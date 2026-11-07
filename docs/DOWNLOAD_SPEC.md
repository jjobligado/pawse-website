# PAWSE Download System & CTA Platform Matrix

This specification details the client-side operating system detection, adaptive Call-to-Action (CTA) states, and integration guidelines for the developer responsible for placing and managing the actual application installers.

---

## 1. Platform & Device Matrix

| Target Platform / Device | Client Detection Triggers | Primary CTA Label & Icon | Click Action | Visual States (Default / Hover / Active) | Secondary Meta-Row Content | Target File / Payload |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Windows Desktop** | `Windows`, `Win32`, `Win64` | `[↓] Download for Windows` | Initiates browser file download | **Base:** `#35A6F1`<br>**Hover:** `#2394DF`<br>**Active:** `#1B7FBE` | `Other platforms ▾` • `View on GitHub →` | `pawse-setup.exe` (`.exe`) |
| **macOS Desktop** | `Macintosh`, `MacIntel` *(non-touch)* | `[↓] Download for Mac` | Initiates browser file download | **Base:** `#35A6F1`<br>**Hover:** `#2394DF`<br>**Active:** `#1B7FBE` | `Other platforms ▾` • `View on GitHub →` | `pawse.dmg` (`.dmg`) |
| **Linux Desktop** | `Linux`, `X11` *(excluding Android)* | `[↓] Download for Linux` | Initiates browser file download | **Base:** `#35A6F1`<br>**Hover:** `#2394DF`<br>**Active:** `#1B7FBE` | `Other platforms ▾` • `View on GitHub →` | `pawse.AppImage` (`.AppImage`) |
| **Mobile & Tablets** *(iOS, iPadOS, Android)* | `iPhone`, `iPad`, `Android`, `Mobile`, `Tablet`, `maxTouchPoints > 1` | `[↗] Send to My Desktop`<br>*(Turns into `[✓] Link Copied to Clipboard! 🐾`)* | 1. Tries Web Share API (`navigator.share`)<br>2. Copies `window.location.href` to clipboard with 2.5s success state | **Base:** `#35A6F1`<br>**Copied:** `#10B981`<br>**Active:** `#059669` | `PAWSE is built for Windows, Mac & Linux` • `View on GitHub →` | Clipboard URL payload |
| **Fallback / Unknown** | Unrecognized desktop user-agent | `[↓] Download for Windows` | Initiates browser file download | **Base:** `#35A6F1`<br>**Hover:** `#2394DF`<br>**Active:** `#1B7FBE` | `Other platforms ▾` • `View on GitHub →` | `pawse-setup.exe` (`.exe`) |

---

## 2. Frontend Implementation Overview

- **Hook File**: `hooks/use-platform.ts`
- **UI Component**: `components/landing/hero-section.tsx`
- **Hook Pattern**: Custom React 19 hook `usePlatform()` using `useSyncExternalStore` (zero SSR hydration mismatches).
- **QA/Dev Switcher**: Allows developers and testers to preview any OS locally via `?os=windows`, `?os=mac`, `?os=linux`, or `?os=mobile` (automatically disabled in production).
- **DOM Signifiers**: The main download anchor contains `data-os="{windows|mac|linux|mobile|other}"` for automated testing, analytics tracking, and script hooking.

### Secondary Meta-Row & `"Other platforms ▾"` Popover Specifications

Beneath the primary pill CTA button, the secondary meta-row provides cross-platform access without competing with the main download button:

- **Desktop Behavior (`windows`, `mac`, `linux`, `other`)**:
  - Renders an interactive **`Other platforms ▾`** button anchored directly to a floating popover menu (`role="menu"`).
  - Lists all three desktop targets (**Windows** `.exe`, **macOS** `.dmg`, and **Linux** `.AppImage`) with equal visual hierarchy, solid-filled platform icons, parallel compatibility subtitles, and file extension indicators (`↓`).
  - Supports click-outside dismissal (`mousedown`), `Escape` key dismissal (`keydown`), and `WCAG 2.1 SC 2.4.3` keyboard focus compliance (`visible` / `invisible` visibility toggling so closed menu links are excluded from the `Tab` order).
  - The Hero Copy container uses `relative z-30` so the open popover cleanly floats above the App Visuals Showcase (`z-10`) below it.
- **Mobile Behavior (`mobile`)**:
  - Replaces the dropdown trigger with plain non-interactive text (`"PAWSE is built for Windows, Mac & Linux"`) so mobile visitors are not prompted to download desktop binaries onto a phone or tablet.
- **UI/UX & Optical Symmetry Standards**:
  - Neither `Other platforms ▾` nor `View on GitHub →` uses a text underline, relying on their trailing geometric icons (`▾` and `→`) as non-color signifiers (`WCAG 1.4.1`).
  - Both `16×16` (`viewBox="0 0 24 24"`) icons share identical internal `12`-unit span and `6`-unit diagonal arm geometry (`points="6 9 12 15 18 9"` and `M6 12H18` + `M12 6L18 12L12 18`) and `gap-1` (`4px`) spacing.
  - On hover (and while the menu is open), text weight thickens in-place via `[-webkit-text-stroke:0.35px_currentColor]` and icon strokes thicken from `1px` to `1.5px` (`[stroke-width:1.5px]`), eliminating horizontal layout shifts.

### Configuration Object (`PLATFORM_CONFIG` & `DESKTOP_PLATFORMS`)

In `hooks/use-platform.ts`, all download definitions and popover items are centralized in `PLATFORM_CONFIG` and `DESKTOP_PLATFORMS`:

```typescript
export const DESKTOP_PLATFORMS: DesktopPlatformOption[] = [
    {
        id: "windows",
        name: "Windows",
        subtitle: "Windows 10 & 11 (64-bit)",
        extension: ".exe",
        fileName: "pawse-setup.exe",
        href: "/downloads/pawse-setup.exe",
    },
    {
        id: "mac",
        name: "macOS",
        subtitle: "Apple Silicon & Intel",
        extension: ".dmg",
        fileName: "pawse.dmg",
        href: "/downloads/pawse.dmg",
    },
    {
        id: "linux",
        name: "Linux",
        subtitle: "64-bit Linux (x86_64)",
        extension: ".AppImage",
        fileName: "pawse.AppImage",
        href: "/downloads/pawse.AppImage",
    },
];

export const PLATFORM_CONFIG: Record<DetectedPlatform, PlatformDownloadInfo> = {
    windows: {
        label: "Download for Windows",
        fileName: "pawse-setup.exe",
        href: "/downloads/pawse-setup.exe",
        isDownload: true,
        altPlatformText: "Other platforms",
        iconType: "download",
    },
    mac: {
        label: "Download for Mac",
        fileName: "pawse.dmg",
        href: "/downloads/pawse.dmg",
        isDownload: true,
        altPlatformText: "Other platforms",
        iconType: "download",
    },
    linux: {
        label: "Download for Linux",
        fileName: "pawse.AppImage",
        href: "/downloads/pawse.AppImage",
        isDownload: true,
        altPlatformText: "Other platforms",
        iconType: "download",
    },
    mobile: {
        label: "Send to My Desktop",
        href: "#",
        isDownload: false,
        isMobileShare: true,
        altPlatformText: "PAWSE is built for Windows, Mac & Linux",
        iconType: "share",
    },
    other: {
        label: "Download for Windows",
        fileName: "pawse-setup.exe",
        href: "/downloads/pawse-setup.exe",
        isDownload: true,
        altPlatformText: "Other platforms",
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
           ├── pawse.dmg         <-- macOS installer
           └── pawse.AppImage    <-- Linux AppImage
   ```
2. Any file placed inside `public/downloads/` is automatically served by Next.js at `/downloads/<filename>`.
3. The existing `PLATFORM_CONFIG` and `DESKTOP_PLATFORMS` hrefs are already set to `/downloads/pawse-setup.exe`, `/downloads/pawse.dmg`, and `/downloads/pawse.AppImage`.

> [!NOTE]
> Ensure Git LFS (`git-lfs`) is configured if committing large binaries (>50MB) to Git, or add `public/downloads/*.exe`, `public/downloads/*.dmg`, and `public/downloads/*.AppImage` to `.gitignore` and upload them during CI/CD build deployment.

---

### Approach B: Cloud Storage / CDN / GitHub Releases (Recommended for Production)

If hosting installers on an external CDN (e.g. AWS S3, Cloudflare R2) or GitHub Releases:

1. Add environment variables to `.env.local` (and your production hosting environment, e.g. Vercel):
   ```env
   NEXT_PUBLIC_DOWNLOAD_WINDOWS_URL="https://github.com/jjobligado/pawse-app/releases/latest/download/pawse-setup.exe"
   NEXT_PUBLIC_DOWNLOAD_MAC_URL="https://github.com/jjobligado/pawse-app/releases/latest/download/pawse.dmg"
   NEXT_PUBLIC_DOWNLOAD_LINUX_URL="https://github.com/jjobligado/pawse-app/releases/latest/download/pawse.AppImage"
   ```
2. Update `PLATFORM_CONFIG` and `DESKTOP_PLATFORMS` in `hooks/use-platform.ts`:
   ```typescript
   windows: {
       href: process.env.NEXT_PUBLIC_DOWNLOAD_WINDOWS_URL || "/downloads/pawse-setup.exe",
       ...
   },
   mac: {
       href: process.env.NEXT_PUBLIC_DOWNLOAD_MAC_URL || "/downloads/pawse.dmg",
       ...
   },
   linux: {
       href: process.env.NEXT_PUBLIC_DOWNLOAD_LINUX_URL || "/downloads/pawse.AppImage",
       ...
   }
   ```

---

## 4. Platform-Specific Considerations

### macOS (.dmg)
- **Universal vs. Architecture-Specific**:
  - If distributing a Universal DMG (Intel + Apple Silicon), a single `pawse.dmg` suffices.
  - If compiling separate binaries (e.g. `pawse-arm64.dmg` and `pawse-x64.dmg`), you can expand `DESKTOP_PLATFORMS` in `hooks/use-platform.ts` to list both Apple Silicon and Intel options inside the `"Other platforms ▾"` popover.
- **Code Signing & Notarization**: macOS Gatekeeper will block unsigned `.dmg` files. Ensure the artifact has been signed with an Apple Developer ID and notarized using `xcrun notarytool`.

### Windows (.exe)
- **SmartScreen**: Unsigned `.exe` installers will trigger Windows Defender SmartScreen warnings. Sign the installer with an EV (Extended Validation) code-signing certificate to establish instant SmartScreen reputation.

### Linux (.AppImage)
- **Universal Package**: `.AppImage` runs across Ubuntu, Fedora, Debian, Arch, and Linux Mint without root installation. Users simply make the binary executable (`chmod +x pawse.AppImage`) and run it.
- If additional Linux formats (e.g. `.deb` or `.rpm`) are added later, append them to `DESKTOP_PLATFORMS` in `hooks/use-platform.ts`.

---

## 5. How to Test Different Operating Systems (Without Extra Devices)

Developers and QA engineers do not need physical Windows, Mac, Linux, or Mobile devices to test every platform state. Use one of the four methods below:

### Method 1: URL Preview Switcher (Fastest & Zero-Config)

During local development (`process.env.NODE_ENV === "development"`), the `usePlatform` hook monitors the `?os=` query parameter. Simply append the target platform to your local URL:

| Target Platform to Test | Local URL | Rendered CTA | Target Action |
| :--- | :--- | :--- | :--- |
| **Windows Desktop** | `http://localhost:3000/?os=windows` | `[↓] Download for Windows` | Downloads `pawse-setup.exe` |
| **macOS Desktop** | `http://localhost:3000/?os=mac` | `[↓] Download for Mac` | Downloads `pawse.dmg` |
| **Linux Desktop** | `http://localhost:3000/?os=linux` | `[↓] Download for Linux` | Downloads `pawse.AppImage` |
| **Mobile / Tablet** | `http://localhost:3000/?os=mobile` | `[↗] Send to My Desktop` | Copies URL to clipboard with 2.5s green success badge |

> [!NOTE]
> **Production Safety**: This override is strictly gated behind `process.env.NODE_ENV === "development"`. It is completely disabled and ignored on production builds.

---

### Method 2: Browser DevTools User-Agent Emulation (Native Detection Test)

To test the real User-Agent and platform detection regex without using query parameters:

1. Open **DevTools** in Chrome, Edge, or Brave (`F12` or `Ctrl + Shift + I` / `Cmd + Option + I`).
2. Open the Command Menu: `Ctrl + Shift + P` (`Cmd + Shift + P` on macOS).
3. Type `Network conditions` and press **Enter**.
4. In the **Network conditions** drawer at the bottom:
   - Uncheck **"Use browser default"** next to **User agent**.
   - Choose a preset from the dropdown:
     - **Chrome — Mac**: Emulates macOS desktop detection.
     - **Chrome — Linux**: Emulates Linux desktop detection.
     - **Chrome — Windows**: Emulates Windows desktop detection.
     - **Safari — iPhone iOS** or **Chrome — Android Mobile**: Emulates mobile detection.
5. Refresh the page (`F5` or `Ctrl + R`).

---

### Method 3: Mobile & Tablet Simulation (Device Mode)

To test the mobile CTA behavior, touch events, and clipboard copy feedback:

1. In DevTools, click the **Toggle device toolbar** button or press `Ctrl + Shift + M` (`Cmd + Shift + M`).
2. Select a device (e.g. **iPhone 14 Pro**, **Pixel 7**, or **iPad Air**).
3. Reload the page so the browser registers mobile touch points.
4. Click **"Send to My Desktop"**:
   - The button triggers `navigator.clipboard.writeText(window.location.href)`.
   - The button text and color morph into a green `[✓] Link Copied to Clipboard! 🐾` state for 2.5 seconds before smoothly reverting.

---

### Method 4: Automated E2E Testing (Playwright / Cypress)

You can easily automate platform verification in continuous integration. The primary CTA anchor renders a predictable `data-os` DOM attribute (`data-os="windows"`, `data-os="mac"`, `data-os="linux"`, `data-os="mobile"`):

```typescript
// Example: Playwright test suite (e2e/download-cta.spec.ts)
import { test, expect } from '@playwright/test';

test.describe('Platform-adaptive Download CTA', () => {
  test('renders Mac download button when macOS user-agent is present', async ({ browser }) => {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3000');

    const cta = page.locator('a[data-os="mac"]');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText('Download for Mac');
    await expect(cta).toHaveAttribute('href', '/downloads/pawse.dmg');
  });

  test('URL override forces Linux download CTA in development', async ({ page }) => {
    await page.goto('http://localhost:3000/?os=linux');
    const cta = page.locator('a[data-os="linux"]');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText('Download for Linux');
    await expect(cta).toHaveAttribute('href', '/downloads/pawse.AppImage');
  });

  test('Other platforms popover opens and exposes Windows, macOS, and Linux installers', async ({ page }) => {
    await page.goto('http://localhost:3000/?os=windows');
    const trigger = page.getByRole('button', { name: /Other platforms/i });
    await trigger.click();

    const menu = page.getByRole('menu', { name: /Download PAWSE for other platforms/i });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('menuitem')).toHaveCount(3);
  });
});
```
