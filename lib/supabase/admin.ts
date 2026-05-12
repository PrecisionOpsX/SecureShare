import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Service-role Supabase client. Bypasses Row Level Security and is intended
 * only for flows that do not have an authenticated user, e.g. the recipient
 * view at /d/[token] (the recipient is not logged in).
 *
 * Never import this from a client component, route file, or anything that
 * could end up in the browser bundle. The `server-only` import above causes
 * a build error if it does.
 *
 * Parameterised on Database so .update() / .insert() / .select() are
 * type-checked against the schema. Without this, .update()'s parameter
 * type resolves to `never` and the build fails.
 */
let cached: SupabaseClient<Database> | null = null;

export function createAdminClient(): SupabaseClient<Database> {
  if (cached) return cached;
  cached = createClient<Database>(env.supabaseUrl(), env.supabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return cached;
}
