import type { MediaImage } from "@/lib/types";

/**
 * Illustrative stock photography (Unsplash licence) used ONLY by demo
 * records. These are not photographs of Manish Property projects.
 * See public/images/demo/CREDITS.md.
 */
const sizes = {
  "apartment-balconies": [1800, 1200],
  "apartment-block-dark": [1800, 2400],
  "brick-apartments": [1800, 1332],
  "brick-townhouse": [1800, 1200],
  "city-towers": [1800, 1048],
  "construction-site": [1800, 1200],
  "gabled-house-dusk": [1800, 1200],
  "glass-living-stair": [1800, 1200],
  "glass-towers": [1800, 1200],
  "house-in-trees": [1800, 1200],
  "house-pool-palms": [1800, 1200],
  "living-room-bright": [1800, 1200],
  "living-room-gallery-wall": [1800, 1350],
  "living-room-plants": [1800, 1339],
  "modern-house-dusk": [1800, 1200],
  "modern-villa-pool": [1800, 1350],
  "office-interior": [1800, 1202],
  "open-field": [1800, 1013],
  "open-plan-living": [1800, 1224],
  "suburban-houses": [1800, 1200],
  "timber-house-facade": [1800, 1200],
  "white-house-courtyard": [1800, 1800],
  "white-villa-cantilever": [1800, 1200],
  "white-villa-pool": [1800, 1200],
  "white-villa-terrace": [1800, 1194],
} satisfies Record<string, [number, number]>;

export type DemoImageName = keyof typeof sizes;

export function demoImage(name: DemoImageName, alt: string): MediaImage {
  const [width, height] = sizes[name];
  return { src: `/images/demo/${name}.jpg`, alt, width, height, kind: "illustrative" };
}
