# Naviz Khoja — Portfolio

Personal site for Naviz Khoja, a software engineer working on mobile, backend, and GenAI products.

Built with Next.js 16 (App Router, React 19), TypeScript, and Tailwind v4. Design language is light-only neo-brutalism.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
```

## Structure

- `src/app/` — routes, layout, sitemap, robots
- `src/components/sections/` — page sections (About, Achievements)
- `src/components/ui/` — primitives (`<Card>`)
- `src/components/` — other components (header, nav, carousel)
- `public/` — static assets (hero animation, achievement photos, resume PDF)

## Deploy

Deployed on Vercel. Set `NEXT_PUBLIC_SITE_URL` to the production origin so `sitemap.xml`, `robots.txt`, and Open Graph URLs resolve correctly.
