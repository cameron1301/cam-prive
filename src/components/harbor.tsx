import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getHarbor } from "@/lib/slip/api";
import type { ActionResult, HarborState } from "@/lib/slip/types";

type HarborContextValue = {
  harbor: HarborState | null;
  error: string | null;
  refresh: () => Promise<void>;
};

const HarborContext = createContext<HarborContextValue | null>(null);

export function HarborProvider({ children }: { children: ReactNode }) {
  const { user } = useCurrentUserState();
  const [harbor, setHarbor] = useState<HarborState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setHarbor(null);
      setError(null);
      return;
    }
    try {
      const next = await getHarbor();
      setHarbor(next);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The harbor board didn't load.");
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return <HarborContext.Provider value={{ harbor, error, refresh }}>{children}</HarborContext.Provider>;
}

export function useHarbor() {
  const value = useContext(HarborContext);
  if (!value) throw new Error("Harbor board is missing.");
  return value;
}

export function useGate() {
  const { user, isPending } = useCurrentUserState();
  const { harbor, error, refresh } = useHarbor();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || isPending || (user && !harbor && !error)) {
    return { status: "loading" as const, refresh };
  }
  if (!user) return { status: "signedout" as const, refresh };
  if (error || !harbor) return { status: "error" as const, error: error ?? "The harbor board didn't load.", refresh };
  return { status: "ready" as const, harbor, refresh };
}

export function useAction(refresh: () => Promise<void>) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function run(work: Promise<ActionResult>) {
    setPending(true);
    setError(null);
    try {
      const result = await work;
      if (!result.ok) {
        setError(result.error);
        return false;
      }
      await refresh();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message === "Unauthorized" ? "Sign in to continue." : message);
      return false;
    } finally {
      setPending(false);
    }
  }

  return { error, pending, run, setError };
}
