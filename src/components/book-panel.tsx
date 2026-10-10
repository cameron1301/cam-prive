import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { bookStay, cancelStay, leaveStay } from "@/lib/slip/api";
import { BERTH, PLACE } from "@/lib/slip/brand";
import {
  CHECK_IN_LABEL,
  CHECK_OUT_LABEL,
  checkoutDate,
  prettyDate,
  sleepNights,
} from "@/lib/slip/time";
import type { HarborReady, Stay } from "@/lib/slip/types";
import { MonthBoard } from "./calendar";
import { useAction, useGate } from "./harbor";
import { LoadingBlock, SignInPrompt } from "./sign-in-prompt";

export function BookPage() {
  const gate = useGate();
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 pb-20">
      <h1 className="font-display text-5xl">Book a stay</h1>
      <p className="mt-3 max-w-prose text-muted">
        One night or two. Aboard at {CHECK_IN_LABEL}, off by {CHECK_OUT_LABEL}. The boat does not leave {BERTH}.
      </p>
      <div className="mt-8">
        {gate.status === "loading" ? <LoadingBlock label="Loading your stay." /> : null}
        {gate.status === "error" ? <p className="text-rust">{gate.error}</p> : null}
        {gate.status === "signedout" ? <SignInPrompt callbackURL="/book" /> : null}
        {gate.status === "ready" && !gate.harbor.officeClaimed ? (
          <p>
            The harbor office isn't claimed yet.{" "}
            <Link to="/" className="font-medium text-kelp">
              Claim it from the weekend page
            </Link>{" "}
            if this is your boat.
          </p>
        ) : null}
        {gate.status === "ready" && gate.harbor.officeClaimed ? (
          <BookReady harbor={gate.harbor} refresh={gate.refresh} />
        ) : null}
      </div>
    </div>
  );
}

function BookReady({ harbor, refresh }: { harbor: HarborReady; refresh: () => Promise<void> }) {
  const active = harbor.stays.find((stay) => stay.mine && stay.phase !== "closed");
  const past = harbor.stays.filter((stay) => stay.mine && stay.phase === "closed");

  return (
    <div className="grid gap-10">
      {active ? <Pass stay={active} harbor={harbor} refresh={refresh} /> : null}
      {!active && harbor.book.allowed ? <Picker harbor={harbor} refresh={refresh} /> : null}
      {!active && !harbor.book.allowed ? (
        <div className="panel">
          <p>{harbor.book.reason}</p>
          {harbor.me.role === "owner" ? (
            <p className="mt-4">
              <Link to="/" className="btn">
                Open the harbor office
              </Link>
            </p>
          ) : null}
        </div>
      ) : null}
      {past.length > 0 ? (
        <section>
          <h2 className="font-display text-2xl">Finished</h2>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {past.map((stay) => (
              <li key={stay.id} className="py-3 text-sm text-muted">
                {prettyDate(stay.checkIn)} to {prettyDate(checkoutDate(stay.checkIn, stay.nights))}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function Pass({
  stay,
  harbor,
  refresh,
}: {
  stay: Stay;
  harbor: HarborReady;
  refresh: () => Promise<void>;
}) {
  const { error, pending, run } = useAction(refresh);
  const out = checkoutDate(stay.checkIn, stay.nights);
  const washMorning = harbor.washes.includes(stay.checkIn);

  return (
    <article className="panel">
      <p className="text-sm font-medium text-kelp">
        {stay.phase === "upcoming" ? "Your pass" : stay.phase === "aboard" ? "You're aboard" : stay.phase === "wash" ? "With Maria" : "Finished"}
      </p>
      <h2 className="mt-2 font-display text-4xl">
        {prettyDate(stay.checkIn)}
        <span className="text-muted"> to </span>
        {prettyDate(out)}
      </h2>
      <p className="mt-3">
        Aboard {CHECK_IN_LABEL}. Off the boat by {CHECK_OUT_LABEL}. {stay.partySize} aboard. {PLACE}, {BERTH}.
      </p>
      {stay.note ? <p className="mt-3 text-muted">{stay.note}</p> : null}
      {harbor.gateNote ? <p className="mt-4 text-sm">{harbor.gateNote}</p> : null}
      {washMorning && stay.phase === "upcoming" ? (
        <p className="mt-4 text-sm text-muted">
          Maria washes the bridge that morning. Plan to board at {CHECK_IN_LABEL}, after she signs the boat ready. If it runs long, wait on the green.
        </p>
      ) : null}
      {stay.phase === "wash" ? (
        <p className="mt-4">
          {harbor.deskName} has the list. The command bridge is first. You don't need to do anything else.
        </p>
      ) : null}
      <ul className="mt-5 grid gap-2 text-sm text-muted">
        <li>Lines stay on. Engines stay off.</li>
        <li>No cooking aboard. Barbecue on the marina green.</li>
        <li>Head and shower are closed. Yacht club showers and coin laundry are ashore.</li>
        <li>Bring bedding and towels, and take them with you.</li>
      </ul>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {stay.canLeave ? (
          <button type="button" className="btn" disabled={pending} onClick={() => void run(leaveStay({ data: { id: stay.id } }))}>
            {pending ? "Sending…" : "We've left"}
          </button>
        ) : null}
        {stay.canCancel ? (
          <button
            type="button"
            className="btn btn-quiet"
            disabled={pending}
            onClick={() => void run(cancelStay({ data: { id: stay.id } }))}
          >
            Cancel this stay
          </button>
        ) : null}
      </div>
      {stay.canLeave ? (
        <p className="mt-3 text-sm text-muted">Leaving early opens {harbor.deskName}'s list now, instead of at 10:00.</p>
      ) : null}
      {error ? (
        <p className="mt-3 text-sm text-rust" role="alert">
          {error}
        </p>
      ) : null}
    </article>
  );
}

const AGREEMENTS = [
  ["agreeTied", "She stays tied. I will not untie the boat or run the engines."],
  ["agreeCold", "I will not cook, or use a stove, grill, or hot plate, on the boat."],
  ["agreeHead", "I understand the head and shower are closed. Showers are at the yacht club ashore."],
  ["agreeOut", "I will be off by 10:00 am with my bedding, towels, and trash."],
] as const;

function Picker({ harbor, refresh }: { harbor: HarborReady; refresh: () => Promise<void> }) {
  const { error, pending, run, setError } = useAction(refresh);
  const [arrival, setArrival] = useState<string | null>(null);
  const [nights, setNights] = useState<1 | 2>(2);
  const [party, setParty] = useState(2);
  const [note, setNote] = useState("");
  const [agree, setAgree] = useState({ agreeTied: false, agreeCold: false, agreeHead: false, agreeOut: false });

  const mine = useMemo(
    () => harbor.stays.filter((stay) => stay.mine && stay.phase !== "closed").flatMap((stay) => sleepNights(stay.checkIn, stay.nights)),
    [harbor.stays],
  );

  function blocked(day: string, count: 1 | 2) {
    return sleepNights(day, count).some(
      (night) => harbor.taken.includes(night) || harbor.blackouts.includes(night) || night < harbor.minCheckIn || night > harbor.maxCheckIn,
    );
  }

  function pick(day: string) {
    if (blocked(day, 1)) {
      setError("That night is already held.");
      return;
    }
    setError(null);
    setArrival(day);
    setNights(blocked(day, 2) ? 1 : 2);
  }

  const highlight = arrival ? sleepNights(arrival, nights) : [];
  const ready = Boolean(arrival) && agree.agreeTied && agree.agreeCold && agree.agreeHead && agree.agreeOut;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.3fr_0.9fr]">
      <MonthBoard
        taken={harbor.taken}
        blackouts={harbor.blackouts}
        washes={harbor.washes}
        mine={mine}
        highlight={highlight}
        canPick={(day) => !blocked(day, 1)}
        onPick={pick}
      />
      <form
        className="panel"
        onSubmit={(event) => {
          event.preventDefault();
          if (!arrival) return;
          void run(
            bookStay({
              data: {
                checkIn: arrival,
                nights,
                partySize: party,
                note,
                ...agree,
              },
            }),
          );
        }}
      >
        <h2 className="font-display text-3xl">{arrival ? prettyDate(arrival) : "Choose an arrival day"}</h2>
        {arrival ? (
          <p className="mt-2 text-sm text-muted">
            Off {prettyDate(checkoutDate(arrival, nights))} at {CHECK_OUT_LABEL}.
            {harbor.washes.includes(arrival) ? " Maria washes the bridge that morning before you board." : ""}
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted">Then choose one night or two. {harbor.me.remaining === 1 ? "You have one stay." : `You have ${harbor.me.remaining} stays.`}</p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-2">
          {([1, 2] as const).map((count) => {
            const disabled = !arrival || blocked(arrival, count);
            const selected = nights === count;
            return (
              <button
                key={count}
                type="button"
                className={selected ? "btn" : "btn btn-quiet"}
                disabled={disabled}
                onClick={() => setNights(count)}
              >
                {count === 1 ? "One night" : "Two nights"}
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium">Overnight party</p>
          <div className="mt-2 flex items-center gap-3">
            <button type="button" className="btn btn-quiet size-11 px-0" onClick={() => setParty((value) => Math.max(1, value - 1))} aria-label="Fewer people">
              −
            </button>
            <span className="min-w-8 text-center tabular-nums">{party}</span>
            <button
              type="button"
              className="btn btn-quiet size-11 px-0"
              onClick={() => setParty((value) => Math.min(harbor.partyMax, value + 1))}
              aria-label="More people"
            >
              +
            </button>
            <span className="text-sm text-muted">{harbor.partyMax} at most</span>
          </div>
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-medium">Note for Maria</span>
          <textarea
            className="field mt-2 min-h-24"
            maxLength={240}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Two of us, arriving after work"
          />
        </label>

        <fieldset className="mt-5 grid gap-3">
          <legend className="text-sm font-medium">House rules</legend>
          {AGREEMENTS.map(([key, label]) => (
            <label key={key} className="flex min-h-11 items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1 size-5 accent-kelp"
                checked={agree[key]}
                onChange={(event) => setAgree((current) => ({ ...current, [key]: event.target.checked }))}
              />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>

        <button className="btn mt-6 w-full" type="submit" disabled={!ready || pending}>
          {pending ? "Holding…" : "Hold this stay"}
        </button>
        {error ? (
          <p className="mt-3 text-sm text-rust" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  );
}
