export type CheckItem = {
  id: string;
  label: string;
  detail: string;
  done: boolean;
};

const TEMPLATE: Omit<CheckItem, "done">[] = [
  {
    id: "bridge",
    label: "Command bridge",
    detail:
      "Always first. Gulls use the flybridge between stays. Hose the bridge, helm, seats, and windshield. Do not sign the boat ready if droppings are still there.",
  },
  {
    id: "canvas",
    label: "Canvas and clears",
    detail: "Wipe what is up. Shake off anything that landed on the covers.",
  },
  {
    id: "decks",
    label: "Cockpit and side decks",
    detail: "Rinse the cockpit, side decks, and the boarding step. Check the scuppers.",
  },
  {
    id: "cabin",
    label: "Cabin",
    detail:
      "Square the berths. Guests bring their own bedding and take it with them. Nothing perishable stays aboard.",
  },
  {
    id: "galley",
    label: "Galley stayed cold",
    detail:
      "No stove, grill, or hot plate. If someone cooked anyway, note it. Do not pretend it didn't happen.",
  },
  {
    id: "head",
    label: "Head still closed",
    detail: "The head and shower are out of service. The sign on the door should still be there.",
  },
  {
    id: "lines",
    label: "Lines at slip 36",
    detail: "Dock lines and fenders sitting fair. She does not leave the dock for this perk.",
  },
  {
    id: "trash",
    label: "Trash off the boat",
    detail: "Marina bins, not the finger pier. No food left out for the birds.",
  },
];

export function freshChecklist(): CheckItem[] {
  return TEMPLATE.map((item) => ({ ...item, done: false }));
}

export function normalizeChecklist(value: unknown): CheckItem[] {
  let raw: unknown = value;
  if (typeof value === "string") {
    try {
      raw = JSON.parse(value);
    } catch {
      raw = [];
    }
  }
  const done = new Map<string, boolean>();
  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (!item || typeof item !== "object" || !("id" in item)) continue;
      const row = item as { id?: unknown; done?: unknown };
      done.set(String(row.id), row.done === true);
    }
  }
  return TEMPLATE.map((item) => ({ ...item, done: done.get(item.id) ?? false }));
}

export function checklistDone(items: CheckItem[]): boolean {
  return items.length > 0 && items.every((item) => item.done);
}
