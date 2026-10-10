import { fileToDataUrl } from "@/lib/yacht/logic";

export function Callout({ title, children }: { title: string; children: string }) {
  return (
    <aside className="rounded-3xl bg-tide px-5 py-5 text-foam">
      <p className="kicker text-brass">{title}</p>
      <p className="mt-2 text-lg leading-snug">{children}</p>
    </aside>
  );
}

export function PhotoPick({
  label,
  value,
  onPick,
}: {
  label: string;
  value: string | null;
  onPick: (url: string) => void;
}) {
  return (
    <label className="card block overflow-hidden">
      {value ? (
        <img src={value} alt="" className="aspect-[4/3] w-full object-cover" />
      ) : (
        <span className="flex aspect-[4/3] items-center justify-center bg-tide-soft px-4 text-center text-tide">
          Tap to add
        </span>
      )}
      <span className="flex items-center justify-between gap-3 px-4 py-3">
        <span className="font-medium">{label}</span>
        <span className="text-sm text-tide">Photo</span>
      </span>
      <input
        className="sr-only"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          onPick(await fileToDataUrl(file));
        }}
      />
    </label>
  );
}

export function ConfigLine({ label, value }: { label: string; value: string }) {
  const missing = value.includes("ADMIN CONFIGURATION REQUIRED");
  return (
    <div className="border-t border-line py-3 first:border-t-0">
      <p className="text-sm text-muted">{label}</p>
      <p className={missing ? "text-brass-ink" : ""}>{value}</p>
    </div>
  );
}
