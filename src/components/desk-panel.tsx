import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { signWash, toggleWashItem } from "@/lib/slip/api";
import type { CheckItem } from "@/lib/slip/checklist";
import { checklistDone } from "@/lib/slip/checklist";
import { checkoutDate, prettyDate } from "@/lib/slip/time";
import type { HarborReady, Stay } from "@/lib/slip/types";
import { useAction, useGate } from "./harbor";
import { LoadingBlock, SignInPrompt } from "./sign-in-prompt";

export function DeskPage() {
  const gate = useGate();
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 pb-20">
      <h1 className="font-display text-5xl">The desk</h1>
      <div className="mt-8">
        {gate.status === "loading" ? <LoadingBlock label="Opening the desk." /> : null}
        {gate.status === "error" ? <p className="text-rust">{gate.error}</p> : null}
        {gate.status === "signedout" ? <SignInPrompt callbackURL="/desk" /> : null}
        {gate.status === "ready" && !gate.harbor.officeClaimed ? (
          <p>
            <Link to="/" className="font-medium text-kelp">
              Claim the harbor office
            </Link>{" "}
            before the desk can open.
          </p>
        ) : null}
        {gate.status === "ready" && gate.harbor.officeClaimed ? (
          <DeskReady harbor={gate.harbor} refresh={gate.refresh} />
        ) : null}
      </div>
    </div>
  );
}

function DeskReady({ harbor, refresh }: { harbor: HarborReady; refresh: () => Promise<void> }) {
  if (harbor.me.role !== "owner" && harbor.me.role !== "steward") {
    return <p>This desk is {harbor.deskName}'s. Guests don't clean the bridge.</p>;
  }

  const open = harbor.stays.filter((stay) => stay.phase === "wash" && stay.wash);
  const aboard = harbor.stays.find((stay) => stay.phase === "aboard");

  return (
    <div className="grid gap-6">
      <p className="max-w-prose text-muted">
        {harbor.deskName} doesn't wait for a call. A list opens at 10:00 on the checkout morning, or the moment someone taps that they've left. The command bridge is always first. Gulls use it between stays.
      </p>
      {aboard ? (
        <p className="panel text-sm">
          {aboard.guest || "A guest"} is aboard through {prettyDate(checkoutDate(aboard.checkIn, aboard.nights))} at 10:00. The list opens then, on its own.
        </p>
      ) : null}
      {open.length === 0 ? (
        <p className="panel">Nothing is waiting. When a stay ends, this is the only place it needs to be.</p>
      ) : (
        open.map((stay) => <WashCard key={stay.id} stay={stay} harbor={harbor} refresh={refresh} />)
      )}
    </div>
  );
}

function WashCard({
  stay,
  harbor,
  refresh,
}: {
  stay: Stay;
  harbor: HarborReady;
  refresh: () => Promise<void>;
}) {
  const wash = stay.wash;
  const { error, pending, run } = useAction(refresh);
  const [items, setItems] = useState<CheckItem[]>(wash?.items ?? []);
  const [note, setNote] = useState(wash?.note ?? "");
  const signature = (wash?.items ?? []).map((item) => (item.done ? "1" : "0")).join("");

  useEffect(() => {
    if (wash) setItems(wash.items);
  }, [signature, wash]);

  if (!wash) return null;
  const done = checklistDone(items);
  const covering = harbor.me.role === "owner";

  return (
    <article className="panel">
      <p className="text-sm font-medium text-kelp">Bridge wash</p>
      <h2 className="mt-2 font-display text-3xl">{stay.guest || "Guest"}</h2>
      <p className="mt-2 text-sm text-muted">
        {prettyDate(stay.checkIn)} to {prettyDate(checkoutDate(stay.checkIn, stay.nights))}
        {stay.partySize ? ` · party of ${stay.partySize}` : ""}
        {stay.leftEarly ? " · left early" : ""}
      </p>
      {stay.note ? <p className="mt-3 text-sm">{stay.note}</p> : null}
      <ul className="mt-5 grid gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              aria-pressed={item.done}
              className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left ${item.done ? "bg-kelp-soft" : "bg-foam"}`}
              onClick={() => {
                setItems((current) => current.map((row) => (row.id === item.id ? { ...row, done: !row.done } : row)));
                void run(toggleWashItem({ data: { washId: wash.id, itemId: item.id } })).then((ok) => {
                  if (!ok) void refresh();
                });
              }}
            >
              <span
                className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-sm border ${item.done ? "border-kelp bg-kelp text-cream" : "border-line bg-cream"}`}
                aria-hidden
              >
                {item.done ? <Check className="size-3" strokeWidth={2.5} /> : null}
              </span>
              <span>
                <span className="block font-medium">
                  {item.id === "bridge" ? "First · " : ""}
                  {item.label}
                </span>
                <span className="mt-1 block text-sm text-muted">{item.detail}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm tabular-nums text-muted">
        {items.filter((item) => item.done).length} of {items.length}
      </p>
      <label className="mt-4 block">
        <span className="text-sm font-medium">Note, if the bridge was heavy</span>
        <textarea className="field mt-2 min-h-20" maxLength={280} value={note} onChange={(event) => setNote(event.target.value)} />
      </label>
      <button
        type="button"
        className="btn mt-4 w-full"
        disabled={!done || pending}
        onClick={() => void run(signWash({ data: { washId: wash.id, note } }))}
      >
        {pending ? "Signing…" : "Sign the boat ready"}
      </button>
      {covering ? (
        <p className="mt-3 text-sm text-muted">This is {harbor.deskName}'s list. Sign it only if you're covering for her.</p>
      ) : (
        <p className="mt-3 text-sm text-muted">Signing puts the slip back on the board. The office is not in this step.</p>
      )}
      {error ? (
        <p className="mt-3 text-sm text-rust" role="alert">
          {error}
        </p>
      ) : null}
    </article>
  );
}
