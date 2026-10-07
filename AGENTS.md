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
