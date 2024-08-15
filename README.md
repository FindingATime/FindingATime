<p align="center">
  <img alt="GitHub License" src="https://img.shields.io/github/license/FindingATime/FindingATime">
  <a href="https://github.com/FindingATime/FindingATime"><img src="https://img.shields.io/github/stars/FindingATime/FindingATime.svg?style=flat-square&logo=github&label=Stars&logoColor=white" alt="GitHub stars"></a>
  <a href="https://github.com/FindingATime/FindingATime/issues"><img src="https://img.shields.io/github/issues/FindingATime/FindingATime.svg?style=flat-square" alt="GitHub Issues"></a>
</p>

# Overview

An app that makes it easy to schedule meetings with others.

## Quick Start

Clone repository with: `git clone https://github.com/FindingATime/FindingATime`

Run `supabase start`

Copy `.env.example` to `.env.local` and update `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321` and update NEXT_PUBLIC_SUPABASE_ANON_KEY from the output of `supabase start`

Run `pnpm run dev`

Visit local <a href="http://localhost:3000"><strong>Site</strong></a> ·

## Built With

- ⚡️ Next.js 14 (App Router)
- 💚 Supabase w/ supabase-ssr - Works across the entire [Next.js](https://nextjs.org) stack (App Router, Pages Router, Client, Server, Middleware, It just works!)
- ⚛️ React 18
- ⛑ TypeScript
- 📦 [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- 🎨 [Tailwind](https://tailwindcss.com/)
- 🔌 [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components that you can copy and paste into your apps.
- 🧪 Jest w/SWC + React Testing Library - Unit tests for all of your code.
- 🎛️ [MSW](https://mswjs.io/)v2 - Intercept requests inside your tests (set up for testing only)
- 🪝[TanStackQuery](https://tanstack.com/query/v5)v5 - The best way to fetch data on the client
- 📏 ESLint — To find and fix problems in your code
- 💖 Prettier — Code Formatter for consistent style
- 🐶 Husky — For running scripts before committing
- 🚫 lint-staged — Run ESLint and Prettier against staged Git files
- 👷 Github Actions — Run Type Checks, Tests, and Linters on Pull Requests
- 🗂 Path Mapping — Import components or images using the `@` prefix
- ⚪⚫ Dark mode - Toggle theme modes with [next-themes](https://github.com/pacocoursey/next-themes)
- ✨ Next Top Loader - Render a pleasent top loader on navigation with [nextjs-toploader](https://github.com/TheSGJ/nextjs-toploader)
- 🔋 Lots Extras - Next Bundle Analyzer, Vercel Analytics, Vercel Geist Font

## Documentation

### Requirements

- Node.js >= 18.17.0
- pnpm 8

### Scripts

- `pnpm dev` — Starts the application in development mode at `http://localhost:3000`.
- `pnpm build` — Creates an optimized production build of your application.
- `pnpm start` — Starts the application in production mode.
- `pnpm type-check` — Validate code using TypeScript compiler.
- `pnpm lint` — Runs ESLint for all files in the `src` directory.
- `pnpm format-check` — Runs Prettier and checks if any files have formatting issues.
- `pnpm format` — Runs Prettier and formats files.
- `pnpm test` — Runs all the jest tests in the project.
- `pnpm test:ci` — Runs all the jest tests in the project, Jest will assume it is running in a CI environment.
- `pnpm analyze` — Builds the project and opens the bundle analyzer.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for more information.

## Attributions

Finding A Time uses the [SupaNext Starter Kit](https://github.com/michaeltroya/supa-next-starter).
![image](https://github.com/michaeltroya/supa-next-starter/assets/38507347/2ea40874-98de-49ec-ab6a-74c816e6ca22)

Made with 💖 as part of Code Day Labs.
