// Types that model the Sanity composite query payload you store in sessionStorage.
// import { readSanityFromSession } from "./sanityClient";

export interface SanityQueryResponse<T> {
  ms?: number;
  query?: string;
  result: T;
}

export interface SanityPayload {
  services?: Services;
  careers: Career[];
  projects: Project[];
  insights: Insight[];
  aboutUs?: AboutUs;
}

// Services
export interface ServicesCategory {
  label: string;
  items: string[];
}

export interface Services {
  engineers?: ServicesCategory;
  officeManagers?: ServicesCategory;
  fieldSupport?: ServicesCategory;
}

// Careers
export type EmploymentType = "full_time" | "part_time" | "contract" | string;

export interface Career {
  title: string;
  slug: string;
  workLocation: string;
  employmentType: EmploymentType;
  link: string;
}

export interface AboutUsCEO {
  name: string;
  email: string;
}

export interface AboutUs {
  aboutCompany: string;
  imageUrl?: string;
  ceo: AboutUsCEO;
}

export interface PortableTextSpan {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
}

export interface PortableTextMarkDef {
  _key: string;
  _type: string;
  [key: string]: unknown;
}

export interface PortableTextBlock {
  _type: "block";
  _key: string;
  style?: string;
  children: PortableTextSpan[];
  markDefs: PortableTextMarkDef[];
}

// Projects & Insights
export interface Project {
  title: string;
  slug: string;
  description?: string;
  location?: string;
  imageUrl?: string;
  content?: PortableTextBlock[];
}

export interface Insight {
  title: string;
  description?: string;
  imageUrl?: string;
  content?: PortableTextBlock[];
}

// Session helpers
export const SANITY_SESSION_KEY = "data";

export function readSanityFromSession(): SanityPayload | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SANITY_SESSION_KEY);

  if (!raw) return null;
  try {
    return JSON.parse(raw) as SanityPayload;
  } catch {
    return null;
  }
}

export const emptySanityPayload: SanityPayload = {
  services: undefined,
  careers: [],
  projects: [],
  insights: [],
  aboutUs: undefined,
};

// Convenience accessor that returns the core sections with safe defaults
export function readSanityData(): SanityPayload {
  const r = readSanityFromSession();

  console.log("r", r);
  if (!r) return emptySanityPayload;
  return {
    services: r.services,
    careers: r.careers ?? [],
    projects: r.projects ?? [],
    insights: r.insights ?? [],
    aboutUs: r.aboutUs,
  };
}
