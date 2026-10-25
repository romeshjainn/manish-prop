import type {
  AvailabilityStatus,
  EnquiryType,
  ListingType,
  ProjectCategory,
  ProjectStatus,
  PropertyType,
} from "./types";

export const propertyTypeLabel: Record<PropertyType, string> = {
  apartment: "Apartment",
  "independent-house": "Independent house",
  villa: "Villa",
  "builder-floor": "Builder floor",
  plot: "Plot",
  office: "Office",
  shop: "Shop",
  warehouse: "Warehouse",
};

export const listingTypeLabel: Record<ListingType, string> = {
  sale: "For sale",
  rent: "For rent",
};

export const availabilityLabel: Record<AvailabilityStatus, string> = {
  available: "Available",
  "under-offer": "Under offer",
  sold: "Sold",
  rented: "Rented",
  withdrawn: "No longer available",
};

export const projectStatusLabel: Record<ProjectStatus, string> = {
  completed: "Completed",
  ongoing: "Under construction",
  upcoming: "Upcoming",
};

export const projectStatusDescription: Record<ProjectStatus, string> = {
  completed: "Finished developments, photographed as built.",
  ongoing: "Developments currently being built, with confirmed progress updates.",
  upcoming: "Planned developments. Register interest to hear first.",
};

export const projectCategoryLabel: Record<ProjectCategory, string> = {
  residential: "Residential",
  commercial: "Commercial",
  "mixed-use": "Mixed-use",
  plots: "Plots & land",
};

export const enquiryTypeLabel: Record<EnquiryType, string> = {
  buy: "I want to buy",
  rent: "I want to rent",
  sell: "I want to sell my property",
  let: "I want to rent out my property",
  project: "A project enquiry",
  property: "A specific listing",
  other: "Something else",
};
