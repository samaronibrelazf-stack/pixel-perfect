<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules

- Course/certificate demo content lives in `src/data/cursos.ts` as typed mock data — keeps the public site working before a backend exists; replace with Lovable Cloud queries when the database lands.
- Shared chrome (header/footer) renders in `src/routes/__root.tsx`; pages only render their own content.
- UI copy is Brazilian Portuguese.
- Keep brand graphics and illustrative media as local project assets; avoid runtime dependencies on Lovable-hosted asset URLs. Retain complete image framing and descriptive alternatives to distinguish illustrations from company photography.

## Base44 dev environment

- The app runs via `docker compose -f docker-compose.base44.yml up -d` (bun + Vite dev server, port 5000 → host 3000).
- Package manager is **bun** (`bun.lock`, `bunfig.toml`). Deps install on container startup via `bun install`.
- Supabase URL + publishable key are committed in `.env` and mirrored in `.env.base44-defaults` (first `env_file`); `/run/base44/app.env` is the last `env_file` so dashboard secrets override.
- `SUPABASE_SERVICE_ROLE_KEY` is optional — only needed for admin server functions (`client.server.ts` lazy proxy). The public site boots and renders without it.
- Vite config already sets `allowedHosts: true` and `host: 0.0.0.0`, so no host/origin allowlist changes are needed.
- Public pages (`/`, `/cursos`, `/sobre`, `/certificados`) query Supabase via server functions in `src/lib/cursos.functions.ts`; on error they return `[]` so the page still renders.
- Authenticated routes (`/auth`, `/admin`, `/perfil`) need a live Supabase Auth backend to function.
