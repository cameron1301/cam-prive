import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { BookOpen, Car, Compass, Droplets, KeyRound, LifeBuoy, Luggage, MapPin, Utensils } from "lucide-react";
import { GuestLayout, PageIntro } from "./chrome";
import { fileToDataUrl } from "@/lib/yacht/logic";
import {
  activeStay,
  asNightCount,
  calendarCells,
  canCheckIn,
  canStart,
  benefitHeadline,
  checkoutDate,
  money,
  monthLabel,
  nightsBetween,
  nightsLeft,
  normalizePerson,
  pretty,
  priceStay,
  turnoverDate,
  ymOf,
  type PhotoSlot,
  type Reservation,
} from "@/lib/yacht/logic";
import { useYacht } from "@/lib/yacht/store";

const btn = "inline-flex h-12 items-center justify-center rounded-[2px] bg-[#07141d] px-6 text-[12px] font-semibold tracking-[0.08em] text-white uppercase no-underline";
const btnQuiet = "inline-flex h-12 items-center justify-center rounded-[2px] border border-[#07141d] px-6 text-[12px] font-semibold tracking-[0.08em] uppercase";

function shiftMonth(ym: string, delta: number): string {
  const [y, m] = ym.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1 + delta, 1));
  return dt.toISOString().slice(0, 7);
}

function AccessGate() {
  const { openInvitation } = useYacht();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <GuestLayout>
      <section className="mx-auto max-w-xl px-5 py-16 lg:py-24">
        <PageIntro
          kicker="CAM Privé"
          title="Your invitation"
          body="Enter the private code from your invitation. Benefits stay private until we know it's you."
        />
        <form
          className="mt-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (!openInvitation(code)) {
              setError("That code isn't recognized. Please check the invitation and try again.");
              return;
            }
            setError(null);
          }}
        >
          <label className="block text-[13px] text-[#6d6a64]">
            Invitation code
            <input className="field mt-2" value={code} autoComplete="off" onChange={(e) => setCode(e.target.value)} />
          </label>
          <button type="submit" className={`${btn} mt-6`}>Continue</button>
        </form>
        {error ? <p className="mt-4 text-[15px] text-[#6d6a64]">{error}</p> : null}
      </section>
    </GuestLayout>
  );
}

export function BookScreen() {
  const { data, me, today, book } = useYacht();
  const navigate = useNavigate();
  const profile = normalizePerson(me);
  const cap = Math.min(data.config.maxNights, profile.maxStay);
  const [cursor, setCursor] = useState(ymOf(today));
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [adults, setAdults] = useState(2);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nights = checkIn && checkOut ? asNightCount(nightsBetween(checkIn, checkOut), cap) : null;
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
    const count = asNightCount(nightsBetween(checkIn, iso), cap);
    if (!count) {
      setError(`Let's try different dates. This invitation can reserve up to ${cap} consecutive night${cap === 1 ? "" : "s"}.`);
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

  if (!me.id) return <AccessGate />;

  if (me.role !== "manager" || !profile.eligible) {
    return (
      <GuestLayout>
        <section className="mx-auto max-w-3xl px-5 py-16 lg:px-12 lg:py-24">
          <PageIntro kicker="The Bay Escape" title="You're invited" body="Your invitation includes The Bay Escape. If dates aren't showing, your CAM Privé host can help." />
        </section>
      </GuestLayout>
    );
  }

  if (existing) {
    return (
      <GuestLayout>
        <section className="mx-auto max-w-3xl px-5 py-16 lg:px-12 lg:py-24">
          <PageIntro kicker="The Bay Escape" title="Your Bay Escape awaits" body="You already have a weekend with us. Everything for the visit is on My Stay." />
          <Link to="/stay" className={`${btn} mt-8`}>View your stay</Link>
        </section>
      </GuestLayout>
    );
  }

  return (
    <GuestLayout>
      <div className="mx-auto grid max-w-[1280px] gap-14 px-5 py-12 lg:grid-cols-12 lg:px-12 lg:py-16">
        <div className="lg:col-span-7">
          <PageIntro
            kicker="The Bay Escape"
            title="Plan your escape"
            body="Choose the dates that work best for you. We'll take care of the details."
          />
          <div className="mt-10 grid grid-cols-2 gap-8 border-b border-[#ded9d0] pb-6">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">Check-in</p>
              <p className="mt-2 font-display text-[26px] leading-tight lg:text-[32px]">{checkIn ? pretty(checkIn, false) : "Select"}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">Checkout</p>
              <p className="mt-2 font-display text-[26px] leading-tight lg:text-[32px]">{checkOut ? pretty(checkOut, false) : "Select"}</p>
            </div>
          </div>
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <button type="button" className="text-[13px] tracking-[0.08em] uppercase" onClick={() => setCursor(shiftMonth(cursor, -1))}>Previous</button>
              <h2 className="text-[26px]">{monthLabel(cursor)}</h2>
              <button type="button" className="text-[13px] tracking-[0.08em] uppercase" onClick={() => setCursor(shiftMonth(cursor, 1))}>Next</button>
            </div>
            <div className="grid grid-cols-7 text-center text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {cells.map((cell) => {
                const day = Number(cell.iso.slice(-2));
                const taken = data.reservations.some((r) => (r.status === "confirmed" || r.status === "pending_approval") && cell.iso >= r.checkIn && cell.iso < checkoutDate(r.checkIn, r.nights));
                const role = !checkIn ? null : cell.iso === checkIn ? "in" : checkOut && cell.iso === checkOut ? "out" : checkOut && cell.iso > checkIn && cell.iso < checkOut ? "mid" : null;
                return (
                  <button key={cell.iso} type="button" disabled={!cell.inMonth} onClick={() => pick(cell.iso)} className="relative h-12">
                    {role === "in" && checkOut ? <span className="absolute inset-y-1 right-0 left-1/2 bg-[#efeae0]" /> : null}
                    {role === "out" ? <span className="absolute inset-y-1 right-1/2 left-0 bg-[#efeae0]" /> : null}
                    {role === "mid" ? <span className="absolute inset-y-1 inset-x-0 bg-[#efeae0]" /> : null}
                    <span
                      className={`relative z-10 mx-auto grid size-10 place-items-center rounded-full text-[16px] ${
                        !cell.inMonth ? "text-transparent" : role === "in" || role === "out" ? "bg-[#07141d] text-white" : taken ? "text-[#b0aaa2] line-through" : "text-[#07141d]"
                      }`}
                    >
                      {day}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          {error ? <p className="mt-4 text-[15px] text-[#6d6a64]">{error}</p> : null}
        </div>
        <aside className="lg:col-span-5 lg:pt-6">
          <div className="border-t border-[#ded9d0] pt-8 lg:border lg:border-[#ded9d0] lg:p-8 lg:pt-8">
            {checkIn && checkOut && nights && priced ? (
              <>
                <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">Your Bay Escape</p>
                <dl className="mt-6 space-y-3 text-[15px]">
                  <div className="flex justify-between gap-4 border-t border-[#ded9d0] pt-3">
                    <dt className="text-[#6d6a64]">Arrival</dt>
                    <dd className="text-right">{pretty(checkIn)}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-[#ded9d0] pt-3">
                    <dt className="text-[#6d6a64]">Departure</dt>
                    <dd className="text-right">{pretty(checkOut)}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-[#ded9d0] pt-3">
                    <dt className="text-[#6d6a64]">Number of nights</dt>
                    <dd className="text-right">{nights}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-[#ded9d0] pt-3">
                    <dt className="text-[#6d6a64]">Hours aboard</dt>
                    <dd>3:00 PM – 11:00 AM</dd>
                  </div>
                </dl>
                <Benefit priced={priced} />
                {turnover ? <p className="mt-4 text-[14px] leading-relaxed text-[#6d6a64]">Another guest departs that morning. We'll have the yacht ready before your 3:00 PM arrival.</p> : null}
                <div className="mt-8">
                  <p className="text-[13px] text-[#6d6a64]">Adults aboard</p>
                  <div className="mt-2 flex gap-2">
                    {[1, 2, 3, 4].map((n) => (
                      <button key={n} type="button" className={`grid size-11 place-items-center rounded-[2px] border ${adults === n ? "border-[#07141d] bg-[#07141d] text-white" : "border-[#ded9d0]"}`} onClick={() => setAdults(n)}>
                        {n}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-[13px] text-[#6d6a64]">Two is comfortable. Four is the most the cabin allows.</p>
                </div>
                <label className="mt-6 flex gap-3 text-[15px] leading-relaxed">
                  <input type="checkbox" className="mt-1 size-4" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
                  <span>I'll be aboard for the stay. The Bay Escape is dockside, quiet, and prepared for me.</span>
                </label>
                <button
                  type="button"
                  className={`${btn} mt-6 w-full`}
                  onClick={() => {
                    const result = book({ checkIn, nights, adults, accepted });
                    if (!result.ok) {
                      setError(result.error);
                      return;
                    }
                    sessionStorage.setItem("cam-reserved", "1");
                    navigate({ to: "/stay" });
                  }}
                >
                  Reserve your stay
                </button>
                <button type="button" className="mt-4 text-[13px] tracking-[0.06em] uppercase" onClick={() => { setCheckIn(null); setCheckOut(null); }}>
                  Change dates
                </button>
              </>
            ) : (
              <>
                <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">Your Privé benefit</p>
                <p className="mt-4 text-[22px] leading-tight">{benefitHeadline(profile)}</p>
                <p className="mt-4 text-[16px] leading-[1.65] text-[#6d6a64]">
                  Select your arrival, then your departure. The stay is the nights between those mornings.
                </p>
                <ul className="mt-6 space-y-3 text-[15px]">
                  {([1, 2, 3] as const).filter((n) => n <= cap).map((n) => {
                    const row = priceStay(me, n, data.config.nightlyRate);
                    return (
                      <li key={n} className="flex justify-between border-t border-[#ded9d0] pt-3">
                        <span>{n} night{n === 1 ? "" : "s"}</span>
                        <span>{money(row.amount)}</span>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </aside>
      </div>
    </GuestLayout>
  );
}

function Benefit({ priced }: { priced: ReturnType<typeof priceStay> }) {
  return (
    <div className="mt-8">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">Your Privé benefit</p>
      <dl className="mt-3 space-y-3 text-[15px]">
        {priced.complimentaryNights > 0 ? (
          <div className="flex justify-between gap-4 border-t border-[#ded9d0] pt-3">
            <dt>Privé benefit</dt>
            <dd>{priced.complimentaryNights === 1 ? "One Complimentary Night" : `${priced.complimentaryNights} Complimentary Nights`}</dd>
          </div>
        ) : null}
        {priced.paidNights > 0 ? (
          <div className="flex justify-between gap-4 border-t border-[#ded9d0] pt-3">
            <dt>Additional night{priced.paidNights === 1 ? "" : "s"}</dt>
            <dd>{priced.paidNights === 1 ? money(priced.nightly) : `${priced.paidNights} × ${money(priced.nightly)}`}</dd>
          </div>
        ) : null}
        <div className="flex items-end justify-between gap-4 border-t border-[#ded9d0] pt-3">
          <dt className="tracking-[0.08em] uppercase">Total</dt>
          <dd className="font-display text-[36px] leading-none">{money(priced.amount)}</dd>
        </div>
      </dl>
    </div>
  );
}

export function StayScreen() {
  const { data, me, today, cancelStay, changeStay, submitCheckout } = useYacht();
  const href = useRouterState({ select: (s) => s.location.href });
  const [welcome, setWelcome] = useState(() => {
    if (typeof sessionStorage === "undefined") return false;
    const flag = sessionStorage.getItem("cam-reserved") === "1";
    if (flag) sessionStorage.removeItem("cam-reserved");
    return flag;
  });
  const [panel, setPanel] = useState<"stay" | "bring" | "checkout" | "done">(href.includes("panel=checkout") ? "checkout" : "stay");
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [note, setNote] = useState<string | null>(null);
  const stay = data.reservations.find((r) => r.managerId === me.id && (r.status === "confirmed" || r.status === "pending_approval" || r.status === "checked_out"));

  if (!me.id) return <AccessGate />;

  if (me.role !== "manager") {
    return (
      <GuestLayout>
        <section className="mx-auto max-w-3xl px-5 py-16 lg:px-12"><PageIntro kicker="My Stay" title="Your Bay Escape" body="Open this page from your invitation." /></section>
      </GuestLayout>
    );
  }

  const latest = data.reservations.find((r) => r.managerId === me.id);
  const show = stay ?? latest;
  const past = !!show && (show.status === "checked_out" || show.status === "cancelled" || show.status === "declined");
  const visible = tab === "past" ? (past ? show : undefined) : past ? undefined : show;

  return (
    <GuestLayout>
      <div className="mx-auto max-w-[430px] px-5 py-8 lg:max-w-5xl lg:px-8 lg:py-12">
        {panel === "bring" ? <Bring onBack={() => setPanel("stay")} /> : null}
        {panel === "checkout" && visible && visible.status === "confirmed" ? (
          <CheckoutFlow
            onDone={(message) => {
              setNote(message);
              setPanel(message ? "checkout" : "done");
            }}
            submit={(input) => submitCheckout(visible.id, input)}
          />
        ) : null}
        {panel === "done" ? (
          <section className="mx-auto max-w-xl">
            <PageIntro
              kicker="The Bay Escape"
              title="Thank you for joining us"
              body="We hope to welcome you back to CAM Privé soon."
            />
            <button type="button" className={`${btnQuiet} mt-8`} onClick={() => setPanel("stay")}>View your stay</button>
          </section>
        ) : null}
        {panel === "stay" ? (
          <>
            {show && past ? (
              <div className="mb-6 flex gap-6 text-[12px] font-semibold tracking-[0.12em] uppercase">
                <button type="button" className={tab === "upcoming" ? "border-b border-[#07141d] pb-1" : "pb-1 text-[#6d6a64]"} onClick={() => setTab("upcoming")}>Upcoming</button>
                <button type="button" className={tab === "past" ? "border-b border-[#07141d] pb-1" : "pb-1 text-[#6d6a64]"} onClick={() => setTab("past")}>Past</button>
              </div>
            ) : null}
            {!visible ? (
              <div>
                <PageIntro
                  kicker="My Stay"
                  title={tab === "past" ? "No past stays" : "No upcoming stays"}
                  body="When you're ready for your next escape, we'll be here."
                />
                <img src="/yacht/hero-frame.jpg" alt="The Bay Escape" className="mt-8 aspect-[16/10] w-full object-cover" />
                <Link to="/book" className={`${btn} mt-8`}>Check availability</Link>
              </div>
            ) : welcome && tab === "upcoming" && visible.status !== "checked_out" ? (
              <Reserved stay={visible} onView={() => setWelcome(false)} />
            ) : (
              <StayHub
                stay={visible}
                guest={me.name}
                today={today}
                note={note}
                parking={data.config.parking}
                access={data.config.access}
                bring={data.guide.bring}
                activities={data.guide.activities}
                help={data.config.emergency}
                onCancel={() => setNote(cancelStay(visible.id))}
                onChange={(input) => {
                  const result = changeStay({ id: visible.id, ...input });
                  if (!result.ok) return result.error;
                  setNote(null);
                  return null;
                }}
                onBring={() => setPanel("bring")}
                onCheckout={() => setPanel("checkout")}
              />
            )}
          </>
        ) : null}
      </div>
    </GuestLayout>
  );
}

function calendarFile(stay: Reservation) {
  const start = stay.checkIn.replaceAll("-", "");
  const end = checkoutDate(stay.checkIn, stay.nights).replaceAll("-", "");
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    "SUMMARY:The Bay Escape",
    "LOCATION:Sierra Point Harbor\\, Dock 5\\, Slip 36\\, Brisbane",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`;
}

function Reserved({ stay, onView }: { stay: Reservation; onView: () => void }) {
  const out = checkoutDate(stay.checkIn, stay.nights);
  return (
    <section className="mt-10">
      <PageIntro kicker="The Bay Escape" title="Your Bay Escape is reserved" body="We look forward to welcoming you aboard. Your reservation details and arrival information are ready below." />
      <dl className="mt-10 grid gap-6 sm:grid-cols-2">
        {[
          ["Dates", `${pretty(stay.checkIn, false)} — ${pretty(out, false)}`],
          ["Arrival", "3:00 PM"],
          ["Departure", "11:00 AM"],
          ["Marina", "Sierra Point Harbor"],
          ["Guests", `${stay.adults} adult${stay.adults === 1 ? "" : "s"}`],
        ].map(([k, v]) => (
          <div key={k} className="border-t border-[#ded9d0] pt-3">
            <dt className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">{k}</dt>
            <dd className="mt-1 text-[16px]">{v}</dd>
          </div>
        ))}
      </dl>
      <button type="button" className={`${btn} mt-10`} onClick={onView}>View your stay</button>
      <div className="mt-4 flex flex-wrap gap-3">
        <a className={btnQuiet} href="https://maps.google.com/?q=Sierra+Point+Harbor+Brisbane+California" target="_blank" rel="noreferrer">Get directions</a>
        <a className={btnQuiet} href={calendarFile(stay)}>Add to calendar</a>
      </div>
    </section>
  );
}

function configured(value: string | undefined): string | null {
  if (!value || value.includes("ADMIN CONFIGURATION REQUIRED")) return null;
  const text = value.trim();
  return text || null;
}

function refCode(id: string) {
  return id.replace(/\W/g, "").slice(-8).toUpperCase();
}

function stageOf(stay: Reservation, today: string): "before" | "arrival" | "during" | "checkout" | "complete" {
  if (stay.status === "checked_out" || stay.status === "cancelled" || stay.status === "declined") return "complete";
  const out = checkoutDate(stay.checkIn, stay.nights);
  if (today < stay.checkIn) return "before";
  if (today === stay.checkIn) return "arrival";
  if (today < out) return "during";
  return "checkout";
}

const STAGE_LABEL = {
  before: "View arrival details",
  arrival: "Arrival details",
  during: "View stay details",
  checkout: "Complete checkout",
  complete: "Stay completed",
} as const;

function StayHub({
  stay,
  guest,
  today,
  note,
  parking,
  access,
  bring,
  activities,
  help,
  onCancel,
  onChange,
  onBring,
  onCheckout,
}: {
  stay: Reservation;
  guest: string;
  today: string;
  note: string | null;
  parking: string;
  access: string;
  bring: string[];
  activities: Array<{ id: string; title: string; body: string; verified: boolean }>;
  help: string;
  onCancel: () => void;
  onChange: (input: { checkIn: string; nights: 1 | 2 | 3; adults: number }) => string | null;
  onBring: () => void;
  onCheckout: () => void;
}) {
  const [view, setView] = useState<"hub" | "arrival" | "summary" | "modify">("hub");
  const out = checkoutDate(stay.checkIn, stay.nights);
  const stage = stageOf(stay, today);
  const open = stay.status === "confirmed" || stay.status === "pending_approval";
  const parkingNote = configured(parking);
  const accessNote = configured(access);
  const helpNote = configured(help);
  const dining = activities.filter((a) => a.verified && /\b(dining|dinner|restaurant|food)\b/i.test(`${a.title} ${a.body}`));
  const around = activities.filter((a) => a.verified && !dining.includes(a));
  const benefit = stay.complimentaryApplied
    ? stay.complimentaryApplied === 1
      ? "One Complimentary Night"
      : `${stay.complimentaryApplied} Complimentary Nights`
    : "Invitation rate";
  const amount = stay.amount === 0 ? "Included with your invitation" : stay.payment === "paid" ? money(stay.amount) : `${money(stay.amount)} — not collected here`;

  if (view === "arrival") {
    return (
      <section className="mx-auto max-w-xl">
        <button type="button" className="text-[12px] tracking-[0.1em] uppercase" onClick={() => setView("hub")}>Back</button>
        <PageIntro kicker="Arriving" title="Arrival details" body="Check-in is from 3:00 PM. Checkout is by 11:00 AM." />
        <dl className="mt-8">
          {[
            ["Experience", "The Bay Escape"],
            ["Marina", "Sierra Point Harbor, Brisbane, California"],
            ["Location", "Dock 5 · Slip 36"],
            ["Parking", parkingNote ?? "Parking details will be shared with your invitation before you arrive."],
            ["Marina access", accessNote ?? "The way to the slip will be shared with your invitation before you arrive."],
          ].map(([k, v]) => (
            <div key={k} className="border-t border-[#ded9d0] py-4">
              <dt className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">{k}</dt>
              <dd className="mt-1 text-[16px] leading-relaxed">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    );
  }

  if (view === "summary") {
    return (
      <section className="mx-auto max-w-xl">
        <button type="button" className="text-[12px] tracking-[0.1em] uppercase" onClick={() => setView("hub")}>Back</button>
        <PageIntro kicker="My Stay" title="Stay summary" />
        <dl className="mt-8">
          {[
            ["Guest", guest],
            ["Reservation", refCode(stay.id)],
            ["Check-in", `${pretty(stay.checkIn, false)}, 3:00 PM`],
            ["Checkout", `${pretty(out, false)}, 11:00 AM`],
            ["Nights", String(stay.nights)],
            ["Guests", String(stay.adults)],
            ["Privé benefit", benefit],
            ["Amount", amount],
            ["Location", "Sierra Point Harbor, Dock 5, Slip 36"],
            ["Status", stay.status === "confirmed" ? "Reserved" : stay.status === "checked_out" ? "Stay completed" : "Awaiting a note from us"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-6 border-t border-[#ded9d0] py-3 text-[15px]">
              <dt className="text-[#6d6a64]">{k}</dt>
              <dd className="text-right">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    );
  }

  if (view === "modify" && open) {
    return (
      <ModifyStay
        stay={stay}
        onBack={() => setView("hub")}
        onChange={(input) => {
          const error = onChange(input);
          if (!error) setView("hub");
          return error;
        }}
        onCancel={() => {
          onCancel();
          setView("hub");
        }}
      />
    );
  }

  return (
    <article>
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-14">
        <div className="lg:col-span-5 lg:sticky lg:top-6">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">My Stay</p>
          <img src="/yacht/hero-frame.jpg" alt="The Bay Escape at Sierra Point Harbor" className="mt-4 aspect-[16/10] w-full object-cover" />
          <div className="mt-4 flex items-baseline justify-between gap-4 border-b border-[#ded9d0] pb-3">
            <p className="text-[14px] text-[#6d6a64]">Reservation</p>
            <p className="text-[16px] font-semibold tracking-wide">{refCode(stay.id)}</p>
          </div>
          <p className="mt-4 text-[15px]">{pretty(stay.checkIn, false)} — {pretty(out, false)}</p>
          <p className="mt-1 text-[12px] font-semibold tracking-[0.12em] text-[#b6a27a] uppercase">
            {stay.status === "pending_approval" ? "Awaiting a note from us" : stage === "before" ? "Reserved" : stage === "arrival" ? "Arrival day" : stage === "during" ? "During your stay" : stage === "checkout" ? "Checkout day" : "Stay completed"}
          </p>
          <h1 className="mt-1 text-[32px] leading-tight">The Bay Escape</h1>
          <p className="mt-1 text-[15px] text-[#6d6a64]">Sierra Point Harbor<br />Brisbane, California</p>
          {open ? (
            <button type="button" className={`${btnQuiet} mt-5 w-full`} onClick={() => setView("modify")}>Modify / cancel reservation</button>
          ) : null}
          <div className="mt-5 grid grid-cols-2 border-t border-[#ded9d0]">
            <div className="border-r border-[#ded9d0] py-4 pr-4">
              <p className="text-[12px] text-[#6d6a64]">Location</p>
              <p className="mt-1 text-[20px] leading-tight">Dock 5 · Slip 36</p>
            </div>
            <div className="py-4 pl-4">
              <p className="text-[12px] text-[#6d6a64]">Guests</p>
              <p className="mt-1 text-[20px] leading-tight">{stay.adults}</p>
            </div>
          </div>
          {stage === "complete" ? (
            <p className="mt-5 text-center text-[13px] font-semibold tracking-[0.1em] uppercase">Stay completed</p>
          ) : (
            <button
              type="button"
              className={`${btn} mt-5 w-full`}
              onClick={() => {
                if (stage === "checkout") onCheckout();
                else if (stage === "during") document.getElementById("stay-details")?.scrollIntoView({ behavior: "smooth" });
                else setView("arrival");
              }}
            >
              {STAGE_LABEL[stage]}
            </button>
          )}
          <button type="button" className="mt-4 w-full text-center text-[13px] tracking-[0.08em] uppercase underline underline-offset-4" onClick={() => setView("summary")}>
            View stay summary
          </button>
          {note ? <p className="mt-4 text-[15px] text-[#6d6a64]">{note}</p> : null}
        </div>
        <div id="stay-details" className="mt-10 lg:col-span-7 lg:mt-0">
          <InfoRow icon={<MapPin size={18} />} title="Getting here" body="Sierra Point Harbor, Brisbane, California." action={<a className="mt-2 inline-block text-[14px] underline underline-offset-4" href="https://maps.google.com/?q=Sierra+Point+Harbor+Brisbane+California" target="_blank" rel="noreferrer">Get directions</a>} />
          <InfoRow icon={<Car size={18} />} title="Parking" body={parkingNote ?? "Parking details have not been added yet. They will be shared with your invitation before you arrive."} />
          <InfoRow icon={<KeyRound size={18} />} title="Marina access" body={accessNote ?? "Instructions for reaching Dock 5, Slip 36 will be shared with your invitation before you arrive."} />
          <InfoRow icon={<Droplets size={18} />} title="Restrooms and showers" body="The onboard bathroom is not available. Please use the marina restrooms and showers ashore. Hours and the way in are confirmed with your invitation." />
          <InfoRow icon={<BookOpen size={18} />} title="Stay guide" body="A few things to know before and during your time aboard." action={<a className="mt-2 inline-block text-[14px] underline underline-offset-4" href="/guide">View stay guide</a>} />
          <InfoRow icon={<Luggage size={18} />} title="What to bring" body={bring.slice(0, 3).join(" · ") || "Comfortable layers, toiletries for the shore shower, and anything you'd like to eat ashore."} action={<button type="button" className="mt-2 text-[14px] underline underline-offset-4" onClick={onBring}>View the list</button>} />
          <InfoRow icon={<Utensils size={18} />} title="Nearby dining" body={dining.length ? dining.map((a) => a.title).join(" · ") : "Your host has not added dining notes yet."} />
          {around.length ? (
            <InfoRow icon={<Compass size={18} />} title="Make the most of your escape" body={around.map((a) => a.title).join(" · ")} />
          ) : null}
          <InfoRow icon={<LifeBuoy size={18} />} title="Need help?" body={helpNote ?? "A contact will be shared with your invitation. Private numbers are not listed here."} />
        </div>
      </div>
    </article>
  );
}

function InfoRow({ icon, title, body, action }: { icon: ReactNode; title: string; body: string; action?: ReactNode }) {
  return (
    <section className="flex gap-4 border-t border-[#ded9d0] py-5">
      <span className="mt-0.5 text-[#b6a27a]">{icon}</span>
      <div>
        <h2 className="text-[18px]">{title}</h2>
        <p className="mt-1 max-w-xl text-[15px] leading-relaxed text-[#6d6a64]">{body}</p>
        {action}
      </div>
    </section>
  );
}

function ModifyStay({
  stay,
  onBack,
  onChange,
  onCancel,
}: {
  stay: Reservation;
  onBack: () => void;
  onChange: (input: { checkIn: string; nights: 1 | 2 | 3; adults: number }) => string | null;
  onCancel: () => void;
}) {
  const { data, me, today } = useYacht();
  const profile = normalizePerson(me);
  const cap = Math.min(data.config.maxNights, profile.maxStay) as 1 | 2 | 3;
  const [cursor, setCursor] = useState(ymOf(stay.checkIn));
  const [checkIn, setCheckIn] = useState<string | null>(stay.checkIn);
  const [checkOut, setCheckOut] = useState<string | null>(checkoutDate(stay.checkIn, stay.nights));
  const [adults, setAdults] = useState(stay.adults);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState(false);
  const nights = checkIn && checkOut ? asNightCount(nightsBetween(checkIn, checkOut), cap) : null;
  const applied = stay.complimentaryApplied ?? 0;
  const previewPerson = normalizePerson({ ...profile, complimentaryUsed: Math.max(0, profile.complimentaryUsed - applied) });
  const priced = nights ? priceStay(previewPerson, nights, data.config.nightlyRate) : null;
  const cells = calendarCells(cursor);

  const pick = (iso: string) => {
    if (!checkIn || checkOut) {
      const reason = canCheckIn(data, iso, today, stay.id);
      if (reason) return setError(reason);
      setError(null);
      setCheckIn(iso);
      setCheckOut(null);
      return;
    }
    if (iso <= checkIn) {
      const reason = canCheckIn(data, iso, today, stay.id);
      if (reason) return setError(reason);
      setError(null);
      setCheckIn(iso);
      setCheckOut(null);
      return;
    }
    const count = asNightCount(nightsBetween(checkIn, iso), cap);
    if (!count) return setError(`This invitation can reserve up to ${cap} consecutive night${cap === 1 ? "" : "s"}.`);
    const reason = canStart(data, checkIn, count, today, stay.id);
    if (reason) return setError(reason);
    setError(null);
    setCheckOut(iso);
  };

  return (
    <section className="mx-auto max-w-xl">
      <button type="button" className="text-[12px] tracking-[0.1em] uppercase" onClick={onBack}>Back</button>
      <PageIntro kicker="Plans change" title="Adjust your stay" body="Choose new dates. We'll check availability and update your Privé benefit." />
      <div className="mt-8 grid grid-cols-2 gap-6">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">Check-in</p>
          <p className="mt-1 text-[22px]">{checkIn ? pretty(checkIn, false) : "Select"}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">Checkout</p>
          <p className="mt-1 text-[22px]">{checkOut ? pretty(checkOut, false) : "Select"}</p>
        </div>
      </div>
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <button type="button" className="text-[12px] tracking-[0.08em] uppercase" onClick={() => setCursor(shiftMonth(cursor, -1))}>Previous</button>
          <p className="text-[18px]">{monthLabel(cursor)}</p>
          <button type="button" className="text-[12px] tracking-[0.08em] uppercase" onClick={() => setCursor(shiftMonth(cursor, 1))}>Next</button>
        </div>
        <div className="grid grid-cols-7 text-center text-[11px] font-semibold tracking-[0.12em] text-[#6d6a64]">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={`${d}${i}`} className="py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((cell) => {
            const day = Number(cell.iso.slice(-2));
            const taken = data.reservations.some((r) => r.id !== stay.id && (r.status === "confirmed" || r.status === "pending_approval") && cell.iso >= r.checkIn && cell.iso < checkoutDate(r.checkIn, r.nights));
            return (
              <button key={cell.iso} type="button" disabled={!cell.inMonth} onClick={() => pick(cell.iso)} className="h-11">
                <span className={`mx-auto grid size-9 place-items-center rounded-full text-[15px] ${!cell.inMonth ? "text-transparent" : taken ? "text-[#b0aaa2] line-through" : "text-[#07141d]"}`}>{day}</span>
              </button>
            );
          })}
        </div>
      </div>
      {nights && priced ? (
        <p className="mt-4 text-[15px] text-[#6d6a64]">
          {nights} night{nights === 1 ? "" : "s"} · {priced.complimentaryNights > 0 ? (priced.complimentaryNights === 1 ? "One Complimentary Night" : `${priced.complimentaryNights} Complimentary Nights`) : "Invitation rate"} · {money(priced.amount)}
        </p>
      ) : null}
      <p className="mt-4 text-[13px] text-[#6d6a64]">Guests</p>
      <div className="mt-2 flex gap-2">
        {[1, 2, 3, 4].map((n) => (
          <button key={n} type="button" className={`grid size-11 place-items-center border ${adults === n ? "border-[#07141d] bg-[#07141d] text-white" : "border-[#ded9d0]"}`} onClick={() => setAdults(n)}>{n}</button>
        ))}
      </div>
      {error ? <p className="mt-4 text-[15px] text-[#6d6a64]">{error}</p> : null}
      <button
        type="button"
        className={`${btn} mt-6 w-full`}
        disabled={!checkIn || !nights}
        onClick={() => {
          if (!checkIn || !nights) return;
          setError(onChange({ checkIn, nights, adults }));
        }}
      >
        Update reservation
      </button>
      <div className="mt-10 border-t border-[#ded9d0] pt-6">
        <h2 className="text-[24px]">Plans change</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-[#6d6a64]">If you need to adjust your stay, please let us know at least 48 hours before arrival whenever possible. With that notice, a complimentary night is restored. Inside 48 hours, it stays with the visit. Payment is not collected here, so no refund is promised.</p>
        {plans ? (
          <button type="button" className={`${btnQuiet} mt-5`} onClick={onCancel}>Cancel this reservation</button>
        ) : (
          <button type="button" className="mt-5 text-[13px] tracking-[0.08em] uppercase" onClick={() => setPlans(true)}>Cancel this reservation</button>
        )}
      </div>
    </section>
  );
}

function Bring({ onBack }: { onBack: () => void }) {
  return (
    <section>
      <button type="button" className="text-[12px] tracking-[0.1em] uppercase" onClick={onBack}>Back</button>
      <PageIntro kicker="What to bring" title="Pack light" body="We've taken care of the essentials." />
      <div className="mt-10 grid gap-12 sm:grid-cols-2">
        <div>
          <h2 className="text-[28px]">You may want to bring</h2>
          <ul className="mt-4 space-y-3 text-[16px]">
            {["Comfortable layers", "Personal toiletries", "A phone charger", "Favorite food and beverages"].map((item) => (
              <li key={item} className="border-t border-[#ded9d0] pt-3">{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-[28px]">Waiting for you</h2>
          <ul className="mt-4 space-y-3 text-[16px]">
            {["Fresh bedding", "Towels", "Basic onboard essentials"].map((item) => (
              <li key={item} className="border-t border-[#ded9d0] pt-3">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const SHOTS: Array<{ id: PhotoSlot; title: string; body: string }> = [
  { id: "cabin", title: "Interior photo", body: "The cabin and salon as you leave them." },
  { id: "cockpit", title: "Cockpit photo", body: "The cockpit, ready for the next guest." },
  { id: "overall", title: "Exterior photo", body: "A look along the yacht as you step ashore." },
];

function CheckoutFlow({ submit, onDone }: { submit: (input: { notes: string; damage: string; photos: Record<PhotoSlot, string | null> }) => string | null; onDone: (message: string | null) => void }) {
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<Record<PhotoSlot, string | null>>({ cabin: null, cockpit: null, bridge: null, overall: null });
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const shot = SHOTS[step];
  const finish = () => {
    const next = { ...photos, bridge: photos.cockpit };
    const err = submit({ notes, damage: "", photos: next });
    if (err) {
      setError(err);
      return;
    }
    onDone(null);
  };
  return (
    <section>
      <PageIntro kicker="Before you go" title="Before you go" body="We hope you enjoyed your time aboard. A few quick photos before you leave help us prepare beautifully for our next guest." />
      <p className="mt-6 text-[13px] tracking-[0.12em] text-[#6d6a64] uppercase">{step + 1} of 3</p>
      <h2 className="mt-3 text-[32px]">{shot.title}</h2>
      <p className="mt-2 text-[16px] text-[#6d6a64]">{shot.body}</p>
      <label className="mt-6 block cursor-pointer">
        {photos[shot.id] ? (
          <img src={photos[shot.id] ?? ""} alt="" className="h-56 w-full object-cover" />
        ) : (
          <span className="flex h-56 w-full items-center justify-center border border-[#ded9d0] text-[15px] text-[#6d6a64]">Add a photo</span>
        )}
        <input
          className="sr-only"
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            const url = await fileToDataUrl(file);
            setPhotos((p) => ({ ...p, [shot.id]: url }));
          }}
        />
      </label>
      {step === 2 ? (
        <label className="mt-6 block">
          <span className="text-[13px] text-[#6d6a64]">A note for us, if you like</span>
          <textarea className="field mt-2 min-h-24" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
      ) : null}
      {error ? <p className="mt-4 text-[15px]">{error}</p> : null}
      <div className="mt-6 flex gap-3">
        {step > 0 ? <button type="button" className={btnQuiet} onClick={() => setStep((s) => s - 1)}>Back</button> : null}
        {step < 2 ? (
          <button type="button" className={btn} disabled={!photos[shot.id]} onClick={() => setStep((s) => s + 1)}>Continue</button>
        ) : (
          <button type="button" className={btn} disabled={!photos.cabin || !photos.overall || !photos.cockpit} onClick={finish}>
            Complete checkout
          </button>
        )}
      </div>
    </section>
  );
}

export function GuideScreen() {
  const sections = [
    {
      kicker: "Arriving",
      title: "Welcome aboard",
      body: "Check-in is from 3:00 PM. Checkout is by 11:00 AM. Parking, the marina entrance, and access are shared with your invitation once they are confirmed. They are not listed here until then.",
    },
    {
      kicker: "Aboard",
      title: "Your time aboard",
      body: "The Bay Escape is a private dockside stay. The yacht cannot be operated or moved, and it never leaves the slip.",
      lines: [
        "Please leave the engines, helm, lines, and mooring equipment untouched.",
        "The onboard bathroom is not available. Please use the marina restrooms and showers ashore.",
        "No cooking or open flames aboard. Meals are brought aboard or enjoyed ashore.",
        "The yacht is smoke-free, including vaping.",
        "This is a quiet private stay, not a party or an event.",
        "The Bay Escape is reserved for adult guests.",
        "We're unable to welcome pets aboard.",
        "Alcohol may be enjoyed responsibly while docked, subject to marina rules.",
      ],
    },
    {
      kicker: "Marina facilities",
      title: "Ashore, for your comfort",
      body: "Restrooms and showers are available ashore. During your stay, we kindly ask that you use the marina facilities rather than the onboard bathroom systems.",
    },
    {
      kicker: "Before you go",
      title: "A few quiet minutes",
      body: "A few quick photos before you leave help us prepare beautifully for our next guest. Take your belongings with you. We'll look after the rest.",
    },
  ];
  return (
    <GuestLayout>
      <article className="mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20">
        <PageIntro
          kicker="Stay guide"
          title="A few things to know"
          body="Everything you need for an easy weekend on the Bay."
        />
        <p className="mt-6 max-w-xl text-[16px] leading-[1.7] text-[#6d6a64]">
          The Bay Escape is designed to be simple, relaxing, and easy to enjoy. A few thoughtful guidelines help us keep the yacht beautiful and ready for every CAM Privé guest.
        </p>
        <div className="mt-14 space-y-14">
          {sections.map((section) => (
            <section key={section.title} className="border-t border-[#ded9d0] pt-8">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">{section.kicker}</p>
              <h2 className="mt-3 text-[32px]">{section.title}</h2>
              <p className="mt-4 max-w-xl text-[16px] leading-[1.7] text-[#6d6a64]">{section.body}</p>
              {section.lines ? (
                <ul className="mt-4 max-w-xl space-y-3 text-[16px] leading-[1.6] text-[#07141d]">
                  {section.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </article>
    </GuestLayout>
  );
}

export function ExploreScreen() {
  const rows = [
    ["Marina", "Sierra Point Harbor, Brisbane, California"],
    ["Dock", "Dock 5"],
    ["Slip", "Slip 36"],
    ["Parking", "ADMIN CONFIGURATION REQUIRED"],
    ["Marina entrance", "ADMIN CONFIGURATION REQUIRED"],
    ["Access", "ADMIN CONFIGURATION REQUIRED"],
  ];
  return (
    <GuestLayout>
      <article className="mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20">
        <PageIntro kicker="The Bay Escape" title="Getting here" body="Sierra Point Harbor, Brisbane. The yacht stays at her slip for the whole of your visit." />
        <img src="/yacht/approved/04_EXTERIOR_GALLERY_APPROVED.png" alt="The yacht at Sierra Point Harbor" className="mt-8 aspect-[16/10] w-full object-cover" />
        <dl className="mt-10">
          {rows.map(([k, v]) => (
            <div key={k} className="grid gap-1 border-t border-[#ded9d0] py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
              <dt className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">{k}</dt>
              <dd className="text-[16px]">{v}</dd>
            </div>
          ))}
        </dl>
        <a
          className={`${btn} mt-8`}
          href="https://maps.google.com/?q=Sierra+Point+Harbor+Brisbane+California"
          target="_blank"
          rel="noreferrer"
        >
          Get directions
        </a>
        <section id="facilities" className="mt-16 border-t border-[#ded9d0] pt-8">
          <h2 className="text-[32px]">Marina facilities</h2>
          <p className="mt-4 max-w-xl text-[16px] leading-[1.7] text-[#6d6a64]">
            Restrooms and showers are available ashore for your comfort. During your stay, we kindly ask that you use the marina facilities. A coin laundry and barbecue are on the yacht club grounds. Hours and the way in are confirmed with your invitation.
          </p>
        </section>
        <section className="mt-14 border-t border-[#ded9d0] pt-8">
          <h2 className="text-[32px]">Evenings on the Bay</h2>
          <p className="mt-4 max-w-xl text-[16px] leading-[1.7] text-[#6d6a64]">
            Bring what you'd like to eat, or walk the waterfront. The galley offers a refrigerator, a microwave, and coffee. Cooking stays ashore.
          </p>
        </section>
        <section className="mt-14 border-t border-[#ded9d0] pt-8">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">The Bay Escape</p>
          <h2 className="mt-3 text-[32px]">Make it your escape</h2>
          <p className="mt-4 font-display text-[24px] leading-tight">Stay for a night. Linger a little longer.</p>
          <p className="mt-4 max-w-xl text-[16px] leading-[1.7] text-[#6d6a64]">
            Come aboard for a quiet evening by the water, turn it into a weekend away, or settle in for a little longer. The Bay Escape is available for stays of up to three consecutive nights, subject to availability and your Privé invitation.
          </p>
          <Link to="/book" className={`${btn} mt-8`}>Check availability</Link>
        </section>
      </article>
    </GuestLayout>
  );
}

export function ProfileScreen() {
  const { me } = useYacht();
  const profile = normalizePerson(me);
  if (!me.id) return <AccessGate />;
  if (me.role !== "manager") {
    return (
      <GuestLayout>
        <section className="mx-auto max-w-3xl px-5 py-16"><PageIntro kicker="CAM Privé" title="Your invitation" /></section>
      </GuestLayout>
    );
  }
  const first = me.name.split(" ")[0];
  return (
    <GuestLayout>
      <article className="mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20">
        <PageIntro kicker="You're invited" title={`Welcome to CAM Privé, ${first}.`} />
        <p className="mt-6 max-w-xl text-[16px] leading-[1.7] text-[#6d6a64]">
          We're delighted to extend a personal invitation to experience The Bay Escape. Your invitation includes access to a private waterfront retreat at Sierra Point Harbor.
        </p>
        <h2 className="mt-14 text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">Your Privé benefit</h2>
        <p className="mt-4 text-[36px] leading-[1.05]">{benefitHeadline(profile)}</p>
        {profile.preferredRate > 0 && nightsLeft(profile) > 0 ? (
          <p className="mt-4 max-w-lg text-[16px] leading-[1.7] text-[#6d6a64]">
            Additional nights on this invitation are {money(profile.preferredRate)}. A stay may be up to {profile.maxStay} night{profile.maxStay === 1 ? "" : "s"}.
          </p>
        ) : null}
        <Link to="/book" className={`${btn} mt-10`}>Plan your escape</Link>
      </article>
    </GuestLayout>
  );
}
