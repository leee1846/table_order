# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 코드 작성 시 반드시 `docs/conventions.md`의 규칙을 따른다.

## Commands

### Development

```bash
# Run all apps
pnpm dev

# Run specific app
pnpm --filter admin dev         # Admin/tablet app (dev environment)
pnpm --filter menu dev          # Customer menu app (dev environment)

# Environment-specific dev servers
pnpm --filter admin dev:prod    # against production API
pnpm --filter admin dev:stage   # against staging API
pnpm --filter admin dev:arch    # against arch environment API
```

### Build

```bash
pnpm build                      # Build all apps (Turborepo)
pnpm --filter admin build:prod  # Build admin for production
pnpm --filter menu build:prod   # Build menu for production
# Other targets: build:dev, build:stage, build:arch
```

### Type Check & Lint

```bash
pnpm check-types                # Type check all packages (force re-run)
pnpm lint                       # Lint all packages
pnpm format                     # Format all packages
```

> No test runner is configured. There are no unit or integration tests in this repo.

## Architecture Overview

### Monorepo Layout

Turborepo + pnpm workspace with two deployable apps and five shared packages:

- `apps/admin` — Three interfaces in one codebase: tablet POS, admin web, backoffice web
- `apps/menu` — Customer-facing tablet ordering system
- `packages/api` — Axios instances, TanStack Query config, domain fetchers, global error handler
- `packages/ui` — Design tokens, theme system (light/dark/dynamic), shared UI components
- `packages/feature` — Cross-app feature components, Zustand stores, guards, dialog/toast management
- `packages/util` — Pure utilities: date, string, array, calculation, Capacitor integration (`SystemControl`)
- `packages/eslint-config`, `packages/prettier-config`, `packages/typescript-config` — shared tooling config

Packages export TypeScript directly (no build step). Path alias `@repo/<package>` maps to each package's `src/index.ts`.

### Admin App — Three-in-One System

The admin app serves three distinct user interfaces based on role + platform:

| Role | Platform | Interface |
|------|----------|-----------|
| `SHOP` | Native (Capacitor) | Tablet POS app |
| `SHOP` | Web browser | Admin web |
| `ADMIN` / `MASTER` | Web browser | Backoffice web |

`CapacitorApp.isNative()` is the platform discriminator. Post-login redirect in `apps/admin/src/router.tsx` routes users to the correct interface.

Router-level access control uses React Router loaders. Component-level guards (`SalesAccessGuard`, `SettingsAccessGuard`) are in `@repo/feature`.

### Real-Time: SSE

Both apps use SSE (Server-Sent Events) for live order/status updates, wired in each `App.tsx`. Hooks auto-reconnect on network recovery via `@repo/util`.

### Environment Variables

Each app has `.env.development`, `.env.production`, `.env.stage`, `.env.arch`. The only global env variable needed is:

```
VITE_API_BASE_URL=https://...
```

`turbo.json` declares `VITE_API_BASE_URL` as a `globalEnv` so Turborepo cache keys include it.

### React Compiler

`babel-plugin-react-compiler` is enabled in both apps' Vite configs. Avoid manual `useMemo`/`useCallback` wrapping — the compiler handles memoization automatically.

## Package-level Guidance

Each shared package has its own CLAUDE.md with patterns for adding new code:

- `packages/api/CLAUDE.md` — API 엔드포인트 추가 (endpoint → type → fetcher → query hook)
- `packages/ui/CLAUDE.md` — 테마 토큰·컴포넌트 추가
- `packages/feature/CLAUDE.md` — 스토어·다이얼로그·기능 컴포넌트 추가
