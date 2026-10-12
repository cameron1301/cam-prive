import type { Config, Data, PayStatus, Reservation, ReservationStatus } from "./logic";
import { hoursUntilCheckIn, zoned } from "./logic";

/** Stripe cancels an uncaptured PaymentIntent after 7 days. Never treat an older hold as valid. */
export const AUTH_HOLD_MS = 7 * 24 * 60 * 60 * 1000;

export const HOUSE_RULES = [
  "No parties or events.",
  "No smoking or vaping.",
  "No unauthorized visitors.",
  "Four adults at most. No children or pets.",
  "The yacht stays in its slip. Please don't start the engines or use the controls.",
  "No cooking or open flames.",
  "The onboard toilet and shower stay closed. Shore facilities are for washing up.",
  "If something is damaged or needs more than a normal clean, the cost can be taken from the security hold, only for what is documented and allowed by law.",
] as const;

export type DepositStatus =
  | "unverified"
  | "verified"
  | "authorized"
  | "failed"
  | "released"
  | "captured"
  | "expired";

export type Deposit = {
  amount: number;
  status: DepositStatus;
  mode: "test" | "live";
  last4: string;
  brand: string;
  tokenRef: string;
  verifyId: string;
  chargeId: string;
  authId: string;
  authorizedAt: string;
  expiresAt: string;
  releaseDueAt: string;
  releasedAt: string;
  capturedAmount: number;
  captureId: string;
};

export type DepositClaim = {
  id: string;
  reservationId: string;
  amount: number;
  reason: string;
  evidence: string;
  status: "pending_owner" | "approved" | "declined";
  createdAt: string;
  decidedAt: string;
};

export function defaultPaymentConfig(): Pick<
  Config,
  "depositAmount" | "depositLeadHours" | "depositReleaseHours" | "paymentProvider" | "paymentMode" | "acceptedMethods"
> {
  return {
    depositAmount: 250,
    depositLeadHours: 24,
    depositReleaseHours: 24,
    paymentProvider: "stripe",
    paymentMode: "test",
    acceptedMethods: "Credit and debit cards",
  };
}

export function blankDeposit(amount = 250, mode: "test" | "live" = "test"): Deposit {
  return {
    amount,
    status: "unverified",
    mode,
    last4: "",
    brand: "",
    tokenRef: "",
    verifyId: "",
    chargeId: "",
    authId: "",
    authorizedAt: "",
    expiresAt: "",
    releaseDueAt: "",
    releasedAt: "",
    capturedAmount: 0,
    captureId: "",
  };
}

export function normalizeDeposit(
  raw: Partial<Deposit> | undefined,
  amount: number,
  stayStatus?: ReservationStatus,
): Deposit {
  const base = blankDeposit(amount);
  if (!raw || !raw.status) {
    const finished = stayStatus === "checked_out" || stayStatus === "cancelled" || stayStatus === "declined";
    return { ...base, status: finished ? "released" : "unverified" };
  }
  return {
    ...base,
    ...raw,
    amount: Number(raw.amount) > 0 ? Number(raw.amount) : amount,
    capturedAmount: Number(raw.capturedAmount) || 0,
    tokenRef: raw.tokenRef || "",
    mode: raw.mode === "live" ? "live" : "test",
  };
}

export function publicDeposit(deposit: Deposit): Deposit {
  return { ...deposit, tokenRef: "" };
}

export function normalizePaymentConfig(config: Config): Config {
  const defaults = defaultPaymentConfig();
  const amount = Number(config.depositAmount);
  const lead = Number(config.depositLeadHours);
  const release = Number(config.depositReleaseHours);
  return {
    ...config,
    depositAmount: amount > 0 ? amount : defaults.depositAmount,
    depositLeadHours: lead >= 1 && lead <= 72 ? lead : defaults.depositLeadHours,
    depositReleaseHours: release >= 1 && release <= 72 ? release : defaults.depositReleaseHours,
    paymentProvider: "stripe",
    paymentMode: config.paymentMode === "live" ? "live" : "test",
    acceptedMethods: config.acceptedMethods?.trim() || defaults.acceptedMethods,
  };
}

/** A hold only unlocks arrival details while it is still inside Stripe's 7-day window, or after it was released or partly captured. */
export function arrivalUnlocked(deposit: Deposit, now = Date.now()): boolean {
  if (deposit.status === "authorized") {
    const exp = Date.parse(deposit.expiresAt);
    return Number.isFinite(exp) && exp > now;
  }
  return deposit.status === "released" || deposit.status === "captured";
}

export function holdIsDue(stay: Reservation, deposit: Deposit, leadHours: number, now = Date.now()): boolean {
  if (deposit.status !== "verified" || !deposit.tokenRef) return false;
  if (stay.status !== "confirmed" && stay.status !== "pending_approval") return false;
  const checkInAt = zoned(stay.checkIn, "15:00");
  return now >= checkInAt - leadHours * 36e5;
}

export type StayQuote = {
  stayTotal: number;
  chargedToday: number;
  securityHold: number;
  authorizedNow: number;
  testMode: boolean;
};

export function quoteStay(stayAmount: number, payment: PayStatus, deposit: Deposit, now = Date.now()): StayQuote {
  const authorized =
    deposit.status === "authorized" && arrivalUnlocked(deposit, now)
      ? deposit.amount
      : deposit.status === "captured"
        ? deposit.amount
        : 0;
  return {
    stayTotal: stayAmount,
    chargedToday: payment === "paid" ? stayAmount : 0,
    securityHold: deposit.amount,
    authorizedNow: authorized,
    testMode: deposit.mode !== "live",
  };
}

/** Stripe's published US online card rate: 2.9% + $0.30 on a successful charge. A released authorization is not a charge. */
export function estimateStripeOnlineFee(amount: number): number {
  if (amount <= 0) return 0;
  return Math.round((amount * 0.029 + 0.3) * 100) / 100;
}

export function markVerified(deposit: Deposit, tokenRef: string, last4: string, verifyId: string, now = new Date()): Deposit {
  if (deposit.status === "authorized" || deposit.status === "captured") return deposit;
  return {
    ...deposit,
    status: "verified",
    tokenRef,
    last4,
    brand: deposit.mode === "live" ? deposit.brand || "card" : "test",
    verifyId,
    authorizedAt: "",
    expiresAt: "",
    authId: "",
  };
}

export function markAuthorized(deposit: Deposit, authId: string, now = new Date()): Deposit {
  const at = now.toISOString();
  return {
    ...deposit,
    status: "authorized",
    authId,
    authorizedAt: at,
    expiresAt: new Date(now.getTime() + AUTH_HOLD_MS).toISOString(),
    releasedAt: "",
  };
}

export function markReleased(deposit: Deposit, now = new Date()): Deposit {
  return { ...deposit, status: "released", releasedAt: now.toISOString(), releaseDueAt: "" };
}

export function markExpired(deposit: Deposit): Deposit {
  return { ...deposit, status: "expired" };
}

export function markFailed(deposit: Deposit): Deposit {
  return { ...deposit, status: "failed", authId: "", expiresAt: "" };
}

export function markCaptured(deposit: Deposit, amount: number, captureId: string, now = new Date()): Deposit {
  const taken = Math.min(deposit.amount, Math.max(0, amount));
  return {
    ...deposit,
    status: "captured",
    capturedAmount: taken,
    captureId,
    releasedAt: taken < deposit.amount ? now.toISOString() : deposit.releasedAt,
  };
}

type SweepResult = { data: Data; changed: boolean; notes: string[] };

function same(data: Data): SweepResult {
  return { data, changed: false, notes: [] };
}

/** Move holds, releases, and expirations forward. Test-mode holds are recorded locally and are not bank charges. */
export function applySweep(data: Data, now = Date.now()): SweepResult {
  const config = normalizePaymentConfig(data.config);
  const claims = data.claims || [];
  let changed =
    !data.claims ||
    config.depositAmount !== data.config.depositAmount ||
    config.depositLeadHours !== data.config.depositLeadHours ||
    config.depositReleaseHours !== data.config.depositReleaseHours ||
    config.paymentMode !== data.config.paymentMode ||
    config.paymentProvider !== data.config.paymentProvider ||
    config.acceptedMethods !== data.config.acceptedMethods;
  const notes: string[] = [];
  const reservations = data.reservations.map((stay) => {
    const deposit = normalizeDeposit(stay.deposit, config.depositAmount, stay.status);
    let next = deposit;
    const openClaim = claims.some((c) => c.reservationId === stay.id && c.status === "pending_owner");
    if (next.status === "authorized") {
      const exp = Date.parse(next.expiresAt);
      if (!Number.isFinite(exp) || exp <= now) {
        next = markExpired(next);
        notes.push(`Security hold expired for ${stay.id}. It is no longer treated as valid.`);
      } else if (next.mode !== "live" && next.releaseDueAt && Date.parse(next.releaseDueAt) <= now && !openClaim) {
        next = markReleased(next, new Date(now));
        notes.push(`Released the security hold for ${stay.id}.`);
      }
    }
    if (holdIsDue(stay, next, config.depositLeadHours, now)) {
      if (config.paymentMode !== "live") {
        next = markAuthorized(next, next.authId || `test-auth-${stay.id}`, new Date(now));
        notes.push(`Recorded a test security hold for ${stay.id}. No card was charged.`);
      }
    }
    if (stay.status === "cancelled" && next.status === "authorized" && next.mode !== "live") {
      next = markReleased(next, new Date(now));
    }
    if (JSON.stringify(next) !== JSON.stringify(deposit) || !stay.deposit) {
      changed = true;
      return { ...stay, deposit: next };
    }
    return stay;
  });
  if (!changed) return same(data);
  return { data: { ...data, config, claims, reservations }, changed: true, notes };
}

export function scheduleRelease(deposit: Deposit, releaseHours: number, now = new Date()): Deposit {
  if (deposit.status !== "authorized") return deposit;
  return { ...deposit, releaseDueAt: new Date(now.getTime() + releaseHours * 36e5).toISOString() };
}

export function depositDueLabel(checkIn: string, leadHours: number): string {
  const hours = hoursUntilCheckIn(checkIn);
  if (hours <= leadHours) return "Before arrival details are shared";
  return `About ${leadHours} hours before 3:00 PM check-in`;
}
