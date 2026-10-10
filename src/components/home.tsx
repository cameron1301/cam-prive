import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { claimOffice, getBoard } from "@/lib/slip/api";
import {
  ADDRESS,
  BERTH,
  BOAT,
  BOAT_LINE,
  HARBOR_PHONE,
  HARBOR_PHONE_HREF,
  PLACE,
} from "@/lib/slip/brand";
import { CHECK_IN_LABEL, CHECK_OUT_LABEL, prettyDate } from "@/lib/slip/time";
import type { Board } from "@/lib/slip/types";
import { MonthBoard } from "./calendar";
import { useAction, useHarbor } from "./harbor";

const RULES = [
  {
    label: "Tied up",
    text: "She stays at slip 36. This perk is a night aboard, not a cruise and not a charter. Lines stay on. Engines stay off.",
  },
  {
    label: "Cold galley",
    text: "No stove, no grill, no hot plate, no skillet. A cold picnic is fine. Anything that cooks happens on the marina green.",
  },
  {
    label: "Head closed",
    text: "The onboard head and shower are out of service. Showers, and a paid coin laundry, are at the yacht club facility ashore.",
  },
  {
    label: "Off by 10",
    text: "Checkout is 10:00 am. Take your bedding, towels, and trash. The bridge gets washed after you, starting at the top.",
  },
];

const PLAN = [
  {
    when: "Friday, 3:00 pm",
    text: "Arrive, bags below, then a walk on the promenade before the wind comes up. The gate is keyed. Parking at the marina is free.",
  },
  {
    when: "Friday dusk",
    text: "Brisbane Pier is at the northeast end of the point, a short public pier, open all night. Fish it for the usual south-bay mix — smelt, perch, bass — and stay for the company. No license is required when you fish from that public pier. The slip is not the pier: fishing from the private dock is a different set of rules. There is no bait shop, no snack bar, and no light on the pier. Bring tackle, and a layer.",
  },
  {
    when: "Saturday",
    text: "The marina green is the kitchen: picnic tables, barbecues, shade. Cook there. If you need a shower or the coin laundry, both are at the yacht club ashore. The Bay Trail runs along the promenade if you want a longer flat walk. San Bruno Mountain is a short drive when the dock feels small and you want the ridge over the bay.",
  },
  {
    when: "Saturday night",
    text: "Back aboard. Eat what you already cooked. The command bridge is for sitting, not for snacks — gulls live up there. Sierra Point is open to the bay and under the SFO approach. It is a wide view and a busy sky, not a quiet cove.",
  },
  {
    when: "Sunday, 10:00 am",
    text: "Off the boat. Maria starts with the command bridge, because that is where the birds always land. You are not asked to scrub it. You are asked to be gone, and to leave no food.",
  },
];

export function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-5 pb-20">
      <Hero />
      <Claim />
      <Cue />
      <section className="mt-12">
        <dl className="clip grid gap-px bg-line sm:grid-cols-3">
          <Fact term="Check in" detail={CHECK_IN_LABEL} />
          <Fact term="Be off" detail={CHECK_OUT_LABEL} />
          <Fact term="A manager's perk" detail="One stay" />
        </dl>
        <p className="mt-4 max-w-prose text-sm text-muted">
          One stay, not one night. Use it as a single night or a two-night weekend. The office can grant another later. Four people overnight, unless the office sets a different cap.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-4xl">House rules</h2>
        <p className="mt-3 max-w-prose text-muted">
          They are short because the boat is small, the head is closed, and the gulls are reliable.
        </p>
        <ol className="mt-6 divide-y divide-line border-y border-line">
          {RULES.map((rule) => (
            <li key={rule.label} className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <p className="text-sm font-medium text-kelp">{rule.label}</p>
              <p>{rule.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-4xl">After you leave</h2>
        <p className="mt-3 max-w-prose">
          Nobody files a cleaning request. The stay ends at 10:00, or sooner if you say you've left. {""}
          A list opens for Maria. The command bridge is the first line, every time.
        </p>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["The stay closes itself", "10:00 on the checkout morning, or the moment a guest taps that they've left."],
            ["Maria already has the list", "Bridge, canvas, decks, cabin, a cold galley, the closed head, the lines, the trash."],
            ["She signs it ready", "The nights go back on the board. The office does not assign, remind, or chase."],
          ].map(([title, text]) => (
            <li key={title} className="panel">
              <h3 className="font-display text-2xl">{title}</h3>
              <p className="mt-3 text-sm text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-4xl">A weekend on the point</h2>
        <ol className="mt-6 divide-y divide-line border-y border-line">
          {PLAN.map((step) => (
            <li key={step.when} className="grid gap-1 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <p className="text-sm font-medium">{step.when}</p>
              <p className="text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 max-w-prose text-sm text-muted">
          Bring bedding, towels, a cooler, and a layer for the bridge. Eat in Brisbane or South San Francisco before you board if you want a hot meal — the galley stays cold, and the pier doesn't sell food. Stock the cooler. Don't feed the birds.
        </p>
      </section>

      <Board />

      <footer className="mt-16 border-t border-line pt-8">
        <h2 className="font-display text-3xl">Finding her</h2>
        <p className="mt-4 max-w-prose">
          {BOAT}. {BOAT_LINE}. {PLACE}. {BERTH}.
        </p>
        <p className="mt-3 max-w-prose text-muted">
          {ADDRESS}. From Highway 101, take Sierra Point Parkway and follow it to the end. The yacht club is there. The public pier is the left-hand road at the end, toward the northeast corner of the point.
        </p>
        <p className="mt-3">
          Harbormaster{" "}
          <a className="inline-flex min-h-11 items-center font-medium text-kelp" href={HARBOR_PHONE_HREF}>
            {HARBOR_PHONE}
          </a>
        </p>
        <p className="mt-8">
          <Link to="/book" className="btn">
            Book a stay
          </Link>
        </p>
      </footer>
    </div>
  );
}

function Hero() {
  return (
    <section className="pt-12">
      <p className="text-sm font-medium tracking-wide text-kelp">CAM EDU · Sierra Point</p>
      <h1 className="mt-3 max-w-3xl font-display text-5xl sm:text-6xl">Two nights on the Ciera.</h1>
      <p className="mt-5 max-w-prose text-muted">
        A {BOAT}, command bridge, free for CAM EDU staff. {BERTH}, {PLACE}. Managers start with one stay. When you leave, Maria washes the boat — the flybridge first, because the gulls always find it.
      </p>
    </section>
  );
}

function Fact({ term, detail }: { term: string; detail: string }) {
  return (
    <div className="bg-cream px-5 py-5">
      <dt className="text-sm text-muted">{term}</dt>
      <dd className="mt-1 font-display text-3xl">{detail}</dd>
    </div>
  );
}

function Claim() {
  const { harbor, refresh } = useHarbor();
  const { error, pending, run } = useAction(refresh);
  const [mounted, setMounted] = useState(false);
  const [phrase, setPhrase] = useState("");
  useEffect(() => setMounted(true), []);
  if (!mounted || !harbor || harbor.officeClaimed) return null;

  return (
    <section className="panel mt-10">
      <h2 className="font-display text-3xl">Claim the harbor office</h2>
      <p className="mt-3 max-w-prose text-muted">
        {harbor.viewerName}, do this only if the Ciera is yours. Do it before you share the link. Everyone else waits to be added, with one stay for each manager.
      </p>
      <form
        className="mt-5 flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          void run(claimOffice({ data: { phrase } }));
        }}
      >
        <label className="block flex-1">
          <span className="sr-only">Type SLIP 36 to claim</span>
          <input
            className="field"
            value={phrase}
            onChange={(event) => setPhrase(event.target.value)}
            placeholder="Type SLIP 36"
            autoComplete="off"
          />
        </label>
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "Claiming…" : "Claim the office"}
        </button>
      </form>
      {error ? <p className="mt-3 text-sm text-rust">{error}</p> : null}
    </section>
  );
}

function Cue() {
  const { harbor } = useHarbor();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || !harbor?.officeClaimed) return null;
  const { me, book, stays, managerCount } = harbor;
  const active = stays.find((stay) => stay.mine && (stay.phase === "upcoming" || stay.phase === "aboard"));

  if (me.role === "owner" && managerCount === 0) {
    return (
      <p className="mt-8 max-w-prose">
        The office is yours.{" "}
        <Link to="/" className="font-medium text-kelp">
          Add your managers
        </Link>
        . Each one starts with a single stay, and the wash takes care of itself.
      </p>
    );
  }
  if (active) {
    return (
      <p className="mt-8 max-w-prose">
        You have the boat {prettyDate(active.checkIn)}.{" "}
        <Link to="/book" className="font-medium text-kelp">
          Open the pass
        </Link>
        .
      </p>
    );
  }
  if (me.role === "manager" || me.role === "staff") {
    return (
      <p className="mt-8 max-w-prose">
        {book.allowed
          ? `You have ${me.remaining === 1 ? "one stay" : `${me.remaining} stays`} to use.`
          : book.reason}{" "}
        <Link to="/book" className="font-medium text-kelp">
          {book.allowed ? "Hold a weekend" : "See your stay"}
        </Link>
        .
      </p>
    );
  }
  return null;
}

function Board() {
  const [board, setBoard] = useState<Board | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    getBoard()
      .then((next) => {
        if (live) setBoard(next);
      })
      .catch(() => {
        if (live) setFailed(true);
      });
    return () => {
      live = false;
    };
  }, []);

  return (
    <section className="mt-16">
      <h2 className="font-display text-4xl">The board</h2>
      <p className="mt-3 max-w-prose text-muted">
        Shaded nights are already a stay. A rust mark is Maria's morning — she washes the bridge before the next guest comes aboard at 3:00. The same afternoon can be the next check-in.
      </p>
      <div className="mt-6">
        {board ? (
          <MonthBoard taken={board.taken} blackouts={board.blackouts} washes={board.washes} mine={[]} highlight={[]} />
        ) : (
          <div className="panel min-h-80">
            <p className="text-sm text-muted">{failed ? "The board didn't load." : "Loading the board."}</p>
          </div>
        )}
      </div>
    </section>
  );
}
