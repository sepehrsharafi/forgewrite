"use client";
import { useEffect } from "react";
import { SANITY_SESSION_KEY } from "@/utils/sanityTypes";
import { SANITY_UPDATED_EVENT } from "@/utils/sanityClient";

export default function SanityBootstrap() {
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SANITY_QUERY_URL;
    if (!url) return;

    const ALWAYS_REFRESH =
      (process.env.NEXT_PUBLIC_SANITY_ALWAYS_REFRESH || "").toLowerCase() ===
      "true";
    const TTL_MS = Number(process.env.NEXT_PUBLIC_SANITY_TTL_MS || 60000);

    const tsKey = `${SANITY_SESSION_KEY}:ts`;
    const now = Date.now();
    const cached =
      typeof window !== "undefined" &&
      sessionStorage.getItem(SANITY_SESSION_KEY);
    const cachedTsRaw =
      typeof window !== "undefined" && sessionStorage.getItem(tsKey);
    const cachedTs = cachedTsRaw ? Number(cachedTsRaw) : 0;
    const isFresh = Boolean(cached) && cachedTs > 0 && now - cachedTs < TTL_MS;
    if (!ALWAYS_REFRESH && isFresh) return;
    // const cached =
    //   typeof window !== "undefined" &&
    //   sessionStorage.getItem(SANITY_SESSION_KEY);
    // if (cached) return;

    const controller = new AbortController();

    const run = async () => {
      try {
        const res = await fetch(url, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Failed with status ${res.status}`);
        const data = await res.json();
        sessionStorage.setItem(SANITY_SESSION_KEY, JSON.stringify(data.result));
        sessionStorage.setItem(tsKey, String(Date.now()));
        window.dispatchEvent(new Event(SANITY_UPDATED_EVENT));
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // Ignore abort errors
          return;
        }
        console.error("Sanity bootstrap fetch failed", err);
      }
    };

    run();
    return () => controller.abort();
  }, []);

  return null;
}
