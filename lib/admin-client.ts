"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Δημιουργία του Supabase client για client components
const supabase = createClientComponentClient()

// Τύπος για τον admin χρήστη
export interface Admin {
  id: string
  username: string
  role: string
  created_at: string
  last_login: string | null
}

// Client function για τον έλεγχο αν ο χρήστης είναι συνδεδεμένος ως admin
export function isAdminLoggedIn(): boolean {
  // Έλεγχος αν υπάρχουν τα cookies στον browser
  const adminId = getCookie("adminId")
  const adminUsername = getCookie("adminUsername")
  return !!adminId && !!adminUsername
}

// Client function για την ανάκτηση του τρέχοντος admin
export function getCurrentAdmin(): { id: string; username: string } | null {
  const adminId = getCookie("adminId")
  const adminUsername = getCookie("adminUsername")

  if (!adminId || !adminUsername) {
    return null
  }

  return {
    id: adminId,
    username: adminUsername,
  }
}

// Helper function για την ανάκτηση cookie
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null
  return null
}
