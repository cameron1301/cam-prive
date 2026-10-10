import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  CLEAN_STEPS,
  PHOTO_SLOTS,
  STATUS_LABEL,
  checkoutDate,
  money,
  monthBounds,
  nextReservation,
  nightsLeft,
  ownerExceptions,
  GUEST_LABEL,
  normalizePerson,
  personName,
  pretty,
  statsBetween,
  upcomingTurnoverDates,
  yachtStatus,
  type Data,
  type GuestType,
  type Person,
  type PhotoSlot,
  type Severity,
} from "@/lib/yacht/logic";
import { useYacht } from "@/lib/yacht/store";
import { PhotoPick } from "./bits";

export function OwnerHome() {
  const { data, today, decide, resolveIncident } = useYacht();
  const status = yachtStatus(data, today);
  const next = nextReservation(data, today);
  const exceptions = ownerExceptions(data, today);
  const bounds = monthBounds(today.slice(0, 7));
  const month = statsBetween(data, bounds.from, bounds.to, 1);
  const lastClean = data.jobs.find((j) => j.status === "complete");
  const wash = data.maintenance.find((m) => m.kind === "exterior" && !m.completedAt);
  const pending = data.reservations.filter((r) => r.status === "pending_approval");

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl bg-tide text-foam">
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-foam/70">YACHT STATUS</p>
            <h1 className="mt-2 flex items-center gap-3 text-5xl text-foam">
              <span className={`size-3 rounded-full ${status === "ready" ? "bg-ready" : "bg-brass"}`} />
              {STATUS_LABEL[status]}
            </h1>
            <p className="mt-2 max-w-md text-foam/80">
              {exceptions.length
                ? "Only exceptions reach you. Everything else is already running."
                : "Ready for the next guest. Stays, checkout, and Maria’s cleaning run without you."}
            </p>
          </div>
          <img src="/yacht/hero.jpg?v=2" alt="" className="h-28 w-48 rounded-2xl object-cover" />
        </div>
      </section>

      {exceptions.length ? (
        <section className="card p-5">
          <p className="kicker">Needs a decision</p>
          <ul className="mt-3 space-y-2">
            {exceptions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {pending.map((r) => (
        <section key={r.id} className="card p-5">
          <p className="kicker">Additional booking</p>
          <h2 className="mt-2 text-3xl">{personName(data, r.managerId)}</h2>
          <p>
            {pretty(r.checkIn, false)} → {pretty(checkoutDate(r.checkIn, r.nights), false)} · {r.nights} nights · {money(r.amount)}
          </p>
          <p className="text-sm text-muted">{r.adults} adults. Payment is marked pending until you connect a processor. Approving does not charge anyone.</p>
          <div className="mt-4 flex gap-2">
            <button type="button" className="btn btn-tide" onClick={() => decide(r.id, true)}>Approve</button>
            <button type="button" className="btn btn-quiet" onClick={() => decide(r.id, false)}>Decline</button>
          </div>
        </section>
      ))}

      <section className="grid gap-3 sm:grid-cols-2">
        <Fact label="Next reservation" value={next ? `${personName(data, next.managerId)} · ${pretty(next.checkIn, false)}` : "None"} />
        <Fact label="Next check-in" value={next ? `3:00 PM · ${pretty(next.checkIn, false)}` : "—"} />
        <Fact label="Next checkout" value={next ? `11:00 AM · ${pretty(checkoutDate(next.checkIn, next.nights), false)}` : "—"} />
        <Fact label="Last cleaning" value={lastClean?.completedAt ? pretty(lastClean.completedAt.slice(0, 10), false) : "—"} />
        <Fact label="Next exterior wash" value={wash ? pretty(wash.due, false) : "Scheduled"} />
        <Fact label="Open problem" value={exceptions[0] ?? "None"} />
      </section>

      <section className="grid gap-3 lg:grid-cols-3">
        <div className="card p-5">
          <p className="kicker">This month</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between"><span>Nights occupied</span><span>{month.occupied}</span></li>
            <li className="flex justify-between"><span>Complimentary</span><span>{month.complimentary}</span></li>
            <li className="flex justify-between"><span>Paid nights</span><span>{month.paidNights}</span></li>
            <li className="flex justify-between"><span>Paid-stay revenue</span><span>{money(month.revenue)}</span></li>
            <li className="flex justify-between"><span>Cleaning</span><span>{money(month.cleaning)}</span></li>
            <li className="flex justify-between"><span>Maintenance</span><span>{money(month.maintenance)}</span></li>
            <li className="flex justify-between"><span>Slip fee</span><span>{money(month.slip)}</span></li>
            <li className="flex justify-between font-semibold"><span>Net yacht cost</span><span>{money(month.net)}</span></li>
          </ul>
        </div>
        <Utilization today={today} occupied={yearOccupied(data, today)} />
        <div className="card p-5">
          <p className="kicker">Guests</p>
          <p className="mt-2 font-display text-5xl">
            {data.people.filter((p) => p.role === "manager" && p.entitlement === "used").length}
            <span className="text-2xl text-muted"> / {data.people.filter((p) => p.role === "manager").length}</span>
          </p>
          <p className="mt-2 text-sm text-muted">Have used a complimentary night.</p>
        </div>
      </section>

      {data.incidents.filter((i) => !i.resolved).map((i) => (
        <section key={i.id} className="card p-5">
          <p className="kicker">{i.severity}</p>
          <p className="mt-2">{i.description}</p>
          <button type="button" className="btn btn-quiet mt-3" onClick={() => resolveIncident(i.id)}>Mark resolved</button>
        </section>
      ))}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-lg">{value}</p>
    </div>
  );
}

function yearOccupied(data: Data, today: string): number {
  const year = today.slice(0, 4);
  return statsBetween(data, `${year}-01-01`, today, Number(today.slice(5, 7))).occupied;
}

function Utilization({ today, occupied }: { today: string; occupied: number }) {
  const year = Number(today.slice(0, 4));
  const start = Date.UTC(year, 0, 1);
  const [y, m, d] = today.split("-").map(Number);
  const elapsed = Math.round((Date.UTC(y, m - 1, d) - start) / 86400000) + 1;
  const pct = Math.round((occupied / Math.max(1, elapsed)) * 100);
  return (
    <div className="card grid place-items-center p-5 text-center">
      <p className="kicker">Annual utilization</p>
      <p className="mt-3 grid size-28 place-items-center rounded-full border-8 border-tide font-display text-3xl">{pct}%</p>
      <p className="mt-3 text-sm text-muted">{occupied} occupied nights so far in {year}.</p>
    </div>
  );
}

export function Financials() {
  const { data, today } = useYacht();
  const year = Number(today.slice(0, 4));
  const monthIndex = Number(today.slice(5, 7));
  const annual = statsBetween(data, `${year}-01-01`, today, monthIndex);
  const blackoutNights = data.blackouts.filter((b) => b.date >= `${year}-01-01` && b.date <= today).length;
  const dayOfYear = nightsBetweenYearStart(today);
  const available = Math.max(1, dayOfYear - blackoutNights);
  const used = data.people.filter((p) => p.role === "manager" && p.entitlement === "used");
  const unused = data.people.filter((p) => p.role === "manager" && p.eligible && p.entitlement === "available");
  const operating = annual.cleaning + annual.maintenance + annual.slip;
  const perNight = annual.occupied ? operating / annual.occupied : null;
  const pct = available ? Math.round((annual.occupied / available) * 100) : 0;

  return (
    <div className="space-y-5">
      <div>
        <p className="kicker">{year}</p>
        <h1 className="mt-2 text-5xl">Is the yacht earning its keep?</h1>
        <p className="mt-3 max-w-xl text-lg">
          The slip fee is spent either way. Guest nights put the yacht to use. Paid nights are the money that comes back.
        </p>
      </div>
      <section className="card p-5">
        <p className="text-sm text-muted">Utilization</p>
        <p className="font-display text-6xl">{pct}%</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-tide-soft">
          <div className="h-full bg-tide" style={{ width: `${Math.min(100, pct)}%` }} />
        </div>
        <p className="mt-2 text-sm text-muted">{annual.occupied} occupied nights of {available} available.</p>
      </section>
      <section className="grid gap-3 sm:grid-cols-2">
        <Fact label="Guests who have used a complimentary night" value={String(used.length)} />
        <Fact label="Guests with complimentary nights left" value={String(unused.length)} />
        <Fact label="Complimentary nights" value={String(annual.complimentary)} />
        <Fact label="Paid nights" value={String(annual.paidNights)} />
        <Fact label="Paid-stay revenue" value={money(annual.revenue)} />
        <Fact label="Cleaning" value={money(annual.cleaning)} />
        <Fact label="Slip, year to date" value={money(annual.slip)} />
        <Fact label="Maintenance" value={money(annual.maintenance)} />
        <Fact label="Operating cost" value={money(operating)} />
        <Fact label="Cost recovered" value={money(annual.revenue)} />
        <Fact label="Net owner cost" value={money(annual.net)} />
        <Fact label="Cost per utilized night" value={perNight === null ? "—" : money(Math.round(perNight))} />
      </section>
    </div>
  );
}

function nightsBetweenYearStart(today: string): number {
  const year = Number(today.slice(0, 4));
  const start = Date.UTC(year, 0, 1);
  const [y, m, d] = today.split("-").map(Number);
  const now = Date.UTC(y, m - 1, d);
  return Math.round((now - start) / 86400000) + 1;
}

export function AdminBookings() {
  const { data, today, decide, cancelStay } = useYacht();
  const rows = [...data.reservations].sort((a, b) => (a.checkIn < b.checkIn ? 1 : -1));
  return (
    <div className="space-y-4">
      <div>
        <p className="kicker">Bookings</p>
        <h1 className="mt-2 text-4xl">The book</h1>
        <p className="text-muted">Names stay on this side of the door. The guest calendar never shows them.</p>
      </div>
      {rows.map((r) => (
        <article key={r.id} className="card p-5">
          <p className="kicker">{r.status.replaceAll("_", " ")}</p>
          <h2 className="mt-1 text-2xl">{personName(data, r.managerId)}</h2>
          <p>
            {pretty(r.checkIn, false)} → {pretty(checkoutDate(r.checkIn, r.nights), false)} · {r.adults} adults · {r.kind} · {money(r.amount)}
          </p>
          <p className="text-sm text-muted">
            Rules {r.rulesVersion ?? "—"} {r.rulesAcceptedAt ? `accepted ${r.rulesAcceptedAt.slice(0, 16).replace("T", " ")}` : ""}
          </p>
          {r.checkout ? <p className="mt-2 text-sm">Checkout notes: {r.checkout.notes || "None."} {r.checkout.damage ? `Damage: ${r.checkout.damage}` : ""}</p> : null}
          {r.checkout ? (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {PHOTO_SLOTS.map((slot) =>
                r.checkout?.photos[slot.id] ? (
                  <img key={slot.id} src={r.checkout.photos[slot.id] ?? ""} alt={slot.label} className="aspect-video w-full rounded-2xl object-cover" />
                ) : (
                  <p key={slot.id} className="rounded-2xl bg-tide-soft px-3 py-6 text-center text-sm text-tide">{slot.label} not uploaded</p>
                ),
              )}
            </div>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            {r.status === "pending_approval" ? (
              <>
                <button type="button" className="btn btn-tide" onClick={() => decide(r.id, true)}>Approve</button>
                <button type="button" className="btn btn-quiet" onClick={() => decide(r.id, false)}>Decline</button>
              </>
            ) : null}
            {r.status === "confirmed" || r.status === "pending_approval" ? (
              <button type="button" className="btn btn-quiet" onClick={() => cancelStay(r.id)}>Cancel</button>
            ) : null}
          </div>
        </article>
      ))}
      <p className="text-sm text-muted">Today is {pretty(today)}. A night is taken from check-in until the morning of checkout.</p>
    </div>
  );
}

const GUEST_TYPES: GuestType[] = ["manager", "team", "client", "district", "partner", "friend", "vip", "guest"];

function GuestEditor({ person }: { person: Person }) {
  const { data, today, updateGuest, setView } = useYacht();
  const p = normalizePerson(person);
  const [form, setForm] = useState({
    name: p.name,
    email: p.email,
    phone: p.phone,
    guestType: p.guestType,
    eligible: p.eligible,
    complimentaryPerYear: String(p.complimentaryPerYear),
    complimentaryUsed: String(p.complimentaryUsed),
    preferredRate: String(p.preferredRate),
    maxStay: String(p.maxStay),
    benefitExpires: p.benefitExpires,
    benefitStarts: p.benefitStarts,
    specialBenefit: p.specialBenefit,
    notes: p.notes,
  });
  useEffect(() => {
    const n = normalizePerson(person);
    setForm({
      name: n.name,
      email: n.email,
      phone: n.phone,
      guestType: n.guestType,
      eligible: n.eligible,
      complimentaryPerYear: String(n.complimentaryPerYear),
      complimentaryUsed: String(n.complimentaryUsed),
      preferredRate: String(n.preferredRate),
      maxStay: String(n.maxStay),
      benefitExpires: n.benefitExpires,
      benefitStarts: n.benefitStarts,
      specialBenefit: n.specialBenefit,
      notes: n.notes,
    });
  }, [person]);

  const upcoming = data.reservations.find(
    (r) => r.managerId === p.id && (r.status === "confirmed" || r.status === "pending_approval") && checkoutDate(r.checkIn, r.nights) >= today,
  );
  const last = data.reservations.find((r) => r.managerId === p.id && r.status === "checked_out");

  return (
    <article className="card p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl">{p.name}</h2>
          <p className="text-sm text-muted">{GUEST_LABEL[p.guestType]} · {nightsLeft(p)} complimentary night{nightsLeft(p) === 1 ? "" : "s"} left</p>
        </div>
        <button type="button" className="btn btn-quiet" onClick={() => setView(p.id)}>Open their invitation</button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">Name<input className="field mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label className="block text-sm">Guest type
          <select className="field mt-1" value={form.guestType} onChange={(e) => setForm({ ...form, guestType: e.target.value as GuestType })}>
            {GUEST_TYPES.map((t) => <option key={t} value={t}>{GUEST_LABEL[t]}</option>)}
          </select>
        </label>
        <label className="block text-sm">Email<input className="field mt-1" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label className="block text-sm">Phone<input className="field mt-1" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
        <label className="block text-sm">Complimentary nights / year<input className="field mt-1" inputMode="numeric" value={form.complimentaryPerYear} onChange={(e) => setForm({ ...form, complimentaryPerYear: e.target.value })} /></label>
        <label className="block text-sm">Complimentary nights used<input className="field mt-1" inputMode="numeric" value={form.complimentaryUsed} onChange={(e) => setForm({ ...form, complimentaryUsed: e.target.value })} /></label>
        <label className="block text-sm">Preferred nightly rate<input className="field mt-1" inputMode="numeric" value={form.preferredRate} onChange={(e) => setForm({ ...form, preferredRate: e.target.value })} /></label>
        <label className="block text-sm">Maximum stay<input className="field mt-1" inputMode="numeric" value={form.maxStay} onChange={(e) => setForm({ ...form, maxStay: e.target.value })} /></label>
        <label className="block text-sm">Invitation opens<input className="field mt-1" type="date" value={form.benefitStarts} onChange={(e) => setForm({ ...form, benefitStarts: e.target.value })} /></label>
        <label className="block text-sm">Invitation expires<input className="field mt-1" type="date" value={form.benefitExpires} onChange={(e) => setForm({ ...form, benefitExpires: e.target.value })} /></label>
        <label className="block text-sm sm:col-span-2">Special benefit<input className="field mt-1" value={form.specialBenefit} onChange={(e) => setForm({ ...form, specialBenefit: e.target.value })} placeholder="Shown instead of the standard benefit, if set" /></label>
        <label className="flex items-center gap-2 text-sm sm:mt-7">
          <input type="checkbox" checked={form.eligible} onChange={(e) => setForm({ ...form, eligible: e.target.checked })} />
          Booking enabled
        </label>
        <label className="block text-sm sm:col-span-2">Notes<textarea className="field mt-1 min-h-20" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
      </div>
      <p className="mt-3 text-sm">Private invitation: /i/{p.inviteCode}</p>
      <p className="mt-1 text-sm text-muted">
        {upcoming ? `Upcoming ${pretty(upcoming.checkIn, false)}` : "No upcoming stay"}
        {last ? ` · Last stay ${pretty(last.checkIn, false)}` : ""}
      </p>
      <button
        type="button"
        className="btn btn-tide mt-4"
        onClick={() =>
          updateGuest(p.id, {
            name: form.name.trim() || p.name,
            email: form.email.trim(),
            phone: form.phone.trim(),
            guestType: form.guestType,
            eligible: form.eligible,
            complimentaryPerYear: Number(form.complimentaryPerYear) || 0,
            complimentaryUsed: Number(form.complimentaryUsed) || 0,
            preferredRate: Number(form.preferredRate) || 0,
            maxStay: Math.min(3, Math.max(1, Number(form.maxStay) || 1)),
            benefitExpires: form.benefitExpires,
            benefitStarts: form.benefitStarts,
            specialBenefit: form.specialBenefit,
            notes: form.notes,
          })
        }
      >
        Save invitation
      </button>
    </article>
  );
}

export function OperationsScreen() {
  const { data, today } = useYacht();
  const status = yachtStatus(data, today);
  const next = nextReservation(data, today);
  return (
    <div className="space-y-6">
      <div>
        <p className="kicker">Operations</p>
        <h1 className="mt-2 text-4xl">The Bay Escape</h1>
        <p className="mt-2 text-muted">Yacht status: {STATUS_LABEL[status]}. Guests never see this desk.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/clean" className="card p-5 no-underline">
          <p className="kicker">Cleaning</p>
          <p className="mt-2 text-2xl">Maria</p>
          <p className="mt-2 text-sm text-muted">{next ? `Next arrival ${pretty(next.checkIn, false)} at 3:00 PM` : "No upcoming arrival"}</p>
        </Link>
        <Link to="/maintenance" className="card p-5 no-underline">
          <p className="kicker">Maintenance</p>
          <p className="mt-2 text-2xl">Holds and exterior</p>
          <p className="mt-2 text-sm text-muted">Bird droppings, blackout dates, and the monthly wash.</p>
        </Link>
      </div>
    </div>
  );
}

export function PeopleScreen() {
  const { data } = useYacht();
  const guests = data.people.filter((p) => p.role === "manager");
  return (
    <div className="space-y-4">
      <div>
        <p className="kicker">CAM Privé</p>
        <h1 className="mt-2 text-4xl">Guests</h1>
        <p className="mt-2 max-w-xl text-muted">Each invitation has its own complimentary nights, rate, and maximum stay. Guests only see “Your Privé benefit.”</p>
      </div>
      {guests.map((p) => (
        <GuestEditor key={p.id} person={p} />
      ))}
    </div>
  );
}

export function CleanScreen() {
  const { data, today, startCleaning, toggleCheck, finishCleaning, reportProblem } = useYacht();
  const job = data.jobs.find((j) => j.status !== "complete");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [problem, setProblem] = useState("");
  const [severity, setSeverity] = useState<Severity>("minor");
  const [photo, setPhoto] = useState<string | null>(null);
  const [shots, setShots] = useState<Partial<Record<PhotoSlot, string>>>({});
  const stay = job ? data.reservations.find((r) => r.id === job.reservationId) : undefined;
  const sms = data.sms[0];
  const turnovers = upcomingTurnoverDates(data, today);

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <section className="rounded-3xl bg-ready p-5 text-foam">
        <p className="text-2xl font-semibold">Maria</p>
        <p className="text-sm text-foam/85">{sms ? "Text notification is drafted. It is not sent until a number is configured." : "No open text."}</p>
      </section>
      {turnovers.length ? (
        <section className="card p-5">
          <p className="kicker">Same-day turnover</p>
          <h2 className="mt-2 text-2xl">Priority clean</h2>
          <p className="mt-2 text-sm text-muted">
            Checkout is 11:00 AM and the next check-in is 3:00 PM on {turnovers.map((d) => pretty(d, false)).join(", ")}. Mark the yacht ready before 3:00 PM. If it will not be ready, this needs owner attention.
          </p>
        </section>
      ) : null}
      {job ? (
        <section className="card p-5">
          <p className="kicker">New cleaning job</p>
          <h1 className="mt-2 text-3xl">{job.status === "required" ? "Cleaning required" : "Cleaning in progress"}</h1>
          <p className="mt-1">Sierra Point Harbor · Dock 5 · Slip 36</p>
          {stay?.checkout ? <p className="mt-2 text-sm">Guest checkout: {new Date(stay.checkout.at).toLocaleString()}</p> : <p className="mt-2 text-sm">Checkout by 11:00 AM</p>}
          <p className="text-sm text-muted">{nextReservation(data, today) ? `Next guest arrival: ${pretty(nextReservation(data, today)!.checkIn, false)} at 3:00 PM` : "No arrival after this clean."}</p>
          <p className="mt-2 text-sm text-muted">Internal cleaning cost {money(data.config.cleaningCost)}. Optional tip $20 via Zelle is tracked here only. Guests never see payment details.</p>
        </section>
      ) : (
        <h1 className="text-4xl">Nothing to clean</h1>
      )}
      {sms ? (
        <section className="card p-5">
          <p className="kicker">Text that would go to Maria</p>
          <p className="mt-2 whitespace-pre-wrap text-sm">{sms.body}</p>
          <p className="mt-2 text-sm text-brass-ink">Phone number: ADMIN CONFIGURATION REQUIRED. Nothing is sent until you add it.</p>
        </section>
      ) : null}
      {job ? (
        <>
          <div className="grid gap-2">
            {job.status === "required" ? (
              <button type="button" className="btn btn-ready min-h-16 text-lg" onClick={() => startCleaning(job.id)}>Start cleaning</button>
            ) : (
              <p className="card px-4 py-3">Cleaning in progress</p>
            )}
            <button
              type="button"
              className="btn btn-quiet min-h-16"
              onClick={() => {
                if (!problem.trim()) {
                  setError("Add a short description.");
                  return;
                }
                reportProblem({ severity, description: problem.trim(), photo, reservationId: job.reservationId });
                setProblem("");
                setError("Cameron is told only if this is more than minor.");
              }}
            >
              Report problem
            </button>
            <button
              type="button"
              className="btn btn-tide min-h-16 text-lg"
              onClick={() => setError(finishCleaning(job.id, notes))}
            >
              Complete cleaning
            </button>
          </div>
          <ul className="card divide-y divide-line">
            {CLEAN_STEPS.map((step) => (
              <li key={step.id}>
                <button
                  type="button"
                  className="flex min-h-14 w-full items-center justify-between gap-3 px-4 text-left"
                  onClick={() => toggleCheck(job.id, step.id)}
                >
                  <span>{step.label}</span>
                  <span className={`grid size-6 place-items-center rounded-full text-xs text-foam ${job.checks[step.id] ? "bg-ready" : "bg-line text-transparent"}`}>✓</span>
                </button>
              </li>
            ))}
          </ul>
          <label className="block">
            <span className="text-sm text-muted">Note</span>
            <textarea className="field mt-1 min-h-20" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            {PHOTO_SLOTS.map((slot) => (
              <PhotoPick
                key={slot.id}
                label={slot.label}
                value={shots[slot.id] ?? null}
                onPick={(url) => setShots((s) => ({ ...s, [slot.id]: url }))}
              />
            ))}
          </div>
          <div className="card space-y-3 p-5">
            <p className="font-medium">Problem</p>
            <div className="flex flex-wrap gap-2">
              {(["minor", "attention", "urgent"] as const).map((s) => (
                <button key={s} type="button" className={`btn ${severity === s ? "btn-tide" : "btn-quiet"}`} onClick={() => setSeverity(s)}>
                  {s === "attention" ? "Needs attention" : s[0].toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <textarea className="field min-h-20" value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="Short description" />
            <PhotoPick label="Problem photo" value={photo} onPick={setPhoto} />
          </div>
          {error ? <p>{error}</p> : null}
        </>
      ) : (
        <p className="card p-5">When a guest submits checkout, this page fills itself and a text is drafted for you. Bird droppings on the command bridge are a checklist line, not a call to Cameron.</p>
      )}
    </div>
  );
}

export function MaintenanceScreen() {
  const { data, completeExterior, addBlackout, removeBlackout } = useYacht();
  const [notes, setNotes] = useState("Command bridge, bird droppings, deck, cockpit, exterior.");
  const [cost, setCost] = useState("0");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("Owner hold");
  const open = data.maintenance.find((m) => m.kind === "exterior" && !m.completedAt);
  const past = data.maintenance.filter((m) => m.completedAt);

  return (
    <div className="space-y-5">
      <div>
        <p className="kicker">Maintenance</p>
        <h1 className="mt-2 text-4xl">Monthly exterior wash</h1>
        <p className="text-muted">At least once a month, bookings or not. Command bridge and bird droppings come first.</p>
      </div>
      <section className="card p-5">
        <p className="kicker">Next due</p>
        <p className="mt-2 font-display text-4xl">{open ? pretty(open.due, false) : "Set"}</p>
        <p className="mt-2 text-sm text-muted">{open?.notes}</p>
        <label className="mt-4 block text-sm text-muted">
          Notes
          <textarea className="field mt-1 min-h-20" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        <label className="mt-3 block text-sm text-muted">
          Cost
          <input className="field mt-1" inputMode="numeric" value={cost} onChange={(e) => setCost(e.target.value)} />
        </label>
        <button type="button" className="btn btn-tide mt-4" onClick={() => completeExterior(notes, Number(cost) || 0)}>
          Mark exterior wash done
        </button>
      </section>
      {past.map((m) => (
        <p key={m.id} className="text-sm text-muted">Last recorded {m.completedAt?.slice(0, 10)} · {money(m.cost)} · {m.notes}</p>
      ))}
      <section className="card p-5">
        <h2 className="text-2xl">Block a date</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <input className="field max-w-48" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <input className="field max-w-xs" value={reason} onChange={(e) => setReason(e.target.value)} />
          <button type="button" className="btn btn-quiet" onClick={() => date && addBlackout(date, reason)}>Block</button>
        </div>
        <ul className="mt-4 space-y-2">
          {data.blackouts.map((b) => (
            <li key={b.id} className="flex items-center justify-between gap-3">
              <span>{pretty(b.date, false)} — {b.reason}</span>
              <button type="button" className="btn btn-ghost" onClick={() => removeBlackout(b.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export function SettingsScreen() {
  const { data, updateConfig, updateGuide } = useYacht();
  const c = data.config;
  const field = (key: keyof typeof c, label: string) => (
    <label key={key} className="block">
      <span className="text-sm text-muted">{label}</span>
      {typeof c[key] === "number" ? (
        <input
          className="field mt-1"
          inputMode="numeric"
          defaultValue={String(c[key])}
          onBlur={(e) => updateConfig({ [key]: Number(e.target.value) || 0 })}
        />
      ) : (
        <textarea
          className="field mt-1 min-h-24"
          defaultValue={String(c[key])}
          onBlur={(e) => updateConfig({ [key]: e.target.value })}
        />
      )}
    </label>
  );

  return (
    <div className="space-y-5">
      <div>
        <p className="kicker">Settings</p>
        <h1 className="mt-2 text-4xl">Fill in what only you know</h1>
        <p className="text-muted">Blank fields stay labeled until you replace them. Do not put a Zelle address here until you mean guests to see it.</p>
      </div>
      <form className="card space-y-4 p-5" onSubmit={(e) => e.preventDefault()}>
        {field("access", "Access instructions")}
        {field("parking", "Parking")}
        {field("shore", "Shore restroom and shower")}
        {field("wifi", "Wi-Fi")}
        {field("emergency", "Emergency contact")}
        {field("zelle", "Tip instructions")}
        {field("nightlyRate", "Extra night price")}
        {field("cleaningCost", "Cleaning cost")}
        {field("slipMonthly", "Monthly slip fee")}
      </form>
      <form className="card space-y-4 p-5" onSubmit={(e) => e.preventDefault()}>
        <h2 className="text-2xl">Guide copy</h2>
        <label className="block">
          <span className="text-sm text-muted">Hero</span>
          <textarea className="field mt-1 min-h-24" defaultValue={data.guide.heroBody} onBlur={(e) => updateGuide({ heroBody: e.target.value })} />
        </label>
        {data.guide.activities.map((a) => (
          <label key={a.id} className="block">
            <span className="text-sm text-muted">{a.title} {a.verified ? "" : "· unverified"}</span>
            <textarea
              className="field mt-1 min-h-24"
              defaultValue={a.body}
              onBlur={(e) =>
                updateGuide({
                  activities: data.guide.activities.map((item) => (item.id === a.id ? { ...item, body: e.target.value } : item)),
                })
              }
            />
          </label>
        ))}
      </form>
      <section className="card p-5">
        <h2 className="text-2xl">Recent record</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {data.audit.slice(0, 8).map((a) => (
            <li key={a.id}>
              <span className="text-muted">{a.actor} · </span>
              {a.action}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
