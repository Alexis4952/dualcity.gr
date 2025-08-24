"use server"

import { createSupabaseAdminClient } from "@/lib/supabase/server"
import type { UserRole } from "@/lib/auth"

// Συνάρτηση για τη δημιουργία τυχαίου κωδικού
function generateRandomPassword(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let password = ""
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

// Server action για τη δημιουργία νέου χρήστη
export async function createUserAction(formData: FormData) {
  try {
    const username = formData.get("username") as string
    const email = formData.get("email") as string
    const role = formData.get("role") as string

    if (!username || !email || !role) {
      return { success: false, error: "Παρακαλώ συμπληρώστε όλα τα πεδία" }
    }

    // Δημιουργία τυχαίου κωδικού
    const password = generateRandomPassword(10)

    // Δημιουργία του χρήστη στη βάση δεδομένων
    const supabase = createSupabaseAdminClient()

    // Έλεγχος αν υπάρχει ήδη χρήστης με το ίδιο email ή username
    const { data: existingUsers, error: checkError } = await supabase
      .from("users")
      .select("id")
      .or(`email.eq.${email},username.eq.${username}`)

    if (checkError) {
      console.error("Error checking existing users:", checkError)
      return { success: false, error: "Σφάλμα κατά τον έλεγχο για υπάρχοντες χρήστες" }
    }

    if (existingUsers && existingUsers.length > 0) {
      return { success: false, error: "Υπάρχει ήδη χρήστης με αυτό το email ή username" }
    }

    // Δημιουργία του χρήστη
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          username,
          email,
          role,
          password,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Error creating user:", error)
      return { success: false, error: `Σφάλμα κατά τη δημιουργία του χρήστη: ${error.message}` }
    }

    return {
      success: true,
      user: data[0],
      password, // Επιστρέφουμε τον κωδικό για να τον δείξουμε στον admin
    }
  } catch (error) {
    console.error("Unexpected error creating user:", error)
    return { success: false, error: "Απρόσμενο σφάλμα κατά τη δημιουργία του χρήστη" }
  }
}

// Server action για την ανάκτηση όλων των χρηστών
export async function getUsersAction() {
  try {
    const supabase = createSupabaseAdminClient()

    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching users:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching users:", error)
    return []
  }
}

// Server action για την ενημέρωση του ρόλου ενός χρήστη
export async function updateUserRoleAction(userId: string, newRole: UserRole) {
  try {
    const supabase = createSupabaseAdminClient()

    const { error } = await supabase.from("users").update({ role: newRole }).eq("id", userId)

    if (error) {
      console.error("Error updating user role:", error)
      return { success: false, error: `Σφάλμα κατά την ενημέρωση του ρόλου: ${error.message}` }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error updating user role:", error)
    return { success: false, error: "Απρόσμενο σφάλμα κατά την ενημέρωση του ρόλου" }
  }
}

// Server action για τη διαγραφή ενός χρήστη
export async function deleteUserAction(userId: string) {
  try {
    const supabase = createSupabaseAdminClient()

    const { error } = await supabase.from("users").delete().eq("id", userId)

    if (error) {
      console.error("Error deleting user:", error)
      return { success: false, error: `Σφάλμα κατά τη διαγραφή του χρήστη: ${error.message}` }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error deleting user:", error)
    return { success: false, error: "Απρόσμενο σφάλμα κατά τη διαγραφή του χρήστη" }
  }
}
