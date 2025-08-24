"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { isAdmin } from "@/lib/auth"
import { AlertCircle, Check, FileEdit, Plus, Trash2 } from "lucide-react"
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
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  type Announcement,
} from "@/lib/admin-store"

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    important: false,
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    if (!isAdmin()) {
      router.push(
        "/login?redirect=/admin/announcements&message=Πρέπει να είστε διαχειριστής για να αποκτήσετε πρόσβαση",
      )
      return
    }

    // Load announcements
    setAnnouncements(getAnnouncements())
    setLoading(false)
  }, [router])

  const handleCreateAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      setMessage({ type: "error", text: "Παρακαλώ συμπληρώστε όλα τα πεδία" })
      return
    }

    try {
      const result = createAnnouncement(newAnnouncement)
      if (result) {
        setAnnouncements(getAnnouncements())
        setNewAnnouncement({
          title: "",
          content: "",
          important: false,
        })
        setMessage({ type: "success", text: `Η ανακοίνωση δημιουργήθηκε με επιτυχία` })
        setCreateDialogOpen(false)
      }
    } catch (error) {
      setMessage({ type: "error", text: "Σφάλμα κατά τη δημιουργία της ανακοίνωσης" })
    }
  }

  const handleUpdateAnnouncement = () => {
    if (!currentAnnouncement || !currentAnnouncement.title || !currentAnnouncement.content) {
      setMessage({ type: "error", text: "Παρακαλώ συμπληρώστε όλα τα πεδία" })
      return
    }

    try {
      const result = updateAnnouncement(currentAnnouncement.id, {
        title: currentAnnouncement.title,
        content: currentAnnouncement.content,
        important: currentAnnouncement.important,
      })

      if (result) {
        setAnnouncements(getAnnouncements())
        setMessage({ type: "success", text: `Η ανακοίνωση ενημερώθηκε με επιτυχία` })
        setEditDialogOpen(false)
        setCurrentAnnouncement(null)
      }
    } catch (error) {
      setMessage({ type: "error", text: "Σφάλμα κατά την ενημέρωση της ανακοίνωσης" })
    }
  }

  const handleDeleteAnnouncement = (announcementId: string) => {
    if (confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την ανακοίνωση;")) {
      try {
        const success = deleteAnnouncement(announcementId)
        if (success) {
          setAnnouncements(getAnnouncements())
          setMessage({ type: "success", text: "Η ανακοίνωση διαγράφηκε με επιτυχία" })
        } else {
          setMessage({ type: "error", text: "Σφάλμα κατά τη διαγραφή της ανακοίνωσης" })
        }
      } catch (error) {
        setMessage({ type: "error", text: "Σφάλμα κατά τη διαγραφή της ανακοίνωσης" })
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
            <CardTitle className="text-2xl text-white">Διαχείριση Ανακοινώσεων</CardTitle>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Νέα Ανακοίνωση
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle>Δημιουργία Νέας Ανακοίνωσης</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Συμπληρώστε τα στοιχεία για τη νέα ανακοίνωση
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Τίτλος</Label>
                    <Input
                      id="title"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content">Περιεχόμενο</Label>
                    <Textarea
                      id="content"
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                      className="bg-gray-800 border-gray-700 min-h-[150px]"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="important"
                      checked={newAnnouncement.important}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, important: e.target.checked })}
                      className="rounded border-gray-700 bg-gray-800"
                    />
                    <Label htmlFor="important">Σημαντική Ανακοίνωση</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    onClick={handleCreateAnnouncement}
                  >
                    Δημοσίευση
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
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Τίτλος</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Ημερομηνία</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Σημαντική</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Ενέργειες</th>
                    </tr>
                  </thead>
                  <tbody>
                    {announcements.length > 0 ? (
                      announcements.map((announcement) => (
                        <tr key={announcement.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                          <td className="px-4 py-3 text-white">{announcement.title}</td>
                          <td className="px-4 py-3 text-gray-300">
                            {new Date(announcement.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-gray-300">
                            {announcement.important ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-200">
                                Ναι
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                                Όχι
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setCurrentAnnouncement(announcement)
                                  setEditDialogOpen(true)
                                }}
                                className="text-cyan-500 hover:text-cyan-400 hover:bg-cyan-900/20"
                              >
                                <FileEdit className="h-4 w-4" />
                                <span className="sr-only">Επεξεργασία</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteAnnouncement(announcement.id)}
                                className="text-red-500 hover:text-red-400 hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Διαγραφή</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-3 text-center text-gray-400">
                          Δεν υπάρχουν ανακοινώσεις ακόμα
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                onClick={() => router.push("/admin")}
              >
                Επιστροφή στο Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Announcement Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Επεξεργασία Ανακοίνωσης</DialogTitle>
            <DialogDescription className="text-gray-400">Τροποποιήστε τα στοιχεία της ανακοίνωσης</DialogDescription>
          </DialogHeader>
          {currentAnnouncement && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Τίτλος</Label>
                <Input
                  id="edit-title"
                  value={currentAnnouncement.title}
                  onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, title: e.target.value })}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-content">Περιεχόμενο</Label>
                <Textarea
                  id="edit-content"
                  value={currentAnnouncement.content}
                  onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, content: e.target.value })}
                  className="bg-gray-800 border-gray-700 min-h-[150px]"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-important"
                  checked={currentAnnouncement.important}
                  onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, important: e.target.checked })}
                  className="rounded border-gray-700 bg-gray-800"
                />
                <Label htmlFor="edit-important">Σημαντική Ανακοίνωση</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              onClick={handleUpdateAnnouncement}
            >
              Αποθήκευση Αλλαγών
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
