# PWA

Production builds support installation and offline play after the first complete download. Serve the build over HTTPS (or localhost), including when hosted under a subdirectory. Serve `sw.js` with revalidation (`Cache-Control: no-cache`) and JavaScript MIME type; keep `index.html` revalidated too. Hashed assets can use immutable caching.

Open the accessibility menu and select **Cài đặt như App (PWA)**. Supported browsers show an install button when eligible; otherwise the sheet provides manual instructions. On iPhone/iPad, use Safari → Share → Add to Home Screen. Installation availability is controlled by the browser.

All emitted assets are precached. Updates wait until every game window is closed and then apply on reopening, preserving active gameplay. Development mode does not register a service worker. Browser storage eviction can remove offline files; reopen online to restore them.

Verify with `npm run build` followed by `node --test scripts/pwa.test.mjs`. Device QA: install on Android Chrome and iOS Safari, close/reopen in standalone mode, then enable airplane mode and reload. For updates, deploy another build, visit online, close all game windows, and reopen.
