import "server-only";

export interface InsightRecord {
  title: string;
  slug: string;
  imageUrl: string;
  description: string;
}

export interface InsightDetailRecord extends InsightRecord {
  content: string;
}

const SANITY_QUERY = `*[_type == "insights"]{
  "title": coalesce(title, ""),
  "slug": coalesce(slug.current, ""),
  "imageUrl": coalesce(image.asset->url, ""),
  "description": coalesce(description, ""),
}`;

const SANITY_BASE_URL = process.env.SANITY_BASE_URL;

export async function getInsights(): Promise<InsightRecord[]> {
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
  "content": coalesce(pt::text(content), "")
}`;

export async function getInsightBySlug(
  slug: string
): Promise<InsightDetailRecord | null> {
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
