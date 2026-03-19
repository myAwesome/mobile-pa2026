# mobile-pa2026

Mobile client for [pa2023](https://github.com/myAwesome/pa2023) personal diary backend.

Built with React Native + Expo.

## Features

- Browse diary entries by month
- View recent posts (last 30)
- Full-text search
- "On This Day" — entries from this day in previous years
- Create and edit entries
- Dark theme

## Stack

- [Expo](https://expo.dev) + TypeScript
- [Expo Router](https://expo.github.io/router) — file-based navigation
- [TanStack Query](https://tanstack.com/query) — data fetching & caching
- [Zustand](https://zustand-demo.pmnd.rs) — auth state

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the dev server:
   ```bash
   npx expo start
   ```

3. On first launch, enter your pa2023 server URL, email and password.

## Project Structure

```
app/
  (auth)/login.tsx        — Login screen
  (app)/index.tsx         — Main screen (months + posts)
  (app)/post/[id].tsx     — Post viewer
  (app)/compose.tsx       — Create/edit entry
  (app)/recent.tsx        — Recent posts
  (app)/search.tsx        — Search
  (app)/on-this-day.tsx   — On This Day
src/
  api/client.ts           — API client (mirrors jeeves/api/client.go)
  store/auth.ts           — Auth state (Zustand)
```
