"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ShoppingCart, RefreshCw, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "react-hot-toast"

interface Product {
  id: string
  title: string
  price: number
  category: string
  sold: boolean
  images?: { url: string; is_main: boolean }[]
}

export default function SoldProductsManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Φόρτωση προϊόντων
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/products")
      const data = await response.json()

      if (data.products) {
        console.log(`Φορτώθηκαν ${data.products.length} προϊόντα`)
        setProducts(data.products)
      } else {
        console.error("Δεν επιστράφηκαν προϊόντα από το API")
        setProducts([])
        setError("Δεν ήταν δυνατή η φόρτωση των προϊόντων")
      }
    } catch (error) {
      console.error("Σφάλμα κατά τη φόρτωση των προϊόντων:", error)
      setError("Σφάλμα κατά τη φόρτωση των προϊόντων")
    } finally {
      setLoading(false)
    }
  }

  // Αλλαγή κατάστασης πώλησης
  const toggleSoldStatus = async (productId: string, currentStatus: boolean) => {
    try {
      setUpdating(productId)

      const response = await fetch("/api/products/sold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          sold: !currentStatus,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Ενημέρωση της λίστας προϊόντων
        setProducts((prevProducts) =>
          prevProducts.map((product) => (product.id === productId ? { ...product, sold: !currentStatus } : product)),
        )

        toast.success(data.message || "Η κατάσταση του προϊόντος ενημερώθηκε επιτυχώς")
      } else {
        console.error("Σφάλμα κατά την ενημέρωση της κατάστασης:", data.error)
        toast.error(data.error || "Σφάλμα κατά την ενημέρωση της κατάστασης")
      }
    } catch (error) {
      console.error("Σφάλμα κατά την ενημέρωση της κατάστασης:", error)
      toast.error("Σφάλμα κατά την ενημέρωση της κατάστασης")
    } finally {
      setUpdating(null)
    }
  }

  // Φιλτράρισμα για πωλημένα και μη πωλημένα προϊόντα
  const soldProducts = products.filter((product) => product.sold)
  const availableProducts = products.filter((product) => !product.sold)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Διαχείριση Πωλημένων Προϊόντων</h2>
        <Button onClick={fetchProducts} variant="outline" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Ανανέωση
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Φόρτωση προϊόντων...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Πωλημένα προϊόντα */}
          <Card>
            <CardHeader className="bg-red-50 dark:bg-red-900/20">
              <CardTitle className="flex items-center">
                <XCircle className="mr-2 h-5 w-5 text-red-600" />
                <span>Πωλημένα Προϊόντα ({soldProducts.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {soldProducts.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">Δεν υπάρχουν πωλημένα προϊόντα</p>
              ) : (
                <div className="space-y-4">
                  {soldProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center p-3 border border-red-200 dark:border-red-900/30 rounded-lg bg-red-50/50 dark:bg-red-900/10"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images.find((img) => img.is_main)?.url || product.images[0].url}
                              alt={product.title}
                              className="w-12 h-12 rounded-md object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                              <ShoppingCart className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                          <div className="absolute -top-2 -right-2">
                            <Badge variant="destructive" className="text-[10px] px-1">
                              ΠΩΛΗΘΗΚΕ
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{product.title}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{product.category}</Badge>
                            <span className="text-sm text-muted-foreground">{product.price.toLocaleString()}€</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSoldStatus(product.id, product.sold)}
                        disabled={updating === product.id}
                        className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                      >
                        {updating === product.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Επαναφορά"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Διαθέσιμα προϊόντα */}
          <Card>
            <CardHeader className="bg-green-50 dark:bg-green-900/20">
              <CardTitle className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
                <span>Διαθέσιμα Προϊόντα ({availableProducts.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {availableProducts.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">Δεν υπάρχουν διαθέσιμα προϊόντα</p>
              ) : (
                <div className="space-y-4">
                  {availableProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center p-3 border border-green-200 dark:border-green-900/30 rounded-lg bg-green-50/50 dark:bg-green-900/10"
                    >
                      <div className="flex items-center space-x-3">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images.find((img) => img.is_main)?.url || product.images[0].url}
                            alt={product.title}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                            <ShoppingCart className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{product.title}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{product.category}</Badge>
                            <span className="text-sm text-muted-foreground">{product.price.toLocaleString()}€</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSoldStatus(product.id, product.sold)}
                        disabled={updating === product.id}
                        className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        {updating === product.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Πωλήθηκε"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
