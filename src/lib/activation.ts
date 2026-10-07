import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Normalize an activation code string — strip whitespace, uppercase.
 */
export function normalizeActivationCode(code: string | null): string | null {
  if (!code) return null
  return code.trim().toUpperCase()
}

/**
 * Look up an activation code by its normalized value.
 * Returns the matching row from activation_codes if found.
 */
export async function getActivationCodeByValue(
  supabase: SupabaseClient,
  code: string | null
): Promise<{ data: { id: string; [key: string]: any } | null; error: any }> {
  if (!code) return { data: null, error: null }
  return supabase
    .from('activation_codes')
    .select('*')
    .eq('code', code)
    .limit(1)
    .maybeSingle()
}
