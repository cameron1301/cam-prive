import { createHash, randomBytes } from "node:crypto";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { getSql } from "@/lib/db";
import { createSeed } from "./seed";
import {
  blankChecks,
  blankPhotos,
  canStart,
  hoursUntilCheckIn,
  laToday,
  normalizePerson,
  priceStay,
  RULES_VERSION,
  turnoverDate,
  uid,
  type Data,
  type Person,
  type PhotoSlot,
  type Reservation,
  type Role,
  type Severity,
} from "./logic";
import {
  applySweep,
  arrivalUnlocked,
  blankDeposit,
  holdIsDue,
  markAuthorized,
  markCaptured,
  markFailed,
  markReleased,
  markVerified,
  normalizeDeposit,
  normalizePaymentConfig,
  publicDeposit,
  scheduleRelease,
} from "./payments";
import { helcimCapture, helcimConfigured, helcimPreauth, helcimPurchase, helcimRefund, helcimVoid } from "./helcim.server";

const COOKIE = "cam_prive_session";

type Session = { personId: string; viewId: string };

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function parseData(raw: unknown): Data {
  const data = (typeof raw === "string" ? JSON.parse(raw) : raw) as Data;
  data.people = (data.people || []).map((p) => normalizePerson(p));
  data.config = normalizePaymentConfig({ ...createSeed().config, ...(data.config || {}) });
  data.claims = data.claims || [];
  data.reservations = (data.reservations || []).map((stay) => ({
    ...stay,
    deposit: normalizeDeposit(stay.deposit, data.config.depositAmount, stay.status),
  }));
  return data;
}

async function readState(): Promise<Data> {
  const sql = await getSql();
  const rows = await sql<{ data: Data | string }>`select data from cam_state where id = 1`;
  if (!rows.length) {
    const fresh = createSeed(laToday()) as Data & { version?: number };
    fresh.version = 1;
    await sql.query("insert into cam_state (id, data) values (1, $1::jsonb)", [JSON.stringify(fresh)]);
    return fresh;
  }
  const parsed = parseData(rows[0].data);
  const repaired = repairWalkthrough(parsed);
  if (!repaired) return parsed;
  const saved = await writeState(repaired, versionOf(parsed));
  return saved ? repaired : parsed;
}

/** The original walkthrough used a paid stay as if money had been collected. Correct that once. */
function repairWalkthrough(data: Data): Data | null {
  let changed = false;
  const reservations = data.reservations.map((stay) => {
    if (stay.id === "stay-jordan" && stay.status === "confirmed" && stay.payment === "pending") {
      changed = true;
      return { ...stay, status: "cancelled" as const, payment: "not_required" as const, amount: 0 };
    }
    if (stay.id === "stay-priya" && stay.payment === "paid") {
      changed = true;
      return { ...stay, payment: "not_required" as const, amount: 0, kind: "complimentary" as const };
    }
    return stay;
  });
  return changed ? { ...data, reservations } : null;
}

async function writeState(next: Data, previousVersion: number) {
  const sql = await getSql();
  const version = previousVersion + 1;
  const payload = { ...next, version };
  const rows = await sql.query<{ id: number }>(
    "update cam_state set data = $1::jsonb where id = 1 and coalesce((data->>'version')::int, 1) = $2 returning id",
    [JSON.stringify(payload), previousVersion || 1],
  );
  return rows.length > 0;
}

function versionOf(data: Data) {
  return Number((data as Data & { version?: number }).version || 1);
}

async function mutate(change: (data: Data) => Data | { error: string }): Promise<{ data: Data } | { error: string }> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const current = await readState();
    const result = change(current);
    if ("error" in result) return result;
    const saved = await writeState(result, versionOf(current));
    if (saved) return { data: result };
  }
  return { error: "Please try that again." };
}

function cookieSecure() {
  return process.env.NODE_ENV === "production";
}

async function readSession(): Promise<Session | null> {
  const token = getCookie(COOKIE);
  if (!token) return null;
  const sql = await getSql();
  const rows = await sql<{ person_id: string; view_id: string }>`
    select person_id, view_id from cam_sessions
    where token_hash = ${hashToken(token)} and expires_at > now()
  `;
  if (!rows.length) return null;
  return { personId: rows[0].person_id, viewId: rows[0].view_id };
}

async function issueSession(personId: string, viewId = personId) {
  const token = randomBytes(32).toString("hex");
  const sql = await getSql();
  const previous = getCookie(COOKIE);
  if (previous) {
    await sql`delete from cam_sessions where token_hash = ${hashToken(previous)}`;
  }
  await sql`
    insert into cam_sessions (token_hash, person_id, view_id, expires_at)
    values (${hashToken(token)}, ${personId}, ${viewId}, now() + interval '30 days')
  `;
  setCookie(COOKIE, token, {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

function personById(data: Data, id: string) {
  return data.people.find((p) => p.id === id);
}

function roleOf(person: Person | undefined): Role | "" {
  return person?.role ?? "";
}

function redactStay(stay: Reservation): Reservation {
  return {
    id: stay.id,
    managerId: "",
    checkIn: stay.checkIn,
    nights: stay.nights,
    adults: 0,
    kind: "paid",
    status: stay.status,
    payment: "not_required",
    amount: 0,
    rulesVersion: null,
    rulesAcceptedAt: null,
    createdAt: "",
    checkout: null,
    tip: "unset",
    entitlementConsumed: false,
  };
}

function scrubStay(stay: Reservation): Reservation {
  return stay.deposit ? { ...stay, deposit: publicDeposit(stay.deposit) } : stay;
}

function guestCanSeeArrival(data: Data, personId: string): boolean {
  const open = data.reservations.filter(
    (stay) => stay.managerId === personId && (stay.status === "confirmed" || stay.status === "pending_approval"),
  );
  return open.length > 0 && open.every((stay) => !!stay.deposit && arrivalUnlocked(stay.deposit));
}

function publicConfig(data: Data): Data["config"] {
  return {
    ...data.config,
    access: "",
    parking: "",
    shore: "",
    wifi: "",
    emergency: "",
    zelle: "",
    cleaningCost: 0,
    slipMonthly: 0,
  };
}

function forClient(data: Data): Data {
  return { ...data, reservations: data.reservations.map(scrubStay) };
}

export function present(data: Data, session: Session | null) {
  const actor = session ? personById(data, session.personId) : undefined;
  const view = session ? personById(data, session.viewId) : undefined;
  const actorRole = roleOf(actor);
  const privileged = actorRole === "owner" || actorRole === "admin";
  if (!actor || !view) {
    return {
      data: {
        ...data,
        people: [],
        reservations: data.reservations.map(redactStay),
        jobs: [],
        incidents: [],
        expenses: [],
        audit: [],
        sms: [],
        maintenance: [],
        config: publicConfig(data),
      },
      me: null,
      actorRole: "" as const,
    };
  }
  if (privileged) {
    return { data: forClient(data), me: view, actorRole };
  }
  if (actor.role === "cleaner") {
    return {
      data: forClient({
        ...data,
        people: data.people.map((p) => ({ ...p, email: "", phone: "", notes: "", inviteCode: p.id === actor.id ? p.inviteCode : "" })),
        expenses: [],
        audit: [],
        config: { ...data.config, zelle: "", slipMonthly: 0 },
      }),
      me: actor,
      actorRole,
    };
  }
  const mine = data.reservations.filter((r) => r.managerId === actor.id).map(scrubStay);
  const others = data.reservations.filter((r) => r.managerId !== actor.id).map(redactStay);
  return {
    data: {
      ...data,
      people: [{ ...actor }],
      reservations: [...mine, ...others],
      jobs: [],
      incidents: data.incidents.filter((i) => i.reservationId && mine.some((r) => r.id === i.reservationId)),
      expenses: [],
      audit: [],
      sms: [],
      maintenance: [],
      blackouts: data.blackouts.map((b) => ({ ...b, reason: "Held" })),
      claims: (data.claims || []).filter((claim) => mine.some((stay) => stay.id === claim.reservationId)),
      config: guestCanSeeArrival(data, actor.id)
        ? { ...data.config, zelle: "", cleaningCost: 0, slipMonthly: 0 }
        : publicConfig(data),
    },
    me: actor,
    actorRole,
  };
}

function audit(data: Data, actor: string, action: string): Data {
  return {
    ...data,
    audit: [{ id: uid("log"), at: new Date().toISOString(), actor, action }, ...data.audit].slice(0, 80),
  };
}

async function actorContext() {
  const session = await readSession();
  const data = await readState();
  const actor = session ? personById(data, session.personId) : undefined;
  const view = session ? personById(data, session.viewId) ?? actor : undefined;
  return { session, data, actor, view };
}

function deny() {
  return { error: "This invitation can't do that." };
}

async function persistSweep() {
  const current = await readState();
  const swept = applySweep(current, Date.now());
  let next = swept.data;
  if (next.config.paymentMode === "live" && helcimConfigured()) {
    next = await placeLiveHolds(next);
    next = await releaseLiveHolds(next);
  }
  const changed = swept.changed || next !== swept.data;
  if (!changed) return;
  const noted = swept.notes.reduce((data, note) => audit(data, "Payments", note), next);
  await writeState(noted, versionOf(current));
}

async function placeLiveHolds(data: Data): Promise<Data> {
  let reservations = data.reservations;
  for (const stay of data.reservations) {
    const deposit = normalizeDeposit(stay.deposit, data.config.depositAmount, stay.status);
    if (!holdIsDue(stay, deposit, data.config.depositLeadHours) || deposit.mode !== "live") continue;
    const result = await helcimPreauth(deposit.amount, deposit.tokenRef, `preauth-${stay.id}-${deposit.verifyId}`, "0.0.0.0");
    reservations = reservations.map((item) => {
      if (item.id !== stay.id) return item;
      return { ...item, deposit: result.ok ? markAuthorized(deposit, result.transactionId) : markFailed(deposit) };
    });
  }
  return reservations === data.reservations ? data : { ...data, reservations };
}

/** Ask Helcim to reverse a hold that is due. If Helcim refuses, the hold stays authorized until it expires. */
async function releaseLiveHolds(data: Data): Promise<Data> {
  let reservations = data.reservations;
  const now = Date.now();
  for (const stay of data.reservations) {
    const deposit = normalizeDeposit(stay.deposit, data.config.depositAmount, stay.status);
    if (deposit.mode !== "live" || deposit.status !== "authorized" || !deposit.authId) continue;
    const openClaim = (data.claims || []).some((claim) => claim.reservationId === stay.id && claim.status === "pending_owner");
    if (openClaim) continue;
    const due = Boolean(deposit.releaseDueAt) && Date.parse(deposit.releaseDueAt) <= now;
    if (!due && stay.status !== "cancelled") continue;
    const voided = await helcimVoid(deposit.authId, `void-${stay.id}-${deposit.authId}`);
    if (!voided.ok) continue;
    reservations = reservations.map((item) => (item.id === stay.id ? { ...item, deposit: markReleased(deposit) } : item));
  }
  return reservations === data.reservations ? data : { ...data, reservations };
}

export async function loadSnapshot() {
  await persistSweep();
  const { data, actor, view, session } = await actorContext();
  const shown = present(data, session && actor && view ? { personId: actor.id, viewId: view.id } : null);
  return { ready: true, data: shown.data, me: shown.me, actorRole: shown.actorRole, today: laToday() };
}

export async function openInvitation(code: string) {
  const key = code.trim().toLowerCase();
  const data = await readState();
  const person = data.people.map(normalizePerson).find((p) => p.inviteCode === key);
  const allowed = person && (person.role === "owner" || person.role === "admin" || person.role === "cleaner" || person.eligible);
  if (!person || !allowed) return { ok: false as const };
  await issueSession(person.id, person.id);
  const shown = present(await readState(), { personId: person.id, viewId: person.id });
  return { ok: true as const, ready: true, data: shown.data, me: shown.me, actorRole: shown.actorRole, today: laToday() };
}

export async function setView(id: string) {
  const { actor, data } = await actorContext();
  if (!actor || (actor.role !== "owner" && actor.role !== "admin")) return { ok: false as const };
  if (!personById(data, id)) return { ok: false as const };
  const token = getCookie(COOKIE);
  if (!token) return { ok: false as const };
  const sql = await getSql();
  await sql`update cam_sessions set view_id = ${id} where token_hash = ${hashToken(token)}`;
  return { ok: true as const, ...(await loadSnapshot()) };
}

function actingGuest(actor: Person | undefined, view: Person | undefined) {
  if (!actor || !view) return undefined;
  if (actor.role === "owner" || actor.role === "admin") return view.role === "manager" ? view : undefined;
  if (actor.id !== view.id) return undefined;
  return actor.role === "manager" ? actor : undefined;
}

export async function book(input: { checkIn: string; nights: 1 | 2 | 3; adults: number; accepted: boolean }) {
  const today = laToday();
  const { actor, view } = await actorContext();
  const me = actingGuest(actor, view);
  if (!me || !actor || !view) return { ok: false as const, error: "We couldn't find an invitation for this visit." };
  const saved = await mutate((data) => {
    const profile = normalizePerson(data.people.find((p) => p.id === me.id) || me);
    if (!profile.eligible) return { error: "This invitation isn't open for dates just now." };
    if (profile.benefitStarts && today < profile.benefitStarts) return { error: "This invitation opens on a later date." };
    if (profile.benefitExpires && today > profile.benefitExpires) return { error: "This invitation has passed its date." };
    if (!input.accepted) return { error: "Please confirm you'll be aboard before we reserve the stay." };
    if (input.adults < 1 || input.adults > 4) return { error: "We can welcome one to four adults." };
    if (input.nights > profile.maxStay) return { error: `This invitation is for ${profile.maxStay} nights at most.` };
    const open = data.reservations.some(
      (r) => r.managerId === profile.id && (r.status === "confirmed" || r.status === "pending_approval"),
    );
    if (open) return { error: "You already have a stay with us. You can adjust it from My Stay." };
    const block = canStart(data, input.checkIn, input.nights, today);
    if (block) return { error: block };
    const priced = priceStay(profile, input.nights, data.config.nightlyRate);
    const paid = priced.amount > 0;
    const reservation: Reservation = {
      id: uid("stay"),
      managerId: profile.id,
      checkIn: input.checkIn,
      nights: input.nights,
      adults: input.adults,
      kind: priced.kind,
      status: paid ? "pending_approval" : "confirmed",
      payment: paid ? "pending" : "not_required",
      amount: priced.amount,
      rulesVersion: RULES_VERSION,
      rulesAcceptedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      checkout: null,
      tip: "unset",
      entitlementConsumed: priced.usesBenefit,
      complimentaryApplied: priced.complimentaryNights,
      deposit: blankDeposit(data.config.depositAmount, data.config.paymentMode === "live" ? "live" : "test"),
    };
    const people = data.people.map((p) => {
      if (p.id !== profile.id) return p;
      const complimentaryUsed = profile.complimentaryUsed + priced.complimentaryNights;
      return normalizePerson({ ...profile, complimentaryUsed });
    });
    const turnover = turnoverDate(data, input.checkIn, input.nights);
    const when = new Date().toISOString();
    const sms = turnover
      ? [{
          id: uid("sms"),
          at: when,
          to: "Maria",
          body: `SAME-DAY TURNOVER\nCheckout 11:00 AM and the next check-in 3:00 PM on ${turnover}.\nPriority clean. The yacht must be READY before 3:00 PM.`,
        }]
      : [];
    return audit(
      { ...data, people, reservations: [reservation, ...data.reservations], sms: [...sms, ...data.sms] },
      profile.name,
      paid
        ? `Requested ${input.nights} nights starting ${input.checkIn}. Payment is not configured, so the stay is not confirmed.`
        : `Booked a complimentary ${input.nights}-night stay starting ${input.checkIn}.`,
    );
  });
  if ("error" in saved) return { ok: false as const, error: saved.error };
  const snap = present(saved.data, { personId: actor.id, viewId: view.id });
  return { ok: true as const, id: saved.data.reservations[0]?.id, data: snap.data, me: snap.me };
}

export async function changeStay(input: { id: string; checkIn: string; nights: 1 | 2 | 3; adults: number }) {
  const today = laToday();
  const { actor, view } = await actorContext();
  const me = actingGuest(actor, view);
  if (!me || !actor || !view) return { ok: false as const, error: "We couldn't find that stay." };
  const saved = await mutate((data) => {
    const currentStay = data.reservations.find((x) => x.id === input.id);
    if (!currentStay || currentStay.managerId !== me.id) return { error: "We couldn't find that stay." };
    if (currentStay.status !== "confirmed" && currentStay.status !== "pending_approval") {
      return { error: "This stay can no longer be changed." };
    }
    const profile = normalizePerson(data.people.find((p) => p.id === me.id) || me);
    if (input.adults < 1 || input.adults > 4) return { error: "We can welcome one to four adults." };
    if (input.nights > profile.maxStay) return { error: `This invitation is for ${profile.maxStay} nights at most.` };
    const block = canStart(data, input.checkIn, input.nights, today, input.id);
    if (block) return { error: block };
    const applied = currentStay.complimentaryApplied ?? (currentStay.entitlementConsumed ? 1 : 0);
    const restored = normalizePerson({ ...profile, complimentaryUsed: Math.max(0, profile.complimentaryUsed - applied) });
    const priced = priceStay(restored, input.nights, data.config.nightlyRate);
    const paid = priced.amount > 0;
    const people = data.people.map((p) =>
      p.id === me.id ? normalizePerson({ ...p, complimentaryUsed: restored.complimentaryUsed + priced.complimentaryNights }) : p,
    );
    const reservations = data.reservations.map((x) =>
      x.id === input.id
        ? {
            ...x,
            checkIn: input.checkIn,
            nights: input.nights,
            adults: input.adults,
            kind: priced.kind,
            amount: priced.amount,
            status: (paid ? "pending_approval" : "confirmed") as Reservation["status"],
            payment: (paid ? "pending" : "not_required") as Reservation["payment"],
            entitlementConsumed: priced.usesBenefit,
            complimentaryApplied: priced.complimentaryNights,
          }
        : x,
    );
    return audit({ ...data, people, reservations }, profile.name, "Adjusted a stay.");
  });
  if ("error" in saved) return { ok: false as const, error: saved.error };
  const snap = present(saved.data, { personId: actor.id, viewId: view.id });
  return { ok: true as const, data: snap.data, me: snap.me };
}

export async function cancelStay(id: string) {
  const { actor, view } = await actorContext();
  if (!actor || !view) return { error: "We couldn't find that stay." };
  const privileged = actor.role === "owner" || actor.role === "admin";
  const existing = (await readState()).reservations.find((stay) => stay.id === id);
  if (existing?.deposit?.mode === "live" && helcimConfigured()) {
    if (existing.deposit.authId && existing.deposit.status === "authorized") {
      const voided = await helcimVoid(existing.deposit.authId, `void-${existing.id}-${existing.deposit.authId}`);
      if (!voided.ok) return { error: "The security hold could not be released yet. The stay was not cancelled." };
    }
    if (existing.payment === "paid" && existing.deposit.chargeId) {
      const refunded = await helcimRefund(existing.deposit.chargeId, existing.amount, `refund-${existing.id}-${existing.deposit.chargeId}`);
      if (!refunded.ok) return { error: "The stay charge could not be refunded yet. The stay was not cancelled." };
    }
  }
  const saved = await mutate((data) => {
    const stay = data.reservations.find((x) => x.id === id);
    if (!stay) return { error: "We couldn't find that stay." };
    if (!privileged && stay.managerId !== actor.id) return { error: "We couldn't find that stay." };
    if (stay.status !== "confirmed" && stay.status !== "pending_approval") return { error: "This stay can no longer be changed." };
    const late = stay.entitlementConsumed && stay.status === "confirmed" && hoursUntilCheckIn(stay.checkIn) < 48;
    const people = data.people.map((p) => {
      if (p.id !== stay.managerId || late) return p;
      const current = normalizePerson(p);
      const restore = stay.complimentaryApplied ?? (stay.entitlementConsumed ? 1 : 0);
      const complimentaryUsed = Math.max(0, current.complimentaryUsed - restore);
      return normalizePerson({ ...current, complimentaryUsed });
    });
    return audit(
      {
        ...data,
        people,
        reservations: data.reservations.map((x) => {
          if (x.id !== id) return x;
          const deposit = normalizeDeposit(x.deposit, data.config.depositAmount, x.status);
          return {
            ...x,
            status: "cancelled" as const,
            payment: x.payment === "paid" ? ("refunded" as const) : x.payment,
            entitlementConsumed: late ? true : false,
            deposit: deposit.status === "authorized" || deposit.status === "verified" ? markReleased(deposit) : deposit,
          };
        }),
      },
      actor.name,
      late ? "Cancelled inside 48 hours. The complimentary night stays used." : "Cancelled a stay.",
    );
  });
  if ("error" in saved) return { error: saved.error, data: present(await readState(), { personId: actor.id, viewId: view.id }).data };
  const message = saved.data.reservations.find((r) => r.id === id)?.entitlementConsumed
    ? "Your stay is released. Because this is inside 48 hours, the complimentary night remains with this visit."
    : "Your stay is released, and the complimentary night returns to your invitation.";
  const snap = present(saved.data, { personId: actor.id, viewId: view.id });
  return { error: null as string | null, message, data: snap.data, me: snap.me };
}

export async function submitCheckout(id: string, input: { notes: string; damage: string; photos: Record<PhotoSlot, string | null> }) {
  const missing = (Object.keys(blankPhotos()) as PhotoSlot[]).filter((k) => !input.photos[k]);
  if (missing.length) return { error: "Please add the interior, cockpit, and exterior photos before you leave." };
  const { actor, view } = await actorContext();
  if (!actor || !view) return { error: "This stay is not ready for checkout." };
  const today = laToday();
  const saved = await mutate((data) => {
    const stay = data.reservations.find((x) => x.id === id);
    if (!stay || stay.managerId !== actor.id || stay.status !== "confirmed") return { error: "This stay is not ready for checkout." };
    if (today < stay.checkIn) return { error: "Checkout opens on the day you arrive." };
    const when = new Date().toISOString();
    const job = {
      id: uid("job"),
      reservationId: id,
      status: "required" as const,
      checks: blankChecks(),
      photos: {},
      notes: "",
      cost: data.config.cleaningCost,
      startedAt: null,
      completedAt: null,
    };
    const cleaningNote = {
      id: uid("sms"),
      at: when,
      to: "Maria",
      body: "CLEANING REQUIRED\nA guest has checked out at Dock 5, Slip 36. Please clean the cabin and wash the command bridge before the next arrival.",
    };
    return audit(
      {
        ...data,
        reservations: data.reservations.map((x) =>
          x.id === id ? { ...x, status: "checked_out" as const, checkout: { at: when, notes: input.notes, damage: input.damage, photos: input.photos } } : x,
        ),
        jobs: [job, ...data.jobs],
        sms: [cleaningNote, ...data.sms],
        incidents: input.damage.trim()
          ? [{
              id: uid("inc"),
              severity: "attention" as const,
              description: input.damage.trim(),
              photo: input.photos.overall,
              source: "guest" as const,
              reservationId: id,
              createdAt: when,
              resolved: false,
            }, ...data.incidents]
          : data.incidents,
      },
      actor.name,
      "Checked out. Cleaning is required.",
    );
  });
  if ("error" in saved) return { error: saved.error };
  const snap = present(saved.data, { personId: actor.id, viewId: view.id });
  return { error: null, data: snap.data, me: snap.me };
}

async function requireCleaner() {
  const ctx = await actorContext();
  if (!ctx.actor || (ctx.actor.role !== "cleaner" && ctx.actor.role !== "owner" && ctx.actor.role !== "admin")) return null;
  return ctx;
}

export async function startCleaning(jobId: string) {
  const ctx = await requireCleaner();
  if (!ctx?.actor || !ctx.view) return deny();
  const saved = await mutate((data) =>
    audit({
      ...data,
      jobs: data.jobs.map((j) => j.id === jobId ? { ...j, status: "in_progress" as const, startedAt: new Date().toISOString() } : j),
    }, ctx.actor!.name, "Started cleaning."),
  );
  if ("error" in saved) return saved;
  return { data: present(saved.data, { personId: ctx.actor.id, viewId: ctx.view.id }).data };
}

export async function toggleCheck(jobId: string, step: string) {
  const ctx = await requireCleaner();
  if (!ctx?.actor || !ctx.view) return deny();
  const saved = await mutate((data) => ({
    ...data,
    jobs: data.jobs.map((j) => j.id === jobId ? { ...j, checks: { ...j.checks, [step]: !j.checks[step] } } : j),
  }));
  if ("error" in saved) return saved;
  return { data: present(saved.data, { personId: ctx.actor.id, viewId: ctx.view.id }).data };
}

export async function finishCleaning(jobId: string, notes: string, issue?: { amount: number; reason: string; evidence?: string }) {
  const ctx = await requireCleaner();
  if (!ctx?.actor || !ctx.view) return { error: "Cleaning card not found." };
  const today = laToday();
  const saved = await mutate((data) => {
    const job = data.jobs.find((j) => j.id === jobId);
    if (!job) return { error: "Cleaning card not found." };
    if (Object.values(job.checks).some((on) => !on)) return { error: "Finish the checklist first. The command bridge is on it for a reason." };
    const stay = data.reservations.find((r) => r.id === job.reservationId);
    const who = stay ? data.people.find((p) => p.id === stay.managerId)?.name : "guest";
    const when = new Date().toISOString();
    const problem = issue && issue.amount > 0 && issue.reason.trim();
    const claims = problem && stay
      ? [{
          id: uid("claim"),
          reservationId: stay.id,
          amount: Math.min(issue.amount, normalizeDeposit(stay.deposit, data.config.depositAmount, stay.status).amount),
          reason: issue.reason.trim(),
          evidence: issue.evidence?.startsWith("data:image/") ? issue.evidence : "",
          status: "pending_owner" as const,
          createdAt: when,
          decidedAt: "",
        }, ...(data.claims || [])]
      : data.claims || [];
    return audit({
      ...data,
      claims,
      jobs: data.jobs.map((j) => j.id === jobId ? { ...j, status: "complete" as const, notes, completedAt: when } : j),
      expenses: [{ id: uid("exp"), date: today, kind: "cleaning" as const, label: `Turnover cleaning — ${who}`, amount: data.config.cleaningCost }, ...data.expenses],
      reservations: data.reservations.map((item) => {
        if (!stay || item.id !== stay.id || problem) return item;
        return { ...item, deposit: scheduleRelease(normalizeDeposit(item.deposit, data.config.depositAmount, item.status), data.config.depositReleaseHours) };
      }),
      sms: problem ? [{
        id: uid("sms"),
        at: when,
        to: "Owner",
        body: `DEPOSIT REVIEW\nMaria recorded an issue after ${who}'s stay. Nothing is captured until you approve it.`,
      }, ...data.sms] : data.sms,
    }, ctx.actor!.name, problem ? "Finished cleaning and asked the owner to review a deposit charge." : "Marked the yacht ready after cleaning. The security hold is scheduled for release.");
  });
  if ("error" in saved) return { error: saved.error };
  await persistSweep();
  return { error: null, data: present((await readState()), { personId: ctx.actor.id, viewId: ctx.view.id }).data };
}

export async function verifyCard(input: { id: string; cardToken?: string; last4?: string; transactionId?: string }) {
  const { actor, view } = await actorContext();
  const me = actingGuest(actor, view);
  if (!me || !actor || !view) return { ok: false as const, error: "We couldn't find that stay." };
  if (input.cardToken && /\d{13,19}/.test(input.cardToken.replace(/\s/g, ""))) {
    return { ok: false as const, error: "Card numbers are not accepted. Use the secure card form." };
  }
  const current = await readState();
  const stay = current.reservations.find((item) => item.id === input.id && item.managerId === me.id);
  if (!stay || (stay.status !== "confirmed" && stay.status !== "pending_approval")) {
    return { ok: false as const, error: "This stay is not open for a card." };
  }
  const deposit = normalizeDeposit(stay.deposit, current.config.depositAmount, stay.status);
  if (deposit.status === "authorized" || deposit.status === "verified") {
    const snap = present(current, { personId: actor.id, viewId: view.id });
    return { ok: true as const, data: snap.data, me: snap.me };
  }
  if (current.config.paymentMode === "live") {
    if (!helcimConfigured() || !input.cardToken) {
      return { ok: false as const, error: "Helcim is not connected yet. No card was saved and nothing was charged." };
    }
    let chargeId = "";
    if (stay.amount > 0 && stay.payment !== "paid") {
      const purchased = await helcimPurchase(stay.amount, input.cardToken, `purchase-${stay.id}`, "0.0.0.0");
      if (!purchased.ok) return { ok: false as const, error: "The stay charge did not go through. The reservation is not confirmed." };
      chargeId = purchased.transactionId;
    }
    const saved = await mutate((data) => {
      const reservations = data.reservations.map((item) => {
        if (item.id !== stay.id) return item;
        const next = markVerified(normalizeDeposit(item.deposit, data.config.depositAmount, item.status), input.cardToken || "", (input.last4 || "").slice(-4), input.transactionId || chargeId);
        next.chargeId = chargeId || next.chargeId;
        next.mode = "live";
        const due = holdIsDue({ ...item, deposit: next }, next, data.config.depositLeadHours);
        return {
          ...item,
          payment: item.amount > 0 ? ("paid" as const) : item.payment,
          status: "confirmed" as const,
          deposit: due ? next : next,
        };
      });
      return audit({ ...data, reservations }, me.name, "Verified a card with Helcim. The security hold is separate from the stay.");
    });
    if ("error" in saved) return { ok: false as const, error: saved.error };
    await persistSweep();
    const snap = present(await readState(), { personId: actor.id, viewId: view.id });
    return { ok: true as const, data: snap.data, me: snap.me };
  }
  const saved = await mutate((data) => {
    const reservations = data.reservations.map((item) => {
      if (item.id !== stay.id) return item;
      let next = markVerified(normalizeDeposit(item.deposit, data.config.depositAmount, item.status), `test-token-${item.id}`, "4242", `test-verify-${item.id}`);
      if (holdIsDue(item, next, data.config.depositLeadHours)) next = markAuthorized(next, `test-auth-${item.id}`);
      return { ...item, deposit: next };
    });
    return audit({ ...data, reservations }, me.name, "Verified a test card. No bank charge or hold was sent.");
  });
  if ("error" in saved) return { ok: false as const, error: saved.error };
  const snap = present(saved.data, { personId: actor.id, viewId: view.id });
  return { ok: true as const, data: snap.data, me: snap.me };
}

export async function decideClaim(id: string, approve: boolean) {
  const { actor, view } = await actorContext();
  if (!requireOwner(actor) || !view || !actor) return { error: "This invitation can't do that." };
  const current = await readState();
  const claim = (current.claims || []).find((item) => item.id === id);
  if (!claim || claim.status !== "pending_owner") return { error: "That deposit review is no longer open." };
  const stay = current.reservations.find((item) => item.id === claim.reservationId);
  if (!stay) return { error: "We couldn't find that stay." };
  const deposit = normalizeDeposit(stay.deposit, current.config.depositAmount, stay.status);
  if (approve) {
    if (!arrivalUnlocked(deposit) || deposit.status !== "authorized") {
      return { error: "There is no active security hold to capture. An expired hold is not treated as funds we can take." };
    }
    const amount = Math.min(claim.amount, deposit.amount);
    if (amount <= 0) return { error: "The amount to capture has to be greater than zero." };
    let captureId = `test-capture-${claim.id}`;
    let remainder = "The unused amount is not captured.";
    if (deposit.mode === "live") {
      if (!helcimConfigured()) return { error: "Helcim is not connected. No deposit funds were captured." };
      const captured = await helcimCapture(deposit.authId, amount, `capture-${claim.id}`);
      if (!captured.ok) return { error: "Helcim did not capture the deposit. Nothing was taken." };
      captureId = captured.transactionId;
      if (amount < deposit.amount) {
        const released = await helcimVoid(deposit.authId, `void-rest-${claim.id}`);
        remainder = released.ok
          ? "Helcim accepted a reversal of the unused hold."
          : "Helcim did not reverse the unused amount. It stays unavailable to us and expires with the authorization.";
      }
    }
    const saved = await mutate((data) => audit({
      ...data,
      claims: (data.claims || []).map((item) => item.id === id ? { ...item, status: "approved" as const, decidedAt: new Date().toISOString(), amount } : item),
      reservations: data.reservations.map((item) => item.id === stay.id ? { ...item, deposit: markCaptured(normalizeDeposit(item.deposit, data.config.depositAmount, item.status), amount, captureId) } : item),
    }, actor.name, `Approved a deposit capture of ${amount}. ${remainder} This is not stay revenue.`));
    if ("error" in saved) return saved;
    return { data: present(saved.data, { personId: actor.id, viewId: view.id }).data };
  }
  const saved = await mutate((data) => audit({
    ...data,
    claims: (data.claims || []).map((item) => item.id === id ? { ...item, status: "declined" as const, decidedAt: new Date().toISOString() } : item),
    reservations: data.reservations.map((item) => {
      if (item.id !== stay.id) return item;
      const currentDeposit = normalizeDeposit(item.deposit, data.config.depositAmount, item.status);
      return { ...item, deposit: currentDeposit.status === "authorized" ? { ...currentDeposit, releaseDueAt: new Date().toISOString() } : currentDeposit };
    }),
  }, actor.name, "Declined a deposit charge. The hold stays scheduled for release."));
  if ("error" in saved) return saved;
  await persistSweep();
  return { data: present(await readState(), { personId: actor.id, viewId: view.id }).data };
}

export async function reportProblem(input: { severity: Severity; description: string; photo: string | null; reservationId: string | null }) {
  const ctx = await requireCleaner();
  if (!ctx?.actor || !ctx.view) return deny();
  const saved = await mutate((data) => audit({
    ...data,
    incidents: [{ id: uid("inc"), severity: input.severity, description: input.description, photo: input.photo, source: "maria" as const, reservationId: input.reservationId, createdAt: new Date().toISOString(), resolved: false }, ...data.incidents],
  }, ctx.actor!.name, `Reported a ${input.severity} issue.`));
  if ("error" in saved) return saved;
  return { data: present(saved.data, { personId: ctx.actor.id, viewId: ctx.view.id }).data };
}

function requireOwner(actor: Person | undefined) {
  return !!actor && (actor.role === "owner" || actor.role === "admin");
}

export async function resolveIncident(id: string) {
  const { actor, view } = await actorContext();
  if (!requireOwner(actor) || !view) return deny();
  const saved = await mutate((data) => audit({
    ...data,
    incidents: data.incidents.map((i) => i.id === id ? { ...i, resolved: true } : i),
  }, actor!.name, "Resolved an exception."));
  if ("error" in saved) return saved;
  return { data: present(saved.data, { personId: actor!.id, viewId: view.id }).data };
}

export async function decide(id: string, approve: boolean) {
  const { actor, view } = await actorContext();
  if (!requireOwner(actor) || !view) return deny();
  if (approve) return { error: "Payment is not configured, so a paid stay cannot be marked confirmed." };
  const saved = await mutate((data) => {
    const target = data.reservations.find((r) => r.id === id);
    const people = data.people.map((p) => {
      if (!target || p.id !== target.managerId) return p;
      const current = normalizePerson(p);
      const restore = target.complimentaryApplied ?? 0;
      return normalizePerson({ ...current, complimentaryUsed: Math.max(0, current.complimentaryUsed - restore) });
    });
    return audit({
      ...data,
      people,
      reservations: data.reservations.map((r) => r.id === id ? { ...r, status: "declined" as const, payment: "waived" as const } : r),
    }, actor!.name, "Declined a stay that could not be paid.");
  });
  if ("error" in saved) return saved;
  return { data: present(saved.data, { personId: actor!.id, viewId: view.id }).data };
}

export async function restoreEntitlement(personId: string) {
  return ownerPatch(personId, (p) => normalizePerson({ ...p, complimentaryUsed: 0 }), "Restored a complimentary stay.");
}

export async function grantExtra(personId: string) {
  return ownerPatch(personId, (p) => ({ ...p, extraStays: p.extraStays + 1 }), "Granted an extra complimentary stay.");
}

export async function setEligible(personId: string, eligible: boolean) {
  return ownerPatch(personId, (p) => normalizePerson({ ...p, eligible }), eligible ? "Opened booking access." : "Closed booking access.");
}

export async function updateGuest(personId: string, patch: Partial<Person>) {
  return ownerPatch(personId, (p) => normalizePerson({ ...normalizePerson(p), ...patch, id: p.id, role: patch.role ?? p.role }), "Updated a guest invitation.");
}

async function ownerPatch(personId: string, map: (p: Person) => Person, action: string) {
  const { actor, view } = await actorContext();
  if (!requireOwner(actor) || !view) return deny();
  const saved = await mutate((data) => audit({
    ...data,
    people: data.people.map((p) => p.id === personId ? map(p) : p),
  }, actor!.name, action));
  if ("error" in saved) return saved;
  return { data: present(saved.data, { personId: actor!.id, viewId: view.id }).data };
}

export async function addBlackout(date: string, reason: string) {
  const { actor, view } = await actorContext();
  if (!requireOwner(actor) || !view) return deny();
  const saved = await mutate((data) => audit({ ...data, blackouts: [{ id: uid("blk"), date, reason }, ...data.blackouts] }, actor!.name, `Blocked ${date}.`));
  if ("error" in saved) return saved;
  return { data: present(saved.data, { personId: actor!.id, viewId: view.id }).data };
}

export async function removeBlackout(id: string) {
  const { actor, view } = await actorContext();
  if (!requireOwner(actor) || !view) return deny();
  const saved = await mutate((data) => audit({ ...data, blackouts: data.blackouts.filter((b) => b.id !== id) }, actor!.name, "Removed a blocked date."));
  if ("error" in saved) return saved;
  return { data: present(saved.data, { personId: actor!.id, viewId: view.id }).data };
}

export async function completeExterior(notes: string, cost: number) {
  const { actor, view } = await actorContext();
  if (!actor || !view || (actor.role !== "cleaner" && !requireOwner(actor))) return deny();
  const today = laToday();
  const saved = await mutate((data) => {
    const open = data.maintenance.find((m) => m.kind === "exterior" && !m.completedAt);
    const nextDue = addDaysIso(today, 30);
    return audit({
      ...data,
      maintenance: [{
        id: uid("wash"),
        title: "Monthly exterior wash",
        kind: "exterior" as const,
        due: nextDue,
        completedAt: null,
        cost: 0,
        notes: "Command bridge, bird droppings, deck, cockpit, exterior surfaces.",
        cleaner: "Maria",
      }, ...data.maintenance.map((m) => m.id === open?.id ? { ...m, completedAt: new Date().toISOString(), notes, cost } : m)],
      expenses: cost ? [{ id: uid("exp"), date: today, kind: "maintenance" as const, label: "Monthly exterior wash", amount: cost }, ...data.expenses] : data.expenses,
    }, actor.name, "Recorded the monthly exterior wash.");
  });
  if ("error" in saved) return saved;
  return { data: present(saved.data, { personId: actor.id, viewId: view.id }).data };
}

export async function updateConfig(patch: Partial<Data["config"]>) {
  const { actor, view } = await actorContext();
  if (!requireOwner(actor) || !view) return deny();
  const cleaned = { ...patch };
  delete (cleaned as { apiKey?: unknown }).apiKey;
  delete (cleaned as { token?: unknown }).token;
  delete (cleaned as { secret?: unknown }).secret;
  if (cleaned.paymentMode === "live" && !helcimConfigured()) {
    return { error: "Live charging stays off until the Helcim API token is set on the server." };
  }
  const saved = await mutate((data) => audit({
    ...data,
    config: normalizePaymentConfig({ ...data.config, ...cleaned, paymentProvider: "helcim" }),
  }, actor!.name, "Updated yacht settings."));
  if ("error" in saved) return saved;
  return { data: present(saved.data, { personId: actor!.id, viewId: view.id }).data };
}

export async function updateGuide(patch: Partial<Data["guide"]>) {
  const { actor, view } = await actorContext();
  if (!requireOwner(actor) || !view) return deny();
  const saved = await mutate((data) => audit({ ...data, guide: { ...data.guide, ...patch } }, actor!.name, "Updated the guest guide."));
  if ("error" in saved) return saved;
  return { data: present(saved.data, { personId: actor!.id, viewId: view.id }).data };
}

export async function setTip(id: string, tip: "sent" | "skipped") {
  const { actor, view } = await actorContext();
  if (!actor || !view) return deny();
  const saved = await mutate((data) => {
    const stay = data.reservations.find((r) => r.id === id);
    if (!stay || (stay.managerId !== actor.id && actor.role !== "owner" && actor.role !== "admin")) return { error: "We couldn't find that stay." };
    return audit({
      ...data,
      reservations: data.reservations.map((r) => r.id === id ? { ...r, tip } : r),
    }, actor.name, tip === "sent" ? "Guest marked a tip as sent." : "Guest skipped the optional tip.");
  });
  if ("error" in saved) return saved;
  return { data: present(saved.data, { personId: actor.id, viewId: view.id }).data };
}

function addDaysIso(iso: string, n: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return dt.toISOString().slice(0, 10);
}
