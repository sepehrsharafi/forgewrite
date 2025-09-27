import "server-only";

export interface CareerRecord {
  title: string;
  slug: string;
  workLocation: string;
  employmentType: string;
}

const SANITY_BASE_URL = process.env.SANITY_BASE_URL;

const CAREERS_QUERY = `*[_type == "career"]{
  "title": coalesce(title, ""),
  "slug": coalesce(slug.current, ""),
  "workLocation": coalesce(workLocation, ""),
  "employmentType": coalesce(employmentType, ""),
  "link": coalesce(link, "")
}`;

export async function getCareers(): Promise<CareerRecord[]> {
  const searchParams = new URLSearchParams();
  searchParams.set("perspective", "published");
  searchParams.set("query", CAREERS_QUERY);

  const response = await fetch(
    `${SANITY_BASE_URL}?${searchParams.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch careers: ${response.status}`);
  }

  const data = (await response.json()) as {
    result?: CareerRecord[] | null;
  };

  return Array.isArray(data.result) ? data.result : [];
}
