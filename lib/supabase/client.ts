import { createClient as supabaseCreateClient } from "@supabase/supabase-js"

// Singleton pattern για το Supabase client
let supabaseClient: ReturnType<typeof supabaseCreateClient> | null = null

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined",
    )
  }

  supabaseClient = supabaseCreateClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

// Προσθήκη της απαιτούμενης εξαγωγής createSupabaseClient
export const createSupabaseClient = (url?: string, key?: string) => {
  const supabaseUrl = url || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined",
    )
  }

  return supabaseCreateClient(supabaseUrl, supabaseAnonKey)
}

// Βοηθητική συνάρτηση για έλεγχο των μεταβλητών περιβάλλοντος
export function checkSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    isComplete: !!supabaseUrl && !!supabaseAnonKey,
  }
}

export default getSupabaseClient

export const createClient = (url?: string, key?: string) => {
  const supabaseUrl = url || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined",
    )
  }

  return supabaseCreateClient(supabaseUrl, supabaseAnonKey)
}
