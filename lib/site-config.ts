/** Site-wide constants shared across pages and components. */

/** Public team inbox for questions, bug reports, feature requests and feedback. */
export const CONTACT_EMAIL = "pawseapp.team@gmail.com";

/** Builds a mailto: link with an encoded subject and body. */
export function buildMailto(subject: string, body: string) {
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
