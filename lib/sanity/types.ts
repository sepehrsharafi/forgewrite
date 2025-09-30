export type ServiceCategoryId =
  | "engineers"
  | "fieldSupport"
  | "officeManagers";

export interface ServiceCategory {
  id: ServiceCategoryId;
  label: string;
  items: string[];
}

export interface ServicesData {
  categories: ServiceCategory[];
  leaderName: string;
  leaderImageUrl: string;
}
