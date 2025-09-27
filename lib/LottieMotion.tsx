"use client";

import { Suspense, useEffect, useState, lazy } from "react";

type MotionProp = string | Record<string, unknown>;

export default function MyLottieComponent({
  motionLocation,
  showPlaceholder = true,
}: {
  motionLocation: MotionProp | undefined;
  showPlaceholder?: boolean;
}) {
  const [animationData, setAnimationData] = useState<Record<
    string,
    unknown
  > | null>(
    typeof motionLocation === "object" && motionLocation !== null
      ? motionLocation
      : null
  );
  const [error, setError] = useState<string | null>(null);
  const LazyLottie = lazy(() => import("lottie-react"));

  function Skeleton() {
    return (
      <div
        className={`h-full rounded-md bg-gray-200 dark:bg-gray-800`}
        aria-busy
        aria-label="Loading animation"
      />
    );
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError(null);
      // If an object was passed, use it directly.
      if (typeof motionLocation === "object" && motionLocation !== null) {
        setAnimationData(motionLocation as Record<string, unknown>);
        return;
      }

      // If a string was passed, treat it as a URL to a JSON file in `public/` or absolute URL.
      const raw = String(motionLocation || "").trim();
      if (!raw) return;

      // Normalize relative paths to start from public root when needed.
      const isAbsoluteHttp = /^https?:\/\//i.test(raw);
      const url = isAbsoluteHttp
        ? raw
        : raw.startsWith("/")
        ? raw
        : `/${raw.replace(/^\.\//, "")}`;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
        const json = (await res.json()) as Record<string, unknown>;
        if (!cancelled) setAnimationData(json);
      } catch (e: unknown) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load animation");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [motionLocation]);

  if (error) {
    return <div className="text-red-600 text-sm">{error}</div>;
  }

  // Optional placeholder while loading the JSON
  if (!animationData) {
    return showPlaceholder ? <Skeleton /> : null;
  }

  return (
    <Suspense fallback={<Skeleton />}>
      <LazyLottie
        className="w-full h-full"
        style={{ width: "100%", height: "100%" }}
        animationData={animationData}
        loop
        autoplay
      />
    </Suspense>
  );
}
