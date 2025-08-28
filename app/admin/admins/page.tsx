"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Check, ArrowLeft, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { createAdminAction, deleteAdminAction, getAdminsAction } from "@/app/actions/admin"
import { isAdminLoggedIn } from "@/lib/admin-auth"
import type { Admin } from "@/app/actions/admin"
import { useActionState } from "react"

// Αρχική κατάσταση για το form state
const initialState = {
  success: false,
  error: null,
  admin: null,
}

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [formState, formAction] = useActionState(createAdminAction, initialState)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Έλεγχος αν ο χρήστης είναι συνδεδεμένος ως admin
    if (!isAdminLoggedIn()) {
      router.push("/admin-login?redirect=/admin/admins&message=Πρέπει να συνδεθείτε ως διαχειριστής")
      return
    }

    // Φόρτωση των admin χρηστών
    fetchAdmins()
  }, [router])

  // Ενημέρωση του μηνύματος όταν αλλάζει το formState
  useEffect(() => {
    if (formState.success) {
      setMessage({ type: "success", text: "Ο admin δημιουργήθηκε με επιτυχία!" })
      fetchAdmins() // Ανανέωση της λίστας admin
    } else if (formState.error) {
      setMessage({ type: "error", text: formState.error })
    }
  }, [formState])

  const fetchAdmins = async () => {
    setLoading(true)
    try {
      const adminsList = await getAdminsAction()
      setAdmins(adminsList)
    } catch (error) {
      console.error("Error fetching admins:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAdmin = async (adminId: string) => {
    if (confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον admin;")) {
      setDeleteLoading(adminId)
      try {
        const result = await deleteAdminAction(adminId)

        if (result.success) {
          setMessage({ type: "success", text: "Ο admin διαγράφηκε με επιτυχία" })
          await fetchAdmins()
        } else {
          setMessage({ type: "error", text: result.error || "Σφάλμα κατά τη διαγραφή του admin" })
        }
      } catch (error) {
        console.error("Error deleting admin:", error)
        setMessage({ type: "error", text: "Σφάλμα κατά τη διαγραφή του admin" })
      } finally {
        setDeleteLoading(null)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-16 px-4">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <Link href="/admin" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Επιστροφή στο Dashboard
              </Link>
              <CardTitle className="text-2xl text-white">Διαχείριση Admin</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <Alert
                variant={message.type === "error" ? "destructive" : "default"}
                className={message.type === "success" ? "bg-green-900/20 border-green-800 text-green-400" : ""}
              >
                {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                <AlertTitle>{message.type === "error" ? "Σφάλμα" : "Επιτυχία"}</AlertTitle>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">Προσθήκη Νέου Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={formAction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" className="bg-gray-700 border-gray-600" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Κωδικός</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      className="bg-gray-700 border-gray-600"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    Δημιουργία Admin
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="rounded-md border border-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-800/50 border-b border-gray-800">
                      <th className="px-4 py-3 text-left font-medium text-gray-300">ID</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Username</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Ρόλος</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Ημ/νία Δημιουργίας</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Τελευταία Σύνδεση</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Ενέργειες</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.length > 0 ? (
                      admins.map((admin) => (
                        <tr key={admin.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                          <td className="px-4 py-3 text-gray-300">{admin.id.substring(0, 8)}</td>
                          <td className="px-4 py-3 text-white">{admin.username}</td>
                          <td className="px-4 py-3 text-gray-300">{admin.role}</td>
                          <td className="px-4 py-3 text-gray-300">{new Date(admin.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-gray-300">
                            {admin.last_login ? new Date(admin.last_login).toLocaleDateString() : "-"}
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteAdmin(admin.id)}
                              disabled={admin.username === "admin" || deleteLoading === admin.id} // Δεν επιτρέπεται η διαγραφή του αρχικού admin
                              className="text-red-500 hover:text-red-400 hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Διαγραφή</span>
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-3 text-center text-gray-400">
                          Δεν υπάρχουν admin χρήστες ακόμα
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
