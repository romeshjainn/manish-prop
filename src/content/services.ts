import type { Service, Strength } from "@/lib/types";

/**
 * SERVICES
 * Set `confirmed: true` only for services Manish Property actually offers.
 * Unconfirmed services are visible in preview mode only. Edit titles and
 * descriptions freely; add or remove entries as needed.
 */
export const services: Service[] = [
  {
    id: "buying",
    title: "Buying a property",
    description:
      "Tell us your budget, preferred locations and must-haves. We shortlist suitable options, arrange visits and keep you informed at each step until the purchase is complete.",
    audience: "First-time buyers, upgrading families and anyone purchasing a home or plot.",
    icon: "key",
    enquiryType: "buy",
    confirmed: false,
  },
  {
    id: "selling",
    title: "Selling a property",
    description:
      "We help present your property accurately, share it with interested buyers and coordinate visits and conversations so you are not handling every call yourself.",
    audience: "Owners looking to sell a home, plot or commercial space.",
    icon: "tag",
    enquiryType: "sell",
    confirmed: false,
  },
  {
    id: "renting",
    title: "Rentals for tenants & landlords",
    description:
      "Tenants can share their requirements and receive matching options. Landlords can list a property and meet prospective tenants without the back-and-forth.",
    audience: "Tenants looking for a home or office, and owners looking to let.",
    icon: "home",
    enquiryType: "rent",
    confirmed: false,
  },
  {
    id: "commercial",
    title: "Commercial property",
    description:
      "Offices, shops and work spaces for sale or lease, matched to your floor-area, frontage and access requirements.",
    audience: "Businesses, retailers and professionals looking for premises.",
    icon: "building",
    enquiryType: "buy",
    confirmed: false,
  },
  {
    id: "plots",
    title: "Plots & land",
    description:
      "Residential and commercial plots, with clear information on size, access and location so you can compare options properly.",
    audience: "Buyers planning to build, and long-term land buyers.",
    icon: "map",
    enquiryType: "buy",
    confirmed: false,
  },
  {
    id: "projects",
    title: "Project enquiries",
    description:
      "Unit availability, configurations and pricing for the development projects listed on this website, straight from the people handling them.",
    audience: "Home buyers and investors interested in a specific project.",
    icon: "trending",
    enquiryType: "project",
    confirmed: false,
  },
];

/**
 * "WHY MANISH PROPERTY" — only keep points the business can stand behind.
 * Set `confirmed: true` once the owner has approved each statement.
 */
export const strengths: Strength[] = [
  {
    title: "Clear property information",
    body: "Each listing states its price, size and status plainly. Where something is not yet confirmed, we say so instead of guessing.",
    confirmed: false,
  },
  {
    title: "Direct conversations",
    body: "You speak with the people handling the property, by phone, WhatsApp or in person — not a call centre.",
    confirmed: false,
  },
  {
    title: "Help from shortlist to keys",
    body: "From the first shortlist through site visits and paperwork coordination, we stay involved until the deal is done.",
    confirmed: false,
  },
  {
    title: "Options for different needs",
    body: "Homes, plots and commercial spaces across budgets — to buy or to rent — so you can compare in one place.",
    confirmed: false,
  },
];
