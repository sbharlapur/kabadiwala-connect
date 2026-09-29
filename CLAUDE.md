# Kabadiwala Connect - Engineering Guide (SIH 2026 Problem Statement 26229)

Kabadiwala Connect brings informal scrap collectors (*kabadiwalas*) into the formal e-waste recycling chain through an AI-powered offline-first mobile PWA, verifiable custody handovers, and real-time CPCB/SPCB compliance integration for authorized recyclers.

## Monorepo Architecture

```
F:\stitch_kabadiwala_connect_app/
├── apps/
│   ├── collector/       # Offline-first Mobile PWA (React + Vite + Dexie + Workbox)
│   └── recycler/        # Authorized Recycler Portal & Dashboard (React + Vite)
├── packages/
│   ├── ui/              # Design System (High-Contrast Utilitarian Tactility, DESIGN.md)
│   └── shared/          # Shared TypeScript types, Zod schemas, API client
├── server/              # FastAPI + SQLAlchemy 2 + PostgreSQL + ML valuation engine
├── ml/                  # 7-category E-waste classifier & Anomaly models
├── scripts/             # setup_db.py, seed.py, doctor.py, gen_api.py
└── docs/                # LOCAL_SETUP.md, DEMO.md, ARCHITECTURE.md
```

## Quick Start Commands

- `npm run setup` - Automated environment setup (DB check/init, migrations, seeds, dependencies)
- `npm run dev` - Launch full stack (FastAPI backend on port 8000, Collector on 5173, Recycler on 5174)
- `npm run doctor` - Run pre-flight health diagnostics (PostgreSQL, FastAPI, builds, tests)
- `npm run migrate` - Apply database migrations
- `npm run seed` - Seed realistic Indian scrap rates, recyclers, collectors, and lots
- `npm run test` - Run full end-to-end test suite (FastAPI pytest + Frontend vitest)
- `npm run gen:api` - Export OpenAPI schema and regenerate TypeScript client

## Tech Stack & Design Standards

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide / Material Symbols Outlined, Dexie.js (IndexedDB), Canvas Confetti, HTML5 QR scanner.
- **Design Tokens**: Defined in `packages/ui/src/tokens/designTokens.ts` matching `DESIGN.md`. Minimum 56dp touch targets, minimum 16px font, Verified Emerald (`#004e2a` / `#20673F`), Industrial Gold (`#8a5100` / `#D98200`), Warning Vermilion (`#ba1a1a` / `#D32F2F`).
- **Backend**: FastAPI, Python 3.11, SQLAlchemy 2 (async), Pydantic v2, PostgreSQL (with Haversine geo-spatial math fallback for portability), PyJWT, Passlib.
- **Multilingual**: 26 Indian languages (22 Eighth Schedule + Khasi, Garo, Mizo, Kokborok) with native scripts, RTL support, and TTS audio readout triggers on every card.
- **Verifiable Custody**: HMAC-SHA256 dynamic QR tokens + 4-digit numeric fallback, SHA-256 photo hash anchoring, and Server-Sent Events (SSE) real-time state handshakes.
