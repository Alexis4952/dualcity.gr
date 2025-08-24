"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { isAdmin } from "@/lib/auth"
import { getOrders, updateOrderStatus, getProduct, type Order } from "@/lib/admin-store"
import { AlertCircle, ArrowLeft, Check, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    if (!isAdmin()) {
      router.push("/login?redirect=/admin/orders&message=Πρέπει να είστε διαχειριστής για να αποκτήσετε πρόσβαση")
      return
    }

    // Load orders
    setOrders(getOrders())
    setLoading(false)
  }, [router])

  const handleUpdateStatus = (orderId: string, status: Order["status"]) => {
    try {
      const result = updateOrderStatus(orderId, status)
      if (result) {
        setOrders(getOrders())
        setMessage({ type: "success", text: "Η κατάσταση της παραγγελίας ενημερώθηκε με επιτυχία" })

        // Update current order if it's being viewed
        if (currentOrder && currentOrder.id === orderId) {
          setCurrentOrder(result)
        }
      } else {
        setMessage({ type: "error", text: "Σφάλμα κατά την ενημέρωση της κατάστασης" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Σφάλμα κατά την ενημέρωση της κατάστασης" })
    }
  }

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">Σε εκκρεμότητα</Badge>
      case "completed":
        return <Badge className="bg-green-600 hover:bg-green-700">Ολοκληρώθηκε</Badge>
      case "cancelled":
        return <Badge className="bg-red-600 hover:bg-red-700">Ακυρώθηκε</Badge>
      default:
        return <Badge className="bg-gray-600 hover:bg-gray-700">{status}</Badge>
    }
  }

  const getProductDetails = (productId: string) => {
    const product = getProduct(productId)
    return product ? product : { name: "Άγνωστο προϊόν", price: 0 }
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
              <CardTitle className="text-2xl text-white">Διαχείριση Παραγγελιών</CardTitle>
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

            <div className="rounded-md border border-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-800/50 border-b border-gray-800">
                      <th className="px-4 py-3 text-left font-medium text-gray-300">ID</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Χρήστης</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Προϊόντα</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Σύνολο</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Κατάσταση</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Ημερομηνία</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Ενέργειες</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                          <td className="px-4 py-3 text-gray-300">{order.id.substring(0, 8)}</td>
                          <td className="px-4 py-3 text-white">{order.userId.substring(0, 8)}</td>
                          <td className="px-4 py-3 text-gray-300">{order.products.length} προϊόν(τα)</td>
                          <td className="px-4 py-3 text-gray-300">€{order.total.toFixed(2)}</td>
                          <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                          <td className="px-4 py-3 text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setCurrentOrder(order)
                                setViewDialogOpen(true)
                              }}
                              className="text-cyan-500 hover:text-cyan-400 hover:bg-cyan-900/20"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Προβολή</span>
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-3 text-center text-gray-400">
                          Δεν υπάρχουν παραγγελίες ακόμα
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

      {/* View Order Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Λεπτομέρειες Παραγγελίας</DialogTitle>
            <DialogDescription className="text-gray-400">
              {currentOrder && `Παραγγελία #${currentOrder.id.substring(0, 8)}`}
            </DialogDescription>
          </DialogHeader>
          {currentOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Κατάσταση</h3>
                  <Select
                    value={currentOrder.status}
                    onValueChange={(value) => handleUpdateStatus(currentOrder.id, value as Order["status"])}
                  >
                    <SelectTrigger className="mt-1 bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="pending">Σε εκκρεμότητα</SelectItem>
                      <SelectItem value="completed">Ολοκληρώθηκε</SelectItem>
                      <SelectItem value="cancelled">Ακυρώθηκε</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Ημερομηνία</h3>
                  <p className="mt-1 text-white">{new Date(currentOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Προϊόντα</h3>
                <div className="rounded-md border border-gray-800 divide-y divide-gray-800">
                  {currentOrder.products.map((item, index) => {
                    const product = getProductDetails(item.productId)
                    return (
                      <div key={index} className="p-3 flex justify-between items-center">
                        <div>
                          <p className="text-white">{product.name}</p>
                          <p className="text-sm text-gray-400">Ποσότητα: {item.quantity}</p>
                        </div>
                        <p className="text-white">€{(product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                <p className="font-medium text-white">Σύνολο</p>
                <p className="font-bold text-white">€{currentOrder.total.toFixed(2)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
