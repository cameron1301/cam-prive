import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addDays,
  daysInMonth,
  laParts,
  maxCheckIn,
  monthStart,
  prettyDate,
  prettyMonth,
  weekdayIndex,
} from "@/lib/slip/time";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type MonthBoardProps = {
  taken: string[];
  blackouts: string[];
  washes: string[];
  mine: string[];
  highlight: string[];
  canPick?: (iso: string) => boolean;
  onPick?: (iso: string) => void;
};

export function MonthBoard(props: MonthBoardProps) {
  const [cursor, setCursor] = useState<string | null>(null);
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    const date = laParts().date;
    setToday(date);
    setCursor(monthStart(date));
  }, []);

  if (!cursor || !today) {
    return <div className="panel min-h-80" aria-hidden />;
  }

  const floor = monthStart(today);
  const ceil = monthStart(maxCheckIn());
  const next = monthStart(addDays(cursor, 32));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          className="btn btn-quiet size-11 px-0"
          aria-label="Previous month"
          disabled={cursor <= floor}
          onClick={() => setCursor(monthStart(addDays(cursor, -1)))}
        >
          <ChevronLeft aria-hidden className="size-4" />
        </button>
        <p className="text-sm text-muted">
          {prettyMonth(cursor)}
          <span className="hidden md:inline"> and {prettyMonth(next)}</span>
        </p>
        <button
          type="button"
          className="btn btn-quiet size-11 px-0"
          aria-label="Next month"
          disabled={next > ceil}
          onClick={() => setCursor(next)}
        >
          <ChevronRight aria-hidden className="size-4" />
        </button>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <p className="mb-3 font-display text-2xl">{prettyMonth(cursor)}</p>
          <Month cursor={cursor} today={today} {...props} />
        </div>
        <div className="hidden md:block">
          <p className="mb-3 font-display text-2xl">{prettyMonth(next)}</p>
          <Month cursor={next} today={today} {...props} />
        </div>
      </div>
      <Legend />
    </div>
  );
}

function Month({
  cursor,
  today,
  taken,
  blackouts,
  washes,
  mine,
  highlight,
  canPick,
  onPick,
}: MonthBoardProps & { cursor: string; today: string }) {
  const count = daysInMonth(cursor);
  const lead = weekdayIndex(cursor);
  const cells: Array<string | null> = [...Array(lead).fill(null), ...Array.from({ length: count }, (_, i) => addDays(cursor, i))];

  return (
    <div>
      <div className="grid grid-cols-7 gap-1" aria-hidden>
        {WEEKDAYS.map((day) => (
          <div key={day} className="pb-1 text-center text-xs text-muted">
            {day.slice(0, 1)}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((iso, index) => {
          if (!iso) return <div key={`empty-${index}`} />;
          const isTaken = taken.includes(iso);
          const isBlackout = blackouts.includes(iso);
          const isMine = mine.includes(iso);
          const isOn = highlight.includes(iso);
          const isWash = washes.includes(iso);
          const isToday = iso === today;
          const pickable = Boolean(onPick && canPick?.(iso));
          const label = [
            prettyDate(iso),
            isOn ? "selected" : isMine ? "your stay" : isTaken ? "held" : isBlackout ? "office hold" : "open",
            isWash ? "bridge wash that morning" : "",
          ]
            .filter(Boolean)
            .join(", ");

          const className = [
            "flex h-11 flex-col items-center justify-center rounded-lg text-sm tabular-nums",
            isOn ? "bg-kelp text-cream" : "",
            !isOn && isMine ? "bg-kelp-soft text-ink" : "",
            !isOn && !isMine && isTaken ? "bg-ink/10 text-muted" : "",
            !isOn && !isMine && !isTaken && isBlackout ? "bg-foam text-ink shadow-panel" : "",
            !isOn && !isMine && !isTaken && !isBlackout ? "text-ink" : "",
            isToday && !isOn ? "underline decoration-kelp decoration-2 underline-offset-4" : "",
            pickable ? "hover:bg-kelp-soft" : "",
            !pickable && onPick ? "cursor-default" : "",
          ]
            .filter(Boolean)
            .join(" ");

          const body = (
            <>
              <span>{Number(iso.slice(8))}</span>
              {isWash ? (
                <span className={`mt-0.5 h-0.5 w-3 ${isOn ? "bg-cream" : "bg-rust"}`} />
              ) : (
                <span className="mt-0.5 h-0.5 w-3" />
              )}
            </>
          );

          if (!pickable) {
            return (
              <div key={iso} className={className} aria-label={label}>
                {body}
              </div>
            );
          }

          return (
            <button key={iso} type="button" className={className} aria-label={label} onClick={() => onPick?.(iso)}>
              {body}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Legend() {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
      <li className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-sm bg-ink/10" /> Held
      </li>
      <li className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-sm bg-kelp-soft" /> Your stay
      </li>
      <li className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-sm bg-foam shadow-panel" /> Office hold
      </li>
      <li className="flex items-center gap-2">
        <span className="h-0.5 w-3 bg-rust" /> Bridge wash
      </li>
    </ul>
  );
}
