export const TZ = "America/Los_Angeles";
export const CHECK_IN_HOUR = 15;
export const CHECK_OUT_HOUR = 10;
export const CHECK_IN_LABEL = "3:00 pm";
export const CHECK_OUT_LABEL = "10:00 am";
export const MAX_NIGHTS = 2;
export const HORIZON_DAYS = 270;

export type StayPhase = "upcoming" | "aboard" | "wash" | "closed";

export function laParts(now = new Date()): { date: string; hour: number } {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  });
  const bag: Record<string, string> = {};
  for (const part of fmt.formatToParts(now)) bag[part.type] = part.value;
  return {
    date: `${bag.year}-${bag.month}-${bag.day}`,
    hour: Number(bag.hour),
  };
}

export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  const yyyy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function checkoutDate(checkIn: string, nights: number): string {
  return addDays(checkIn, nights);
}

export function sleepNights(checkIn: string, nights: number): string[] {
  return Array.from({ length: nights }, (_, i) => addDays(checkIn, i));
}

/** Sleep-night ranges overlap. Checkout morning is free for the next arrival. */
export function rangesOverlap(
  aIn: string,
  aNights: number,
  bIn: string,
  bNights: number,
): boolean {
  const aEnd = checkoutDate(aIn, aNights);
  const bEnd = checkoutDate(bIn, bNights);
  return aIn < bEnd && bIn < aEnd;
}

export function stayStarted(checkIn: string, now = new Date()): boolean {
  const { date, hour } = laParts(now);
  return date > checkIn || (date === checkIn && hour >= CHECK_IN_HOUR);
}

export function stayEnded(
  checkIn: string,
  nights: number,
  leftEarly: boolean,
  now = new Date(),
): boolean {
  if (leftEarly) return true;
  const { date, hour } = laParts(now);
  const out = checkoutDate(checkIn, nights);
  return date > out || (date === out && hour >= CHECK_OUT_HOUR);
}

export function phaseOf(
  checkIn: string,
  nights: number,
  leftEarly: boolean,
  washReady: boolean,
  now = new Date(),
): StayPhase {
  const ended = stayEnded(checkIn, nights, leftEarly, now);
  if (ended && washReady) return "closed";
  if (ended) return "wash";
  if (stayStarted(checkIn, now)) return "aboard";
  return "upcoming";
}

export function minCheckIn(now = new Date()): string {
  const { date, hour } = laParts(now);
  return hour >= CHECK_IN_HOUR ? addDays(date, 1) : date;
}

export function maxCheckIn(now = new Date()): string {
  return addDays(laParts(now).date, HORIZON_DAYS);
}

export function weekdayIndex(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function monthStart(iso: string): string {
  return `${iso.slice(0, 7)}-01`;
}

export function daysInMonth(iso: string): number {
  const [y, m] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

export function prettyDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function prettyMonth(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

export function clip(value: string, max: number): string {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}
