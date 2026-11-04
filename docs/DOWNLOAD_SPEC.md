# PAWSE Download System & CTA Platform Matrix

This specification details the client-side operating system detection, adaptive Call-to-Action (CTA) states, and integration guidelines for the developer responsible for placing and managing the actual application installers.

---

## 1. Platform & Device Matrix

| Target Platform / Device | Client Detection Triggers | Primary CTA Label & Icon | Click Action | Visual States (Default / Hover / Active) | Secondary Meta-Row Content | Target File / Payload |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Windows Desktop** | `Windows`, `Win32`, `Win64` | `[↓] Download for Windows` | Initiates browser file download | **Base:** `#35A6F1`<br>**Hover:** `#2394DF`<br>**Active:** `#1B7FBE` | `Also available for macOS (.dmg)` • `View on GitHub ↗` | `pawse-setup.exe` (`.exe`) |
| **macOS Desktop** | `Macintosh`, `MacIntel` *(non-touch)* | `[↓] Download for Mac` | Initiates browser file download | **Base:** `#35A6F1`<br>**Hover:** `#2394DF`<br>**Active:** `#1B7FBE` | `Also available for Windows (.exe)` • `View on GitHub ↗` | `pawse.dmg` (`.dmg`) |
| **Linux Desktop** | `Linux`, `X11` *(excluding Android)* | `[🔔] Notify Me for Linux` | Smooth-scrolls to `#beta` & focuses email input | **Base:** `#35A6F1`<br>**Hover:** `#2394DF`<br>**Active:** `#1B7FBE` | `Linux build in progress` • `View on GitHub ↗` | N/A (Waitlist anchor) |
| **Mobile & Tablets** *(iOS, iPadOS, Android)* | `iPhone`, `iPad`, `Android`, `Mobile`, `Tablet`, `maxTouchPoints > 1` | `[↗] Send to My Desktop`<br>*(Turns into `[✓] Link Copied to Clipboard! 🐾`)* | 1. Tries Web Share API (`navigator.share`)<br>2. Copies `window.location.href` to clipboard with 2.5s success state | **Base:** `#35A6F1`<br>**Copied:** `#10B981`<br>**Active:** `#059669` | `PAWSE is built for Windows & Mac` • `View on GitHub ↗` | Clipboard URL payload |
| **Fallback / Unknown** | Unrecognized desktop user-agent | `[↓] Download for Windows` | Initiates browser file download | **Base:** `#35A6F1`<br>**Hover:** `#2394DF`<br>**Active:** `#1B7FBE` | `Also available for macOS (.dmg)` • `View on GitHub ↗` | `pawse-setup.exe` (`.exe`) |

---

## 2. Frontend Implementation Overview

- **Hook File**: `hooks/use-platform.ts`
- **UI Component**: `components/hero-section.tsx`
- **Hook Pattern**: Custom React 19 hook `usePlatform()` using `useSyncExternalStore` (zero SSR hydration mismatches).
- **QA/Dev Switcher**: Allows developers and testers to preview any OS locally via `?os=linux`, `?os=mac`, `?os=mobile` (automatically disabled in production).
- **DOM Signifiers**: The main download anchor contains `data-os="{windows|mac|linux|mobile|other}"` for automated testing, analytics tracking, and script hooking.

### Configuration Object (`PLATFORM_CONFIG`)

In `hooks/use-platform.ts`, all download definitions are centralized in `PLATFORM_CONFIG`:

```typescript
const PLATFORM_CONFIG: Record<DetectedPlatform, PlatformDownloadInfo> = {
    windows: {
        label: "Download for Windows",
        fileName: "pawse-setup.exe",
        href: "/downloads/pawse-setup.exe",
        isDownload: true,
        altPlatformText: "Also available for macOS",
        altPlatformFile: "/downloads/pawse.dmg",
        iconType: "download",
    },
    mac: {
        label: "Download for Mac",
        fileName: "pawse.dmg",
        href: "/downloads/pawse.dmg",
        isDownload: true,
        altPlatformText: "Also available for Windows",
        altPlatformFile: "/downloads/pawse-setup.exe",
        iconType: "download",
    },
    linux: {
        label: "Notify Me for Linux",
        href: "#beta",
        isDownload: false,
        altPlatformText: "Linux build in progress",
        iconType: "bell",
    },
    mobile: {
        label: "Send to My Desktop",
        href: "#",
        isDownload: false,
        isMobileShare: true,
        altPlatformText: "PAWSE is built for Windows & Mac",
        iconType: "share",
    },
    other: {
        label: "Download for Windows",
        fileName: "pawse-setup.exe",
        href: "/downloads/pawse-setup.exe",
        isDownload: true,
        altPlatformText: "Also available for macOS",
        altPlatformFile: "/downloads/pawse.dmg",
        iconType: "download",
    },
};
```

---

## 3. Developer Integration Guide (Placing the Actual Files)

Depending on your distribution infrastructure, use one of the two strategies below:

### Approach A: Local Static Hosting in the Repository (Simple)

If hosting installers directly via Next.js:

1. Create a `public/downloads/` directory:
   ```text
   pawse-website/
   └── public/
       └── downloads/
           ├── pawse-setup.exe   <-- Windows installer
           └── pawse.dmg         <-- macOS installer
   ```
2. Any file placed inside `public/downloads/` is automatically served by Next.js at `/downloads/<filename>`.
3. The existing `PLATFORM_CONFIG` hrefs are already set to `/downloads/pawse-setup.exe` and `/downloads/pawse.dmg`.

> [!NOTE]
> Ensure Git LFS (`git-lfs`) is configured if committing large binaries (>50MB) to Git, or add `public/downloads/*.exe` and `public/downloads/*.dmg` to `.gitignore` and upload them during CI/CD build deployment.

---

### Approach B: Cloud Storage / CDN / GitHub Releases (Recommended for Production)

If hosting installers on an external CDN (e.g. AWS S3, Cloudflare R2) or GitHub Releases:

1. Add environment variables to `.env.local` (and your production hosting environment, e.g. Vercel):
   ```env
   NEXT_PUBLIC_DOWNLOAD_WINDOWS_URL="https://github.com/jjobligado/pawse-app/releases/latest/download/pawse-setup.exe"
   NEXT_PUBLIC_DOWNLOAD_MAC_URL="https://github.com/jjobligado/pawse-app/releases/latest/download/pawse.dmg"
   ```
2. Update `PLATFORM_CONFIG` in `hooks/use-platform.ts`:
   ```typescript
   windows: {
       href: process.env.NEXT_PUBLIC_DOWNLOAD_WINDOWS_URL || "/downloads/pawse-setup.exe",
       ...
   },
   mac: {
       href: process.env.NEXT_PUBLIC_DOWNLOAD_MAC_URL || "/downloads/pawse.dmg",
       ...
   }
   ```

---

## 4. Platform-Specific Considerations

### macOS (.dmg)
- **Universal vs. Architecture-Specific**:
  - If distributing a Universal DMG (Intel + Apple Silicon), a single `pawse.dmg` suffices.
  - If compiling separate binaries (e.g. `pawse-arm64.dmg` and `pawse-x64.dmg`), you can expand the detection logic in `components/hero-section.tsx` or provide a platform switcher on the secondary row.
- **Code Signing & Notarization**: macOS Gatekeeper will block unsigned `.dmg` files. Ensure the artifact has been signed with an Apple Developer ID and notarized using `xcrun notarytool`.

### Windows (.exe)
- **SmartScreen**: Unsigned `.exe` installers will trigger Windows Defender SmartScreen warnings. Sign the installer with an EV (Extended Validation) code-signing certificate to establish instant SmartScreen reputation.

### Linux (Future Activation)
When the Linux release is ready:
1. Change `linux.isDownload` to `true`.
2. Change `linux.label` to `"Download for Linux"`.
3. Set `linux.href` to your package target (e.g. `pawse.AppImage`, `.deb`, or `.tar.gz`).
4. Change `linux.iconType` from `"bell"` to `"download"`.
