import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { BedDouble, Bluetooth, Camera, Coffee, Heart, MapPin, Menu, Microwave, Refrigerator, Ruler, Thermometer, Tv, Users, Wifi, X } from "lucide-react";
import { Callout, ConfigLine, PhotoPick } from "./bits";
import {
  activeStay,
  asNightCount,
  calendarCells,
  canCheckIn,
  canStart,
  checkoutDate,
  money,
  monthLabel,
  nightsBetween,
  nightsLeft,
  pretty,
  priceStay,
  turnoverDate,
  ymOf,
  type PhotoSlot,
  type Reservation,
} from "@/lib/yacht/logic";
import { useYacht } from "@/lib/yacht/store";

const RULES = [
  "Adults only. No children. No pets.",
  "No smoking or vaping.",
  "No parties or unauthorized events.",
  "The yacht never leaves the slip. Do not start the engines, operate the boat, or touch marina lines.",
  "The onboard toilet and shower are closed. Use shore facilities.",
  "No open flame, no stovetop, nothing that is an unreasonable fire risk. The microwave, refrigerator, and coffee maker are convenience appliances only.",
  "Alcohol is allowed for adults while the boat stays docked, within the law and marina rules.",
  "The booking manager stays aboard and is responsible for every guest.",
  "Negligent or intentional damage can mean reimbursement and loss of future use.",
];

const HERO = "/yacht/approved/01_HERO_EXTERIOR_APPROVED.png";

export function EmployeeHome() {
  const { data, me, today } = useYacht();
  const stay = me.role === "manager" ? activeStay(data, me.id, today) : undefined;
  const [menu, setMenu] = useState(false);
  return (
    <div className="bg-white text-ink lg:bg-[#d5e2ee]">
      <img src={HERO} alt="" className="pointer-events-none fixed inset-0 -z-10 hidden h-full w-full scale-110 object-cover opacity-70 blur-md lg:block" />
      <div className="lg:mx-auto lg:my-5 lg:max-w-6xl lg:overflow-hidden lg:rounded-[1.7rem] lg:bg-white lg:shadow-[0_24px_70px_-28px_rgba(7,24,48,0.55)]">
        <header className="flex items-center justify-between gap-4 bg-white px-4 py-3 lg:px-7 lg:py-4">
          <Link to="/" className="no-underline">
            <Wordmark />
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-[#1c2b42] lg:flex">
            <a href="#top" className="border-b-2 border-[#1c2b42] pb-1 font-medium no-underline">Home</a>
            <a href="#gallery" className="no-underline">Gallery</a>
            <a href="#features" className="no-underline">Features</a>
            <a href="#layout" className="no-underline">Layout</a>
            <a href="#specs" className="no-underline">Specifications</a>
            <Link to="/book" className="btn btn-tide min-h-10 px-4 text-sm no-underline">Book your stay</Link>
          </nav>
          <div className="flex items-center gap-2">
            <RoleSwitch />
            <button type="button" className="grid size-11 place-items-center rounded-full text-tide lg:hidden" aria-label={menu ? "Close menu" : "Open menu"} onClick={() => setMenu((v) => !v)}>
              {menu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </header>
        {menu ? (
          <div className="space-y-1 border-t border-line px-4 py-3 lg:hidden">
            <MenuLink to="/book" label="Book your stay" />
            <MenuLink to="/stay" label="Your stay" />
            <MenuLink to="/explore" label="Explore" />
            <MenuLink to="/profile" label="Profile" />
          </div>
        ) : null}

        <section id="top" className="lg:px-4 lg:pb-4">
          <div className="relative overflow-hidden bg-[#07182c] lg:rounded-[1.35rem]">
            <img src={HERO} alt="Bayliner Ciera 2858 tied at the marina" className="h-72 w-full object-cover object-[82%_center] lg:h-[32rem] lg:object-center" />
            <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[#061221] from-0% via-[#061221] via-[34%] to-transparent lg:block" />
            <div className="absolute inset-0 hidden max-w-xl flex-col justify-center px-10 text-white lg:flex">
              <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-white/80">CAM YACHT ESCAPE</p>
              <h1 className="mt-2 font-sans text-6xl leading-[1.02] font-semibold tracking-tight text-white">Your Weekend on the Bay</h1>
              <p className="mt-3 text-lg text-white/90">A private perk for CAM Educational Services managers.</p>
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                <Spec icon={<Users size={18} />} label="Sleeps" value="2–4 adults" />
                <Spec icon={<Ruler size={18} />} label="Length" value="28 ft" />
                <Spec icon={<MapPin size={18} />} label="Tied at" value="Sierra Point" />
              </ul>
              <div className="mt-6">
                <a href="#gallery" className="btn bg-white text-[#122033] no-underline">View the yacht</a>
              </div>
            </div>
          </div>
          <div className="px-5 pt-4 lg:hidden">
            <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-tide">CAM YACHT ESCAPE</p>
            <h1 className="mt-1 font-sans text-4xl leading-[1.05] font-semibold tracking-tight text-[#16324f]">Your Weekend on the Bay</h1>
            <p className="mt-2 text-[#3d4d63]">A private perk for CAM Educational Services managers.</p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-[#1c2b42]">
              <Spec icon={<Users size={18} />} label="Sleeps" value="2–4 adults" />
              <Spec icon={<Ruler size={18} />} label="Length" value="28 ft" />
              <Spec icon={<MapPin size={18} />} label="Tied at" value="Sierra Point" />
            </ul>
            <Link to="/book" className="btn btn-tide mt-5 w-full no-underline">Book your stay</Link>
          </div>
        </section>

        <section id="gallery" className="px-4 py-6 lg:px-7 lg:py-8">
          <div className="mb-4 flex items-baseline justify-between lg:hidden">
            <h2 className="font-sans text-2xl font-semibold tracking-tight">Gallery</h2>
            <a href="#layout" className="text-sm font-medium text-tide no-underline">See all</a>
          </div>
          <div id="features" className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-5">
            <Card title="Upper command bridge" body="Curved seating and the center helm. The best seat on the bay." image="/yacht/approved/02_COMMAND_BRIDGE_APPROVED.png" />
            <Card title="Cockpit" body="Chairs at the stern, beside the door into the cabin." image="/yacht/approved/03_COCKPIT_APPROVED.png" />
            <Card title="Exterior view" body="A short look at the boat, still tied at Dock 5, Slip 36. Press play." image="/yacht/approved/04_EXTERIOR_GALLERY_APPROVED.png" video="/yacht/exterior.mp4" wide />
          </div>
          <div id="layout" className="mt-3 grid grid-cols-2 gap-3 lg:mt-5 lg:grid-cols-5 lg:gap-5">
            <Card title="Galley" body="Sink, microwave, refrigerator, and coffee. No cooking aboard." image="/yacht/approved/05_GALLEY_KITCHEN_APPROVED.png" className="lg:col-span-2" />
            <Card title="Dining area" body="Salon seating, the table, and the forward berth." image="/yacht/approved/06_DINING_SALON_APPROVED.png" className="lg:col-span-3" />
          </div>
          <p id="specs" className="mt-6 text-sm text-muted">Sierra Point Harbor, Dock 5, Slip 36. Dockside only. The bathroom aboard is closed. No cooking and no open flame.</p>
          {stay ? (
            <div className="card mt-4 p-5">
              <p className="kicker">Your stay</p>
              <StaySummary stay={stay} />
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function Wordmark() {
  return (
    <span className="flex items-center gap-2 text-[#16324f]">
      <svg viewBox="0 0 36 24" className="h-7 w-10" aria-hidden>
        <path d="M2 16c4-6 8-6 12 0s8 6 12 0 6-6 8 0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <span className="leading-none">
        <span className="block font-sans text-[0.95rem] font-semibold tracking-[0.14em]">CAM</span>
        <span className="mt-0.5 block font-sans text-[0.62rem] tracking-[0.16em] text-[#5c6b80]">YACHT ESCAPE</span>
      </span>
    </span>
  );
}

function RoleSwitch() {
  const { data, me, setView } = useYacht();
  const managers = data.people.filter((p) => p.role === "manager");
  return (
    <label className="hidden sm:block">
      <span className="sr-only">Preview as</span>
      <select className="field min-h-10 w-36 bg-white py-1 text-sm" value={me.id} onChange={(e) => setView(e.target.value)} aria-label="Preview as">
        <option value="cameron">Cameron</option>
        <option value="maria">Maria</option>
        {managers.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </label>
  );
}

function MenuLink({ to, label }: { to: "/book" | "/stay" | "/explore" | "/profile"; label: string }) {
  return <Link to={to} className="block rounded-xl px-3 py-3 font-medium no-underline">{label}</Link>;
}

function Card({ title, body, image, wide, className = "", video }: { title: string; body: string; image: string; wide?: boolean; className?: string; video?: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <article className={`${wide ? "col-span-2 lg:col-span-1" : ""} ${className}`}>
      {video && playing ? (
        <video src={video} poster={image} className="aspect-[16/10] w-full rounded-2xl bg-[#07182c] object-cover" controls autoPlay playsInline />
      ) : video ? (
        <button type="button" onClick={() => setPlaying(true)} className="relative block w-full cursor-pointer" aria-label={`Play ${title}`}>
          <img src={image} alt="" className="aspect-[16/10] w-full rounded-2xl object-cover" />
        </button>
      ) : (
        <img src={image} alt="" className="aspect-[16/10] w-full rounded-2xl object-cover" />
      )}
      <h2 className="mt-2 font-sans text-[0.95rem] font-semibold tracking-tight lg:text-lg">{title}</h2>
      <p className="mt-1 hidden text-sm leading-snug text-[#5c6b80] lg:block">{body}</p>
    </article>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="grid size-9 place-items-center rounded-full bg-[#e7eef6] text-[#16324f]">{icon}</span>
      <span>
        <span className="block text-xs text-foam/75">{label}</span>
        <span className="text-base font-medium">{value}</span>
      </span>
    </li>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl bg-foam px-4 py-4 shadow-card">
      <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{k}</dt>
      <dd className="mt-1">{v}</dd>
    </div>
  );
}

const AMENITIES: Array<[string, typeof Tv]> = [
  ["TV", Tv],
  ["Refrigerator", Refrigerator],
  ["Microwave", Microwave],
  ["Wi-Fi", Wifi],
  ["Heater / AC", Thermometer],
  ["Bluetooth stereo", Bluetooth],
  ["Coffee maker", Coffee],
  ["Bedding and towels", BedDouble],
];


function StaySummary({ stay }: { stay: Reservation }) {
  const end = checkoutDate(stay.checkIn, stay.nights);
  return (
    <div className="mt-2">
      <p className="font-display text-3xl">
        {pretty(stay.checkIn, false)} → {pretty(end, false)}
      </p>
      <p className="mt-1 text-muted">
        {stay.nights} night{stay.nights === 1 ? "" : "s"} · {stay.kind === "complimentary" ? "Complimentary" : money(stay.amount)} ·{" "}
        {stay.status === "pending_approval" ? "Waiting for Cameron" : stay.status === "confirmed" ? "Confirmed" : stay.status}
      </p>
      <Link to="/stay" className="btn btn-tide mt-4 no-underline">
        Open my stay
      </Link>
    </div>
  );
}

export function BookScreen() {
  const { data, me, today, book } = useYacht();
  const navigate = useNavigate();
  const [cursor, setCursor] = useState(ymOf(today));
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [step, setStep] = useState<"dates" | "rules">("dates");
  const [adults, setAdults] = useState(2);
  const [accepted, setAccepted] = useState(false);
  const [present, setPresent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nights = checkIn && checkOut ? asNightCount(nightsBetween(checkIn, checkOut), data.config.maxNights) : null;

  useEffect(() => {
    const raw = sessionStorage.getItem("cam-draft");
    if (!raw) return;
    sessionStorage.removeItem("cam-draft");
    try {
      const parsed = JSON.parse(raw) as { checkIn?: string; nights?: number };
      const n = asNightCount(parsed.nights ?? 0, data.config.maxNights);
      if (parsed.checkIn && n && !canStart(data, parsed.checkIn, n, today)) {
        setCheckIn(parsed.checkIn);
        setCheckOut(checkoutDate(parsed.checkIn, n));
        setCursor(parsed.checkIn.slice(0, 7));
        setStep("rules");
      }
    } catch {
      /* ignore a bad draft */
    }
  }, [data, today]);

  const priced = nights ? priceStay(me, nights, data.config.nightlyRate) : null;
  const cells = calendarCells(cursor);
  const existing = me.role === "manager" ? activeStay(data, me.id, today) : undefined;
  const turnover = checkIn && nights ? turnoverDate(data, checkIn, nights) : null;

  const pick = (iso: string) => {
    if (!checkIn || checkOut) {
      const reason = canCheckIn(data, iso, today);
      if (reason) {
        setError(reason);
        return;
      }
      setError(null);
      setCheckIn(iso);
      setCheckOut(null);
      return;
    }
    if (iso <= checkIn) {
      const reason = canCheckIn(data, iso, today);
      if (reason) {
        setError(reason);
        return;
      }
      setError(null);
      setCheckIn(iso);
      setCheckOut(null);
      return;
    }
    const count = asNightCount(nightsBetween(checkIn, iso), data.config.maxNights);
    if (!count) {
      setError(`A stay is ${data.config.maxNights} nights at most.`);
      return;
    }
    const reason = canStart(data, checkIn, count, today);
    if (reason) {
      setError(reason);
      return;
    }
    setError(null);
    setCheckOut(iso);
  };

  if (me.role !== "manager") {
    return <p className="card p-6">Booking is the manager’s screen. Use the view switch to open Alex Chen or another manager.</p>;
  }

  if (existing) {
    return (
      <div className="card p-6">
        <p className="kicker">Already on the books</p>
        <h1 className="mt-2 text-4xl">You have an open stay</h1>
        <StaySummary stay={existing} />
      </div>
    );
  }

  if (step === "rules" && checkIn && nights && priced) {
    return (
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          const result = book({ checkIn, nights, adults, accepted: accepted && present });
          if (!result.ok) {
            setError(result.error);
            return;
          }
          navigate({ to: "/stay" });
        }}
      >
        <div>
          <p className="kicker">Before this is confirmed</p>
          <h1 className="mt-2 text-4xl">House rules</h1>
        </div>
        <Callout title="Important">
          There is no usable toilet or shower aboard the yacht. Shore facilities must be used.
        </Callout>
        <Callout title="The boat stays put">
          Guests never start the engines, never operate the yacht, and never leave Dock 5, Slip 36.
        </Callout>
        <ul className="card space-y-3 p-5">
          {RULES.map((rule) => (
            <li key={rule} className="border-b border-line pb-3 last:border-b-0 last:pb-0">
              {rule}
            </li>
          ))}
        </ul>
        <div className="card p-5">
          <p className="font-medium">Adults aboard, including you</p>
          <p className="mt-1 text-sm text-muted">Two is the stay we recommend. Three is tight. Four is the absolute maximum and is not comfortable.</p>
          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4].map((n) => (
              <button key={n} type="button" className={`btn ${adults === n ? "btn-tide" : "btn-quiet"} min-w-12 px-0`} onClick={() => setAdults(n)}>
                {n}
              </button>
            ))}
          </div>
        </div>
        <label className="card flex gap-3 p-5">
          <input type="checkbox" className="mt-1 size-5" checked={present} onChange={(e) => setPresent(e.target.checked)} />
          <span>I will be aboard for the whole stay. The complimentary benefit is not transferable.</span>
        </label>
        <label className="card flex gap-3 p-5">
          <input type="checkbox" className="mt-1 size-5" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
          <span>I accept these rules, version {new Date().getFullYear() === 2026 ? "2026-10-house-1" : "2026-10-house-1"}.</span>
        </label>
        {error ? <p className="text-brass-ink">{error}</p> : null}
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-quiet" onClick={() => setStep("dates")}>
            Back
          </button>
          <button className="btn btn-brass" type="submit" disabled={!accepted || !present}>
            {priced.needsApproval ? "Request your stay" : "Confirm your stay"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <p className="kicker">The Bay Escape</p>
        <h1 className="mt-3 text-[35px] lg:text-[48px]">Book your escape</h1>
        <p className="mt-4 max-w-md text-[15px] text-muted">
          {checkOut ? "The morning you leave is not an extra night." : checkIn ? "Select your checkout date." : "Select your check-in date. Up to 3 nights."}
        </p>
        <section className="mt-8 border border-line bg-white p-4 lg:p-6">
          <div className="mb-4 flex items-center justify-between">
            <button type="button" className="btn btn-quiet" onClick={() => setCursor(shiftMonth(cursor, -1))} aria-label="Previous month">Prev</button>
            <h2 className="text-[26px]">{monthLabel(cursor)}</h2>
            <button type="button" className="btn btn-quiet" onClick={() => setCursor(shiftMonth(cursor, 1))} aria-label="Next month">Next</button>
          </div>
          <div className="grid grid-cols-7 text-center text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((cell) => {
              const day = Number(cell.iso.slice(-2));
              const taken = data.reservations.some((r) => (r.status === "confirmed" || r.status === "pending_approval") && cell.iso >= r.checkIn && cell.iso < checkoutDate(r.checkIn, r.nights));
              const role = !checkIn
                ? null
                : cell.iso === checkIn
                  ? "in"
                  : checkOut && cell.iso === checkOut
                    ? "out"
                    : checkOut && cell.iso > checkIn && cell.iso < checkOut
                      ? "mid"
                      : null;
              return (
                <button
                  key={cell.iso}
                  type="button"
                  disabled={!cell.inMonth}
                  onClick={() => pick(cell.iso)}
                  className="relative h-14"
                >
                  {role === "in" && checkOut ? <span className="absolute inset-y-2 right-0 left-1/2 bg-[#efeae0]" /> : null}
                  {role === "out" ? <span className="absolute inset-y-2 right-1/2 left-0 bg-[#efeae0]" /> : null}
                  {role === "mid" ? <span className="absolute inset-y-2 inset-x-0 bg-[#efeae0]" /> : null}
                  <span
                    className={`relative z-10 mx-auto grid size-10 place-items-center rounded-full text-[16px] ${
                      !cell.inMonth
                        ? "text-transparent"
                        : role === "in" || role === "out"
                          ? "bg-[#07141d] text-white"
                          : taken
                            ? "text-[#b0aaa2] line-through"
                            : "text-[#07141d]"
                    }`}
                  >
                    {day}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
        {error ? <p className="mt-4 text-sm">{error}</p> : null}
        <p className="mt-4 max-w-md text-[13px] leading-[1.5] text-muted">
          Nights are the evenings you stay. The checkout morning is not an extra night, and it can open for a 3:00 PM arrival once Maria marks the yacht ready.
        </p>
      </div>
      <aside className="lg:col-span-5 lg:pt-16">
        <div className="border border-line bg-white p-6 lg:p-8">
          <p className="kicker">The Bay Escape</p>
          {checkIn && checkOut && nights && priced ? (
            <>
              <p className="mt-4 font-display text-[30px] leading-tight uppercase lg:text-[38px]">
                {pretty(checkIn, false)} — {pretty(checkOut, false)}
              </p>
              <p className="mt-2 text-[15px] tracking-[0.08em] uppercase">{nights} night{nights === 1 ? "" : "s"}</p>
              <dl className="mt-8 space-y-3 border-t border-line pt-5 text-[15px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Check-in</dt>
                  <dd>{pretty(checkIn)} · 3:00 PM</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Checkout</dt>
                  <dd>{pretty(checkOut)} · 11:00 AM</dd>
                </div>
              </dl>
              <div className="mt-6 border-t border-line pt-5">
                <p className="text-[11px] font-semibold tracking-[0.14em] uppercase">CAM Privé manager benefit</p>
                <dl className="mt-3 space-y-2 text-[15px]">
                  {priced.complimentaryNights > 0 ? (
                    <div className="flex justify-between gap-4">
                      <dt>Complimentary nights</dt>
                      <dd>{priced.complimentaryNights}</dd>
                    </div>
                  ) : null}
                  {priced.paidNights > 0 ? (
                    <div className="flex justify-between gap-4">
                      <dt>Additional night</dt>
                      <dd>{priced.paidNights} × {money(data.config.nightlyRate)}</dd>
                    </div>
                  ) : null}
                  <div className="flex justify-between gap-4 pt-2">
                    <dt>Total</dt>
                    <dd className="font-display text-[32px] leading-none">{money(priced.amount)}</dd>
                  </div>
                </dl>
                {priced.needsApproval ? <p className="mt-4 text-[11px] font-semibold tracking-[0.14em] uppercase">Owner approval required</p> : null}
                {turnover ? <p className="mt-3 text-[14px] text-muted">Same-day turnover. Maria is asked to have the yacht ready before 3:00 PM.</p> : null}
              </div>
              <button type="button" className="btn btn-tide mt-8 w-full" onClick={() => setStep("rules")}>
                {priced.needsApproval ? "Request your stay" : "Confirm your stay"}
              </button>
              <button type="button" className="mt-4 text-[13px] font-medium tracking-[0.04em]" onClick={() => { setCheckIn(null); setCheckOut(null); }}>Change dates</button>
            </>
          ) : (
            <p className="mt-4 text-[15px] leading-[1.6] text-muted">
              {checkIn ? "Select your checkout date. The morning you leave is not an extra night." : "Select your check-in date."}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}

function shiftMonth(ym: string, delta: number): string {
  const [y, m] = ym.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1 + delta, 1));
  return dt.toISOString().slice(0, 7);
}

export function StayScreen() {
  const { data, me, today, cancelStay, submitCheckout, setTip } = useYacht();
  const stay = data.reservations.find(
    (r) => r.managerId === me.id && (r.status === "confirmed" || r.status === "pending_approval" || r.status === "checked_out"),
  );
  const [note, setNote] = useState<string | null>(null);
  const [panel, setPanel] = useState<"stay" | "checkin" | "rules" | "bring" | "marina" | "help" | "checkout">("stay");
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [photos, setPhotos] = useState<Record<PhotoSlot, string | null>>({
    cabin: null,
    cockpit: null,
    bridge: null,
    overall: null,
  });
  const [notes, setNotes] = useState("");
  const [damage, setDamage] = useState("");

  if (me.role !== "manager") return <p className="card p-6">Open My Stay as a manager.</p>;

  const latest = data.reservations.filter((r) => r.managerId === me.id)[0];
  if (!latest) {
    return (
      <div className="card p-6">
        <h1 className="text-4xl">No stay yet</h1>
        <Link to="/book" className="btn btn-brass mt-4 no-underline">Book your stay</Link>
      </div>
    );
  }

  const show = stay ?? latest;
  const out = checkoutDate(show.checkIn, show.nights);
  const past = show.status === "checked_out" || show.status === "cancelled" || show.status === "declined";
  const visible = tab === "past" ? (past ? show : undefined) : past ? undefined : show;

  if (!visible) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <StayTabs tab={tab} setTab={setTab} />
        <div className="card p-6">
          <h1 className="text-3xl">{tab === "past" ? "No past stay" : "No upcoming stay"}</h1>
          <Link to="/book" className="btn btn-brass mt-4 no-underline">Book Your Stay →</Link>
        </div>
      </div>
    );
  }

  const confirmed = visible.status === "confirmed";

  return (
    <div className="mx-auto max-w-lg space-y-4">
      {panel === "stay" ? (
        <>
          <StayTabs tab={tab} setTab={setTab} />
          <article className="card overflow-hidden">
            <img src="/yacht/hero.jpg" alt="" className="h-40 w-full object-cover" />
            <div className="space-y-3 p-4">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${confirmed ? "bg-ready/15 text-ready" : "bg-brass/30 text-brass-ink"}`}>
                {visible.status === "confirmed" ? "CONFIRMED" : visible.status === "pending_approval" ? "PENDING" : visible.status.replaceAll("_", " ").toUpperCase()}
              </span>
              <p className="font-display text-3xl">{pretty(visible.checkIn, false)} → {pretty(out, false)}</p>
              <p className="text-muted">{visible.nights} night{visible.nights === 1 ? "" : "s"} · {visible.kind === "complimentary" ? "Complimentary" : money(visible.amount)}</p>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" className="btn btn-tide" onClick={() => setPanel("checkin")}>View details</button>
                {confirmed ? (
                  <button type="button" className="btn btn-quiet" onClick={() => setNote(cancelStay(visible.id))}>Modify / Cancel</button>
                ) : (
                  <button type="button" className="btn btn-quiet" onClick={() => setNote(cancelStay(visible.id))}>Withdraw</button>
                )}
              </div>
            </div>
          </article>
          <nav className="card divide-y divide-line">
            {([
              ["checkin", "Check-in guide", "3:00 PM arrival. Codes stay blank until configured."],
              ["rules", "Yacht rules", "The boat stays tied. No toilet or shower aboard."],
              ["bring", "What to bring", "Packing for a dockside night."],
              ["marina", "Marina guide", "Dock 5, Slip 36. Facilities marked if unknown."],
              ["help", "Need help?", "Emergency contact is not published yet."],
            ] as const).map(([id, title, body]) => (
              <button key={id} type="button" className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left" onClick={() => setPanel(id)}>
                <span>
                  <span className="block font-medium">{title}</span>
                  <span className="block text-sm text-muted">{body}</span>
                </span>
                <span aria-hidden className="text-muted">›</span>
              </button>
            ))}
          </nav>
          {confirmed ? (
            <button type="button" className="btn btn-brass w-full" onClick={() => setPanel("checkout")}>Checkout by 11:00 AM</button>
          ) : null}
          {note ? <p>{note}</p> : null}
        </>
      ) : null}

      {panel !== "stay" ? (
        <button type="button" className="text-sm text-tide" onClick={() => setPanel("stay")}>← My Stay</button>
      ) : null}

      {panel === "checkin" ? (
        <section className="card overflow-hidden">
          <img src="/yacht/marina.jpg" alt="" className="h-36 w-full object-cover" />
          <div className="space-y-3 p-5">
            <h1 className="text-4xl">{visible.status === "pending_approval" ? "Request received" : "Reservation confirmed"}</h1>
            <p className="text-muted">
              {visible.status === "pending_approval"
                ? "The extra night needs owner approval. This stay is not confirmed yet."
                : "Your stay is all set. Check in at 3:00 PM, out at 11:00 AM."}
            </p>
            <ConfigLine label="Dates" value={`${pretty(visible.checkIn, false)} → ${pretty(out, false)}`} />
            <ConfigLine label="Location" value="Sierra Point Harbor, Dock 5, Slip 36" />
            <ConfigLine label="Guests" value={`${visible.adults} adult${visible.adults === 1 ? "" : "s"}`} />
            <ConfigLine label="Access" value={data.config.access} />
            <ConfigLine label="Parking" value={data.config.parking} />
            <ConfigLine label="Shore restroom and shower" value={data.config.shore} />
            <ConfigLine label="Wi-Fi" value={data.config.wifi} />
            <Callout title="Important">There is no usable toilet or shower aboard. Shore facilities must be used. The yacht never leaves the slip.</Callout>
          </div>
        </section>
      ) : null}

      {panel === "rules" ? (
        <ul className="card space-y-3 p-5">
          {RULES.map((rule) => (
            <li key={rule} className="border-b border-line pb-3 last:border-0 last:pb-0">{rule}</li>
          ))}
        </ul>
      ) : null}

      {panel === "bring" ? (
        <ul className="card space-y-2 p-5">
          {data.guide.bring.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}

      {panel === "marina" ? (
        <section className="card p-5">
          <h1 className="text-3xl">Marina guide</h1>
          <ConfigLine label="Harbor" value="Sierra Point Harbor. Dock 5. Slip 36." />
          <ConfigLine label="Access" value={data.config.access} />
          <ConfigLine label="Parking" value={data.config.parking} />
          <ConfigLine label="Shore facilities" value={data.config.shore} />
          <p className="mt-3 text-sm text-muted">Gate hours, guest policy, and fishing rules stay unpublished until they are verified.</p>
        </section>
      ) : null}

      {panel === "help" ? (
        <section className="card p-5">
          <h1 className="text-3xl">Need help?</h1>
          <ConfigLine label="Emergency" value={data.config.emergency} />
          <p className="text-sm text-muted">Do not start the engines. Do not leave the slip. If something is unsafe, leave the boat and use the configured emergency contact.</p>
        </section>
      ) : null}

      {panel === "checkout" && confirmed ? (
        <section className="space-y-4">
          <div className="card p-5">
            <h1 className="text-3xl">Checkout checklist</h1>
            <p className="mt-1 text-sm text-muted">Please complete by 11:00 AM.</p>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                "Remove all personal belongings",
                "Remove all trash",
                "Put used towels in the designated location",
                "Put used bedding in the designated location",
                "Turn off appliances",
                "Close windows and doors",
                "Report any damage or issues",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              ["cabin", "Cabin / interior"],
              ["cockpit", "Cockpit"],
              ["bridge", "Command bridge"],
              ["overall", "Overall condition"],
            ] as const).map(([id, label]) => (
              <PhotoPick key={id} label={label} value={photos[id]} onPick={(url) => setPhotos((p) => ({ ...p, [id]: url }))} />
            ))}
          </div>
          <label className="block">
            <span className="text-sm text-muted">Notes for Maria</span>
            <textarea className="field mt-1 min-h-24" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm text-muted">Damage, if any</span>
            <textarea className="field mt-1 min-h-20" value={damage} onChange={(e) => setDamage(e.target.value)} />
          </label>
          {note ? <p>{note}</p> : null}
          <button
            type="button"
            className="btn btn-tide w-full"
            onClick={() => {
              const err = submitCheckout(visible.id, { notes, damage, photos });
              setNote(err ?? "Checkout is in. Maria’s cleaning opens on its own.");
            }}
          >
            <Camera size={18} aria-hidden /> Submit checkout
          </button>
        </section>
      ) : null}

      {visible.status === "checked_out" && panel === "stay" ? (
        <section className="card p-5">
          <Heart className="text-brass" aria-hidden />
          <h2 className="mt-2 text-3xl">Thank Maria</h2>
          <p className="mt-2">A $20 cleaning tip is appreciated and optional. The complimentary stay does not require it.</p>
          <ConfigLine label="How to send it" value={data.config.zelle} />
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn btn-brass" onClick={() => setTip(visible.id, "sent")}>I sent $20</button>
            <button type="button" className="btn btn-quiet" onClick={() => setTip(visible.id, "skipped")}>Skip</button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function StayTabs({ tab, setTab }: { tab: "upcoming" | "past"; setTab: (t: "upcoming" | "past") => void }) {
  return (
    <div className="grid grid-cols-2 rounded-full bg-foam p-1 shadow-card">
      {(["upcoming", "past"] as const).map((id) => (
        <button key={id} type="button" className={`min-h-11 rounded-full capitalize ${tab === id ? "bg-tide text-foam" : "text-muted"}`} onClick={() => setTab(id)}>
          {id}
        </button>
      ))}
    </div>
  );
}

export function ExploreScreen() {
  const { data } = useYacht();
  const g = data.guide;
  const [tab, setTab] = useState<"things" | "dining" | "day" | "weekend">("things");
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <p className="kicker">Explore the area</p>
        <h1 className="mt-2 text-4xl">Around Slip 36</h1>
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {([
          ["things", "Things to do"],
          ["dining", "Dining"],
          ["day", "24-hour"],
          ["weekend", "48-hour"],
        ] as const).map(([id, label]) => (
          <button key={id} type="button" className={`btn shrink-0 ${tab === id ? "btn-tide" : "btn-quiet"}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>
      <Callout title="Important">
        There is no usable toilet or shower aboard. Engines stay off. The boat does not leave Slip 36.
      </Callout>
      {tab === "things" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {g.activities.map((a) => (
            <article key={a.id} className="card overflow-hidden">
              <img src={a.verified ? "/yacht/bridge.jpg" : "/yacht/marina.jpg"} alt="" className="h-32 w-full object-cover" />
              <div className="p-4">
                <p className="kicker">{a.verified ? "On the boat" : "Not confirmed yet"}</p>
                <h2 className="mt-1 text-2xl">{a.title}</h2>
                <p className="mt-2 text-sm text-muted">{a.body}</p>
              </div>
            </article>
          ))}
        </div>
      ) : null}
      {tab === "dining" ? (
        <section className="card p-5">
          <h2 className="text-3xl">Dining</h2>
          <p className="mt-2 text-muted">No restaurant list is published yet. Cooking aboard is not allowed. The microwave and coffee maker are the only galley use.</p>
        </section>
      ) : null}
      {tab === "day" ? (
        <ol className="card space-y-3 p-5">
          {g.escape24.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : null}
      {tab === "weekend" ? (
        <ol className="card space-y-3 p-5">
          {g.escape48.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

export function ProfileScreen() {
  const { me, data, resetDemo } = useYacht();
  const mine = data.reservations.filter((r) => r.managerId === me.id);
  return (
    <div className="space-y-5">
      <div>
        <p className="kicker">Profile</p>
        <h1 className="mt-2 text-4xl">{me.name}</h1>
        <p className="text-muted">{me.region} · {me.role}</p>
      </div>
      <section className="card p-5">
        <p>This walkthrough uses sample people so you can open every screen. Cameron only hears about exceptions. Maria gets a single cleaning page. Managers book the benefit.</p>
        <p className="mt-3 text-sm text-muted">Nothing here is a live text message, a door code, or a payment account. Those stay blank until you configure them.</p>
        <button type="button" className="btn btn-quiet mt-4" onClick={() => resetDemo()}>Reset the walkthrough</button>
      </section>
      {me.role === "manager" ? (
        <section className="card p-5">
          <h2 className="text-2xl">Entitlement</h2>
          <p className="mt-2">
            {nightsLeft(me) > 0
              ? `${nightsLeft(me)} complimentary night${nightsLeft(me) === 1 ? "" : "s"} remaining. Up to 3 nights. A night beyond the complimentary two is $89 and needs approval.`
              : "Complimentary nights are used. Additional nights are $89 and need approval."}
          </p>
          {me.extraStays > 0 ? <p>{me.extraStays} extra complimentary stay{me.extraStays === 1 ? "" : "s"} granted.</p> : null}
          <p className="mt-3 text-sm text-muted">{mine.length} reservation record{mine.length === 1 ? "" : "s"}.</p>
        </section>
      ) : null}
      <p className="text-sm text-muted">Rules version 2026-10-house-1. Acceptance time is stored with each reservation.</p>
    </div>
  );
}
