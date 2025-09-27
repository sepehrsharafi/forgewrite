"use client";
import { useEffect, useState } from "react";
import {
  emptySanityPayload,
  readSanityFromSession,
  type SanityPayload,
} from "@/utils/sanityTypes";

export const SANITY_UPDATED_EVENT = "sanity:updated";


export function useSanityData(): SanityPayload {
  const initial: SanityPayload = (() => {
    if (typeof window === "undefined") return emptySanityPayload;
    const r = readSanityFromSession();
    if (!r) return emptySanityPayload;
    return {
      services: r.services,
      careers: r.careers ?? [],
      projects: r.projects ?? [],
      insights: r.insights ?? [],
      aboutUs: r.aboutUs,
    };
  })();
  const [data, setData] = useState<SanityPayload>(initial);

  useEffect(() => {
    const load = () => {
      const r = readSanityFromSession();
      if (r)
        setData({
          services: r.services,
          careers: r.careers ?? [],
          projects: r.projects ?? [],
          insights: r.insights ?? [],
          aboutUs: r.aboutUs,
        });
    };

    load();
    const onUpdated = () => load();
    window.addEventListener(SANITY_UPDATED_EVENT, onUpdated as EventListener);
    return () => {
      window.removeEventListener(SANITY_UPDATED_EVENT, onUpdated as EventListener);
    };
  }, []);

  return data;
}
