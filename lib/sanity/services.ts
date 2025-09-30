import "server-only";

import type {
  ServiceCategory,
  ServiceCategoryId,
  ServicesData,
} from "./types";

export type { ServiceCategory, ServiceCategoryId, ServicesData } from "./types";

const SANITY_BASE_URL = process.env.SANITY_BASE_URL;

const SERVICES_QUERY = `{
  "services": *[_type == "services"][0]{
    "engineers": {
      "label": coalesce(engineersButtonLabel, ""),
      "items": coalesce(engineersItems[].text, [])
    },
    "fieldSupport": {
      "label": coalesce(fieldSupportButtonLabel, ""),
      "items": coalesce(fieldSupportItems[].text, [])
    },
    "officeManagers": {
      "label": coalesce(officeManagersButtonLabel, ""),
      "items": coalesce(officeManagersItems[].text, [])
    }
  },
  "leader": *[_type == "aboutUs"][0]{
    "name": coalesce(ceo.name, ""),
    "imageUrl": coalesce(image.asset->url, "")
  }
}`;

export async function getServicesPageData(): Promise<ServicesData> {
  const searchParams = new URLSearchParams();
  searchParams.set("perspective", "published");
  searchParams.set("query", SERVICES_QUERY);

  const response = await fetch(
    `${SANITY_BASE_URL}?${searchParams.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch services data: ${response.status}`);
  }

  const data = (await response.json()) as {
    result?: {
      services?: Record<string, { label?: string; items?: string[] }>;
      leader?: { name?: string; imageUrl?: string } | null;
    };
  };

  const services = data.result?.services ?? {};
  const leader = data.result?.leader ?? null;

  const orderedIds: ServiceCategoryId[] = [
    "engineers",
    "fieldSupport",
    "officeManagers",
  ];

  const categories = orderedIds
    .map((id) => {
      const entry = services[id];
      if (!entry) return null;
      const items = Array.isArray(entry.items) ? entry.items : [];
      if (!entry.label && items.length === 0) return null;
      return {
        id,
        label: entry.label ?? "",
        items,
      } satisfies ServiceCategory;
    })
    .filter((item): item is ServiceCategory => Boolean(item));

  return {
    categories,
    leaderName: leader?.name ?? "",
    leaderImageUrl: leader?.imageUrl ?? "",
  };
}
