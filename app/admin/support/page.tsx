"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { isAdmin } from "@/lib/auth"
import { AlertCircle, Check, Eye, MessageSquare } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getSupportTickets, updateSupportTicket, type SupportTicket } from "@/lib/admin-store"

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [currentTicket, setCurrentTicket] = useState<SupportTicket | null>(null)
  const [replyText, setReplyText] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    if (!isAdmin()) {
      router.push("/login?redirect=/admin/support&message=Πρέπει να είστε διαχειριστής για να αποκτήσετε πρόσβαση")
      return
    }

    // Load support tickets
    setTickets(getSupportTickets())
    setLoading(false)
  }, [router])

  const handleReplyToTicket = () => {
    if (!currentTicket || !replyText.trim()) {
      setMessage({ type: "error", text: "Παρακαλώ γράψτε μια απάντηση" })
      return
    }

    try {
      const updatedTicket = updateSupportTicket(currentTicket.id, {
        status: "answered",
        adminReply: replyText,
      })

      if (updatedTicket) {
        setTickets(getSupportTickets())
        setMessage({ type: "success", text: "Η απάντηση στάλθηκε με επιτυχία" })
        setReplyText("")
        setViewDialogOpen(false)
      } else {
        setMessage({ type: "error", text: "Σφάλμα κατά την αποστολή της απάντησης" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Σφάλμα κατά την αποστολή της απάντησης" })
    }
  }

  const handleCloseTicket = (ticketId: string) => {
    try {
      const updatedTicket = updateSupportTicket(ticketId, {
        status: "closed",
      })

      if (updatedTicket) {
        setTickets(getSupportTickets())
        setMessage({ type: "success", text: "Το αίτημα έκλεισε με επιτυχία" })

        // Update current ticket if it's being viewed
        if (currentTicket && currentTicket.id === ticketId) {
          setCurrentTicket(updatedTicket)
        }
      } else {
        setMessage({ type: "error", text: "Σφάλμα κατά το κλείσιμο του αιτήματος" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Σφάλμα κατά το κλείσιμο του αιτήματος" })
    }
  }

  const getStatusBadge = (status: SupportTicket["status"]) => {
    switch (status) {
      case "open":
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">Ανοιχτό</Badge>
      case "answered":
        return <Badge className="bg-blue-600 hover:bg-blue-700">Απαντήθηκε</Badge>
      case "closed":
        return <Badge className="bg-green-600 hover:bg-green-700">Κλειστό</Badge>
      default:
        return <Badge className="bg-gray-600 hover:bg-gray-700">{status}</Badge>
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
            <CardTitle className="text-2xl text-white">Διαχείριση Αιτημάτων Υποστήριξης</CardTitle>
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
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Χρήστης</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Θέμα</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Κατάσταση</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Ημερομηνία</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Ενέργειες</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.length > 0 ? (
                      tickets.map((ticket) => (
                        <tr key={ticket.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                          <td className="px-4 py-3 text-gray-300">{ticket.id.substring(0, 8)}</td>
                          <td className="px-4 py-3 text-white">{ticket.userName}</td>
                          <td className="px-4 py-3 text-gray-300 truncate max-w-[200px]">{ticket.subject}</td>
                          <td className="px-4 py-3">{getStatusBadge(ticket.status)}</td>
                          <td className="px-4 py-3 text-gray-300">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setCurrentTicket(ticket)
                                  setReplyText(ticket.adminReply || "")
                                  setViewDialogOpen(true)
                                }}
                                className="text-cyan-500 hover:text-cyan-400 hover:bg-cyan-900/20"
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Προβολή</span>
                              </Button>
                              {ticket.status !== "closed" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleCloseTicket(ticket.id)}
                                  className="text-green-500 hover:text-green-400 hover:bg-green-900/20"
                                >
                                  <Check className="h-4 w-4" />
                                  <span className="sr-only">Κλείσιμο</span>
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-3 text-center text-gray-400">
                          Δεν υπάρχουν αιτήματα υποστήριξης
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

      {/* View Ticket Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>Αίτημα Υποστήριξης</DialogTitle>
            <DialogDescription className="text-gray-400">
              {currentTicket && `#${currentTicket.id.substring(0, 8)} - ${currentTicket.subject}`}
            </DialogDescription>
          </DialogHeader>
          {currentTicket && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">Από: {currentTicket.userName}</p>
                  <p className="text-sm text-gray-400">
                    Ημερομηνία: {new Date(currentTicket.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>{getStatusBadge(currentTicket.status)}</div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700">
                <p className="text-white whitespace-pre-wrap">{currentTicket.message}</p>
              </div>

              {currentTicket.adminReply && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Απάντηση Διαχειριστή</h3>
                  <div className="bg-cyan-900/20 p-4 rounded-md border border-cyan-900/50">
                    <p className="text-white whitespace-pre-wrap">{currentTicket.adminReply}</p>
                  </div>
                </div>
              )}

              {currentTicket.status !== "closed" && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Απάντηση</h3>
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Γράψτε την απάντησή σας..."
                    className="bg-gray-800 border-gray-700 min-h-[150px]"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                      onClick={handleReplyToTicket}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Αποστολή Απάντησης
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <div className="flex gap-2">
              {currentTicket && currentTicket.status !== "closed" && (
                <Button
                  variant="outline"
                  onClick={() => handleCloseTicket(currentTicket.id)}
                  className="border-green-700 text-green-400 hover:bg-green-900/20"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Κλείσιμο Αιτήματος
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
