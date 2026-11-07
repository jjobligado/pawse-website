/**
 * Contact message delivery.
 *
 * Currently sends through Web3Forms (https://web3forms.com), which forwards each
 * submission to the team inbox. Everything provider-specific lives in this file:
 * moving to an own API route or a helpdesk later only means rewriting
 * `sendContactMessage`, not the form UI.
 */

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

/** Public by design (it ships in the page); set in .env.local and the host's env vars. */
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";

export const isContactFormConfigured = ACCESS_KEY.length > 0;

export interface ContactMessage {
    /** Full topic label, e.g. "Bug Report". */
    topic: string;
    name: string;
    email: string;
    message: string;
    /** Visitor's detected desktop OS, if any (helps triage bug reports). */
    os: string;
    /** Honeypot: real visitors never fill this; bots often do. */
    botcheck: boolean;
}

export type SendResult = { ok: true } | { ok: false; reason: string };

export async function sendContactMessage(input: ContactMessage): Promise<SendResult> {
    if (!isContactFormConfigured) {
        return { ok: false, reason: "The contact form isn't set up yet." };
    }

    try {
        const response = await fetch(WEB3FORMS_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                access_key: ACCESS_KEY,
                subject: `[PAWSE] ${input.topic}`,
                from_name: "PAWSE Website",
                // Web3Forms uses `email` as the reply-to, so "Reply" in Gmail reaches the visitor.
                email: input.email,
                name: input.name || "(not provided)",
                topic: input.topic,
                os: input.os || "(not detected)",
                message: input.message,
                botcheck: input.botcheck,
            }),
        });

        if (response.status === 429) {
            return { ok: false, reason: "Too many messages right now. Please try again in a minute." };
        }

        const data = (await response.json().catch(() => null)) as { success?: boolean } | null;
        if (response.ok && data?.success) return { ok: true };

        return { ok: false, reason: "We couldn't send your message." };
    } catch {
        return { ok: false, reason: "We couldn't reach the server. Check your connection." };
    }
}
