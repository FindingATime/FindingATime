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


## Documentation

### Requirements

- Node.js >= 18.17.0
- pnpm >= 8

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

## Architecture

To learn more about the architecture of this project, please see the [ARCHITECTURE.md](ARCHITECTURE.md) file.

## Attributions

Finding A Time uses the [SupaNext Starter Kit](https://github.com/michaeltroya/supa-next-starter).
![image](https://github.com/michaeltroya/supa-next-starter/assets/38507347/2ea40874-98de-49ec-ab6a-74c816e6ca22)

Made with 💖 as part of [Code Day Labs](https://labs.codeday.org/).
