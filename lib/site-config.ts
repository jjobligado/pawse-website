/** Site-wide constants shared across pages and components. */

/** Public team inbox for questions, bug reports, feature requests and feedback. */
export const CONTACT_EMAIL = "pawseapp.team@gmail.com";

export const SITE_NAME = "PAWSE";
export const SITE_TITLE = "PAWSE — The Coziest Way to Get Things Done";
export const SITE_DESCRIPTION =
    "A calm Pomodoro timer for your desktop, with a pixel cat who focuses alongside you. Free to download for Windows, macOS and Linux. Works offline.";

/**
 * The public address of the site, used for canonical URLs, the sitemap,
 * robots.txt and link previews. Set NEXT_PUBLIC_SITE_URL (e.g.
 * "https://pawse.app") once the production domain exists. On Vercel it falls
 * back to the project's production URL; locally, to localhost.
 */
export const SITE_URL = (() => {
    const explicit = process.env.NEXT_PUBLIC_SITE_URL;
    if (explicit) return explicit.replace(/\/+$/, "");
    const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    if (vercel) return `https://${vercel}`;
    return "http://localhost:3000";
})();
