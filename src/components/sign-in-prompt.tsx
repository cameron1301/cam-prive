import { GROK_PROVIDERS, signIn } from "@/lib/auth/client";

export function SignInPrompt({ callbackURL = "/" }: { callbackURL?: string }) {
  return (
    <div className="panel max-w-md">
      <h2 className="text-3xl">View your invitation</h2>
      <p className="mt-3 text-muted">
        Sign in and we'll open what has been prepared for you.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        {GROK_PROVIDERS.map((provider) => (
          <button
            key={provider.providerId}
            type="button"
            className="btn"
            onClick={() => signIn(provider.providerId, { callbackURL })}
          >
            Continue with {provider.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="panel" aria-live="polite">
      <p className="text-sm text-muted">{label}</p>
      <div className="mt-4 h-3 w-2/3 animate-pulse rounded-full bg-ink/10" />
      <div className="mt-3 h-3 w-1/2 animate-pulse rounded-full bg-ink/10" />
    </div>
  );
}
