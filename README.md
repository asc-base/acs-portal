# ACS Portal

Next.js frontend for the Applied Computer Science program at KMUTT.

## Development

Set `API_URL` to the backend origin and run:

```bash
npm run dev
```

Browser requests use `/api`; the development rewrite forwards them to `API_URL`. Server entrypoints call the backend directly.

## Source layout

- `src/app` contains Next.js route entrypoints and application layouts.
- `src/features/<name>` groups each feature's screens, schemas, domain types, services, and repositories.
- `src/shared` contains reusable UI, common schemas/types, HTTP transport, and theme.
- `tests/features/<name>` mirrors feature-owned unit tests; `tests/shared` holds tests for shared code.
- `src/proxy.ts` handles admin access and media requests.

Feature schemas define validated form, request, query, and response data; exported TypeScript data types are derived from those schemas. `client.ts` exposes browser queries and mutations, while feature `hooks/` own form and controller logic. Server-rendered data uses feature `server.ts` entrypoints. Server calls forward only the current request's Cookie and use `no-store`; client calls go through `/api` with credentials.

## Checks

```bash
npm test
npm run test:watch
npm test -- tests/features/students
npm run lint
npm run build
npm run test:media-rewrite
```

Vitest runs TypeScript tests under `tests/features/` and `tests/shared/` in Node by default; individual UI tests can opt into jsdom. The media and SSR integration command builds the app before running its Node test. Next.js supports Node.js 20.9 or newer; the test tooling requires Node.js 22.22.2 or newer in the 22.x line, 24.15 or newer in the 24.x line, or 26 or newer.
