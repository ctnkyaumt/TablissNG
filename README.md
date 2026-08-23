<p align="left">
  <img src="src/views/shared/tabliss.svg" alt="TablissNG logo" width="320" />
</p>

# TablissNG

> A fast, beautiful, and customizable New Tab page for Chromium, Firefox, Safari, and Web.

TablissNG offers a clean new tab experience packed with useful widgets, dynamic backgrounds, theming, and offline support.

---

## Features

- **Widgets**: Time, Weather (5-day forecast), Quick Links, Todo, Notes, Quotes, GitHub & LeetCode Calendars, Tally Counter, Currency Rates, IP Info, and more.
- **Backgrounds**: Unsplash, NASA APOD, Giphy, Wikimedia, Bing Daily Wallpaper, Solid Colors, Gradients, and custom uploads/URLs with automatic night dimming.
- **Customization**: Drag-and-drop widget positioning, custom fonts, outlines, time-based color transitions, and global accent colors.
- **Privacy & Offline**: No trackers, fully open source, and full offline caching support with Workbox.
- **Multilingual**: Over 30 translations supported.

---

## Installation

Download the latest pre-built extension packages from [Releases](https://github.com/ctnkyaumt/TablissNG/releases):

1. **Chromium (Chrome, Brave, Edge, Opera)**: Download `tabliss-chromium.zip`, extract, and load unpacked via `chrome://extensions` (Developer mode enabled).
2. **Firefox**: Download `tabliss-firefox.zip` and load via `about:debugging` (or install as temporary add-on).
3. **Web**: Deploy or host `tabliss-web.zip` as a static progressive web app (PWA).

---

## Development

Requires **Node.js (>= 22)** and **pnpm (>= 10)**.

```sh
# Clone repository
git clone https://github.com/ctnkyaumt/TablissNG.git
cd TablissNG

# Install dependencies
pnpm install

# Start local development server (Web)
pnpm run dev

# Target specific browsers in development
pnpm run dev:chromium
pnpm run dev:firefox
```

### Build

```sh
# Build for all targets
pnpm run build:chromium
pnpm run build:firefox
pnpm run build:web
pnpm run build:safari
```

### Environment Variables

Copy `.env.example` to `.env` to configure optional API keys (Unsplash, Giphy, NASA):

```sh
cp .env.example .env
```

---

## License & Credits

- Licensed under **GPL-3.0**.
- Originally created by [Joel Shepherd](https://github.com/joelshepherd). Fork maintained with improvements and contributions from the community.
