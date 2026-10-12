export const RULES_VERSION = "2026-10-house-1";

export const CLEAN_STEPS = [
  { id: "interior", label: "Interior cleaning" },
  { id: "trash", label: "Trash removal" },
  { id: "fridge", label: "Refrigerator inspection" },
  { id: "micro", label: "Microwave inspection" },
  { id: "coffee", label: "Coffee area" },
  { id: "floors", label: "Floors" },
  { id: "surfaces", label: "Surfaces" },
  { id: "sleep", label: "Sleeping area" },
  { id: "bedding-out", label: "Bedding removal" },
  { id: "bedding-wash", label: "Wash bedding" },
  { id: "towels-wash", label: "Wash towels" },
  { id: "bedding-reset", label: "Replace and reset bedding" },
  { id: "towels-reset", label: "Replace and reset towels" },
  { id: "cockpit", label: "Cockpit inspection" },
  { id: "bridge", label: "Command bridge inspection" },
  { id: "birds", label: "Bird droppings — inspect and clean" },
  { id: "exterior", label: "Exterior visual inspection" },
  { id: "damage", label: "Damage inspection" },
  { id: "reset", label: "Final overall reset" },
] as const;

export const PHOTO_SLOTS = [
  { id: "cabin", label: "Cabin / interior" },
  { id: "cockpit", label: "Cockpit" },
  { id: "bridge", label: "Command bridge" },
  { id: "overall", label: "Overall condition" },
] as const;

export type PhotoSlot = (typeof PHOTO_SLOTS)[number]["id"];
export type CleanId = (typeof CLEAN_STEPS)[number]["id"];

export type Role = "owner" | "manager" | "cleaner" | "admin";
export type Entitlement = "available" | "used";
export type PayStatus = "not_required" | "pending" | "paid" | "refunded" | "waived";
export type ReservationStatus =
  | "confirmed"
  | "pending_approval"
  | "declined"
  | "cancelled"
  | "checked_out";
export type Severity = "minor" | "attention" | "urgent";
export type YachtStatus =
  | "ready"
  | "reserved"
  | "occupied"
  | "cleaning_required"
  | "cleaning"
  | "maintenance"
  | "attention";

export type GuestType = "manager" | "team" | "client" | "district" | "partner" | "friend" | "vip" | "guest";

export type Person = {
  id: string;
  name: string;
  region: string;
  role: Role;
  guestType: GuestType;
  email: string;
  phone: string;
  eligible: boolean;
  entitlement: Entitlement;
  extraStays: number;
  complimentaryPerYear: number;
  complimentaryUsed: number;
  preferredRate: number;
  maxStay: number;
  benefitExpires: string;
  benefitStarts: string;
  specialBenefit: string;
  inviteCode: string;
  notes: string;
};

export const GUEST_LABEL: Record<GuestType, string> = {
  manager: "CAM manager",
  team: "CAM team",
  client: "Client",
  district: "School district partner",
  partner: "Business partner",
  friend: "Friend",
  vip: "VIP",
  guest: "Other invited guest",
};

export function normalizePerson(raw: Person): Person {
  const guestType = raw.guestType ?? (raw.role === "manager" ? "manager" : "guest");
  const complimentaryPerYear = raw.complimentaryPerYear ?? (guestType === "manager" ? 1 : 0);
  const complimentaryUsed =
    raw.complimentaryUsed ?? (raw.entitlement === "used" ? Math.min(1, complimentaryPerYear) : 0);
  const remaining = Math.max(0, complimentaryPerYear - complimentaryUsed);
  return {
    ...raw,
    guestType,
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    complimentaryPerYear,
    complimentaryUsed,
    preferredRate: raw.preferredRate ?? (guestType === "manager" ? 89 : 0),
    maxStay: raw.maxStay ?? 3,
    benefitExpires: raw.benefitExpires ?? "",
    benefitStarts: raw.benefitStarts ?? "",
    specialBenefit: raw.specialBenefit ?? "",
    inviteCode: (raw.inviteCode || raw.id || "").toLowerCase(),
    notes: raw.notes ?? "",
    entitlement: remaining > 0 ? "available" : "used",
  };
}

export function benefitHeadline(person: Person): string {
  const profile = normalizePerson(person);
  if (profile.specialBenefit.trim()) return profile.specialBenefit.trim();
  const left = nightsLeft(profile);
  if (left === 1) return "One Complimentary Night";
  if (left > 1) return `${left} Complimentary Nights`;
  if (profile.preferredRate > 0) return `Preferred Privé Rate — $${profile.preferredRate}/night`;
  return "Your invitation is open";
}

export function findByInvite(people: Person[], code: string): Person | undefined {
  const key = code.trim().toLowerCase();
  if (!key) return undefined;
  return people.map(normalizePerson).find((p) => p.inviteCode === key && p.role === "manager");
}

export function nightsLeft(person: Person): number {
  const p = normalizePerson(person);
  return Math.max(0, p.complimentaryPerYear - p.complimentaryUsed);
}

export type NightCount = 1 | 2 | 3;

export type Reservation = {
  id: string;
  managerId: string;
  checkIn: string;
  nights: NightCount;
  adults: number;
  kind: "complimentary" | "paid";
  status: ReservationStatus;
  payment: PayStatus;
  amount: number;
  rulesVersion: string | null;
  rulesAcceptedAt: string | null;
  createdAt: string;
  checkout: null | {
    at: string;
    notes: string;
    damage: string;
    photos: Record<PhotoSlot, string | null>;
  };
  tip: "unset" | "sent" | "skipped";
  entitlementConsumed: boolean;
  complimentaryApplied?: number;
  deposit?: import("./payments").Deposit;
};

export type CleaningJob = {
  id: string;
  reservationId: string;
  status: "required" | "in_progress" | "complete";
  checks: Record<string, boolean>;
  photos: Partial<Record<PhotoSlot, string>>;
  notes: string;
  cost: number;
  startedAt: string | null;
  completedAt: string | null;
};

export type Incident = {
  id: string;
  severity: Severity;
  description: string;
  photo: string | null;
  source: "guest" | "maria";
  reservationId: string | null;
  createdAt: string;
  resolved: boolean;
};

export type Blackout = { id: string; date: string; reason: string };

export type MaintenanceTask = {
  id: string;
  title: string;
  kind: "exterior" | "other";
  due: string;
  completedAt: string | null;
  cost: number;
  notes: string;
  cleaner: string;
};

export type Expense = {
  id: string;
  date: string;
  kind: "slip" | "cleaning" | "maintenance" | "other";
  label: string;
  amount: number;
};

export type Audit = { id: string; at: string; actor: string; action: string };
export type SmsNote = { id: string; at: string; to: string; body: string };

export type GuideBlock = { id: string; title: string; body: string; verified: boolean };

export type Config = {
  access: string;
  parking: string;
  shore: string;
  wifi: string;
  emergency: string;
  zelle: string;
  nightlyRate: number;
  cleaningCost: number;
  slipMonthly: number;
  maxNights: number;
  horizonDays: number;
  depositAmount: number;
  depositLeadHours: number;
  depositReleaseHours: number;
  paymentProvider: "helcim";
  paymentMode: "test" | "live";
  acceptedMethods: string;
};

export type Guide = {
  heroTitle: string;
  heroBody: string;
  activities: GuideBlock[];
  bring: string[];
  escape24: string[];
  escape48: string[];
};

export type Data = {
  people: Person[];
  reservations: Reservation[];
  jobs: CleaningJob[];
  incidents: Incident[];
  blackouts: Blackout[];
  maintenance: MaintenanceTask[];
  expenses: Expense[];
  audit: Audit[];
  sms: SmsNote[];
  config: Config;
  guide: Guide;
  claims: import("./payments").DepositClaim[];
};

export function laToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return dt.toISOString().slice(0, 10);
}

export function checkoutDate(checkIn: string, nights: number): string {
  return addDays(checkIn, nights);
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const [y1, m1, d1] = checkIn.split("-").map(Number);
  const [y2, m2, d2] = checkOut.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}

export function nightsOf(checkIn: string, nights: number): string[] {
  return Array.from({ length: nights }, (_, i) => addDays(checkIn, i));
}

/** Calendar dates from check-in through checkout morning, inclusive. */
export function stayDates(checkIn: string, nights: number): string[] {
  return Array.from({ length: nights + 1 }, (_, i) => addDays(checkIn, i));
}

export function asNightCount(n: number, max = 3): NightCount | null {
  if (n !== 1 && n !== 2 && n !== 3) return null;
  return n <= max ? n : null;
}

export function cmp(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function pretty(iso: string, withWeekday = true): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: withWeekday ? "long" : undefined,
    month: "long",
    day: "numeric",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

export function monthLabel(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(y, m - 1, 1)));
}

export function ymOf(iso: string): string {
  return iso.slice(0, 7);
}

export function zoned(iso: string, hhmm: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  const [hh, mm] = hhmm.split(":").map(Number);
  let t = Date.UTC(y, m - 1, d, hh, mm);
  for (let i = 0; i < 4; i++) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(t));
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
    const got = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
    const want = Date.UTC(y, m - 1, d, hh, mm);
    t += want - got;
  }
  return t;
}

export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;
}

export function blankChecks(): Record<string, boolean> {
  return Object.fromEntries(CLEAN_STEPS.map((s) => [s.id, false]));
}

export function blankPhotos(): Record<PhotoSlot, string | null> {
  return { cabin: null, cockpit: null, bridge: null, overall: null };
}

const BLOCKING: ReservationStatus[] = ["confirmed", "pending_approval"];

export function blocksNight(r: Reservation, iso: string): boolean {
  if (!BLOCKING.includes(r.status)) return false;
  const end = checkoutDate(r.checkIn, r.nights);
  return iso >= r.checkIn && iso < end;
}

export function hasOpenEntitlement(p: Person): boolean {
  return normalizePerson(p).eligible && nightsLeft(p) > 0;
}

export function priceStay(person: Person, nights: number, rate: number) {
  const profile = normalizePerson(person);
  const nightly = profile.preferredRate || rate;
  const complimentaryNights = profile.eligible ? Math.min(nightsLeft(profile), nights) : 0;
  const paidNights = nights - complimentaryNights;
  const amount = paidNights * nightly;
  const overLimit = nights > profile.maxStay;
  return {
    complimentaryNights,
    paidNights,
    amount,
    nightly,
    needsApproval: overLimit,
    kind: (amount === 0 ? "complimentary" : "paid") as "complimentary" | "paid",
    usesBenefit: complimentaryNights > 0,
  };
}

export function canCheckIn(data: Data, iso: string, today: string, exceptId?: string): string | null {
  const { horizonDays } = data.config;
  if (iso < today) return "That date has already passed. Please choose a day still ahead.";
  if (iso > addDays(today, horizonDays)) return `Those dates aren't open yet. A stay can be reserved up to ${horizonDays} days ahead.`;
  if (data.blackouts.some((b) => b.date === iso)) return "That date is held. Please choose another.";
  if (data.reservations.some((r) => r.id !== exceptId && blocksNight(r, iso))) return "That night is already reserved. Please choose another arrival.";
  const status = yachtStatus(data, today);
  if (iso === today && status !== "ready" && status !== "reserved") {
    return "An arrival today isn't available. The yacht is still being prepared.";
  }
  return null;
}

/** Checkout morning that shares a calendar date with another stay's check-in. */
export function turnoverDate(data: Data, checkIn: string, nights: number): string | null {
  const out = checkoutDate(checkIn, nights);
  for (const r of data.reservations) {
    if (r.status !== "confirmed" && r.status !== "pending_approval" && r.status !== "checked_out") continue;
    if (checkoutDate(r.checkIn, r.nights) === checkIn) return checkIn;
    if ((r.status === "confirmed" || r.status === "pending_approval") && r.checkIn === out) return out;
  }
  return null;
}

export function upcomingTurnoverDates(data: Data, today: string): string[] {
  const dates = new Set<string>();
  const live = data.reservations.filter(
    (r) => r.status === "confirmed" || r.status === "pending_approval" || r.status === "checked_out",
  );
  for (const arrival of live) {
    if (arrival.status === "checked_out" || arrival.checkIn < today) continue;
    for (const departure of live) {
      if (departure.id !== arrival.id && checkoutDate(departure.checkIn, departure.nights) === arrival.checkIn) {
        dates.add(arrival.checkIn);
      }
    }
  }
  return [...dates];
}

export function activeStay(data: Data, managerId: string, today: string): Reservation | undefined {
  return data.reservations.find((r) => {
    if (r.managerId !== managerId) return false;
    if (r.status === "pending_approval") return true;
    if (r.status === "confirmed") return checkoutDate(r.checkIn, r.nights) >= today;
    return false;
  });
}

export function canStart(data: Data, checkIn: string, nights: NightCount, today: string, exceptId?: string): string | null {
  const max = data.config.maxNights;
  if (nights > max) return `Stays can be reserved for up to ${max} nights.`;
  const check = canCheckIn(data, checkIn, today, exceptId);
  if (check) return check;
  const nightsList = nightsOf(checkIn, nights);
  for (const night of nightsList) {
    if (night !== checkIn && night > addDays(today, data.config.horizonDays)) {
      return `Those dates aren't open yet. A stay can be reserved up to ${data.config.horizonDays} days ahead.`;
    }
    if (data.blackouts.some((b) => b.date === night)) return "Part of that stay is held. Please choose different dates.";
    if (data.reservations.some((r) => r.id !== exceptId && blocksNight(r, night))) return "Part of that stay is already reserved.";
  }
  return null;
}

export function isAboard(r: Reservation, today: string, now = Date.now()): boolean {
  if (r.status !== "confirmed") return false;
  const out = checkoutDate(r.checkIn, r.nights);
  if (today < r.checkIn || today > out) return false;
  if (today < out) return true;
  return now < zoned(out, "11:00");
}

export function isOverdue(r: Reservation, today: string, now = Date.now()): boolean {
  if (r.status !== "confirmed") return false;
  const out = checkoutDate(r.checkIn, r.nights);
  return now >= zoned(out, "11:00") || today > out;
}

export function yachtStatus(data: Data, today: string, now = Date.now()): YachtStatus {
  const openUrgent = data.incidents.some((i) => !i.resolved && (i.severity === "urgent" || i.severity === "attention"));
  if (openUrgent) return "attention";
  const washDue = data.maintenance.find((m) => m.kind === "exterior" && !m.completedAt && m.due < today);
  if (washDue) return "maintenance";
  const turnoverLate =
    upcomingTurnoverDates(data, today).includes(today) && now >= zoned(today, "15:00");
  if (data.jobs.some((j) => j.status === "in_progress")) return turnoverLate ? "attention" : "cleaning";
  if (data.jobs.some((j) => j.status === "required")) return turnoverLate ? "attention" : "cleaning_required";
  if (data.reservations.some((r) => isOverdue(r, today, now))) return turnoverLate ? "attention" : "cleaning_required";
  if (data.reservations.some((r) => isAboard(r, today, now))) return "occupied";
  if (data.reservations.some((r) => r.status === "confirmed" && r.checkIn > today)) return "reserved";
  return "ready";
}

export const STATUS_LABEL: Record<YachtStatus, string> = {
  ready: "Ready",
  reserved: "Reserved",
  occupied: "Occupied",
  cleaning_required: "Cleaning required",
  cleaning: "Cleaning in progress",
  maintenance: "Maintenance required",
  attention: "Owner attention",
};

export function money(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export type PeriodStats = {
  occupied: number;
  complimentary: number;
  paidNights: number;
  revenue: number;
  cleaning: number;
  maintenance: number;
  slip: number;
  net: number;
};

export function statsBetween(data: Data, from: string, to: string, slipMonths: number): PeriodStats {
  let occupied = 0;
  let complimentary = 0;
  let paidNights = 0;
  let revenue = 0;
  for (const r of data.reservations) {
    if (r.status !== "confirmed" && r.status !== "checked_out") continue;
    const nightsList = nightsOf(r.checkIn, r.nights).filter((n) => n >= from && n <= to);
    occupied += nightsList.length;
    const complimentaryCap = Math.min(
      r.nights,
      r.complimentaryApplied ?? (r.entitlementConsumed ? 1 : r.kind === "complimentary" ? r.nights : 0),
    );
    const all = nightsOf(r.checkIn, r.nights);
    let paidInRange = 0;
    for (const iso of nightsList) {
      if (all.indexOf(iso) < complimentaryCap) complimentary += 1;
      else {
        paidNights += 1;
        paidInRange += 1;
      }
    }
    const paidTotal = r.nights - complimentaryCap;
    if (paidTotal > 0 && r.payment === "paid") revenue += Math.round(r.amount * (paidInRange / paidTotal));
  }
  const cleaning = data.expenses
    .filter((e) => e.kind === "cleaning" && e.date >= from && e.date <= to)
    .reduce((s, e) => s + e.amount, 0);
  const maintenance = data.expenses
    .filter((e) => e.kind === "maintenance" && e.date >= from && e.date <= to)
    .reduce((s, e) => s + e.amount, 0);
  const slip = data.config.slipMonthly * slipMonths;
  return {
    occupied,
    complimentary,
    paidNights,
    revenue,
    cleaning,
    maintenance,
    slip,
    net: revenue - cleaning - maintenance - slip,
  };
}

export function monthBounds(ym: string): { from: string; to: string } {
  const [y, m] = ym.split("-").map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return { from: `${ym}-01`, to: `${ym}-${String(last).padStart(2, "0")}` };
}

export function yearBounds(year: number): { from: string; to: string } {
  return { from: `${year}-01-01`, to: `${year}-12-31` };
}

export function hoursUntilCheckIn(checkIn: string, now = Date.now()): number {
  return (zoned(checkIn, "15:00") - now) / 36e5;
}

export function nextReservation(data: Data, today: string): Reservation | undefined {
  return data.reservations
    .filter((r) => r.status === "confirmed" && checkoutDate(r.checkIn, r.nights) >= today)
    .sort((a, b) => cmp(a.checkIn, b.checkIn))[0];
}

export function ownerExceptions(data: Data, today: string, now = Date.now()): string[] {
  const notes: string[] = [];
  const pending = data.reservations.filter((r) => r.status === "pending_approval");
  if (pending.length) notes.push(`${pending.length} additional stay${pending.length === 1 ? "" : "s"} waiting for approval.`);
  for (const i of data.incidents) {
    if (!i.resolved && i.severity !== "minor") notes.push(`${i.severity === "urgent" ? "Urgent" : "Needs attention"}: ${i.description}`);
  }
  for (const r of data.reservations) {
    if (isOverdue(r, today, now)) notes.push(`Stay ended without checkout — ${personName(data, r.managerId)}.`);
  }
  const upcoming = nextReservation(data, today);
  if (upcoming && upcoming.checkIn <= addDays(today, 1)) {
    const blocked = yachtStatus(data, today, now);
    if (blocked === "cleaning_required" || blocked === "cleaning" || blocked === "maintenance" || blocked === "attention") {
      notes.push("A guest arrives soon and the yacht is not ready.");
    }
  }
  const wash = data.maintenance.find((m) => m.kind === "exterior" && !m.completedAt);
  if (wash && wash.due < today) notes.push("Monthly exterior wash is overdue.");
  return notes;
}

export function personName(data: Data, id: string): string {
  return data.people.find((p) => p.id === id)?.name ?? "Manager";
}

export function calendarCells(ym: string): Array<{ iso: string; inMonth: boolean }> {
  const [y, m] = ym.split("-").map(Number);
  const firstDow = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const count = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells: Array<{ iso: string; inMonth: boolean }> = [];
  for (let i = 0; i < firstDow; i++) {
    const iso = addDays(`${ym}-01`, i - firstDow);
    cells.push({ iso, inMonth: false });
  }
  for (let d = 1; d <= count; d++) {
    cells.push({ iso: `${ym}-${String(d).padStart(2, "0")}`, inMonth: true });
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].iso;
    cells.push({ iso: addDays(last, 1), inMonth: false });
  }
  return cells;
}

export async function fileToDataUrl(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not read that photo."));
      el.src = url;
    });
    const scale = Math.min(1, 960 / img.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not prepare that photo.");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.72);
  } finally {
    URL.revokeObjectURL(url);
  }
}
