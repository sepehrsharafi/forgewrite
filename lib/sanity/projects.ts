import "server-only";
import type { PortableTextBlock } from "@portabletext/types";

export interface ProjectRecord {
  title: string;
  slug: string;
  imageUrl: string;
  description: string;
  location?: string;
}

export interface ProjectDetailRecord extends ProjectRecord {
  establishedAt?: string;
  breadCrumb?: string[];
  content?: PortableTextBlock[];
}

const SANITY_QUERY = `*[_type == "projects"] | order(_updatedAt desc){
  "title": coalesce(title, ""),
  "imageUrl": coalesce(image.asset->url, ""),
  "description": coalesce(description, ""),
  "location": coalesce(location, ""),
  "slug": coalesce(slug.current, "")
}`;

const SANITY_BASE_URL = process.env.SANITY_BASE_URL;

export async function getProjects(): Promise<ProjectRecord[]> {
  if (!SANITY_BASE_URL) {
    throw new Error("SANITY_BASE_URL is not configured.");
  }

  const searchParams = new URLSearchParams();
  searchParams.set("perspective", "published");
  searchParams.set("query", SANITY_QUERY);

  const response = await fetch(
    `${SANITY_BASE_URL}?${searchParams.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.status}`);
  }

  const data = (await response.json()) as {
    result?: ProjectRecord[];
  };

  return data.result ?? [];
}

const SANITY_PROJECT_DETAIL_QUERY = `*[_type == "projects" && slug.current == $slug][0]{
  "title": coalesce(title, ""),
  "slug": coalesce(slug.current, ""),
  "imageUrl": coalesce(image.asset->url, ""),
  "description": coalesce(description, ""),
  "location": coalesce(location, ""),
  "establishedAt": coalesce(establishedAt, ""),
  "breadCrumb": coalesce(breadCrumb, []),
  "content": select(
    defined(content) => content[]{
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => {
          ...,
          "slug": reference->slug
        }
      }
    },
    []
  )
}`;

export async function getProjectBySlug(
  slug: string
): Promise<ProjectDetailRecord | null> {
  if (!SANITY_BASE_URL) {
    throw new Error("SANITY_BASE_URL is not configured.");
  }

  const searchParams = new URLSearchParams();
  searchParams.set("perspective", "published");
  searchParams.set("query", SANITY_PROJECT_DETAIL_QUERY);
  searchParams.set("$slug", JSON.stringify(slug));

  const response = await fetch(
    `${SANITY_BASE_URL}?${searchParams.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch project ${slug}: ${response.status}`);
  }

  const data = (await response.json()) as {
    result?: ProjectDetailRecord | null;
  };

  return data.result ?? null;
}
