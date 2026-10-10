import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useYacht } from "@/lib/yacht/store";

export function BrandMark() {
  return (
    <img
      src="/brand/cam-prive-official.png?v=hr3"
      alt="CAM Privé — Exclusive experiences by CAM"
      className="h-auto w-[160px] lg:w-[190px]"
    />
  );
}

const LINKS = [
  { to: "/escape", label: "Experiences" },
  { to: "/profile", label: "My Invitation" },
  { to: "/stay", label: "My Stay" },
] as const;

export function GuestHeader() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const link = "text-[12px] font-medium tracking-[0.08em] uppercase no-underline";
  return (
    <header className="sticky top-0 z-40 border-b border-[#ded9d0]/80 bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 lg:h-[84px] lg:px-12">
        <Link to="/" className="no-underline" aria-label="CAM Privé home">
          <BrandMark />
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((item) => (
            <Link key={item.to} to={item.to} className={`${link} ${path === item.to ? "text-[#07141d]" : "text-[#6d6a64]"}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="grid size-11 place-items-center lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-[#ded9d0] bg-white px-5 py-2 lg:hidden">
          {LINKS.map((item) => (
            <Link key={item.to} to={item.to} className="block py-3 text-[13px] tracking-[0.08em] uppercase no-underline" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}

export function GuestFooter() {
  return (
    <footer className="bg-[#07141d] px-5 py-8 text-[#f7f4ee] lg:px-12">
      <p className="mx-auto max-w-[1280px] text-[12px] tracking-[0.14em] text-white/75 uppercase">
        CAM Privé · Exclusive experiences by CAM
      </p>
    </footer>
  );
}

export function GuestLayout({ children }: { children: ReactNode }) {
  const { me } = useYacht();
  if (me.role === "owner" || me.role === "admin" || me.role === "cleaner") {
    return <div className="text-[#07141d]">{children}</div>;
  }
  return (
    <div className="min-h-dvh bg-white text-[#07141d]">
      <GuestHeader />
      <main>{children}</main>
      <GuestFooter />
    </div>
  );
}

export function PageIntro({ kicker, title, body }: { kicker: string; title: string; body?: string }) {
  return (
    <header className="max-w-2xl">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">{kicker}</p>
      <h1 className="mt-3 text-[36px] leading-[1.02] lg:text-[52px]">{title}</h1>
      {body ? <p className="mt-4 max-w-xl text-[16px] leading-[1.65] text-[#6d6a64]">{body}</p> : null}
    </header>
  );
}
