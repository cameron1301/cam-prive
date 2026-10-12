import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createSeed } from "./seed";
import {
  laToday,
  normalizePerson,
  yachtStatus,
  type Data,
  type Person,
  type PhotoSlot,
  type Severity,
} from "./logic";
import {
  blackoutFn,
  bookStay,
  cancelStayFn,
  changeStayFn,
  checkoutFn,
  configFn,
  decideFn,
  eligibleFn,
  finishCleanFn,
  grantFn,
  guideFn,
  loadState,
  openInvite,
  removeBlackoutFn,
  reportFn,
  resolveFn,
  restoreFn,
  startCleanFn,
  switchView,
  tipFn,
  toggleCheckFn,
  updateGuestFn,
  washFn,
} from "./api";

type ViewId = string;

type Api = {
  ready: boolean;
  data: Data;
  viewId: ViewId;
  today: string;
  me: Person;
  setView: (id: string) => Promise<void>;
  openInvitation: (code: string) => Promise<"/" | "/profile" | null>;
  book: (input: { checkIn: string; nights: 1 | 2 | 3; adults: number; accepted: boolean }) => Promise<{ ok: true; id: string } | { ok: false; error: string }>;
  changeStay: (input: { id: string; checkIn: string; nights: 1 | 2 | 3; adults: number }) => Promise<{ ok: true } | { ok: false; error: string }>;
  cancelStay: (id: string) => Promise<string>;
  submitCheckout: (id: string, input: { notes: string; damage: string; photos: Record<PhotoSlot, string | null> }) => Promise<string | null>;
  setTip: (id: string, tip: "sent" | "skipped") => Promise<void>;
  startCleaning: (jobId: string) => Promise<void>;
  toggleCheck: (jobId: string, step: string) => Promise<void>;
  finishCleaning: (jobId: string, notes: string) => Promise<string | null>;
  reportProblem: (input: { severity: Severity; description: string; photo: string | null; reservationId: string | null }) => Promise<void>;
  resolveIncident: (id: string) => Promise<void>;
  decide: (id: string, approve: boolean) => Promise<void>;
  restoreEntitlement: (personId: string) => Promise<void>;
  grantExtra: (personId: string) => Promise<void>;
  setEligible: (personId: string, eligible: boolean) => Promise<void>;
  updateGuest: (personId: string, patch: Partial<Person>) => Promise<void>;
  addBlackout: (date: string, reason: string) => Promise<void>;
  removeBlackout: (id: string) => Promise<void>;
  completeExterior: (notes: string, cost: number) => Promise<void>;
  updateConfig: (patch: Partial<Data["config"]>) => Promise<void>;
  updateGuide: (patch: Partial<Data["guide"]>) => Promise<void>;
  resetDemo: () => void;
};

const Ctx = createContext<Api | null>(null);

function blankState(today: string): Data {
  const seed = createSeed(today);
  return {
    ...seed,
    people: [],
    reservations: [],
    jobs: [],
    incidents: [],
    expenses: [],
    audit: [],
    sms: [],
    maintenance: [],
    config: { ...seed.config, access: "", parking: "", shore: "", wifi: "", emergency: "", zelle: "", cleaningCost: 0, slipMonthly: 0 },
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

function applySnap(
  snap: { data?: Data; me?: Person | null },
  setData: (data: Data) => void,
  setMe: (person: Person) => void,
) {
  if (snap.data) setData(snap.data);
  if ("me" in snap) setMe(snap.me ? normalizePerson(snap.me) : ANON);
}

export function YachtProvider({ children }: { children: ReactNode }) {
  const today = laToday();
  const [data, setData] = useState<Data>(() => blankState(today));
  const [me, setMe] = useState<Person>(ANON);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    loadState()
      .then((snap) => {
        if (!live) return;
        applySnap(snap, setData, setMe);
        setReady(true);
      })
      .catch(() => {
        if (live) setReady(true);
      });
    return () => {
      live = false;
    };
  }, []);

  const api = useMemo<Api>(() => {
    const take = (snap: { data?: Data; me?: Person | null }) => applySnap(snap, setData, setMe);
    return {
      ready,
      data,
      viewId: me.id,
      today,
      me,
      setView: async (id) => {
        const snap = await switchView({ data: id });
        if (snap.ok) take(snap);
      },
      openInvitation: async (code) => {
        const snap = await openInvite({ data: code });
        if (!snap.ok) return null;
        take(snap);
        const role = snap.me?.role;
        if (role === "cleaner" || role === "owner" || role === "admin") return "/";
        return "/profile";
      },
      book: async (input) => {
        const result = await bookStay({ data: input });
        if (result.ok) take(result);
        return result.ok ? { ok: true, id: result.id || "" } : { ok: false, error: result.error };
      },
      changeStay: async (input) => {
        const result = await changeStayFn({ data: input });
        if (result.ok) take(result);
        return result.ok ? { ok: true } : { ok: false, error: result.error };
      },
      cancelStay: async (id) => {
        const result = await cancelStayFn({ data: id });
        take(result);
        return result.message || result.error || "Your stay is released.";
      },
      submitCheckout: async (id, input) => {
        const result = await checkoutFn({ data: { id, ...input } });
        if (!result.error && result.data) take(result);
        return result.error;
      },
      setTip: async (id, tip) => {
        const result = await tipFn({ data: { id, tip } });
        if ("data" in result && result.data) take(result);
      },
      startCleaning: async (jobId) => {
        const result = await startCleanFn({ data: jobId });
        if ("data" in result && result.data) take(result);
      },
      toggleCheck: async (jobId, step) => {
        const result = await toggleCheckFn({ data: { jobId, step } });
        if ("data" in result && result.data) take(result);
      },
      finishCleaning: async (jobId, notes) => {
        const result = await finishCleanFn({ data: { jobId, notes } });
        if (!result.error && result.data) take(result);
        return result.error;
      },
      reportProblem: async (input) => {
        const result = await reportFn({ data: input });
        if ("data" in result && result.data) take(result);
      },
      resolveIncident: async (id) => {
        const result = await resolveFn({ data: id });
        if ("data" in result && result.data) take(result);
      },
      decide: async (id, approve) => {
        const result = await decideFn({ data: { id, approve } });
        if ("data" in result && result.data) take(result);
      },
      restoreEntitlement: async (personId) => {
        const result = await restoreFn({ data: personId });
        if ("data" in result && result.data) take(result);
      },
      grantExtra: async (personId) => {
        const result = await grantFn({ data: personId });
        if ("data" in result && result.data) take(result);
      },
      setEligible: async (personId, eligible) => {
        const result = await eligibleFn({ data: { personId, eligible } });
        if ("data" in result && result.data) take(result);
      },
      updateGuest: async (personId, patch) => {
        const result = await updateGuestFn({ data: { personId, patch } });
        if ("data" in result && result.data) take(result);
      },
      addBlackout: async (date, reason) => {
        const result = await blackoutFn({ data: { date, reason } });
        if ("data" in result && result.data) take(result);
      },
      removeBlackout: async (id) => {
        const result = await removeBlackoutFn({ data: id });
        if ("data" in result && result.data) take(result);
      },
      completeExterior: async (notes, cost) => {
        const result = await washFn({ data: { notes, cost } });
        if ("data" in result && result.data) take(result);
      },
      updateConfig: async (patch) => {
        const result = await configFn({ data: patch });
        if ("data" in result && result.data) take(result);
      },
      updateGuide: async (patch) => {
        const result = await guideFn({ data: patch });
        if ("data" in result && result.data) take(result);
      },
      resetDemo: () => {
        /* Production data is not cleared from the browser. */
      },
    };
  }, [data, me, ready, today]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useYacht(): Api {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Yacht store missing");
  return ctx;
}

export function statusNow(data: Data, today: string) {
  return yachtStatus(data, today);
}
