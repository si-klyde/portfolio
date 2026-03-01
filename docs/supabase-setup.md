# Supabase Setup

## 1. Create Project
- https://supabase.com → New Project
- Name: `portfolio`, pick closest region
## 2. Get API Credentials
Dashboard → Settings → API:
- **Project URL** → `VITE_SUPABASE_URL`
- **anon public** key → `VITE_SUPABASE_ANON_KEY`

## 3. Create `.env`
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

## 4. Run Schema
SQL Editor → paste contents of `docs/schema.sql` → Run
