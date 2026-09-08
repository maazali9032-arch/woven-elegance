import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { fetchInvitation, slugFromPath, type FetchResult } from "@/lib/zar/invitation";
import { Invitation } from "@/components/zar/Invitation";
import { BrandTicker } from "@/components/zar/BrandTicker";
import { ErrorState, FallbackState, LoadingState, NotFoundState } from "@/components/zar/States";

export const Route = createFileRoute("/$slug")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Wedding Invitation" },
      {
        name: "description",
        content: "A digital wedding invitation, woven thread by thread.",
      },
      { property: "og:title", content: "Wedding Invitation" },
      {
        property: "og:description",
        content: "A digital wedding invitation, woven thread by thread.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InvitationRoute,
});

function InvitationRoute() {
  const { slug: rawSlug } = Route.useParams();
  const [result, setResult] = useState<FetchResult | null>(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setResult(null);
    setAttempt((a) => a + 1);
  }, []);

  useEffect(() => {
    let active = true;
    const slug = slugFromPath(`/${rawSlug}`);
    if (!slug) {
      setResult({ state: "not_found" });
      return;
    }
    fetchInvitation(slug).then(
      (res) => active && setResult(res),
      (err: unknown) =>
        active &&
        setResult({
          state: "error",
          errorMessage: err instanceof Error ? err.message : "Unexpected error",
        }),
    );
    return () => {
      active = false;
    };
  }, [rawSlug, attempt]);

  if (!result) return <LoadingState />;

  if (result.state === "error") {
    return (
      <ErrorState
        onRetry={retry}
        {...(result.errorMessage ? { message: result.errorMessage } : {})}
      />
    );
  }

  if (result.state === "not_found") return <NotFoundState />;

  if (result.state === "fallback") {
    return (
      <>
        <FallbackState
          shopName={result.fallback?.shop_name ?? result.brand_name ?? null}
          message={result.fallback?.message ?? null}
          phone={result.fallback?.phone ?? null}
          websiteUrl={result.fallback?.website_url ?? null}
        />
        <BrandTicker brandName={result.brand_name ?? null} />
      </>
    );
  }

  if (!result.content) return <NotFoundState />;

  return (
    <>
      <Invitation content={result.content} invitation={result.invitation ?? null} />
      <BrandTicker brandName={result.brand_name ?? null} />
    </>
  );
}
