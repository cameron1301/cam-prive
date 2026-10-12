import { createServerFn } from "@tanstack/react-start";
import type { Data, Person, PhotoSlot, Severity } from "./logic";

export const loadState = createServerFn({ method: "GET" }).handler(async () => {
  const ops = await import("./ops.server");
  return ops.loadSnapshot();
});

export const openInvite = createServerFn({ method: "POST" })
  .validator((code: string) => code.trim().toLowerCase())
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.openInvitation(data);
  });

export const switchView = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.setView(data);
  });

export const bookStay = createServerFn({ method: "POST" })
  .validator((input: { checkIn: string; nights: 1 | 2 | 3; adults: number; accepted: boolean }) => input)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.book(data);
  });

export const changeStayFn = createServerFn({ method: "POST" })
  .validator((input: { id: string; checkIn: string; nights: 1 | 2 | 3; adults: number }) => input)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.changeStay(data);
  });

export const cancelStayFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.cancelStay(data);
  });

export const checkoutFn = createServerFn({ method: "POST" })
  .validator((input: { id: string; notes: string; damage: string; photos: Record<PhotoSlot, string | null> }) => input)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.submitCheckout(data.id, data);
  });

export const tipFn = createServerFn({ method: "POST" })
  .validator((input: { id: string; tip: "sent" | "skipped" }) => input)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.setTip(data.id, data.tip);
  });

export const startCleanFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.startCleaning(data);
  });

export const toggleCheckFn = createServerFn({ method: "POST" })
  .validator((input: { jobId: string; step: string }) => input)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.toggleCheck(data.jobId, data.step);
  });

export const finishCleanFn = createServerFn({ method: "POST" })
  .validator((input: { jobId: string; notes: string; issue?: { amount: number; reason: string; evidence?: string } }) => input)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.finishCleaning(data.jobId, data.notes, data.issue);
  });

export const verifyCardFn = createServerFn({ method: "POST" })
  .validator((input: { id: string; cardToken?: string; last4?: string; transactionId?: string }) => input)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.verifyCard(data);
  });

export const decideClaimFn = createServerFn({ method: "POST" })
  .validator((input: { id: string; approve: boolean }) => input)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.decideClaim(data.id, data.approve);
  });

export const reportFn = createServerFn({ method: "POST" })
  .validator((input: { severity: Severity; description: string; photo: string | null; reservationId: string | null }) => input)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.reportProblem(data);
  });

export const resolveFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.resolveIncident(data);
  });

export const decideFn = createServerFn({ method: "POST" })
  .validator((input: { id: string; approve: boolean }) => input)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.decide(data.id, data.approve);
  });

export const restoreFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.restoreEntitlement(data);
  });

export const grantFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.grantExtra(data);
  });

export const eligibleFn = createServerFn({ method: "POST" })
  .validator((input: { personId: string; eligible: boolean }) => input)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.setEligible(data.personId, data.eligible);
  });

export const updateGuestFn = createServerFn({ method: "POST" })
  .validator((input: { personId: string; patch: Partial<Person> }) => input)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.updateGuest(data.personId, data.patch);
  });

export const blackoutFn = createServerFn({ method: "POST" })
  .validator((input: { date: string; reason: string }) => input)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.addBlackout(data.date, data.reason);
  });

export const removeBlackoutFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.removeBlackout(data);
  });

export const washFn = createServerFn({ method: "POST" })
  .validator((input: { notes: string; cost: number }) => input)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.completeExterior(data.notes, data.cost);
  });

export const configFn = createServerFn({ method: "POST" })
  .validator((patch: Partial<Data["config"]>) => patch)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.updateConfig(data);
  });

export const guideFn = createServerFn({ method: "POST" })
  .validator((patch: Partial<Data["guide"]>) => patch)
  .handler(async ({ data }) => {
    const ops = await import("./ops.server");
    return ops.updateGuide(data);
  });
