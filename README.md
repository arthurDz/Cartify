# Cartify

## Overview
**Cartify** is a bare‑React‑Native demo that showcases an end‑to‑end e‑commerce flow: OAuth login, product catalogue, search with advanced filters, rich product‑detail carousel, and related‑item discovery.  
The app consumes the public Platzi Fake Store API (`https://api.escuelajs.co/api/v1`) and is architected for speed (JSI MMKV), security (encrypted token storage + auto‑refresh), and future scale (feature‑first folder layout, RTK global state).

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running](#running)
- [Project Structure](#project-structure)
- [Key Screens](#key-screens)
- [Core Services](#core-services)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Features
- 🔐 **OAuth login** with automatic refresh‑token handling  
- 🛍️ **Product list** with infinite scroll & skeleton placeholders  
- 🔎 **Advanced search** — debounced title search + min/max price + category dropdown  
- 🖼 **Detail screen** with Reanimated image carousel & pagination dots  
- 🤝 **Related products** (same category, paginated)  
- 💲 **Scalable price formatter** (`Intl.NumberFormat` with cache)  
- ⚡ **MMKV caching** for auth, settings and (optionally) product slices  
- 🌙 Safe‑area & responsive helpers (`horizontalScale`, `verticalScale`)  
- 📦 Ready for CI / Fastlane lanes (no Expo eject surprises)

## Prerequisites
| Tool | Minimum version |
|------|-----------------|
| Node | >= 18 |
| React Native CLI | >= 0.74 |
| Xcode | 14 (only for iOS build) |
| Android Studio | Flamingo + NDK r25c (for MMKV) |

## Installation

```bash
# clone the repo
git clone https://github.com/your‑user/cartify.git
cd cartify

# install JS deps
npm install

# iOS native deps
cd ios && pod install && cd ..
```

## Running

| Platform | Command |
|----------|---------|
| Metro bundler | `npm start` |
| iOS simulator | `npm run ios` |
| Android emulator | `npm run android` |

> **Tip:** Use a physical device for Android API 23+ to test MMKV AES encryption.

## Project Structure
```
app/
├── assets/
├── components/
├── navigation/
│   ├── AuthStack.js
│   └── AppStack.js
├── screens/
│   ├── Auth/
│   └── Products/
├── store/
│   ├── index.js
│   └── slices/
├── utils/
└── api/
    └── client.js
```

## Key Screens
| Screen | Highlights |
|--------|------------|
| **Login / Register** | Regex email + length validation, MMKV token persistence, Alert on server error. |
| **ProductList** | Infinite `FlatList`, horizontal category chips, pull‑to‑refresh. |
| **Search** | Debounced input, CancelToken, min/max price, category dropdown. |
| **ProductDetail** | Reanimated carousel, dynamic dot indicators, paginated `/related` endpoint. |

## Core Services
| File | Responsibility |
|------|----------------|
| `api/client.js` | Single axios instance, request logger, auth header, 401 queue + token refresh. |
| `store/mmkv.js` | Shared MMKV instance + redux‑persist adapter (AES ready). |
| `utils/price.js` | Cached `Intl.NumberFormat` helper – one‑liner to switch currency/locale. |

## Configuration

Create a `.env` at the repo root if you need to override defaults:

```dotenv
API_BASE_URL=https://api.escuelajs.co/api/v1
ENABLE_MMKV_ENCRYPTION=true
```

## Contributing
1. Fork ➜ create a feature branch (`feat/cart`)  
2. Follow Conventional Commits (`feat: …`, `fix: …`, `chore: …`)  
3. Run `npm run lint` before pushing.

PRs are welcome for:
- Detox E2E tests
- Offline product cache transformer
- Dark‑mode theming

## License
MIT © 2025 Your Name – fake‑store data courtesy of Escuelajs / Platzi.
