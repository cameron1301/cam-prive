import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { LoadingBlock, SignInPrompt } from "@/components/sign-in-prompt";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in · CAM Privé" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { user, isPending } = useCurrentUserState();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-dvh bg-[#f7f4ee] text-[#07141d]">
      <header className="border-b border-[#ded9d0]/80 bg-white">
        <div className="mx-auto flex h-[72px] max-w-[1280px] items-center px-5 lg:h-[84px] lg:px-12">
          <img src="/brand/cam-prive-official.png?v=hr3" alt="CAM Privé — Exclusive experiences by CAM" className="h-auto w-[160px] lg:w-[190px]" />
        </div>
      </header>
      <div className="mx-auto max-w-xl px-5 py-16 lg:py-24">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">You're invited</p>
        <h1 className="mt-3 text-[40px] leading-[1.02] lg:text-[52px]">Welcome to CAM Privé</h1>
        <p className="mt-4 text-[16px] leading-[1.65] text-[#6d6a64]">
          Your invitation includes access to The Bay Escape, a private dockside retreat at Sierra Point Harbor.
        </p>
        <div className="mt-10">
          {!mounted || isPending ? <LoadingBlock label="Opening your invitation." /> : null}
          {mounted && !isPending && user ? <Navigate to="/" /> : null}
          {mounted && !isPending && !user ? <SignInPrompt callbackURL="/" /> : null}
        </div>
      </div>
    </div>
  );
}
