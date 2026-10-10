import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql, type Sql } from "@/lib/db";
import { checklistDone, freshChecklist, normalizeChecklist } from "./checklist";
import type {
  ActionResult,
  Board,
  BookGate,
  HarborReady,
  HarborState,
  Me,
  Role,
  RosterPerson,
  Stay,
  Wash,
} from "./types";
import {
  checkoutDate,
  clip,
  isIsoDate,
  laParts,
  maxCheckIn,
  minCheckIn,
  phaseOf,
  sleepNights,
  stayEnded,
  type StayPhase,
} from "./time";

type BookingRow = {
  id: number;
  person_id: number;
  user_id: string;
  check_in: string;
  nights: number;
  party_size: number;
  note: string;
  left_early: boolean;
  guest: string;
  wash_id: number | null;
  checklist: unknown;
  wash_note: string | null;
  wash_ready: boolean | null;
};

const ROLES: readonly Role[] = ["owner", "manager", "staff", "steward", "pending"];

function asRole(value: string): Role {
  return ROLES.includes(value as Role) ? (value as Role) : "pending";
}

function day(value: string): string {
  return value.slice(0, 10);
}

function num(value: unknown): number {
  return typeof value === "number" ? value : Number(value);
}

function flag(value: unknown): boolean {
  return value === true || value === "t" || value === "true" || value === 1;
}

async function openWashes(sql: Sql, now = new Date()): Promise<void> {
  const rows = await sql<{
    id: number;
    check_in: string;
    nights: number;
    left_early: boolean;
  }>`
    select b.id,
           to_char(b.check_in, 'YYYY-MM-DD') as check_in,
           b.nights,
           (b.left_early_at is not null) as left_early
    from bookings b
    where b.status = 'confirmed'
      and not exists (select 1 from turnarounds t where t.booking_id = b.id)
  `;
  const checklist = JSON.stringify(freshChecklist());
  for (const row of rows) {
    if (!stayEnded(day(row.check_in), num(row.nights), flag(row.left_early), now)) continue;
    await sql`
      insert into turnarounds (booking_id, checklist)
      values (${row.id}, ${checklist}::jsonb)
      on conflict (booking_id) do nothing
    `;
  }
}

async function loadBookings(sql: Sql): Promise<BookingRow[]> {
  return sql<BookingRow>`
    select b.id,
           b.person_id,
           b.user_id,
           to_char(b.check_in, 'YYYY-MM-DD') as check_in,
           b.nights,
           b.party_size,
           b.note,
           (b.left_early_at is not null) as left_early,
           p.name as guest,
           t.id as wash_id,
           t.checklist,
           t.note as wash_note,
           (t.ready_at is not null) as wash_ready
    from bookings b
    join people p on p.id = b.person_id
    left join turnarounds t on t.booking_id = b.id
    where b.status = 'confirmed'
    order by b.check_in, b.id
  `;
}

function expandBoard(rows: BookingRow[]): Pick<Board, "taken" | "washes"> {
  const taken: string[] = [];
  const washes: string[] = [];
  for (const row of rows) {
    const checkIn = day(row.check_in);
    const nights = num(row.nights);
    taken.push(...sleepNights(checkIn, nights));
    if (!flag(row.wash_ready)) washes.push(checkoutDate(checkIn, nights));
  }
  return { taken, washes };
}

export const getBoard = createServerFn({ method: "GET" }).handler(async (): Promise<Board> => {
  const sql = await getSql();
  await openWashes(sql);
  const [rows, blackoutRows, settings] = await Promise.all([
    loadBookings(sql),
    sql<{ day: string }>`select to_char(day, 'YYYY-MM-DD') as day from blackouts order by day`,
    sql<{ party_max: number }>`select party_max from harbor_settings where id = 1`,
  ]);
  const board = expandBoard(rows);
  return {
    ...board,
    blackouts: blackoutRows.map((row) => day(row.day)),
    partyMax: num(settings[0]?.party_max ?? 4),
  };
});

type PersonRow = {
  id: number;
  name: string;
  email: string | null;
  role: string;
  user_id: string | null;
  stays_granted: number;
  stays_used: number;
};

async function loadPeople(sql: Sql): Promise<PersonRow[]> {
  return sql<PersonRow>`
    select p.id, p.name, p.email, p.role, p.user_id, p.stays_granted,
           (select count(*)::int from bookings b
             where b.person_id = p.id and b.status = 'confirmed') as stays_used
    from people p
    order by case p.role
      when 'owner' then 0
      when 'steward' then 1
      when 'manager' then 2
      when 'staff' then 3
      else 4
    end, p.name, p.id
  `;
}

function toMe(row: PersonRow): Me {
  const staysGranted = num(row.stays_granted);
  const staysUsed = num(row.stays_used);
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: asRole(row.role),
    staysGranted,
    staysUsed,
    remaining: Math.max(0, staysGranted - staysUsed),
  };
}

function bookGate(me: Me, stays: Stay[], today: string): BookGate {
  if (me.role === "pending") {
    return {
      allowed: false,
      reason: "You're signed in, but this email isn't on the CAM EDU list yet.",
    };
  }
  if (me.role === "steward") {
    return {
      allowed: false,
      reason: "This sign-in opens the desk. Stays are booked from a manager's login.",
    };
  }
  const holding = stays.find((stay) => stay.mine && (stay.phase === "upcoming" || stay.phase === "aboard"));
  if (holding) {
    return { allowed: false, reason: "You already have a stay on the board." };
  }
  const washing = stays.find((stay) => stay.mine && stay.phase === "wash");
  if (washing && checkoutDate(washing.checkIn, washing.nights) >= today) {
    return {
      allowed: false,
      reason: "Today is still your checkout. If you have another stay to use, you can book from tomorrow.",
    };
  }
  if (me.remaining < 1) {
    return me.role === "owner"
      ? {
          allowed: false,
          reason: "This office login doesn't have a stay yet. Grant yourself one in the harbor office if you want the weekend.",
        }
      : {
          allowed: false,
          reason: "Your complimentary stay is already used. The harbor office can grant another.",
        };
  }
  return { allowed: true, reason: "" };
}

async function assemble(sql: Sql, me: Me, now = new Date()): Promise<HarborReady> {
  const { date, hour } = laParts(now);
  const [people, rows, blackoutRows, settingsRows] = await Promise.all([
    loadPeople(sql),
    loadBookings(sql),
    sql<{ day: string; reason: string }>`
      select to_char(day, 'YYYY-MM-DD') as day, reason from blackouts order by day
    `,
    sql<{ gate_note: string; party_max: number }>`
      select gate_note, party_max from harbor_settings where id = 1
    `,
  ]);
  const settings = settingsRows[0];
  const privileged = me.role === "owner" || me.role === "steward";
  const named = me.role !== "pending";
  const board = expandBoard(rows);

  const stays: Stay[] = rows.map((row) => {
    const checkIn = day(row.check_in);
    const nights = num(row.nights);
    const leftEarly = flag(row.left_early);
    const washReady = flag(row.wash_ready);
    const phase: StayPhase = phaseOf(checkIn, nights, leftEarly, washReady, now);
    const mine = row.person_id === me.id;
    const seePrivate = privileged || mine;
    let wash: Wash | null = null;
    if (privileged && row.wash_id != null) {
      wash = {
        id: num(row.wash_id),
        ready: washReady,
        note: row.wash_note ?? "",
        items: normalizeChecklist(row.checklist),
      };
    }
    const upcoming = phase === "upcoming";
    return {
      id: num(row.id),
      guest: named ? row.guest : "",
      mine,
      checkIn,
      nights,
      partySize: seePrivate ? num(row.party_size) : 0,
      note: seePrivate ? row.note : "",
      leftEarly,
      phase,
      canCancel: upcoming && (mine || me.role === "owner"),
      canLeave: phase === "aboard" && (mine || me.role === "owner"),
      wash,
    };
  });

  const stewards = people.filter((person) => person.role === "steward");
  const showGate =
    privileged ||
    stays.some((stay) => stay.mine && (stay.phase === "upcoming" || stay.phase === "aboard"));
  let phase: HarborReady["phase"] = "ready";
  if (stays.some((stay) => stay.phase === "aboard")) phase = "aboard";
  else if (stays.some((stay) => stay.phase === "wash")) phase = "wash";

  const roster: RosterPerson[] | null =
    me.role === "owner"
      ? people.map((person) => ({
          id: person.id,
          name: person.name,
          email: person.email,
          role: asRole(person.role),
          linked: person.user_id != null,
          staysGranted: num(person.stays_granted),
          staysUsed: num(person.stays_used),
        }))
      : null;

  return {
    officeClaimed: true,
    me,
    phase,
    deskName: stewards[0]?.name || "Maria",
    stewardNeedsEmail: !stewards.some((person) => person.email && person.email.length > 0),
    managerCount: people.filter((person) => person.role === "manager").length,
    partyMax: num(settings?.party_max ?? 4),
    gateNote: showGate ? (settings?.gate_note ?? "") : null,
    today: date,
    minCheckIn: minCheckIn(now),
    maxCheckIn: maxCheckIn(now),
    taken: board.taken,
    blackouts: blackoutRows.map((row) => day(row.day)),
    washes: board.washes,
    stays,
    roster,
    book: bookGate(me, stays, date),
  };
}

async function identity(userId: string): Promise<{ sql: Sql; email: string; name: string }> {
  const sql = await getSql();
  await openWashes(sql);
  const rows = await sql<{ name: string; email: string }>`
    select name, email from "user" where id = ${userId}
  `;
  const user = rows[0];
  if (!user?.email) throw new Error("We couldn't read the signed-in account.");
  return { sql, email: user.email.trim().toLowerCase(), name: user.name?.trim() || "CAM EDU" };
}

async function linkPerson(sql: Sql, userId: string, email: string, name: string): Promise<PersonRow | null> {
  const byUser = await sql<PersonRow>`
    select p.id, p.name, p.email, p.role, p.user_id, p.stays_granted,
           (select count(*)::int from bookings b
             where b.person_id = p.id and b.status = 'confirmed') as stays_used
    from people p
    where p.user_id = ${userId}
  `;
  if (byUser[0]) return byUser[0];

  const byEmail = await sql<{ id: number }>`
    select id from people where email is not null and lower(email) = ${email} limit 1
  `;
  if (byEmail[0]) {
    await sql`
      update people
      set user_id = ${userId}
      where id = ${byEmail[0].id} and user_id is null
    `;
  }

  const owners = await sql<{ id: number }>`select id from people where role = 'owner' limit 1`;
  if (!byEmail[0] && owners[0]) {
    await sql`
      insert into people (name, email, role, user_id, stays_granted)
      values (${clip(name, 80) || "CAM EDU"}, ${email}, 'pending', ${userId}, 0)
      on conflict (user_id) do nothing
    `;
  }

  const linked = await sql<PersonRow>`
    select p.id, p.name, p.email, p.role, p.user_id, p.stays_granted,
           (select count(*)::int from bookings b
             where b.person_id = p.id and b.status = 'confirmed') as stays_used
    from people p
    where p.user_id = ${userId}
  `;
  return linked[0] ?? null;
}

export const getHarbor = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<HarborState> => {
    const { sql, email, name } = await identity(context.userId);
    const person = await linkPerson(sql, context.userId, email, name);
    if (!person) return { officeClaimed: false, viewerName: name };
    return assemble(sql, toMe(person));
  });

function normEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export const claimOffice = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const phrase = typeof input === "object" && input && "phrase" in input ? String((input as { phrase: unknown }).phrase) : "";
    return { phrase: phrase.trim().toLowerCase() };
  })
  .handler(async ({ context, data }): Promise<ActionResult> => {
    if (data.phrase !== "slip 36") {
      return { ok: false, error: "Type SLIP 36 to confirm this is your boat." };
    }
    const { sql, email, name } = await identity(context.userId);
    const existing = await sql<{ role: string }>`select role from people where user_id = ${context.userId}`;
    if (existing[0]?.role === "owner") return { ok: true };
    const inserted = await sql<{ id: number }>`
      insert into people (name, email, role, user_id, stays_granted)
      select ${clip(name, 80) || "Owner"}, ${email}, 'owner', ${context.userId}, 0
      where not exists (select 1 from people where role = 'owner')
        and not exists (select 1 from people where user_id = ${context.userId})
      returning id
    `;
    if (!inserted[0]) {
      return { ok: false, error: "The harbor office is already claimed." };
    }
    return { ok: true };
  });

type BookInput = {
  checkIn: string;
  nights: 1 | 2;
  partySize: number;
  note: string;
  agreeTied: boolean;
  agreeCold: boolean;
  agreeHead: boolean;
  agreeOut: boolean;
};

function parseBook(input: unknown): BookInput | { error: string } {
  if (!input || typeof input !== "object") return { error: "Choose an arrival day." };
  const raw = input as Record<string, unknown>;
  const checkIn = typeof raw.checkIn === "string" ? raw.checkIn : "";
  if (!isIsoDate(checkIn)) return { error: "Choose an arrival day." };
  const nights = raw.nights === 2 ? 2 : raw.nights === 1 ? 1 : 0;
  if (!nights) return { error: "A stay is one night or two." };
  const partySize = num(raw.partySize);
  if (!Number.isInteger(partySize)) return { error: "Choose how many people are staying." };
  const note = typeof raw.note === "string" ? clip(raw.note, 240) : "";
  return {
    checkIn,
    nights,
    partySize,
    note,
    agreeTied: raw.agreeTied === true,
    agreeCold: raw.agreeCold === true,
    agreeHead: raw.agreeHead === true,
    agreeOut: raw.agreeOut === true,
  };
}

export const bookStay = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => input)
  .handler(async ({ context, data }): Promise<ActionResult> => {
    const parsed = parseBook(data);
    if ("error" in parsed) return { ok: false, error: parsed.error };
    if (!parsed.agreeTied || !parsed.agreeCold || !parsed.agreeHead || !parsed.agreeOut) {
      return { ok: false, error: "Accept the four house rules to hold the stay." };
    }
    const now = new Date();
    const today = laParts(now).date;
    const earliest = minCheckIn(now);
    const latest = maxCheckIn(now);
    if (parsed.checkIn < earliest || parsed.checkIn > latest) {
      return { ok: false, error: "That arrival day is outside the booking window." };
    }
    const { sql, email, name } = await identity(context.userId);
    const person = await linkPerson(sql, context.userId, email, name);
    if (!person) return { ok: false, error: "Claim the harbor office before booking." };
    const me = toMe(person);
    const state = await assemble(sql, me, now);
    if (!state.book.allowed) return { ok: false, error: state.book.reason };
    if (parsed.partySize < 1 || parsed.partySize > state.partyMax) {
      return { ok: false, error: `Overnight party is ${state.partyMax} at most.` };
    }
    const nights = sleepNights(parsed.checkIn, parsed.nights);
    if (nights.some((night) => state.taken.includes(night) || state.blackouts.includes(night))) {
      return { ok: false, error: "Those nights are already held." };
    }
    const inserted = await sql<{ id: number }>`
      insert into bookings (person_id, user_id, check_in, nights, party_size, note, status)
      select ${me.id}, ${context.userId}, ${parsed.checkIn}::date, ${parsed.nights}, ${parsed.partySize}, ${parsed.note}, 'confirmed'
      where exists (
        select 1 from people p
        where p.id = ${me.id}
          and p.user_id = ${context.userId}
          and p.role in ('owner', 'manager', 'staff')
          and p.stays_granted > (
            select count(*)::int from bookings b
            where b.person_id = p.id and b.status = 'confirmed'
          )
      )
      and not exists (
        select 1 from bookings b
        where b.person_id = ${me.id}
          and b.status = 'confirmed'
          and (b.check_in + b.nights) >= ${today}::date
      )
      and not exists (
        select 1 from bookings b
        where b.status = 'confirmed'
          and b.check_in < (${parsed.checkIn}::date + ${parsed.nights}::int)
          and (b.check_in + b.nights) > ${parsed.checkIn}::date
      )
      and not exists (
        select 1 from blackouts k
        where k.day >= ${parsed.checkIn}::date
          and k.day < (${parsed.checkIn}::date + ${parsed.nights}::int)
      )
      and ${parsed.partySize}::int between 1 and (select party_max from harbor_settings where id = 1)
      returning id
    `;
    if (!inserted[0]) {
      return { ok: false, error: "Those nights were just taken, or the stay is no longer open." };
    }
    return { ok: true };
  });

async function requireReady(userId: string): Promise<{ sql: Sql; me: Me; state: HarborReady }> {
  const { sql, email, name } = await identity(userId);
  const person = await linkPerson(sql, userId, email, name);
  if (!person) throw new Error("The harbor office has not been claimed.");
  const me = toMe(person);
  const state = await assemble(sql, me);
  return { sql, me, state };
}

export const cancelStay = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const id = typeof input === "object" && input && "id" in input ? num((input as { id: unknown }).id) : 0;
    return { id };
  })
  .handler(async ({ context, data }): Promise<ActionResult> => {
    if (!data.id) return { ok: false, error: "Missing stay." };
    const { sql, me, state } = await requireReady(context.userId);
    const stay = state.stays.find((item) => item.id === data.id);
    if (!stay?.canCancel) return { ok: false, error: "That stay can no longer be cancelled." };
    const { hour } = laParts();
    const updated = await sql<{ id: number }>`
      update bookings
      set status = 'cancelled'
      where id = ${data.id}
        and status = 'confirmed'
        and (${me.role} = 'owner' or person_id = ${me.id})
        and (
          check_in > ${state.today}::date
          or (check_in = ${state.today}::date and ${hour} < 15)
        )
      returning id
    `;
    if (!updated[0]) return { ok: false, error: "That stay can no longer be cancelled." };
    return { ok: true };
  });

export const leaveStay = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const id = typeof input === "object" && input && "id" in input ? num((input as { id: unknown }).id) : 0;
    return { id };
  })
  .handler(async ({ context, data }): Promise<ActionResult> => {
    if (!data.id) return { ok: false, error: "Missing stay." };
    const { sql, me, state } = await requireReady(context.userId);
    const stay = state.stays.find((item) => item.id === data.id);
    if (!stay?.canLeave) return { ok: false, error: "The wash opens on its own at 10:00 if you're still marked aboard." };
    const updated = await sql<{ id: number }>`
      update bookings
      set left_early_at = now()
      where id = ${data.id}
        and status = 'confirmed'
        and left_early_at is null
        and (${me.role} = 'owner' or person_id = ${me.id})
      returning id
    `;
    if (!updated[0]) return { ok: false, error: "The stay was already closed." };
    await openWashes(sql);
    return { ok: true };
  });

async function requireDesk(userId: string): Promise<{ sql: Sql; me: Me }> {
  const ready = await requireReady(userId);
  if (ready.me.role !== "owner" && ready.me.role !== "steward") {
    throw new Error("The desk is for Maria and the harbor office.");
  }
  return ready;
}

export const toggleWashItem = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const raw = (input ?? {}) as { washId?: unknown; itemId?: unknown };
    return { washId: num(raw.washId), itemId: typeof raw.itemId === "string" ? raw.itemId : "" };
  })
  .handler(async ({ context, data }): Promise<ActionResult> => {
    if (!data.washId || !data.itemId) return { ok: false, error: "Missing checklist item." };
    const { sql } = await requireDesk(context.userId);
    const rows = await sql<{ checklist: unknown; ready: boolean }>`
      select checklist, (ready_at is not null) as ready from turnarounds where id = ${data.washId}
    `;
    const row = rows[0];
    if (!row) return { ok: false, error: "That wash isn't open." };
    if (flag(row.ready)) return { ok: false, error: "This wash is already signed." };
    const items = normalizeChecklist(row.checklist).map((item) =>
      item.id === data.itemId ? { ...item, done: !item.done } : item,
    );
    if (!items.some((item) => item.id === data.itemId)) {
      return { ok: false, error: "That item isn't on the list." };
    }
    await sql`
      update turnarounds
      set checklist = ${JSON.stringify(items)}::jsonb
      where id = ${data.washId} and ready_at is null
    `;
    return { ok: true };
  });

export const signWash = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const raw = (input ?? {}) as { washId?: unknown; note?: unknown };
    return {
      washId: num(raw.washId),
      note: typeof raw.note === "string" ? clip(raw.note, 280) : "",
    };
  })
  .handler(async ({ context, data }): Promise<ActionResult> => {
    if (!data.washId) return { ok: false, error: "Missing wash." };
    const { sql } = await requireDesk(context.userId);
    const rows = await sql<{ checklist: unknown; ready: boolean }>`
      select checklist, (ready_at is not null) as ready from turnarounds where id = ${data.washId}
    `;
    const row = rows[0];
    if (!row) return { ok: false, error: "That wash isn't open." };
    if (flag(row.ready)) return { ok: true };
    const items = normalizeChecklist(row.checklist);
    if (!checklistDone(items)) {
      return { ok: false, error: "The command bridge is first, and every line has to be done." };
    }
    await sql`
      update turnarounds
      set ready_at = now(), ready_by = ${context.userId}, note = ${data.note}
      where id = ${data.washId} and ready_at is null
    `;
    return { ok: true };
  });

type PersonInput = {
  id?: number;
  name: string;
  email: string | null;
  role: Role;
  staysGranted: number;
};

function parsePerson(input: unknown, withId: boolean): PersonInput | { error: string } {
  if (!input || typeof input !== "object") return { error: "Missing person." };
  const raw = input as Record<string, unknown>;
  const name = typeof raw.name === "string" ? clip(raw.name, 80) : "";
  if (name.length < 1) return { error: "A name is required." };
  const email = normEmail(raw.email);
  if (!email) return { error: "Use the email they will sign in with." };
  const role = typeof raw.role === "string" ? asRole(raw.role) : "pending";
  if (role === "owner") return { error: "There is already an owner." };
  let staysGranted = Math.floor(num(raw.staysGranted));
  if (!Number.isFinite(staysGranted) || staysGranted < 0) staysGranted = 0;
  if (role === "manager" && staysGranted < 1) {
    return { error: "A manager starts with at least one stay." };
  }
  if (role === "steward") staysGranted = 0;
  if (staysGranted > 12) return { error: "That's more stays than this boat can promise." };
  const id = withId ? num(raw.id) : undefined;
  if (withId && !id) return { error: "Missing person." };
  return { id, name, email, role, staysGranted };
}

async function requireOwner(userId: string): Promise<{ sql: Sql; me: Me }> {
  const ready = await requireReady(userId);
  if (ready.me.role !== "owner") throw new Error("Only the harbor office can change the list.");
  return ready;
}

export const addPerson = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => input)
  .handler(async ({ context, data }): Promise<ActionResult> => {
    const parsed = parsePerson(data, false);
    if ("error" in parsed) return { ok: false, error: parsed.error };
    const { sql } = await requireOwner(context.userId);
    try {
      const inserted = await sql<{ id: number }>`
        insert into people (name, email, role, stays_granted)
        select ${parsed.name}, ${parsed.email}, ${parsed.role}, ${parsed.staysGranted}
        where not exists (
          select 1 from people where email is not null and lower(email) = ${parsed.email}
        )
        returning id
      `;
      if (!inserted[0]) return { ok: false, error: "That email is already on the list." };
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.toLowerCase().includes("unique")) {
        return { ok: false, error: "That email is already on the list." };
      }
      throw err;
    }
    return { ok: true };
  });

export const savePerson = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => input)
  .handler(async ({ context, data }): Promise<ActionResult> => {
    const parsed = parsePerson(data, true);
    if ("error" in parsed) return { ok: false, error: parsed.error };
    const { sql, me } = await requireOwner(context.userId);
    if (parsed.id === me.id) return { ok: false, error: "The office login stays the owner. Grant a stay from the quota control." };
    const current = await sql<{ role: string; stays_used: number; user_id: string | null }>`
      select role,
             user_id,
             (select count(*)::int from bookings b where b.person_id = people.id and b.status = 'confirmed') as stays_used
      from people where id = ${parsed.id}
    `;
    const row = current[0];
    if (!row) return { ok: false, error: "That person isn't on the list." };
    if (row.role === "owner") return { ok: false, error: "The owner row can't be edited here." };
    if (parsed.staysGranted < num(row.stays_used)) {
      return { ok: false, error: "They've already used more stays than that." };
    }
    try {
      const updated = await sql<{ id: number }>`
        update people
        set name = ${parsed.name},
            email = ${parsed.email},
            role = ${parsed.role},
            stays_granted = ${parsed.staysGranted}
        where id = ${parsed.id}
          and role <> 'owner'
          and not exists (
            select 1 from people other
            where other.id <> ${parsed.id}
              and other.email is not null
              and lower(other.email) = ${parsed.email}
          )
        returning id
      `;
      if (!updated[0]) return { ok: false, error: "That email is already on the list." };
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.toLowerCase().includes("unique")) {
        return { ok: false, error: "That email is already on the list." };
      }
      throw err;
    }
    return { ok: true };
  });

export const grantStays = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const raw = (input ?? {}) as { id?: unknown; staysGranted?: unknown };
    return { id: num(raw.id), staysGranted: Math.floor(num(raw.staysGranted)) };
  })
  .handler(async ({ context, data }): Promise<ActionResult> => {
    if (!data.id) return { ok: false, error: "Missing person." };
    const { sql } = await requireOwner(context.userId);
    const rows = await sql<{ role: string; stays_used: number }>`
      select role,
             (select count(*)::int from bookings b where b.person_id = people.id and b.status = 'confirmed') as stays_used
      from people where id = ${data.id}
    `;
    const row = rows[0];
    if (!row) return { ok: false, error: "That person isn't on the list." };
    let granted = data.staysGranted;
    if (!Number.isFinite(granted) || granted < 0 || granted > 12) {
      return { ok: false, error: "Choose a stay count between 0 and 12." };
    }
    if (row.role === "manager" && granted < 1) {
      return { ok: false, error: "A manager keeps at least one stay on the books." };
    }
    if (row.role === "steward") granted = 0;
    if (granted < num(row.stays_used)) {
      return { ok: false, error: "They've already used more stays than that." };
    }
    await sql`update people set stays_granted = ${granted} where id = ${data.id}`;
    return { ok: true };
  });

export const removePending = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const id = typeof input === "object" && input && "id" in input ? num((input as { id: unknown }).id) : 0;
    return { id };
  })
  .handler(async ({ context, data }): Promise<ActionResult> => {
    const { sql } = await requireOwner(context.userId);
    const removed = await sql<{ id: number }>`
      delete from people
      where id = ${data.id}
        and role = 'pending'
        and not exists (select 1 from bookings b where b.person_id = people.id)
      returning id
    `;
    if (!removed[0]) return { ok: false, error: "Only someone still waiting, with no stays, can be removed." };
    return { ok: true };
  });

export const saveHarbor = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const raw = (input ?? {}) as { gateNote?: unknown; partyMax?: unknown };
    return {
      gateNote: typeof raw.gateNote === "string" ? raw.gateNote.trim().slice(0, 500) : "",
      partyMax: Math.floor(num(raw.partyMax)),
    };
  })
  .handler(async ({ context, data }): Promise<ActionResult> => {
    if (data.partyMax < 1 || data.partyMax > 6) {
      return { ok: false, error: "Overnight party is between 1 and 6." };
    }
    const { sql } = await requireOwner(context.userId);
    await sql`
      update harbor_settings
      set gate_note = ${data.gateNote}, party_max = ${data.partyMax}
      where id = 1
    `;
    return { ok: true };
  });

export const toggleBlackout = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const raw = (input ?? {}) as { day?: unknown; reason?: unknown };
    return {
      day: typeof raw.day === "string" ? raw.day : "",
      reason: typeof raw.reason === "string" ? clip(raw.reason, 80) : "",
    };
  })
  .handler(async ({ context, data }): Promise<ActionResult> => {
    if (!isIsoDate(data.day)) return { ok: false, error: "Pick a date." };
    const { sql, state } = await requireReady(context.userId);
    if (state.me.role !== "owner") return { ok: false, error: "Only the harbor office can hold dates." };
    if (state.blackouts.includes(data.day)) {
      await sql`delete from blackouts where day = ${data.day}::date`;
      return { ok: true };
    }
    if (state.taken.includes(data.day)) {
      return { ok: false, error: "That night is already a stay. Cancel the stay first." };
    }
    const reason = data.reason || "Held by the office";
    await sql`
      insert into blackouts (day, reason)
      values (${data.day}::date, ${reason})
      on conflict (day) do update set reason = excluded.reason
    `;
    return { ok: true };
  });
