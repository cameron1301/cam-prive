import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  addPerson,
  cancelStay,
  grantStays,
  removePending,
  saveHarbor,
  savePerson,
  toggleBlackout,
} from "@/lib/slip/api";
import { checkoutDate, prettyDate } from "@/lib/slip/time";
import type { HarborReady, Role, RosterPerson } from "@/lib/slip/types";
import { MonthBoard } from "./calendar";
import { useAction, useGate } from "./harbor";
import { LoadingBlock, SignInPrompt } from "./sign-in-prompt";

export function OfficePage() {
  const gate = useGate();
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 pb-20">
      <h1 className="font-display text-5xl">Harbor office</h1>
      <div className="mt-8">
        {gate.status === "loading" ? <LoadingBlock label="Opening the office." /> : null}
        {gate.status === "error" ? <p className="text-rust">{gate.error}</p> : null}
        {gate.status === "signedout" ? <SignInPrompt callbackURL="/office" /> : null}
        {gate.status === "ready" && !gate.harbor.officeClaimed ? (
          <p>
            <Link to="/" className="font-medium text-kelp">
              Claim the office
            </Link>{" "}
            from the weekend page if this is your boat.
          </p>
        ) : null}
        {gate.status === "ready" && gate.harbor.officeClaimed && gate.harbor.me.role !== "owner" ? (
          <p>The list, the quotas, and the held dates live with the owner.</p>
        ) : null}
        {gate.status === "ready" && gate.harbor.officeClaimed && gate.harbor.me.role === "owner" ? (
          <OfficeReady harbor={gate.harbor} refresh={gate.refresh} />
        ) : null}
      </div>
    </div>
  );
}

function OfficeReady({ harbor, refresh }: { harbor: HarborReady; refresh: () => Promise<void> }) {
  const phase =
    harbor.phase === "wash"
      ? `${harbor.deskName} already has the bridge wash. Nothing for you to assign.`
      : harbor.phase === "aboard"
        ? "Someone is aboard. The wash opens at 10:00 the morning they leave, or sooner if they tap that they've left."
        : "The Ciera is ready. You don't have a cleaning task.";

  return (
    <div className="grid gap-12">
      <p className="max-w-prose text-lg">{phase}</p>
      {harbor.stewardNeedsEmail ? (
        <p className="panel">
          Add {harbor.deskName}'s email below. When a stay ends, her phone is the desk — bridge first, then the rest. You are not copied, and you don't confirm it.
        </p>
      ) : null}
      <Settings harbor={harbor} refresh={refresh} />
      <People harbor={harbor} refresh={refresh} />
      <Holds harbor={harbor} refresh={refresh} />
      <Board harbor={harbor} refresh={refresh} />
    </div>
  );
}

function Settings({ harbor, refresh }: { harbor: HarborReady; refresh: () => Promise<void> }) {
  const { error, pending, run } = useAction(refresh);
  const [gateNote, setGateNote] = useState(harbor.gateNote ?? "");
  const [partyMax, setPartyMax] = useState(harbor.partyMax);

  return (
    <section>
      <h2 className="font-display text-3xl">Arrival</h2>
      <form
        className="panel mt-4"
        onSubmit={(event) => {
          event.preventDefault();
          void run(saveHarbor({ data: { gateNote, partyMax } }));
        }}
      >
        <label className="block">
          <span className="text-sm font-medium">Note on the pass</span>
          <textarea className="field mt-2 min-h-28" maxLength={500} value={gateNote} onChange={(event) => setGateNote(event.target.value)} />
          <span className="mt-2 block text-sm text-muted">Shown only after someone has a stay. Gate keys belong here, not on the public page.</span>
        </label>
        <div className="mt-5">
          <p className="text-sm font-medium">Overnight party, at most</p>
          <div className="mt-2 flex items-center gap-3">
            <button type="button" className="btn btn-quiet size-11 px-0" onClick={() => setPartyMax((value) => Math.max(1, value - 1))} aria-label="Lower the party cap">
              −
            </button>
            <span className="min-w-8 text-center tabular-nums">{partyMax}</span>
            <button type="button" className="btn btn-quiet size-11 px-0" onClick={() => setPartyMax((value) => Math.min(6, value + 1))} aria-label="Raise the party cap">
              +
            </button>
          </div>
          <p className="mt-2 text-sm text-muted">Four is the house number: a 28-foot boat, and a head that stays closed.</p>
        </div>
        <button className="btn mt-5" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </button>
        {error ? <p className="mt-3 text-sm text-rust">{error}</p> : null}
      </form>
    </section>
  );
}

function People({ harbor, refresh }: { harbor: HarborReady; refresh: () => Promise<void> }) {
  const roster = harbor.roster ?? [];
  return (
    <section>
      <h2 className="font-display text-3xl">People</h2>
      <p className="mt-3 max-w-prose text-muted">
        Each manager starts with one stay. That is the whole perk — one visit, up to two nights. Staff can be given a stay the same way. Maria does not use a quota.
      </p>
      <AddPerson refresh={refresh} />
      <ul className="mt-4 grid gap-3">
        {roster.map((person) => (
          <li key={`${person.id}-${person.email}-${person.role}-${person.staysGranted}`}>
            {person.role === "owner" ? (
              <OwnerRow person={person} refresh={refresh} />
            ) : (
              <PersonRow person={person} refresh={refresh} />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function AddPerson({ refresh }: { refresh: () => Promise<void> }) {
  const { error, pending, run } = useAction(refresh);
  const [role, setRole] = useState<Role>("manager");
  const [stays, setStays] = useState(1);

  return (
    <form
      className="panel mt-4 grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        void run(
          addPerson({
            data: {
              name: String(data.get("name") ?? ""),
              email: String(data.get("email") ?? ""),
              role,
              staysGranted: role === "steward" ? 0 : stays,
            },
          }),
        ).then((ok) => {
          if (ok) form.reset();
        });
      }}
    >
      <h3 className="font-display text-2xl">Add someone</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <label>
          <span className="text-sm font-medium">Name</span>
          <input className="field mt-2" name="name" required maxLength={80} />
        </label>
        <label>
          <span className="text-sm font-medium">Sign-in email</span>
          <input className="field mt-2" name="email" type="email" required />
        </label>
      </div>
      <label>
        <span className="text-sm font-medium">Role</span>
        <select
          className="field mt-2"
          value={role}
          onChange={(event) => {
            const next = event.target.value as Role;
            setRole(next);
            if (next === "manager" && stays < 1) setStays(1);
            if (next === "steward") setStays(0);
          }}
        >
          <option value="manager">Manager — one stay</option>
          <option value="staff">Staff — grant a stay if you want</option>
          <option value="steward">Steward — the desk, not a guest</option>
        </select>
      </label>
      {role !== "steward" ? (
        <div>
          <p className="text-sm font-medium">Stays</p>
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              className="btn btn-quiet size-11 px-0"
              onClick={() => setStays((value) => Math.max(role === "manager" ? 1 : 0, value - 1))}
              aria-label="Fewer stays"
            >
              −
            </button>
            <span className="min-w-8 text-center tabular-nums">{stays}</span>
            <button type="button" className="btn btn-quiet size-11 px-0" onClick={() => setStays((value) => Math.min(12, value + 1))} aria-label="More stays">
              +
            </button>
          </div>
        </div>
      ) : null}
      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Adding…" : "Add to the list"}
      </button>
      {error ? <p className="text-sm text-rust">{error}</p> : null}
    </form>
  );
}

function OwnerRow({ person, refresh }: { person: RosterPerson; refresh: () => Promise<void> }) {
  const { error, pending, run } = useAction(refresh);
  const [stays, setStays] = useState(person.staysGranted);
  return (
    <div className="panel">
      <p className="font-medium">{person.name}</p>
      <p className="text-sm text-muted">Owner · {person.email}</p>
      <p className="mt-2 text-sm tabular-nums">
        {person.staysUsed} used · {Math.max(0, stays - person.staysUsed)} left
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-quiet size-11 px-0" onClick={() => setStays((value) => Math.max(person.staysUsed, value - 1))} aria-label="Fewer stays for yourself">
          −
        </button>
        <span className="min-w-8 text-center tabular-nums">{stays}</span>
        <button type="button" className="btn btn-quiet size-11 px-0" onClick={() => setStays((value) => Math.min(12, value + 1))} aria-label="More stays for yourself">
          +
        </button>
        <button type="button" className="btn" disabled={pending || stays === person.staysGranted} onClick={() => void run(grantStays({ data: { id: person.id, staysGranted: stays } }))}>
          {pending ? "Saving…" : "Save your stays"}
        </button>
      </div>
      {error ? <p className="mt-3 text-sm text-rust">{error}</p> : null}
    </div>
  );
}

function PersonRow({ person, refresh }: { person: RosterPerson; refresh: () => Promise<void> }) {
  const { error, pending, run } = useAction(refresh);
  const [role, setRole] = useState<Role>(person.role);
  const [stays, setStays] = useState(person.staysGranted);
  const id = person.role === "steward" ? "maria" : undefined;

  return (
    <form
      id={id}
      className="panel grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        void run(
          savePerson({
            data: {
              id: person.id,
              name: String(data.get("name") ?? ""),
              email: String(data.get("email") ?? ""),
              role,
              staysGranted: role === "steward" ? 0 : stays,
            },
          }),
        );
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label>
          <span className="text-sm font-medium">Name</span>
          <input className="field mt-2" name="name" defaultValue={person.name} required maxLength={80} />
        </label>
        <label>
          <span className="text-sm font-medium">Sign-in email</span>
          <input className="field mt-2" name="email" type="email" defaultValue={person.email ?? ""} required />
        </label>
      </div>
      <label>
        <span className="text-sm font-medium">Role</span>
        <select
          className="field mt-2"
          value={role}
          onChange={(event) => {
            const next = event.target.value as Role;
            setRole(next);
            if (next === "manager" && stays < 1) setStays(1);
            if (next === "steward") setStays(0);
          }}
        >
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
          <option value="steward">Steward</option>
          <option value="pending">Waiting</option>
        </select>
      </label>
      <p className="text-sm tabular-nums text-muted">
        {person.staysUsed} used
        {person.linked ? " · signed in" : " · hasn't signed in yet"}
      </p>
      {role !== "steward" ? (
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn btn-quiet size-11 px-0"
            onClick={() => setStays((value) => Math.max(role === "manager" ? Math.max(1, person.staysUsed) : person.staysUsed, value - 1))}
            aria-label={`Fewer stays for ${person.name}`}
          >
            −
          </button>
          <span className="min-w-8 text-center tabular-nums">{stays}</span>
          <button type="button" className="btn btn-quiet size-11 px-0" onClick={() => setStays((value) => Math.min(12, value + 1))} aria-label={`More stays for ${person.name}`}>
            +
          </button>
        </div>
      ) : (
        <p className="text-sm text-muted">The desk doesn't book a stay.</p>
      )}
      <div className="flex flex-wrap gap-3">
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </button>
        {person.role === "pending" ? (
          <button type="button" className="btn btn-quiet" disabled={pending} onClick={() => void run(removePending({ data: { id: person.id } }))}>
            Remove
          </button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-rust">{error}</p> : null}
    </form>
  );
}

function Holds({ harbor, refresh }: { harbor: HarborReady; refresh: () => Promise<void> }) {
  const { error, pending, run } = useAction(refresh);
  const [reason, setReason] = useState("Held by the office");
  return (
    <section>
      <h2 className="font-display text-3xl">Dates you hold back</h2>
      <p className="mt-3 max-w-prose text-muted">
        Tap an open day to keep it. Tap it again to release it. A night that is already a stay has to be cancelled first. Personal use of the boat belongs here, not in a guest quota.
      </p>
      <label className="mt-4 block max-w-md">
        <span className="text-sm font-medium">Note for yourself</span>
        <input className="field mt-2" value={reason} maxLength={80} onChange={(event) => setReason(event.target.value)} />
      </label>
      <div className="mt-4">
        <MonthBoard
          taken={harbor.taken}
          blackouts={harbor.blackouts}
          washes={harbor.washes}
          mine={[]}
          highlight={[]}
          canPick={(day) => !harbor.taken.includes(day) && day >= harbor.today && day <= harbor.maxCheckIn}
          onPick={(day) => {
            if (!pending) void run(toggleBlackout({ data: { day, reason } }));
          }}
        />
      </div>
      {error ? <p className="mt-3 text-sm text-rust">{error}</p> : null}
    </section>
  );
}

function Board({ harbor, refresh }: { harbor: HarborReady; refresh: () => Promise<void> }) {
  const { error, pending, run } = useAction(refresh);
  const live = harbor.stays.filter((stay) => stay.phase !== "closed");
  if (live.length === 0) {
    return (
      <section>
        <h2 className="font-display text-3xl">On the board</h2>
        <p className="mt-3 text-muted">No stay is out. The next one will close itself into {harbor.deskName}'s list.</p>
      </section>
    );
  }
  return (
    <section>
      <h2 className="font-display text-3xl">On the board</h2>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {live.map((stay) => (
          <li key={stay.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">{stay.guest}</p>
              <p className="text-sm text-muted">
                {prettyDate(stay.checkIn)} to {prettyDate(checkoutDate(stay.checkIn, stay.nights))} · {label(stay.phase)}
                {stay.partySize ? ` · ${stay.partySize}` : ""}
              </p>
            </div>
            {stay.canCancel ? (
              <button type="button" className="btn btn-quiet" disabled={pending} onClick={() => void run(cancelStay({ data: { id: stay.id } }))}>
                Cancel
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      {error ? <p className="mt-3 text-sm text-rust">{error}</p> : null}
    </section>
  );
}

function label(phase: string) {
  if (phase === "aboard") return "aboard";
  if (phase === "wash") return "bridge wash";
  if (phase === "upcoming") return "upcoming";
  return phase;
}
