import "server-only";

export interface AboutPageRecord {
  aboutCompany: string;
  imageUrl: string;
  name: string;
  email: string;
}

const SANITY_BASE_URL = process.env.SANITY_BASE_URL;

const ABOUT_QUERY = `*[_type == "aboutUs"][0]{
  "aboutCompany": coalesce(aboutCompany, ""),
  "imageUrl": coalesce(image.asset->url, ""),
  "name": coalesce(ceo.name, ""),
  "email": coalesce(ceo.email, "")
}`;

export async function getAboutPageData(): Promise<AboutPageRecord | null> {
  const searchParams = new URLSearchParams();
  searchParams.set("perspective", "published");
  searchParams.set("query", ABOUT_QUERY);

  const response = await fetch(
    `${SANITY_BASE_URL}?${searchParams.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch about page data: ${response.status}`);
  }

  const data = (await response.json()) as {
    result?: Partial<AboutPageRecord> | null;
  };

  if (!data.result) return null;

  return {
    aboutCompany: data.result.aboutCompany ?? "",
    imageUrl: data.result.imageUrl ?? "",
    name: data.result.name ?? "",
    email: data.result.email ?? "",
  };
}
