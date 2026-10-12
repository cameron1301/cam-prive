import { Link, Navigate, useRouterState } from "@tanstack/react-router";
import { Calendar, Compass, Home, Ship, User, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useYacht } from "@/lib/yacht/store";

const EMPLOYEE: Array<{ to: "/" | "/book" | "/stay" | "/explore" | "/profile"; label: string; icon: LucideIcon }> = [
  { to: "/", label: "Home", icon: Home },
  { to: "/book", label: "Book", icon: Calendar },
  { to: "/stay", label: "My Stay", icon: Ship },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/profile", label: "Profile", icon: User },
];

const OWNER: Array<{ to: "/" | "/admin" | "/people" | "/operations" | "/financials" | "/settings"; label: string }> = [
  { to: "/", label: "Overview" },
  { to: "/people", label: "Guests" },
  { to: "/admin", label: "Reservations" },
  { to: "/operations", label: "Operations" },
  { to: "/financials", label: "Financials" },
  { to: "/settings", label: "Settings" },
];

function Mark() {
  return (
    <img
      src="/brand/cam-prive-official.png?v=hr3"
      alt="CAM Privé — Exclusive experiences by CAM"
      className="h-auto w-[160px] lg:w-[190px]"
    />
  );
}

export function Frame({ children }: { children: ReactNode }) {
  const { data, me, setView } = useYacht();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const managers = data.people.filter((p) => p.role === "manager");
  const role = me.role;
  const manager = role === "manager";
  const owner = role === "owner" || role === "admin";
  const home = manager && (path === "/" || path === "/escape" || path === "/book");
  const showcase = manager;

  if (!owner && role !== "cleaner") {
    const staff = ["/admin", "/clean", "/maintenance", "/operations", "/financials", "/people", "/settings"];
    if (staff.includes(path)) return <Navigate to="/" />;
    return <div className="min-h-dvh bg-white text-[#07141d]">{children}</div>;
  }

  return (
    <div className="min-h-dvh bg-sand text-ink">
      {home ? null : (
      <header className="sticky top-0 z-40 border-b border-[#ded9d0] bg-white text-[#07141d]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-6">
          <Link to="/" className="no-underline">
            <Mark />
          </Link>
          {showcase ? (
            <nav className="hidden items-center gap-7 text-[13px] font-medium tracking-[0.04em] lg:flex">
              <Link to="/" className="text-ink no-underline">Home</Link>
              <Link to="/escape" className="text-ink no-underline">The Bay Escape</Link>
              <Link to="/stay" className="text-ink no-underline">Your Stay</Link>
              <Link to="/book" className="btn btn-tide no-underline">Book your stay</Link>
            </nav>
          ) : null}
          {owner ? (
            <nav className="hidden items-center gap-4 text-sm lg:flex">
              {OWNER.map((item) => (
                <TopLink key={item.to} to={item.to} on={path === item.to}>
                  {item.label}
                </TopLink>
              ))}
            </nav>
          ) : null}
          <div className="flex items-center gap-3">
            {owner ? (
            <label className="text-xs text-[#6d6a64]">
              <span className="sr-only">Preview as</span>
              <select
                className="field min-h-10 bg-foam py-1 text-sm text-ink"
                value={me.id}
                onChange={(e) => setView(e.target.value)}
                aria-label="Preview as"
              >
                <option value="cameron">Cameron</option>
                <option value="maria">Maria</option>
                {managers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            ) : null}
          </div>
        </div>
        {owner ? (
          <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
            {OWNER.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`shrink-0 rounded-full px-3 py-2 text-sm no-underline ${path === item.to ? "bg-[#07141d] text-white" : "text-[#07141d]"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>
      )}

      <main className={home ? "" : `mx-auto max-w-6xl px-4 py-6 ${manager ? "pb-28" : "pb-12"}`}>
        {children}
      </main>

      {manager && !home ? (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-foam lg:hidden">
          <ul className="grid grid-cols-5">
            {EMPLOYEE.map((item) => {
              const on = path === item.to;
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[0.7rem] no-underline ${on ? "text-tide" : "text-muted"}`}
                  >
                    <Icon size={20} aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}

function TopLink({
  to,
  on,
  children,
}: {
  to: "/" | "/book" | "/stay" | "/explore" | "/profile" | "/admin" | "/clean" | "/maintenance" | "/operations" | "/financials" | "/people" | "/settings";
  on: boolean;
  children: ReactNode;
}) {
  return (
    <Link to={to} className={`no-underline ${on ? "font-semibold text-[#07141d]" : "text-[#6d6a64]"}`}>
      {children}
    </Link>
  );
}
