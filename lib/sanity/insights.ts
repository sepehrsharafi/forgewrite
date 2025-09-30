import "server-only";
import type { PortableRichTextBlock } from "@/app/UI/portableText";

export interface InsightRecord {
  title: string;
  slug: string;
  imageUrl: string;
  description: string;
}

export interface InsightDetailRecord extends InsightRecord {
  content?: PortableRichTextBlock[];
}

const SANITY_QUERY = `*[_type == "insights"]| order(_updatedAt desc){
  "title": coalesce(title, ""),
  "slug": coalesce(slug.current, ""),
  "imageUrl": coalesce(image.asset->url, ""),
  "description": coalesce(description, ""),
}`;

const SANITY_BASE_URL = process.env.SANITY_BASE_URL;

export async function getInsights(): Promise<InsightRecord[]> {
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
    throw new Error(`Failed to fetch insights: ${response.status}`);
  }

  const data = (await response.json()) as {
    result?: InsightRecord[];
  };

  return data.result ?? [];
}

const SANITY_DETAIL_QUERY = `*[_type == "insights" && slug.current == $slug][0]{
  "title": coalesce(title, ""),
  "slug": coalesce(slug.current, ""),
  "imageUrl": coalesce(image.asset->url, ""),
  "description": coalesce(description, ""),
  "content": select(
    defined(content) => content[]{
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => {
          ...,
          "slug": reference->slug
        }
      },
      _type == "image" => {
        ...,
        asset->{
          url,
          metadata{
            dimensions{
              width,
              height,
              aspectRatio
            }
          }
        },
        "alt": coalesce(alt, asset->altText, ""),
        "caption": coalesce(caption, "")
      }
    },
    []
  )
}`;

export async function getInsightBySlug(
  slug: string
): Promise<InsightDetailRecord | null> {
  if (!SANITY_BASE_URL) {
    throw new Error("SANITY_BASE_URL is not configured.");
  }

  const searchParams = new URLSearchParams();
  searchParams.set("perspective", "published");
  searchParams.set("query", SANITY_DETAIL_QUERY);
  searchParams.set("$slug", JSON.stringify(slug));

  const response = await fetch(
    `${SANITY_BASE_URL}?${searchParams.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch insight ${slug}: ${response.status}`);
  }

  const data = (await response.json()) as {
    result?: InsightDetailRecord | null;
  };

  return data.result ?? null;
}
