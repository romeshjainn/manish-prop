/**
 * Site-wide runtime settings.
 *
 * PREVIEW MODE
 * ------------
 * When preview mode is on, the site also shows:
 *   - demo properties and projects (records with `isDemo: true`)
 *   - services / strengths not yet confirmed by the owner
 *   - "content needed" notes where business information is missing
 * and every page is marked `noindex` with a visible preview banner.
 *
 * Default: ON in `next dev`, OFF in production builds.
 * Override with SHOW_DEMO_CONTENT=true|false in the environment.
 */
const flag = process.env.SHOW_DEMO_CONTENT;

export const previewMode: boolean =
  flag === "true" ? true : flag === "false" ? false : process.env.NODE_ENV !== "production";

export const siteUrl: string = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const PROPERTIES_PER_PAGE = 9;
