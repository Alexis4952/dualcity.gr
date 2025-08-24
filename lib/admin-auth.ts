"use client"

// Συνάρτηση για τον έλεγχο αν ο χρήστης είναι συνδεδεμένος ως admin
export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false

  // Έλεγχος στο localStorage (πιο αξιόπιστο στο client-side)
  const adminId = localStorage.getItem("adminId")
  const adminUsername = localStorage.getItem("adminUsername")
  const adminToken = localStorage.getItem("adminToken")

  return !!adminId && !!adminUsername && !!adminToken
}

// Συνάρτηση για την ανάκτηση του τρέχοντος admin
export function getCurrentAdmin(): { id: string; username: string } | null {
  if (typeof window === "undefined") {
    console.log("getCurrentAdmin: window is undefined (server-side)")
    return null
  }

  try {
    console.log("getCurrentAdmin: Checking localStorage for admin data")
    const adminId = localStorage.getItem("adminId")
    const adminUsername = localStorage.getItem("adminUsername")
    const adminToken = localStorage.getItem("adminToken")

    console.log("getCurrentAdmin: localStorage values:", {
      adminId: adminId ? "exists" : "missing",
      adminUsername: adminUsername ? "exists" : "missing",
      adminToken: adminToken ? "exists" : "missing",
    })

    if (!adminId || !adminUsername || !adminToken) {
      console.log("getCurrentAdmin: Missing required admin data")
      return null
    }

    console.log("getCurrentAdmin: Admin data found:", { id: adminId, username: adminUsername })
    return {
      id: adminId,
      username: adminUsername,
    }
  } catch (error) {
    console.error("getCurrentAdmin: Error retrieving admin data:", error)
    return null
  }
}

// Συνάρτηση για την αποθήκευση των στοιχείων του admin
export function setAdminData(id: string, username: string): void {
  if (typeof window === "undefined") return

  try {
    console.log("setAdminData: Saving admin data:", { id, username })

    // Αποθήκευση σε localStorage (πιο αξιόπιστο στο client-side)
    localStorage.setItem("adminId", id)
    localStorage.setItem("adminUsername", username)
    localStorage.setItem("adminToken", "true")
    localStorage.setItem("adminLoginTime", new Date().toISOString())

    // Αποθήκευση σε cookies για το server-side
    document.cookie = `adminId=${id}; path=/; max-age=${60 * 60 * 24 * 7}; secure; samesite=lax`
    document.cookie = `adminUsername=${username}; path=/; max-age=${60 * 60 * 24 * 7}; secure; samesite=lax`

    console.log("setAdminData: Admin data saved successfully")
  } catch (error) {
    console.error("setAdminData: Error saving admin data:", error)
  }
}

// Συνάρτηση για την αποσύνδεση του admin
export function logoutAdmin(): void {
  if (typeof window === "undefined") return

  try {
    console.log("logoutAdmin: Removing admin data")

    // Διαγραφή από localStorage
    localStorage.removeItem("adminId")
    localStorage.removeItem("adminUsername")
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminLoginTime")

    // Διαγραφή cookies
    document.cookie = "adminId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=lax"
    document.cookie = "adminUsername=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=lax"

    console.log("logoutAdmin: Admin logged out successfully")
  } catch (error) {
    console.error("logoutAdmin: Error logging out admin:", error)
  }
}

// Helper function για την ανάκτηση cookie
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null

  try {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)

    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null
    }

    return null
  } catch (error) {
    console.error(`getCookie: Error getting cookie ${name}:`, error)
    return null
  }
}
