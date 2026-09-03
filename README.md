# Inovative Fashion

Dark-themed e-commerce storefront for [inovativefashion.com](https://inovativefashion.com), built with **Next.js 16** (App Router), TypeScript, Tailwind CSS v4, Framer Motion, GSAP, and Lucide.

## Commands

```sh
npm install
npm run dev
```

Then open `http://localhost:3000`.

| Command | Action |
| --- | --- |
| `npm run dev` | Next.js dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run server:dev` | Local Express API on `:4000` (scaffold) |

## Routes

- `/` — homepage hero, collection filters, product grid, story sections
- `/try-on` — virtual try-on studio
- `/product/[id]` — gallery, size/color, try-on CTA, complete-the-look
- `/api/health` — Next Route Handler health check
- `/api/v1/*` — stub for future Express mount (`src/server`)

## Backend scaffold

Express lives under `src/server` (routes, controllers, middleware). Mount later with `serverless-http` on `/api/v1`. See `.env.example`.
