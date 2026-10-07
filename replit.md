# Running in Replit

Use the **Start application** workflow to open the site in Preview. The equivalent command is:

```sh
bun run dev -- --host 0.0.0.0 --port 5000 --strictPort
```

The app reads its Supabase URL and publishable key from the existing environment configuration. Set the corresponding `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_PUBLISHABLE_KEY` variables in Replit Secrets when recreating this environment.

Some image URLs refer to Lovable-hosted assets and currently return 404 in the Replit preview.
