import assert from "node:assert/strict";
import test from "node:test";
import { createSeed } from "./seed.ts";
import {
  applySweep,
  arrivalUnlocked,
  blankDeposit,
  estimateStripeOnlineFee,
  holdIsDue,
  markAuthorized,
  markCaptured,
  markExpired,
  markVerified,
  normalizeDeposit,
  quoteStay,
  scheduleRelease,
} from "./payments.ts";
import type { Reservation } from "./logic.ts";

function stay(partial: Partial<Reservation> & Pick<Reservation, "id" | "checkIn" | "status">): Reservation {
  return {
    managerId: "alex",
    nights: 1,
    adults: 2,
    kind: "complimentary",
    payment: "not_required",
    amount: 0,
    rulesVersion: null,
    rulesAcceptedAt: null,
    createdAt: "2026-10-01T00:00:00Z",
    checkout: null,
    tip: "unset",
    entitlementConsumed: true,
    ...partial,
  };
}

test("an $89 stay uses Stripe's published US card rate, and a free stay has no fee", () => {
  assert.equal(estimateStripeOnlineFee(89), 2.88);
  assert.equal(estimateStripeOnlineFee(0), 0);
});

test("a complimentary stay quotes no charge today and a separate $250 hold", () => {
  const deposit = blankDeposit(250);
  const quote = quoteStay(0, "not_required", deposit);
  assert.equal(quote.stayTotal, 0);
  assert.equal(quote.chargedToday, 0);
  assert.equal(quote.securityHold, 250);
  assert.equal(quote.authorizedNow, 0);
  assert.equal(quote.testMode, true);
});

test("a paid stay is not marked charged until payment is actually paid", () => {
  const quote = quoteStay(178, "pending", blankDeposit(250));
  assert.equal(quote.stayTotal, 178);
  assert.equal(quote.chargedToday, 0);
  assert.equal(quote.securityHold, 250);
});

test("the hold waits until the lead window, then a second sweep does not duplicate it", () => {
  const seed = createSeed("2026-10-12");
  const soon = stay({ id: "soon", checkIn: "2026-10-13", status: "confirmed", deposit: markVerified(blankDeposit(250), "test-token-soon", "4242", "v1") });
  const later = stay({ id: "later", checkIn: "2026-11-01", status: "confirmed", deposit: markVerified(blankDeposit(250), "test-token-later", "4242", "v2") });
  const now = Date.parse("2026-10-13T00:00:00Z");
  assert.equal(holdIsDue(soon, soon.deposit!, 24, now), true);
  assert.equal(holdIsDue(later, later.deposit!, 24, now), false);
  const first = applySweep({ ...seed, reservations: [soon, later] }, now);
  assert.equal(first.data.reservations.find((item) => item.id === "soon")?.deposit?.status, "authorized");
  assert.equal(first.data.reservations.find((item) => item.id === "later")?.deposit?.status, "verified");
  const second = applySweep(first.data, now);
  assert.equal(second.changed, false);
  assert.equal(first.data.reservations.find((item) => item.id === "soon")?.deposit?.authId, "test-auth-soon");
});

test("an expired hold does not unlock arrival, and a clear inspection schedules a release", () => {
  const expired = markExpired(markAuthorized(blankDeposit(250), "auth"));
  assert.equal(arrivalUnlocked(expired, Date.now()), false);
  const fresh = markAuthorized(blankDeposit(250), "auth", new Date("2026-10-12T15:00:00Z"));
  assert.equal(arrivalUnlocked(fresh, Date.parse("2026-10-12T16:00:00Z")), true);
  const due = scheduleRelease(fresh, 24, new Date("2026-10-15T18:00:00Z"));
  const seed = createSeed("2026-10-15");
  const reservation = stay({ id: "out", checkIn: "2026-10-13", status: "checked_out", deposit: due });
  const swept = applySweep({ ...seed, reservations: [reservation] }, Date.parse("2026-10-16T19:00:00Z"));
  assert.equal(swept.data.reservations[0]?.deposit?.status, "released");
});

test("a damage capture keeps only the approved amount", () => {
  const captured = markCaptured(markAuthorized(blankDeposit(250), "auth"), 80, "cap");
  assert.equal(captured.status, "captured");
  assert.equal(captured.capturedAmount, 80);
  assert.equal(captured.amount, 250);
});

test("a pending damage claim blocks automatic release", () => {
  const due = scheduleRelease(markAuthorized(blankDeposit(250), "auth", new Date("2026-10-12T15:00:00Z")), 24, new Date("2026-10-15T18:00:00Z"));
  const seed = createSeed("2026-10-15");
  const reservation = stay({ id: "out", checkIn: "2026-10-13", status: "checked_out", deposit: due });
  const swept = applySweep(
    {
      ...seed,
      reservations: [reservation],
      claims: [{ id: "c1", reservationId: "out", amount: 80, reason: "Cushion", evidence: "", status: "pending_owner", createdAt: "", decidedAt: "" }],
    },
    Date.parse("2026-10-16T19:00:00Z"),
  );
  assert.equal(swept.data.reservations[0]?.deposit?.status, "authorized");
});

test("live mode does not invent a local authorization", () => {
  const seed = createSeed("2026-10-12");
  seed.config.paymentMode = "live";
  const verified = markVerified(blankDeposit(250, "live"), "tok_live", "4242", "v1");
  const soon = stay({ id: "soon", checkIn: "2026-10-13", status: "confirmed", deposit: verified });
  const swept = applySweep({ ...seed, reservations: [soon] }, Date.parse("2026-10-13T00:00:00Z"));
  assert.equal(swept.data.reservations[0]?.deposit?.status, "verified");
  assert.equal(swept.data.reservations[0]?.deposit?.authId, "");
});

test("old stays without a deposit record are not left unverified after checkout", () => {
  const deposit = normalizeDeposit(undefined, 250, "checked_out");
  assert.equal(deposit.status, "released");
  assert.equal(deposit.tokenRef, "");
});
