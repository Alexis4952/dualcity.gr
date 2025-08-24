"use server"

import { cookies } from "next/headers"
import { createSupabaseAdminClient } from "@/lib/supabase/server"

// Τύπος για τον admin χρήστη
export interface Admin {
  id: string
  username: string
  role: string
  created_at: string
  last_login: string | null
  password?: string // Added password field
}

// Αρχική κατάσταση για τις συναρτήσεις που επιστρέφουν κατάσταση
const initialState = {
  success: false,
  error: null,
  admin: null,
}

// Συνάρτηση για καθυστέρηση (sleep)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Συνάρτηση για επανάληψη με καθυστέρηση
async function retryOperation<T>(operation: () => Promise<T>, maxRetries = 3, initialDelay = 1000): Promise<T> {
  let lastError: any

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      console.log(`Attempt ${attempt + 1} failed:`, error)
      lastError = error

      // Εκθετική καθυστέρηση (exponential backoff)
      const waitTime = initialDelay * Math.pow(2, attempt)
      console.log(`Waiting ${waitTime}ms before retry...`)
      await delay(waitTime)
    }
  }

  throw lastError
}

// Server action για τη σύνδεση admin
export async function loginAdminAction(username: string, password: string) {
  console.log(`Attempting to login admin: ${username}`)

  try {
    // Χρησιμοποιούμε τον admin client που παρακάμπτει τις RLS πολιτικές
    const supabase = createSupabaseAdminClient()

    // Έλεγχος αν υπάρχει ο admin με το συγκεκριμένο username με μηχανισμό επανάληψης
    const fetchAdmin = async () => {
      const { data: admin, error } = await supabase.from("admins").select("*").eq("username", username).maybeSingle()

      if (error) {
        console.error("Error fetching admin:", error)
        throw new Error(`Σφάλμα κατά την αναζήτηση του admin: ${error.message}`)
      }

      return admin
    }

    // Εκτέλεση του ελέγχου με μηχανισμό επανάληψης
    const admin = await retryOperation(fetchAdmin, 3, 1000)

    if (!admin) {
      console.log(`No admin found with username: ${username}`)
      return {
        success: false,
        error: `Δεν βρέθηκε admin με το όνομα χρήστη: ${username}`,
      }
    }

    // Έλεγχος του κωδικού πρόσβασης
    if (admin.password !== password) {
      console.log(`Invalid password for admin: ${username}`)
      return {
        success: false,
        error: "Λάθος κωδικός πρόσβασης",
      }
    }

    console.log(`Admin login successful: ${username}`)

    // Ενημέρωση του last_login με μηχανισμό επανάληψης
    const updateLastLogin = async () => {
      const { error: updateError } = await supabase
        .from("admins")
        .update({ last_login: new Date().toISOString() })
        .eq("id", admin.id)

      if (updateError) {
        console.error("Error updating last_login:", updateError)
        throw new Error(`Σφάλμα κατά την ενημέρωση του last_login: ${updateError.message}`)
      }
    }

    // Εκτέλεση της ενημέρωσης με μηχανισμό επανάληψης
    await retryOperation(updateLastLogin, 3, 1000)

    // Καταγραφή της ενέργειας σύνδεσης
    await logAdminActionServer(admin.id, "login", { username: admin.username })

    // Αποθήκευση του admin token σε cookie
    const cookieStore = await cookies()
    cookieStore.set("adminId", admin.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 εβδομάδα
      path: "/",
    })

    cookieStore.set("adminUsername", admin.username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 εβδομάδα
      path: "/",
    })

    return {
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
    }
  } catch (error) {
    console.error("Unexpected error during admin login:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return {
      success: false,
      error: `Απρόσμενο σφάλμα κατά τη σύνδεση: ${errorMessage}`,
    }
  }
}

// Server action για την καταγραφή ενέργειας admin
export async function logAdminActionServer(adminId: string, action: string, details: any = {}) {
  try {
    const supabase = createSupabaseAdminClient()

    const { error } = await supabase.from("admin_logs").insert([
      {
        admin_id: adminId,
        action,
        details,
      },
    ])

    if (error) {
      console.error("Log admin action error:", error)
    }
  } catch (error) {
    console.error("Unexpected log admin action error:", error)
  }
}

// Server action για την ανάκτηση των admin χρηστών
export async function getAdminsAction(): Promise<Admin[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase.from("admins").select("*")

  if (error) {
    console.error("Error fetching admins:", error)
    return []
  }

  return data || []
}

// Server action για τη δημιουργία νέου admin
export async function createAdminAction(prevState: any, formData: FormData) {
  try {
    const username = (formData.get("username") as string)?.trim()
    const password = (formData.get("password") as string)?.trim()
    const role = "admin" // Προεπιλεγμένος ρόλος

    if (!username || !password) {
      return { success: false, error: "Παρακαλώ συμπληρώστε όλα τα πεδία", admin: null }
    }

    console.log(`Attempting to create admin with username: ${username}`)

    const supabase = createSupabaseAdminClient()

    // Παίρνουμε το ID του τρέχοντος admin από τα cookies
    const cookieStore = await cookies()
    const adminId = cookieStore.get("adminId")?.value
    if (!adminId) {
      return { success: false, error: "Δεν είστε συνδεδεμένος ως admin", admin: null }
    }

    // Έλεγχος αν υπάρχει ήδη χρήστης με το ίδιο username
    const { data: existingAdmins, error: checkError } = await supabase
      .from("admins")
      .select("id")
      .eq("username", username)

    if (checkError) {
      console.error("Error checking existing admin:", checkError)
      return { success: false, error: "Σφάλμα κατά τον έλεγχο για υπάρχοντα admin", admin: null }
    }

    if (existingAdmins && existingAdmins.length > 0) {
      return { success: false, error: "Υπάρχει ήδη χρήστης με αυτό το username", admin: null }
    }

    // Δημιουργία νέου admin
    const { data, error } = await supabase.from("admins").insert([{ username, password, role }]).select()

    if (error || !data || data.length === 0) {
      console.error("Create admin error:", error)
      return { success: false, error: "Σφάλμα κατά τη δημιουργία του admin", admin: null }
    }

    const newAdmin = data[0]
    console.log(`Successfully created admin: ${newAdmin.username}, id: ${newAdmin.id}`)

    // Καταγραφή της ενέργειας δημιουργίας admin
    await logAdminActionServer(adminId, "create_admin", {
      created_username: username,
      created_role: role,
    })

    return {
      success: true,
      error: null,
      admin: {
        id: newAdmin.id,
        username: newAdmin.username,
        role: newAdmin.role,
        created_at: newAdmin.created_at,
        last_login: newAdmin.last_login,
      },
    }
  } catch (error) {
    console.error("Unexpected create admin error:", error)
    return { success: false, error: "Σφάλμα κατά τη δημιουργία του admin", admin: null }
  }
}

// Server action για τη διαγραφή admin
export async function deleteAdminAction(adminId: string) {
  try {
    const supabase = createSupabaseAdminClient()

    // Παίρνουμε το ID του τρέχοντος admin από τα cookies
    const cookieStore = await cookies()
    const currentAdminId = cookieStore.get("adminId")?.value
    if (!currentAdminId) {
      return { success: false, error: "Δεν είστε συνδεδεμένος ως admin" }
    }

    // Έλεγχος αν είναι ο αρχικός admin (δεν επιτρέπεται η διαγραφή του)
    const { data: adminToDelete, error: fetchError } = await supabase
      .from("admins")
      .select("username")
      .eq("id", adminId)

    if (fetchError) {
      console.error("Error fetching admin to delete:", fetchError)
      return { success: false, error: "Σφάλμα κατά την ανάκτηση του admin" }
    }

    if (adminToDelete && adminToDelete.length > 0 && adminToDelete[0].username === "admin") {
      return { success: false, error: "Δεν επιτρέπεται η διαγραφή του αρχικού admin" }
    }

    // Έλεγχος αν προσπαθεί να διαγράψει τον εαυτό του
    if (currentAdminId === adminId) {
      return { success: false, error: "Δεν μπορείτε να διαγράψετε τον εαυτό σας" }
    }

    const { error } = await supabase.from("admins").delete().eq("id", adminId)

    if (error) {
      console.error("Delete admin error:", error)
      return { success: false, error: "Σφάλμα κατά τη διαγραφή του admin" }
    }

    // Καταγραφή της ενέργειας διαγραφής admin
    await logAdminActionServer(currentAdminId, "delete_admin", { deleted_admin_id: adminId })

    return { success: true }
  } catch (error) {
    console.error("Unexpected delete admin error:", error)
    return { success: false, error: "Σφάλμα κατά τη διαγραφή του admin" }
  }
}

// Server action για την ανάκτηση των admin logs
export async function getAdminLogsAction() {
  try {
    const supabase = createSupabaseAdminClient()

    const { data, error } = await supabase
      .from("admin_logs")
      .select(`
        id,
        action,
        details,
        created_at,
        admins (
          id,
          username
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Get admin logs error:", error)
      return []
    }

    return data
  } catch (error) {
    console.error("Unexpected get admin logs error:", error)
    return []
  }
}

// Server action για την αποσύνδεση admin
export async function logoutAdminAction() {
  const cookieStore = await cookies()
  cookieStore.delete("adminId")
  cookieStore.delete("adminUsername")
  return { success: true }
}

// Server action για τον έλεγχο αν ο χρήστης είναι συνδεδεμένος ως admin
export async function checkAdminAuthAction() {
  const cookieStore = await cookies()
  const adminId = cookieStore.get("adminId")?.value
  const adminUsername = cookieStore.get("adminUsername")?.value

  if (!adminId || !adminUsername) {
    return { isLoggedIn: false, admin: null }
  }

  return {
    isLoggedIn: true,
    admin: {
      id: adminId,
      username: adminUsername,
    },
  }
}
