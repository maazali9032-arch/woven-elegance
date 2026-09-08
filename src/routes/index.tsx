import { createFileRoute } from "@tanstack/react-router";
import { WarpField } from "@/components/zar/WarpField";
import { WovenBorder } from "@/components/zar/WovenBorder";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZAR Digital Invitations" },
      {
        name: "description",
        content: "ZAR digital wedding invitations. Each invitation opens at its own private link.",
      },
      { property: "og:title", content: "ZAR Digital Invitations" },
      {
        property: "og:description",
        content: "ZAR digital wedding invitations. Each invitation opens at its own private link.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

/** The root path intentionally shows no wedding data. */
function Landing() {
  return (
    <main className="relative flex min-h-svh items-center justify-center px-6 py-16">
      <WarpField />
      <div className="w-full max-w-sm text-center">
        <WovenBorder units={14} height={14} />
        <h1 className="mt-8 font-display text-4xl text-zar-cream">Digital Invitations</h1>
        <div className="zar-gold-rule mx-auto mt-5 h-px w-24" />
        <p className="mt-6 font-display text-lg leading-relaxed text-zar-cream/70">
          Every invitation is woven for one family alone and opens only at its own private link.
        </p>
        <p className="zar-eyebrow mt-6 text-zar-cream/45">Please use the link you were given</p>
        <WovenBorder units={14} height={14} className="mt-8" />
      </div>
    </main>
  );
}
