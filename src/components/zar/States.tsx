import { Medallion } from "./Medallion";
import { WarpField } from "./WarpField";
import { WovenBorder } from "./WovenBorder";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-svh items-center justify-center px-6 py-16">
      <WarpField />
      <div className="w-full max-w-sm text-center">{children}</div>
    </main>
  );
}

export function LoadingState() {
  return (
    <Shell>
      <p className="zar-eyebrow text-zar-gold/80">Weaving the invitation</p>
      <WovenBorder units={14} height={14} className="mt-6" />
    </Shell>
  );
}

export function NotFoundState() {
  return (
    <Shell>
      <Medallion className="mx-auto max-w-[280px]">
        <div className="px-6 text-center text-zar-ink">
          <p className="zar-eyebrow text-zar-burgundy">Invitation not found</p>
          <p className="mt-4 font-display text-xl leading-snug">
            This thread does not belong to any carpet on our loom.
          </p>
          <p className="mt-4 text-xs text-zar-ink/60">
            Please check the link you were given and try again.
          </p>
        </div>
      </Medallion>
    </Shell>
  );
}

export function ErrorState({ onRetry, message }: { onRetry: () => void; message?: string }) {
  return (
    <Shell>
      <p className="zar-eyebrow text-zar-gold">The loom paused</p>
      <p className="mt-4 font-display text-2xl text-zar-cream">
        We couldn't load this invitation just now.
      </p>
      {message ? <p className="mt-3 text-xs text-zar-cream/50">{message}</p> : null}
      <button
        type="button"
        onClick={onRetry}
        className="zar-eyebrow mt-8 rounded-sm border border-zar-gold/50 px-6 py-3 text-zar-cream transition-colors hover:bg-zar-burgundy/50"
      >
        Try again
      </button>
    </Shell>
  );
}

export function FallbackState({
  shopName,
  message,
  phone,
  websiteUrl,
}: {
  shopName?: string | null;
  message?: string | null;
  phone?: string | null;
  websiteUrl?: string | null;
}) {
  return (
    <Shell>
      <WovenBorder units={16} height={12} />
      <div className="zar-parchment mt-4 rounded-sm border border-zar-gold/40 px-6 py-10">
        {shopName ? (
          <h1 className="font-display text-3xl text-zar-burgundy">{shopName}</h1>
        ) : (
          <h1 className="font-display text-3xl text-zar-burgundy">Digital Invitations</h1>
        )}
        <div className="zar-gold-rule mx-auto mt-4 h-px w-20" />
        <p className="mt-5 font-display text-lg text-zar-ink/80">
          {message?.trim() || "This invitation is not currently available."}
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          {phone ? (
            <a
              href={`tel:${phone}`}
              className="zar-eyebrow rounded-sm border border-zar-burgundy/40 px-5 py-2 text-zar-burgundy"
            >
              {phone}
            </a>
          ) : null}
          {websiteUrl ? (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="zar-eyebrow text-zar-teal underline underline-offset-4"
            >
              Visit website
            </a>
          ) : null}
        </div>
      </div>
      <WovenBorder units={16} height={12} className="mt-4" />
    </Shell>
  );
}
