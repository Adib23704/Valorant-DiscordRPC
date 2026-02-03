# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Valo Discord RPC is a Tauri v2 application that displays your Valorant game status on Discord. It consists of a Rust backend and a React/TypeScript frontend.

## Development Commands

```bash
# Install dependencies
pnpm install

# Run development mode (starts both frontend and Tauri)
pnpm tauri dev

# Build for production
pnpm tauri build

# Frontend only
pnpm dev          # Start Vite dev server
pnpm build        # Build frontend (tsc + vite build)

# Linting and formatting (Biome)
pnpm check        # Run all checks (lint + format)
pnpm check:fix    # Auto-fix all issues
pnpm lint         # Lint only
pnpm format       # Format only

# Rust backend (from src-tauri/)
cargo build       # Build
cargo check       # Type check
cargo clippy      # Linting
cargo fmt         # Format
cargo test        # Run tests

# Full validation (CI-style)
pnpm validate     # Biome check + cargo fmt --check + cargo clippy
```

## Architecture

### Frontend (React + TypeScript + Tailwind v4)

```
src/
├── components/
│   ├── dashboard/    # Main dashboard components (status, preview, control)
│   ├── layout/       # Layout wrapper, header, sidebar
│   ├── settings/     # Settings panel components
│   └── ui/           # Reusable UI primitives (shadcn/ui style)
├── hooks/            # React hooks (usePresence, useSettings, useTauriEvents)
├── stores/           # Zustand stores (presenceStore, settingsStore, connectionStore)
├── lib/
│   ├── tauri.ts      # Tauri invoke wrappers
│   └── utils.ts      # Utility functions (cn, formatTime)
├── pages/            # Page components (Dashboard, About)
├── styles/           # Global CSS with Tailwind v4 @theme configuration
└── types/            # TypeScript types (events, settings, presence)
```

### Backend (Rust + Tauri)

```
src-tauri/src/
├── commands/         # Tauri commands (presence, settings, status)
├── config/           # Settings store and types
├── content/          # Game content loader (agents, maps from valorant-api.com)
├── discord/          # Discord IPC client and activity builder
├── events/           # Event payloads for frontend communication
├── presence/
│   ├── manager.rs    # Main presence manager with polling loop
│   ├── states/       # Activity builders per game state (menu, queue, pregame, ingame, range)
│   └── utilities.rs  # Helper functions
├── process/          # Process detection (Valorant, Riot Client)
├── riot/             # Riot local API client (lockfile, endpoints, types)
├── error.rs          # Error types
└── lib.rs            # Tauri setup and state management
```

### Key Data Flow

1. **Presence Loop** (`presence/manager.rs`): Spawns a tokio task that polls every 3 seconds
2. **Riot API** (`riot/client.rs`): Reads lockfile, fetches presence data via local API
3. **Content Data** (`content/loader.rs`): Fetches agent/map/rank info from valorant-api.com
4. **Activity Building** (`presence/states/`): Creates Discord activity based on game state
5. **Discord IPC** (`discord/client.rs`): Updates Discord Rich Presence

### State Management

- Tauri commands use `State<'_, Arc<T>>` for `PresenceManager` and `SettingsStore`
- Frontend uses Zustand stores that sync with Tauri events
- Settings persisted to JSON file in app data directory

### Important Types

- `SessionLoopState`: `Menus | Pregame | Ingame` (from Riot API)
- `GameStatePayload`: Event payload sent to frontend
- `DiscordActivity`: Discord presence data structure
- `PresenceData`: Decoded presence from Riot local API

### Tooling

- **Biome**: Linting and formatting for JS/TS/JSON/CSS (replaces ESLint/Prettier)
- **Tailwind CSS v4**: Uses `@tailwindcss/vite` plugin with `@import "tailwindcss"` and `@theme` directive
- **Husky + lint-staged**: Pre-commit hooks run Biome and cargo fmt on staged files
