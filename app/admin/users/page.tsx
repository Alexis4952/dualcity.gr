"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserRole, isAdmin } from "@/lib/auth"
import { AlertCircle, ArrowLeft, Check, Trash2, UserPlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { createUserAction, deleteUserAction, getUsersAction, updateUserRoleAction } from "@/app/actions/users"

// Τύπος για τον χρήστη
interface User {
  id: string
  username: string
  email: string
  role: UserRole
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [newUsername, setNewUsername] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newRole, setNewRole] = useState<UserRole>(UserRole.USER)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  // Φόρτωση χρηστών
  const loadUsers = async () => {
    try {
      const usersData = await getUsersAction()
      setUsers(usersData)
    } catch (error) {
      console.error("Error loading users:", error)
      setMessage({ type: "error", text: "Σφάλμα κατά τη φόρτωση των χρηστών" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Έλεγχος αν ο χρήστης είναι admin
    if (!isAdmin()) {
      router.push("/login?redirect=/admin/users&message=Πρέπει να είστε διαχειριστής για να αποκτήσετε πρόσβαση")
      return
    }

    // Φόρτωση χρηστών
    loadUsers()
  }, [router])

  const handleCreateUser = async () => {
    if (!newUsername || !newEmail) {
      setMessage({ type: "error", text: "Παρακαλώ συμπληρώστε όλα τα πεδία" })
      return
    }

    try {
      // Δημιουργία FormData για το server action
      const formData = new FormData()
      formData.append("username", newUsername)
      formData.append("email", newEmail)
      formData.append("role", newRole)

      // Κλήση του server action
      const result = await createUserAction(formData)

      if (result.success) {
        // Επαναφόρτωση των χρηστών
        await loadUsers()

        // Καθαρισμός των πεδίων
        setNewUsername("")
        setNewEmail("")
        setNewRole(UserRole.USER)

        // Εμφάνιση μηνύματος επιτυχίας
        setMessage({
          type: "success",
          text: `Ο χρήστης δημιουργήθηκε με επιτυχία! Προσωρινός κωδικός: ${result.password}`,
        })

        // Κλείσιμο του dialog
        setDialogOpen(false)
      } else {
        setMessage({ type: "error", text: result.error || "Σφάλμα κατά τη δημιουργία του χρήστη" })
      }
    } catch (error) {
      console.error("Error creating user:", error)
      setMessage({ type: "error", text: "Σφάλμα κατά τη δημιουργία του χρήστη" })
    }
  }

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    try {
      const result = await updateUserRoleAction(userId, newRole)

      if (result.success) {
        // Επαναφόρτωση των χρηστών
        await loadUsers()

        // Εμφάνιση μηνύματος επιτυχίας
        setMessage({ type: "success", text: "Ο ρόλος του χρήστη ενημερώθηκε με επιτυχία" })
      } else {
        setMessage({ type: "error", text: result.error || "Σφάλμα κατά την ενημέρωση του ρόλου" })
      }
    } catch (error) {
      console.error("Error updating user role:", error)
      setMessage({ type: "error", text: "Σφάλμα κατά την ενημέρωση του ρόλου" })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const result = await deleteUserAction(userId)

      if (result.success) {
        // Επαναφόρτωση των χρηστών
        await loadUsers()

        // Εμφάνιση μηνύματος επιτυχίας
        setMessage({ type: "success", text: "Ο χρήστης διαγράφηκε με επιτυχία" })
      } else {
        setMessage({ type: "error", text: result.error || "Σφάλμα κατά τη διαγραφή του χρήστη" })
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      setMessage({ type: "error", text: "Σφάλμα κατά τη διαγραφή του χρήστη" })
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
              <CardTitle className="text-2xl text-white">Διαχείριση Χρηστών</CardTitle>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Προσθήκη Χρήστη
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle>Προσθήκη Νέου Χρήστη</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Συμπληρώστε τα στοιχεία για να δημιουργήσετε έναν νέο χρήστη.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Όνομα Χρήστη</Label>
                    <Input
                      id="username"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Ρόλος</Label>
                    <Select value={newRole} onValueChange={(value) => setNewRole(value as UserRole)}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Επιλέξτε ρόλο" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value={UserRole.USER}>Χρήστης</SelectItem>
                        <SelectItem value={UserRole.ADMIN}>Διαχειριστής</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    onClick={handleCreateUser}
                  >
                    Δημιουργία Χρήστη
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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

            <div className="rounded-md border border-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-800/50 border-b border-gray-800">
                      <th className="px-4 py-3 text-left font-medium text-gray-300">ID</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Όνομα Χρήστη</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Email</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Ρόλος</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Ημ/νία Εγγραφής</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Ενέργειες</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                          <td className="px-4 py-3 text-gray-300">{user.id.substring(0, 8)}</td>
                          <td className="px-4 py-3 text-white">{user.username}</td>
                          <td className="px-4 py-3 text-gray-300">{user.email}</td>
                          <td className="px-4 py-3">
                            <Select
                              value={user.role}
                              onValueChange={(value) => handleUpdateRole(user.id, value as UserRole)}
                            >
                              <SelectTrigger className="h-8 w-28 bg-gray-800 border-gray-700">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700">
                                <SelectItem value={UserRole.USER}>Χρήστης</SelectItem>
                                <SelectItem value={UserRole.ADMIN}>Διαχειριστής</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-4 py-3 text-gray-300">{new Date(user.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteUser(user.id)}
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
                          Δεν υπάρχουν χρήστες ακόμα
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
