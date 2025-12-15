/// <reference types="vite/client" />

// optional: explicit typing for env vars you use
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // add other VITE_ keys here...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
