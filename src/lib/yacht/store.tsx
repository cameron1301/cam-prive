import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createSeed } from "./seed";
import {
  blankChecks,
  blankPhotos,
  canStart,
  hoursUntilCheckIn,
  laToday,
  RULES_VERSION,
  checkoutDate,
  nightsLeft,
  findByInvite,
  normalizePerson,
  priceStay,
  turnoverDate,
  uid,
  yachtStatus,
  type Data,
  type Person,
  type PhotoSlot,
  type Reservation,
  type Severity,
} from "./logic";

const KEY = "cam-prive-guests-v5";
const SESSION = "cam-prive-who";

type ViewId = string;

type Api = {
  ready: boolean;
  data: Data;
  viewId: ViewId;
  today: string;
  me: Person;
  setView: (id: string) => void;
  openInvitation: (code: string) => boolean;
  book: (input: {
    checkIn: string;
    nights: 1 | 2 | 3;
    adults: number;
    accepted: boolean;
  }) => { ok: true; id: string } | { ok: false; error: string };
  changeStay: (input: {
    id: string;
    checkIn: string;
    nights: 1 | 2 | 3;
    adults: number;
  }) => { ok: true } | { ok: false; error: string };
  cancelStay: (id: string) => string;
  submitCheckout: (id: string, input: { notes: string; damage: string; photos: Record<PhotoSlot, string | null> }) => string | null;
  setTip: (id: string, tip: "sent" | "skipped") => void;
  startCleaning: (jobId: string) => void;
  toggleCheck: (jobId: string, step: string) => void;
  finishCleaning: (jobId: string, notes: string) => string | null;
  reportProblem: (input: { severity: Severity; description: string; photo: string | null; reservationId: string | null }) => void;
  resolveIncident: (id: string) => void;
  decide: (id: string, approve: boolean) => void;
  restoreEntitlement: (personId: string) => void;
  grantExtra: (personId: string) => void;
  setEligible: (personId: string, eligible: boolean) => void;
  updateGuest: (personId: string, patch: Partial<Person>) => void;
  addBlackout: (date: string, reason: string) => void;
  removeBlackout: (id: string) => void;
  completeExterior: (notes: string, cost: number) => void;
  updateConfig: (patch: Partial<Data["config"]>) => void;
  updateGuide: (patch: Partial<Data["guide"]>) => void;
  resetDemo: () => void;
};

const Ctx = createContext<Api | null>(null);

function persist(data: Data) {
  localStorage.setItem(KEY, JSON.stringify({ viewId: "", data }));
}

function remember(id: string) {
  try {
    if (id) sessionStorage.setItem(SESSION, id);
    else sessionStorage.removeItem(SESSION);
  } catch {
    /* private mode */
  }
}

function remembered(): string {
  try {
    return sessionStorage.getItem(SESSION) || "";
  } catch {
    return "";
  }
}

function audit(data: Data, actor: string, action: string): Data {
  return {
    ...data,
    audit: [{ id: uid("log"), at: new Date().toISOString(), actor, action }, ...data.audit].slice(0, 80),
  };
}

const ANON: Person = normalizePerson({
  id: "",
  name: "",
  region: "",
  role: "manager",
  guestType: "guest",
  email: "",
  phone: "",
  eligible: false,
  entitlement: "used",
  extraStays: 0,
  complimentaryPerYear: 0,
  complimentaryUsed: 0,
  preferredRate: 0,
  maxStay: 3,
  benefitExpires: "",
  benefitStarts: "",
  specialBenefit: "",
  inviteCode: "",
  notes: "",
});

export function YachtProvider({ children }: { children: ReactNode }) {
  const today = laToday();
  const [viewId, setViewId] = useState("");
  const [data, setData] = useState<Data>(() => createSeed(today));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { viewId?: string; data?: Data };
        if (saved.data?.people && saved.data.config && saved.data.guide) {
          saved.data.people = saved.data.people.map((p) => normalizePerson(p));
          if (saved.data.config.maxNights < 3) saved.data.config.maxNights = 3;
          setData(saved.data);
          const who = remembered();
          if (who && saved.data.people.some((p) => p.id === who)) setViewId(who);
        }
      }
    } catch {
      /* keep seed */
    }
    setReady(true);
  }, []);

  const api = useMemo<Api>(() => {
    const me = data.people.find((p) => p.id === viewId) ?? ANON;

    const commit = (next: Data, nextView = viewId) => {
      setData(next);
      setViewId(nextView);
      remember(nextView);
      persist(next);
    };

    return {
      ready,
      data,
      viewId,
      today,
      me,
      setView: (id) => {
        setViewId(id);
        remember(id);
        persist(data);
      },
      openInvitation: (code) => {
        const person = findByInvite(data.people, code);
        if (!person || !person.eligible) return false;
        setViewId(person.id);
        remember(person.id);
        persist(data);
        return true;
      },
      book: ({ checkIn, nights, adults, accepted }) => {
        if (!me.id || me.role !== "manager") return { ok: false, error: "We couldn't find an invitation for this visit." };
        const profile = normalizePerson(me);
        if (!profile.eligible) return { ok: false, error: "This invitation isn't open for dates just now." };
        if (profile.benefitStarts && today < profile.benefitStarts) return { ok: false, error: "This invitation opens on a later date." };
        if (profile.benefitExpires && today > profile.benefitExpires) return { ok: false, error: "This invitation has passed its date." };
        if (!accepted) return { ok: false, error: "Please confirm you'll be aboard before we reserve the stay." };
        if (adults < 1 || adults > 4) return { ok: false, error: "We can welcome one to four adults." };
        if (nights > profile.maxStay) return { ok: false, error: `This invitation is for ${profile.maxStay} nights at most.` };
        const open = data.reservations.some(
          (r) => r.managerId === me.id && (r.status === "confirmed" || r.status === "pending_approval"),
        );
        if (open) return { ok: false, error: "You already have a stay with us. You can adjust it from My Stay." };
        const block = canStart(data, checkIn, nights, today);
        if (block) return { ok: false, error: block };
        const priced = priceStay(me, nights, data.config.nightlyRate);
        const reservation: Reservation = {
          id: uid("stay"),
          managerId: me.id,
          checkIn,
          nights,
          adults,
          kind: priced.kind,
          status: "confirmed",
          payment: priced.amount === 0 ? "not_required" : "pending",
          amount: priced.amount,
          rulesVersion: RULES_VERSION,
          rulesAcceptedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          checkout: null,
          tip: "unset",
          entitlementConsumed: priced.usesBenefit,
          complimentaryApplied: priced.complimentaryNights,
        };
        const people = data.people.map((p) => {
          if (p.id !== me.id) return p;
          const current = normalizePerson(p);
          const complimentaryUsed = current.complimentaryUsed + priced.complimentaryNights;
          return normalizePerson({
            ...current,
            complimentaryUsed,
            entitlement: complimentaryUsed >= current.complimentaryPerYear ? "used" : "available",
          });
        });
        const turnover = turnoverDate(data, checkIn, nights);
        const when = new Date().toISOString();
        const sms = turnover
          ? [
              {
                id: uid("sms"),
                at: when,
                to: "Maria",
                body: [
                  "SAME-DAY TURNOVER",
                  `Checkout 11:00 AM and the next check-in 3:00 PM on ${turnover}.`,
                  "Priority clean. The yacht must be READY before 3:00 PM.",
                  "If it will not be ready in time, this needs owner attention.",
                ].join("\n"),
              },
            ]
          : [];
        const next = audit(
          { ...data, people, reservations: [reservation, ...data.reservations], sms: [...sms, ...data.sms] },
          me.name,
          priced.needsApproval
            ? `Requested approval for ${nights} nights starting ${checkIn}. ${priced.complimentaryNights} complimentary, ${priced.paidNights} at $89.`
            : priced.amount
              ? `Booked ${nights} nights starting ${checkIn}. ${priced.complimentaryNights} complimentary, ${priced.paidNights} at the invitation rate.`
              : `Booked a complimentary ${nights}-night stay starting ${checkIn}.`,
        );
        commit(next);
        return { ok: true, id: reservation.id };
      },
      changeStay: ({ id, checkIn, nights, adults }) => {
        const currentStay = data.reservations.find((x) => x.id === id);
        if (!currentStay || currentStay.managerId !== me.id) return { ok: false, error: "We couldn't find that stay." };
        if (currentStay.status !== "confirmed" && currentStay.status !== "pending_approval") {
          return { ok: false, error: "This stay can no longer be changed." };
        }
        const profile = normalizePerson(me);
        if (adults < 1 || adults > 4) return { ok: false, error: "We can welcome one to four adults." };
        if (nights > profile.maxStay) return { ok: false, error: `This invitation is for ${profile.maxStay} nights at most.` };
        const block = canStart(data, checkIn, nights, today, id);
        if (block) return { ok: false, error: block };
        const applied = currentStay.complimentaryApplied ?? (currentStay.entitlementConsumed ? 1 : 0);
        const restored = normalizePerson({
          ...profile,
          complimentaryUsed: Math.max(0, profile.complimentaryUsed - applied),
        });
        const priced = priceStay(restored, nights, data.config.nightlyRate);
        const complimentaryUsed = restored.complimentaryUsed + priced.complimentaryNights;
        const people = data.people.map((p) =>
          p.id === me.id ? normalizePerson({ ...p, complimentaryUsed }) : p,
        );
        const reservations = data.reservations.map((x) =>
          x.id === id
            ? {
                ...x,
                checkIn,
                nights,
                adults,
                kind: priced.kind,
                amount: priced.amount,
                payment: (priced.amount === 0 ? "not_required" : "pending") as Reservation["payment"],
                entitlementConsumed: priced.usesBenefit,
                complimentaryApplied: priced.complimentaryNights,
              }
            : x,
        );
        commit(audit({ ...data, people, reservations }, me.name, "Adjusted a stay."));
        return { ok: true };
      },
      cancelStay: (id) => {
        const r = data.reservations.find((x) => x.id === id);
        if (!r) return "We couldn't find that stay.";
        if (r.status !== "confirmed" && r.status !== "pending_approval") return "This stay can no longer be changed.";
        const late = r.entitlementConsumed && r.status === "confirmed" && hoursUntilCheckIn(r.checkIn) < 48;
        const people = data.people.map((p) => {
          if (p.id !== r.managerId || late) return p;
          const current = normalizePerson(p);
          const restore = r.complimentaryApplied ?? (r.entitlementConsumed ? 1 : 0);
          const complimentaryUsed = Math.max(0, current.complimentaryUsed - restore);
          return normalizePerson({
            ...current,
            complimentaryUsed,
            entitlement: complimentaryUsed >= current.complimentaryPerYear ? "used" : "available",
          });
        });
        const next = audit(
          {
            ...data,
            people,
            reservations: data.reservations.map((x) =>
              x.id === id ? { ...x, status: "cancelled" as const, entitlementConsumed: late ? true : false } : x,
            ),
          },
          me.name,
          late
            ? "Cancelled inside 48 hours. The complimentary stay stays used."
            : "Cancelled a stay. Entitlement returned when it was complimentary and on time.",
        );
        commit(next);
        return late
          ? "Your stay is released. Because this is inside 48 hours, the complimentary night remains with this visit."
          : "Your stay is released, and the complimentary night returns to your invitation.";
      },
      submitCheckout: (id, input) => {
        const missing = (Object.keys(blankPhotos()) as PhotoSlot[]).filter((k) => !input.photos[k]);
        if (missing.length) return "Please add the interior, cockpit, and exterior photos before you leave.";
        const r = data.reservations.find((x) => x.id === id);
        if (!r || r.status !== "confirmed") return "This stay is not ready for checkout.";
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
        const when = new Date().toISOString();
        const sms = {
          id: uid("sms"),
          at: when,
          to: "Maria",
          body: [
            "CAM Privé — cleaning required",
            "The Bay Escape",
            "Sierra Point Harbor, Dock 5, Slip 36",
            `Checkout recorded ${when}`,
            turnoverDate(
              { ...data, reservations: data.reservations.map((x) => (x.id === id ? { ...x, status: "checked_out" as const } : x)) },
              r.checkIn,
              r.nights,
            )
              ? "SAME-DAY TURNOVER. Priority clean. READY before the 3:00 PM check-in, or this needs owner attention."
              : "",
            input.damage ? `Guest reported: ${input.damage}` : "No damage reported.",
            input.notes ? `Notes: ${input.notes}` : "",
            "Open the cleaning page. Maria already has yacht access.",
          ]
            .filter(Boolean)
            .join("\n"),
        };
        const next = audit(
          {
            ...data,
            reservations: data.reservations.map((x) =>
              x.id === id
                ? {
                    ...x,
                    status: "checked_out" as const,
                    checkout: { at: when, notes: input.notes, damage: input.damage, photos: input.photos },
                  }
                : x,
            ),
            jobs: [job, ...data.jobs],
            sms: [sms, ...data.sms],
            incidents: input.damage.trim()
              ? [
                  {
                    id: uid("inc"),
                    severity: "attention" as const,
                    description: input.damage.trim(),
                    photo: input.photos.overall,
                    source: "guest" as const,
                    reservationId: id,
                    createdAt: when,
                    resolved: false,
                  },
                  ...data.incidents,
                ]
              : data.incidents,
          },
          me.name,
          "Checked out. Maria’s cleaning card opened.",
        );
        commit(next);
        return null;
      },
      setTip: (id, tip) => {
        commit(
          audit(
            {
              ...data,
              reservations: data.reservations.map((r) => (r.id === id ? { ...r, tip } : r)),
            },
            me.name,
            tip === "sent" ? "Guest marked a $20 tip as sent." : "Guest skipped the optional tip.",
          ),
        );
      },
      startCleaning: (jobId) => {
        commit(
          audit(
            {
              ...data,
              jobs: data.jobs.map((j) =>
                j.id === jobId ? { ...j, status: "in_progress" as const, startedAt: new Date().toISOString() } : j,
              ),
            },
            "Maria",
            "Started cleaning.",
          ),
        );
      },
      toggleCheck: (jobId, step) => {
        const next = {
          ...data,
          jobs: data.jobs.map((j) =>
            j.id === jobId ? { ...j, checks: { ...j.checks, [step]: !j.checks[step] } } : j,
          ),
        };
        commit(next);
      },
      finishCleaning: (jobId, notes) => {
        const job = data.jobs.find((j) => j.id === jobId);
        if (!job) return "Cleaning card not found.";
        const undone = Object.entries(job.checks).filter(([, on]) => !on);
        if (undone.length) return "Finish the checklist first. The command bridge is on it for a reason.";
        const stay = data.reservations.find((r) => r.id === job.reservationId);
        const who = stay ? data.people.find((p) => p.id === stay.managerId)?.name : "guest";
        const when = new Date().toISOString();
        commit(
          audit(
            {
              ...data,
              jobs: data.jobs.map((j) =>
                j.id === jobId ? { ...j, status: "complete" as const, notes, completedAt: when } : j,
              ),
              expenses: [
                {
                  id: uid("exp"),
                  date: today,
                  kind: "cleaning" as const,
                  label: `Turnover cleaning — ${who}`,
                  amount: data.config.cleaningCost,
                },
                ...data.expenses,
              ],
            },
            "Maria",
            "Marked the yacht ready after cleaning.",
          ),
        );
        return null;
      },
      reportProblem: ({ severity, description, photo, reservationId }) => {
        commit(
          audit(
            {
              ...data,
              incidents: [
                {
                  id: uid("inc"),
                  severity,
                  description,
                  photo,
                  source: "maria",
                  reservationId,
                  createdAt: new Date().toISOString(),
                  resolved: false,
                },
                ...data.incidents,
              ],
            },
            "Maria",
            `Reported a ${severity} issue.`,
          ),
        );
      },
      resolveIncident: (id) => {
        commit(
          audit(
            {
              ...data,
              incidents: data.incidents.map((i) => (i.id === id ? { ...i, resolved: true } : i)),
            },
            me.name,
            "Resolved an exception.",
          ),
        );
      },
      decide: (id, approve) => {
        const target = data.reservations.find((r) => r.id === id);
        const people = data.people.map((p) => {
          if (!target || approve || p.id !== target.managerId) return p;
          const current = normalizePerson(p);
          const restore = target.complimentaryApplied ?? (target.entitlementConsumed ? Math.min(2, target.nights) : 0);
          const complimentaryUsed = Math.max(0, current.complimentaryUsed - restore);
          return normalizePerson({ ...current, complimentaryUsed });
        });
        commit(
          audit(
            {
              ...data,
              people,
              reservations: data.reservations.map((r) => {
                if (r.id !== id) return r;
                return approve
                  ? { ...r, status: "confirmed" as const, payment: "pending" as const }
                  : { ...r, status: "declined" as const, payment: "waived" as const };
              }),
            },
            me.name,
            approve ? "Approved a paid stay." : "Declined a paid stay.",
          ),
        );
      },
      restoreEntitlement: (personId) => {
        commit(
          audit(
            {
              ...data,
              people: data.people.map((p) =>
                p.id === personId ? normalizePerson({ ...p, complimentaryUsed: 0 }) : p,
              ),
            },
            me.name,
            "Restored a complimentary stay.",
          ),
        );
      },
      grantExtra: (personId) => {
        commit(
          audit(
            {
              ...data,
              people: data.people.map((p) => (p.id === personId ? { ...p, extraStays: p.extraStays + 1 } : p)),
            },
            me.name,
            "Granted an extra complimentary stay.",
          ),
        );
      },
      setEligible: (personId, eligible) => {
        commit(
          audit(
            {
              ...data,
              people: data.people.map((p) => (p.id === personId ? normalizePerson({ ...p, eligible }) : p)),
            },
            me.name,
            eligible ? "Opened booking access." : "Closed booking access.",
          ),
        );
      },
      updateGuest: (personId, patch) => {
        commit(
          audit(
            {
              ...data,
              people: data.people.map((p) => (p.id === personId ? normalizePerson({ ...normalizePerson(p), ...patch }) : p)),
            },
            me.name,
            "Updated a guest invitation.",
          ),
        );
      },
      addBlackout: (date, reason) => {
        commit(
          audit(
            { ...data, blackouts: [{ id: uid("blk"), date, reason }, ...data.blackouts] },
            me.name,
            `Blocked ${date}.`,
          ),
        );
      },
      removeBlackout: (id) => {
        commit(audit({ ...data, blackouts: data.blackouts.filter((b) => b.id !== id) }, me.name, "Removed a blocked date."));
      },
      completeExterior: (notes, cost) => {
        const open = data.maintenance.find((m) => m.kind === "exterior" && !m.completedAt);
        const doneId = open?.id;
        const nextDue = addDaysSafe(today, 30);
        commit(
          audit(
            {
              ...data,
              maintenance: [
                {
                  id: uid("wash"),
                  title: "Monthly exterior wash",
                  kind: "exterior" as const,
                  due: nextDue,
                  completedAt: null,
                  cost: 0,
                  notes: "Command bridge, bird droppings, deck, cockpit, exterior surfaces.",
                  cleaner: "Maria",
                },
                ...data.maintenance.map((m) =>
                  m.id === doneId ? { ...m, completedAt: new Date().toISOString(), notes, cost } : m,
                ),
              ],
              expenses: cost
                ? [
                    {
                      id: uid("exp"),
                      date: today,
                      kind: "maintenance" as const,
                      label: "Monthly exterior wash",
                      amount: cost,
                    },
                    ...data.expenses,
                  ]
                : data.expenses,
            },
            me.name,
            "Recorded the monthly exterior wash.",
          ),
        );
      },
      updateConfig: (patch) => {
        commit(audit({ ...data, config: { ...data.config, ...patch } }, me.name, "Updated yacht settings."));
      },
      updateGuide: (patch) => {
        commit(audit({ ...data, guide: { ...data.guide, ...patch } }, me.name, "Updated the guest guide."));
      },
      resetDemo: () => {
        const fresh = createSeed(laToday());
        commit(fresh, "");
      },
    };
  }, [data, ready, today, viewId]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

function addDaysSafe(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return dt.toISOString().slice(0, 10);
}

export function useYacht(): Api {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Yacht store missing");
  return ctx;
}

export function statusNow(data: Data, today: string) {
  return yachtStatus(data, today);
}
