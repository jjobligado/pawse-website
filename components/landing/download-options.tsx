import { getDownload, type DesktopOs, type PlatformDownloadInfo } from "@/hooks/use-platform";

/** Filled OS marks, sized by the caller's box; colour follows currentColor. */
export function OsIcon({ os }: { os: DesktopOs }) {
    if (os === "windows") {
        return (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 3h8.5v8.5H3V3zm9.5 0H21v8.5h-8.5V3zM3 12.5h8.5V21H3v-8.5zm9.5 0H21V21h-8.5v-8.5z" />
            </svg>
        );
    }
    if (os === "mac") {
        return (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.48-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83zM15.96 6.33c.67-.81 1.12-1.94 1-3.08-.96.04-2.13.64-2.82 1.45-.61.7-.15 1.86-1.01 2.97 1.08.08 2.16-.53 2.83-1.34z" />
            </svg>
        );
    }
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C9.5 2 8 3.9 8 6.5c0 1.3.4 2.4.9 3.3C7.2 11.4 6 13.7 6 16.2c0 1.4.4 2.6 1.1 3.5-.4.3-.6.7-.6 1.1 0 .7.8 1.2 2 1.2.9 0 1.7-.3 2.1-.8.4.1.9.1 1.4.1s1-.1 1.4-.1c.4.5 1.2.8 2.1.8 1.2 0 2-.5 2-1.2 0-.4-.2-.8-.6-1.1.7-.9 1.1-2.1 1.1-3.5 0-2.5-1.2-4.8-2.9-6.4.5-.9.9-2 .9-3.3C16 3.9 14.5 2 12 2zm-1.5 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-1.5 2.3c1.1 0 2 .5 2 1.1s-.9 1.1-2 1.1-2-.5-2-1.1.9-1.1 2-1.1zm0 3.7c2 0 3.5 1.9 3.5 4.2 0 1.8-1.5 3.3-3.5 3.3s-3.5-1.5-3.5-3.3c0-2.3 1.5-4.2 3.5-4.2z" />
        </svg>
    );
}

/**
 * The line under a desktop download button: which build the button gives, and
 * for Mac / Linux a quiet link to the other build ("Intel Mac? Download here").
 */
export function DownloadNote({ info }: { info: PlatformDownloadInfo }) {
    if (!info.note) return null;
    const alt = info.alt && getDownload(info.alt.id);
    return (
        <span suppressHydrationWarning className="inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-center">
            <span>{info.note}</span>
            {info.alt && alt && (
                <>
                    <span aria-hidden="true">·</span>
                    <span>
                        {info.alt.prompt}{" "}
                        <a href={alt.href} download={alt.fileName} className="font-medium text-ink link-underline">
                            {info.alt.link}
                        </a>
                    </span>
                </>
            )}
        </span>
    );
}
