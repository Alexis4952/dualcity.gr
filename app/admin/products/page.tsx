"use client"

import { DialogDescription } from "@/components/ui/dialog"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import {
  Loader2,
  Plus,
  ImageIcon,
  Trash,
  Star,
  X,
  Edit,
  AlertTriangle,
  Percent,
  Calendar,
  ExternalLink,
  Save,
  ShoppingCart,
  Ban,
  Tag,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getSupabaseClient } from "@/lib/supabase/client"
import { EnvVariablesSetup } from "@/components/env-variables-setup"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Checkbox } from "@/components/ui/checkbox"
// Εισάγουμε το νέο component
import { DiscountChecker } from "@/components/admin/discount-checker"
// Εισάγουμε το νέο component
import { SetupSoldColumnButton } from "@/components/admin/setup-sold-column-button"

// Τύποι δεδομένων
interface Product {
  id: string
  title: string
  description: string
  price: number
  category: string
  on_sale?: boolean
  discount_percentage?: number
  discount_price?: number
  discount_start_date?: string
  discount_end_date?: string
  slug?: string
  created_at?: string
  updated_at?: string
  images?: ProductImage[]
  featured?: boolean
  sold?: boolean
}

interface ProductImage {
  id: string
  product_id: string
  url: string
  is_main: boolean
  position?: number
  created_at?: string
}

export default function ProductsPage() {
  const [supabase, setSupabase] = useState<any>(null)
  const [supabaseError, setSupabaseError] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [bucketExists, setBucketExists] = useState(false)
  const [checkingBucket, setCheckingBucket] = useState(true)
  const [activeTab, setActiveTab] = useState("add")

  // Βασικά στοιχεία προϊόντος
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("other") // Default category
  const [askForPrice, setAskForPrice] = useState(false) // Νέο state για "Ρωτήστε τιμή"

  // Εικόνες
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [mainImageIndex, setMainImageIndex] = useState(0)

  // Επεξεργασία προϊόντος
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editPrice, setEditPrice] = useState("")
  const [editCategory, setEditCategory] = useState("")
  const [editAskForPrice, setEditAskForPrice] = useState(false) // Νέο state για επεξεργασία
  const [savingEdit, setSavingEdit] = useState(false)
  const [editImages, setEditImages] = useState<File[]>([])
  const [editImageUrls, setEditImageUrls] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<ProductImage[]>([])

  // Διαχείριση έκπτωσης
  const [discountDialogOpen, setDiscountDialogOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [discountPercentage, setDiscountPercentage] = useState<string>("")
  const [discountStartDate, setDiscountStartDate] = useState<string>("")
  const [discountEndDate, setDiscountEndDate] = useState<string>("")
  const [applyingDiscount, setApplyingDiscount] = useState(false)

  // Διαχείριση κατάστασης πώλησης
  const [markingSold, setMarkingSold] = useState(false)
  const [soldConfirmDialogOpen, setSoldConfirmDialogOpen] = useState(false)
  const [selectedProductForSold, setSelectedProductForSold] = useState<Product | null>(null)

  // Βοηθητική συνάρτηση για την εμφάνιση τιμής
  const formatPrice = (price: number) => {
    if (price === -1) {
      return "Ρωτήστε τιμή"
    }
    return `${price.toLocaleString()}€`
  }

  // Αρχικοποίηση του Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      try {
        // Έλεγχος αν υπάρχουν οι απαραίτητες μεταβλητές περιβάλλοντος
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          console.warn("Missing Supabase environment variables")
          setSupabaseError("Λείπουν οι απαραίτητες μεταβλητές περιβάλλοντος για το Supabase")
          return
        }

        // Χρήση του getSupabaseClient από το lib/supabase/client.ts
        try {
          const client = getSupabaseClient()
          setSupabase(client)
          console.log("Supabase client initialized successfully")
        } catch (clientError) {
          console.error("Error initializing Supabase client:", clientError)
          setSupabaseError("Σφάλμα κατά την αρχικοποίηση του Supabase client")
        }
      } catch (error) {
        console.error("Failed to initialize Supabase client:", error)
        setSupabaseError(error instanceof Error ? error.message : "Unknown error initializing Supabase")
      }
    }

    initSupabase()
  }, [])

  // Φόρτωση προϊόντων και έλεγχος bucket όταν το Supabase client είναι έτοιμο
  useEffect(() => {
    if (supabase) {
      checkBucketExists()
      fetchProducts()
    }
  }, [supabase])

  // Έλεγχος αν υπάρχει το bucket
  const checkBucketExists = async () => {
    if (!supabase) return

    try {
      setCheckingBucket(true)
      console.log("Checking if bucket exists...")

      // Χρησιμοποιούμε το API endpoint για να ελέγξουμε αν υπάρχει το bucket
      const response = await fetch("/api/setup-bucket")
      const data = await response.json()

      if (data.success) {
        console.log("Bucket check successful:", data.message)
        setBucketExists(true)
      } else {
        console.error("Bucket check failed:", data.message)
        toast({
          title: "Προειδοποίηση",
          description:
            "Δεν ήταν δυνατή η πρόσβαση στο χώρο αποθήκευσης εικόνων. Η λειτουργία ανεβάσματος εικόνων ενδέχεται να μην λειτουργεί.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error checking bucket:", error)
      toast({
        title: "Προειδοποίηση",
        description: "Δεν ήταν δυνατός ο έλεγχος του χώρου αποθήκευσης εικόνων.",
        variant: "destructive",
      })
    } finally {
      setCheckingBucket(false)
    }
  }

  // Βελτιώνουμε τη συνάρτηση fetchProducts για να διασφαλίσουμε ότι τα δεδομένα ανανεώνονται σωστά

  // Αντικαθιστούμε την υπάρχουσα συνάρτηση fetchProducts με την παρακάτω:
  const fetchProducts = async () => {
    if (!supabase) return

    try {
      setLoading(true)
      console.log("Fetching products...")

      // Πρώτα ελέγχουμε και ενημερώνουμε τις εκπτώσεις βάσει ημερομηνιών
      try {
        const checkResponse = await fetch("/api/check-discounts", {
          method: "GET",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        })

        if (!checkResponse.ok) {
          console.error("Error checking discounts:", await checkResponse.text())
        }
      } catch (checkError) {
        console.error("Error checking discounts:", checkError)
      }

      // Φόρτωση προϊόντων από το API με παραμέτρους για αποφυγή caching
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/products?t=${timestamp}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.products) {
        console.log(`Fetched ${data.products.length} products`)
        console.log(
          "Products with sold status:",
          data.products.filter((p) => p.sold).map((p) => p.id),
        )
        setProducts(data.products)
      } else {
        console.error("No products returned from API")
        setProducts([])
      }
    } catch (error) {
      console.error("Error in fetchProducts:", error)
      toast({
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η φόρτωση των προϊόντων",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Χειρισμός εικόνων
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files)
      setImages((prev) => [...prev, ...fileArray])

      // Δημιουργία προεπισκόπησης
      const newUrlArray = fileArray.map((file) => URL.createObjectURL(file))
      setImageUrls((prev) => [...prev, ...newUrlArray])
    }
  }

  // Χειρισμός εικόνων για επεξεργασία
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files)
      setEditImages((prev) => [...prev, ...fileArray])

      // Δημιουργία προεπισκόπησης
      const newUrlArray = fileArray.map((file) => URL.createObjectURL(file))
      setEditImageUrls((prev) => [...prev, ...newUrlArray])
    }
  }

  // Αφαίρεση εικόνας από την προεπισκόπηση
  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev]
      newImages.splice(index, 1)
      return newImages
    })

    setImageUrls((prev) => {
      const newUrls = [...prev]
      URL.revokeObjectURL(newUrls[index]) // Απελευθέρωση του URL
      newUrls.splice(index, 1)
      return newUrls
    })

    // Αν αφαιρούμε την κύρια εικόνα, επαναφέρουμε το mainImageIndex στο 0
    if (index === mainImageIndex) {
      setMainImageIndex(0)
    } else if (index < mainImageIndex) {
      // Αν αφαιρούμε εικόνα πριν την κύρια, μειώνουμε το index
      setMainImageIndex(mainImageIndex - 1)
    }
  }

  // Αφαίρεση εικόνας από την προεπισκόπηση επεξεργασίας
  const removeEditImage = (index: number) => {
    setEditImages((prev) => {
      const newImages = [...prev]
      newImages.splice(index, 1)
      return newImages
    })

    setEditImageUrls((prev) => {
      const newUrls = [...prev]
      URL.revokeObjectURL(newUrls[index]) // Απελευθέρωση του URL
      newUrls.splice(index, 1)
      return newUrls
    })
  }

  // Αφαίρεση υπάρχουσας εικόνας
  const removeExistingImage = async (imageId: string) => {
    if (!supabase || !editingProduct) return

    try {
      // Διαγραφή εικόνας από τη βάση δεδομένων
      const { error } = await supabase.from("product_images").delete().eq("id", imageId)

      if (error) {
        console.error("Error deleting image:", error)
        toast({
          title: "Σφάλμα",
          description: "Δεν ήταν δυνατή η διαγραφή της εικόνας",
          variant: "destructive",
        })
        return
      }

      // Ενημέρωση του state
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId))

      toast({
        title: "Επιτυχία",
        description: "Η εικόνα διαγράφηκε επιτυχώς",
      })
    } catch (error) {
      console.error("Error in removeExistingImage:", error)
      toast({
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η διαγραφή της εικόνας",
        variant: "destructive",
      })
    }
  }

  // Ορισμός κύριας εικόνας
  const setMainImage = (index: number) => {
    setMainImageIndex(index)
  }

  // Ορισμός κύριας εικόνας για υπάρχουσα εικόνα
  const setMainExistingImage = async (imageId: string) => {
    if (!supabase || !editingProduct) return

    try {
      // Πρώτα αφαιρούμε το is_main από όλες τις εικόνες του προϊόντος
      const { error: resetError } = await supabase
        .from("product_images")
        .update({ is_main: false })
        .eq("product_id", editingProduct.id)

      if (resetError) {
        console.error("Error resetting main image:", resetError)
        toast({
          title: "Σφάλμα",
          description: "Δεν ήταν δυνατή η ενημέρωση της κύριας εικόνας",
          variant: "destructive",
        })
        return
      }

      // Μετά ορίζουμε τη νέα κύρια εικόνα
      const { error } = await supabase.from("product_images").update({ is_main: true }).eq("id", imageId)

      if (error) {
        console.error("Error setting main image:", error)
        toast({
          title: "Σφάλμα",
          description: "Δεν ήταν δυνατή η ενημέρωση της κύριας εικόνας",
          variant: "destructive",
        })
        return
      }

      // Ενημέρωση του state
      setExistingImages((prev) =>
        prev.map((img) => ({
          ...img,
          is_main: img.id === imageId,
        })),
      )

      toast({
        title: "Επιτυχία",
        description: "Η κύρια εικόνα ενημερώθηκε επιτυχώς",
      })
    } catch (error) {
      console.error("Error in setMainExistingImage:", error)
      toast({
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η ενημέρωση της κύριας εικόνας",
        variant: "destructive",
      })
    }
  }

  // Ανέβασμα εικόνας μέσω του API
  const uploadImage = async (file: File, productId: string, isMain = false) => {
    if (!bucketExists) {
      console.warn("Bucket does not exist, cannot upload images")
      throw new Error("Bucket does not exist")
    }

    try {
      console.log(`Uploading image for product ${productId}, isMain: ${isMain}`)

      // Δημιουργία FormData για το ανέβασμα του αρχείου
      const formData = new FormData()
      formData.append("file", file)
      formData.append("productId", productId)
      formData.append("isMain", isMain.toString())

      // Ανέβασμα μέσω του API endpoint
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!data.success) {
        console.error("Error uploading image via API:", data.error)
        throw new Error(data.message || "Σφάλμα κατά το ανέβασμα της εικόνας")
      }

      console.log(`Image uploaded successfully. URL: ${data.url}`)
      return data.url
    } catch (error) {
      console.error("Error in uploadImage:", error)
      throw error
    }
  }

  // Προσθήκη προϊόντος
  const addProduct = async () => {
    if (!name || !description || (!askForPrice && !price)) {
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία",
        variant: "destructive",
      })
      return
    }

    try {
      setFormLoading(true)
      setUploadProgress(0)
      console.log("Adding product to database via API...")

      // Προσθήκη προϊόντος μέσω του API endpoint
      const response = await fetch("/api/products/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: name,
          description,
          price: askForPrice ? -1 : Number.parseFloat(price), // Χρησιμοποιούμε -1 για "Ρωτήστε τιμή"
          category,
          on_sale: false,
          sold: false,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        console.error("Error from API:", data.message, data.error)
        throw new Error(data.message || "Σφάλμα κατά την προσθήκη του προϊόντος")
      }

      console.log("Product added successfully:", data.product)
      const productId = data.product.id

      // Ανέβασμα εικόνων
      if (images.length > 0 && bucketExists) {
        try {
          const totalImages = images.length
          console.log(`Uploading ${totalImages} images...`)

          for (let i = 0; i < totalImages; i++) {
            const isMain = i === mainImageIndex // Η επιλεγμένη εικόνα είναι η κύρια
            await uploadImage(images[i], productId, isMain)
            setUploadProgress(Math.round(((i + 1) / totalImages) * 100))
          }

          console.log("All images uploaded successfully")
        } catch (imageError) {
          console.error("Error uploading images:", imageError)
          toast({
            title: "Προειδοποίηση",
            description: "Το προϊόν προστέθηκε, αλλά υπήρξε πρόβλημα με την ανάρτηση των εικόνων",
            variant: "destructive",
          })
        }
      } else if (images.length > 0 && !bucketExists) {
        toast({
          title: "Προειδοποίηση",
          description:
            "Το προϊόν προστέθηκε, αλλά δεν ήταν δυνατή η ανάρτηση των εικόνων επειδή δεν υπάρχει ο χώρος αποθήκευσης",
          variant: "destructive",
        })
      }

      // Επαναφορά φόρμας
      setName("")
      setDescription("")
      setPrice("")
      setCategory("other")
      setAskForPrice(false)
      setImages([])
      setImageUrls([])
      setMainImageIndex(0)

      toast({
        title: "Επιτυχία",
        description: "Το προϊόν προστέθηκε επιτυχώς",
      })

      // Ανανέωση λίστας προϊόντων
      fetchProducts()
    } catch (error) {
      console.error("Error in addProduct:", error)
      toast({
        title: "Σφάλμα",
        description: error instanceof Error ? error.message : "Δεν ήταν δυνατή η προσθήκη του προϊόντος",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
      setUploadProgress(0)
    }
  }

  // Άνοιγμα του dialog για επεξεργασία προϊόντος
  const openEditDialog = async (product: Product) => {
    setEditingProduct(product)
    setEditName(product.title)
    setEditDescription(product.description)
    setEditPrice(product.price === -1 ? "" : product.price.toString())
    setEditCategory(product.category)
    setEditAskForPrice(product.price === -1) // Ελέγχουμε αν η τιμή είναι -1
    setEditImages([])
    setEditImageUrls([])

    // Φόρτωση εικόνων του προϊόντος
    try {
      const { data, error } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", product.id)
        .order("is_main", { ascending: false })

      if (error) {
        console.error("Error fetching product images:", error)
      } else {
        setExistingImages(data || [])
      }
    } catch (error) {
      console.error("Error fetching product images:", error)
    }

    setEditDialogOpen(true)
  }

  // Αποθήκευση επεξεργασμένου προϊόντος
  const saveEditedProduct = async () => {
    if (!editingProduct) return

    try {
      setSavingEdit(true)
      console.log("Αποθήκευση αλλαγών προϊόντος:", {
        id: editingProduct.id,
        title: editName,
        description: editDescription,
        price: editAskForPrice ? -1 : Number.parseFloat(editPrice),
        category: editCategory,
      })

      // Ενημέρωση προϊόντος μέσω του API endpoint
      const response = await fetch("/api/products/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingProduct.id,
          title: editName,
          description: editDescription,
          price: editAskForPrice ? -1 : Number.parseFloat(editPrice),
          category: editCategory,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        console.error("Error from API:", data.message, data.error)
        throw new Error(data.message || "Σφάλμα κατά την ενημέρωση του προϊόντος")
      }

      console.log("Το προϊόν ενημερώθηκε επιτυχώς:", data.product)

      // Ανέβασμα νέων εικόνων
      if (editImages.length > 0 && bucketExists) {
        try {
          console.log(`Ανέβασμα ${editImages.length} νέων εικόνων...`)
          for (let i = 0; i < editImages.length; i++) {
            await uploadImage(editImages[i], editingProduct.id, false)
          }
          console.log("Όλες οι εικόνες ανέβηκαν επιτυχώς")
        } catch (imageError) {
          console.error("Error uploading new images:", imageError)
          toast({
            title: "Προειδοποίηση",
            description: "Το προϊόν ενημερώθηκε, αλλά υπήρξε πρόβλημα με την ανάρτηση των νέων εικόνων",
            variant: "destructive",
          })
        }
      }

      toast({
        title: "Επιτυχία",
        description: "Το προϊόν ενημερώθηκε επιτυχώς",
      })

      // Ενημέρωση του τοπικού state με τις νέες τιμές
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                title: editName,
                description: editDescription,
                price: editAskForPrice ? -1 : Number.parseFloat(editPrice),
                category: editCategory,
                updated_at: new Date().toISOString(),
              }
            : product,
        ),
      )

      // Κλείσιμο του dialog και ανανέωση των προϊόντων
      setEditDialogOpen(false)
      fetchProducts() // Ανανέωση της λίστας προϊόντων από τη βάση δεδομένων
    } catch (error) {
      console.error("Error in saveEditedProduct:", error)
      toast({
        title: "Σφάλμα",
        description: error instanceof Error ? error.message : "Δεν ήταν δυνατή η ενημέρωση του προϊόντος",
        variant: "destructive",
      })
    } finally {
      setSavingEdit(false)
    }
  }

  // Διαγραφή προϊόντος
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτό το προϊόν;")) {
      return
    }

    try {
      console.log("Διαγραφή προϊόντος:", productId)

      // Διαγραφή εικόνων μέσω του API
      if (bucketExists) {
        try {
          const response = await fetch(`/api/delete-product-images?productId=${productId}`, {
            method: "DELETE",
          })

          const data = await response.json()
          if (!data.success) {
            console.error("Error deleting product images via API:", data.error)
          }
        } catch (imageError) {
          console.error("Error deleting product images:", imageError)
        }
      }

      // Διαγραφή προϊόντος μέσω του API endpoint
      const response = await fetch("/api/products/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      })

      const data = await response.json()

      if (!data.success) {
        console.error("Error from API:", data.message, data.error)
        throw new Error(data.message || "Σφάλμα κατά τη διαγραφή του προϊόντος")
      }

      console.log("Product deleted successfully")

      toast({
        title: "Επιτυχία",
        description: "Το προϊόν διαγράφηκε επιτυχώς",
      })

      // Ανανέωση λίστας προϊόντων
      fetchProducts()
    } catch (error) {
      console.error("Error in handleDeleteProduct:", error)
      toast({
        title: "Σφάλμα",
        description: error instanceof Error ? error.message : "Δεν ήταν δυνατή η διαγραφή του προϊόντος",
        variant: "destructive",
      })
    }
  }

  // Άνοιγμα του dialog για την προσθήκη έκπτωσης
  const openDiscountDialog = (productId: string, product: Product) => {
    // Δεν επιτρέπουμε εκπτώσεις σε προϊόντα με "Ρωτήστε τιμή"
    if (product.price === -1) {
      toast({
        title: "Προειδοποίηση",
        description: "Δεν μπορείτε να εφαρμόσετε έκπτωση σε προϊόντα με 'Ρωτήστε τιμή'",
        variant: "destructive",
      })
      return
    }

    setSelectedProductId(productId)
    setDiscountPercentage(product.discount_percentage ? product.discount_percentage.toString() : "")

    // Μορφοποίηση ημερομηνιών για το input type="datetime-local"
    if (product.discount_start_date) {
      const startDate = new Date(product.discount_start_date)
      setDiscountStartDate(formatDateForInput(startDate))
    } else {
      setDiscountStartDate("")
    }

    if (product.discount_end_date) {
      const endDate = new Date(product.discount_end_date)
      setDiscountEndDate(formatDateForInput(endDate))
    } else {
      setDiscountEndDate("")
    }

    setDiscountDialogOpen(true)
  }

  // Βοηθητική συνάρτηση για τη μορφοποίηση ημερομηνίας για το input
  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")

    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  // Εφαρμογή έκπτωσης στο προϊόν
  const applyDiscount = async () => {
    if (!selectedProductId) return

    try {
      setApplyingDiscount(true)

      const discountValue = discountPercentage ? Number.parseFloat(discountPercentage) : null

      console.log("Applying discount:", {
        productId: selectedProductId,
        discountValue,
        startDate: discountStartDate,
        endDate: discountEndDate,
      })

      // Έλεγχος εγκυρότητας
      if (discountValue !== null && (discountValue <= 0 || discountValue > 99)) {
        toast({
          title: "Σφάλμα",
          description: "Το ποσοστό έκπτωσης πρέπει να είναι μεταξύ 1 και 99",
          variant: "destructive",
        })
        return
      }

      // Έλεγχος ημερομηνιών
      let startDateISO = null
      let endDateISO = null

      if (discountStartDate && discountEndDate) {
        const startDate = new Date(discountStartDate)
        const endDate = new Date(discountEndDate)

        if (endDate <= startDate) {
          toast({
            title: "Σφάλμα",
            description: "Η ημερομηνία λήξης πρέπει να είναι μεταγενέστερη της ημερομηνίας έναρξης",
            variant: "destructive",
          })
          return
        }

        startDateISO = startDate.toISOString()
        endDateISO = endDate.toISOString()

        console.log("Discount dates:", {
          startDateISO,
          endDateISO,
          currentDate: new Date().toISOString(),
        })
      }

      // Χρήση του νέου API endpoint για την προσθήκη έκπτωσης
      const response = await fetch("/api/products/discount/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: selectedProductId,
          discountPercentage: discountValue,
          startDate: startDateISO,
          endDate: endDateISO,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        console.error("Error applying discount:", data.error)
        throw new Error(data.error || "Σφάλμα κατά την εφαρμογή της έκπτωσης")
      }

      console.log("Discount applied successfully:", data)

      // Άμεση ενημέρωση της λίστας προϊόντων στο UI
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === selectedProductId
            ? {
                ...product,
                discount_percentage: discountValue,
                discount_price: data.data?.discount_price,
                on_sale: data.data?.on_sale,
                discount_start_date: startDateISO,
                discount_end_date: endDateISO,
              }
            : product,
        ),
      )

      toast({
        title: "Επιτυχία",
        description: discountValue
          ? `Η έκπτωση ${discountValue}% εφαρμόστηκε επιτυχώς`
          : "Η έκπτωση αφαιρέθηκε επιτυχώς",
      })

      // Κλείσιμο του dialog και ανανέωση των προϊόντων
      setDiscountDialogOpen(false)
      fetchProducts() // Ανανέωση της λίστας προϊόντων για να είμαστε σίγουροι
    } catch (error) {
      console.error("Error applying discount:", error)
      toast({
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η εφαρμογή της έκπτωσης",
        variant: "destructive",
      })

      // Σε περίπτωση σφάλματος, ανανεώνουμε τη λίστα για να είμαστε σίγουροι
      fetchProducts()
    } finally {
      setApplyingDiscount(false)
    }
  }

  // Αφαίρεση έκπτωσης από προϊόν
  const removeDiscount = async (productId: string) => {
    if (!confirm("Είστε βέβαιοι ότι θέλετε να αφαιρέσετε την έκπτωση από αυτό το προϊόν;")) {
      return
    }

    try {
      console.log("Removing discount for product:", productId)

      // Αφαίρεση έκπτωσης μέσω του API
      const response = await fetch("/api/products/discount/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      })

      const data = await response.json()

      console.log("API response:", data)

      if (!data.success) {
        console.error("Error removing discount:", data.error)
        throw new Error(data.error || "Σφάλμα κατά την αφαίρεση της έκπτωσης")
      }

      // Άμεση ενημέρωση της λίστας προϊόντων στο UI
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? {
                ...product,
                on_sale: false,
                discount_percentage: null,
                discount_price: null,
                discount_start_date: null,
                discount_end_date: null,
              }
            : product,
        ),
      )

      toast({
        title: "Επιτυχία",
        description: "Η έκπτωση αφαιρέθηκε επιτυχώς",
      })

      // Ανανέωση της λίστας προϊόντων για να είμαστε σίγουροι
      fetchProducts()
    } catch (error) {
      console.error("Error in removeDiscount:", error)
      toast({
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η αφαίρεση της έκπτωσης",
        variant: "destructive",
      })

      // Σε περίπτωση σφάλματος, ανανεώνουμε τη λίστα για να είμαστε σίγουροι
      fetchProducts()
    }
  }

  // Άνοιγμα του dialog για τη σήμανση προϊόντος ως πωλημένο
  const openSoldConfirmDialog = (product: Product) => {
    setSelectedProductForSold(product)
    setSoldConfirmDialogOpen(true)
  }

  // Σήμανση προϊόντος ως πωλημένο
  const markProductAsSold = async () => {
    if (!selectedProductForSold) return

    try {
      setMarkingSold(true)

      console.log(
        `Marking product ${selectedProductForSold.id} as ${!selectedProductForSold.sold ? "sold" : "available"}`,
      )

      // Ενημέρωση της κατάστασης πώλησης μέσω του API
      const response = await fetch("/api/products/sold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: selectedProductForSold.id,
          sold: !selectedProductForSold.sold,
        }),
      })

      const data = await response.json()

      console.log("API response:", data)

      if (!data.success) {
        console.error("Error updating sold status:", data.error, data.details)
        throw new Error(data.error || data.details || "Σφάλμα κατά την ενημέρωση της κατάστασης πώλησης")
      }

      // Άμεση ενημέρωση της λίστας προϊόντων στο UI
      const newSoldStatus = !selectedProductForSold.sold
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === selectedProductForSold.id ? { ...product, sold: newSoldStatus } : product,
        ),
      )

      toast({
        title: "Επιτυχία",
        description: selectedProductForSold.sold
          ? "Το προϊόν σημάνθηκε ως διαθέσιμο"
          : "Το προϊόν σημάνθηκε ως πωλημένο",
      })

      // Κλείσιμο του dialog και ανανέωση των προϊόντων
      setSoldConfirmDialogOpen(false)
      setSelectedProductForSold(null)

      // Ανανέωση της λίστας προϊόντων για να είμαστε σίγουροι
      setTimeout(() => {
        fetchProducts()
      }, 500)
    } catch (error) {
      console.error("Error in markProductAsSold:", error)
      toast({
        title: "Σφάλμα",
        description: error instanceof Error ? error.message : "Δεν ήταν δυνατή η ενημέρωση της κατάστασης πώλησης",
        variant: "destructive",
      })

      // Σε περίπτωση σφάλματος, ανανεώνουμε τη λίστα για να είμαστε σίγουροι
      fetchProducts()
    } finally {
      setMarkingSold(false)
    }
  }

  // Δημιουργία bucket μέσω του API
  const createBucket = async () => {
    try {
      setCheckingBucket(true)
      console.log("Creating bucket via API...")

      const response = await fetch("/api/setup-bucket")
      const data = await response.json()

      if (data.success) {
        console.log("Bucket created successfully:", data.message)
        setBucketExists(true)
        toast({
          title: "Επιτυχία",
          description: "Ο χώρος αποθήκευσης εικόνων δημιουργήθηκε επιτυχώς",
        })
      } else {
        console.error("Bucket creation failed:", data.message)
        toast({
          title: "Σφάλμα",
          description: "Δεν ήταν δυνατή η δημιουργία του χώρου αποθήκευσης εικόνων",
        })
      }
    } catch (error) {
      console.error("Error creating bucket:", error)
      toast({
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η δημιουργία του χώρου αποθήκευσης εικόνων",
        variant: "destructive",
      })
    } finally {
      setCheckingBucket(false)
    }
  }

  // Αν υπάρχει σφάλμα με το Supabase, εμφανίζουμε μήνυμα σφάλματος
  if (supabaseError) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Σφάλμα σύνδεσης με τη βάση δεδομένων</AlertTitle>
          <AlertDescription>
            <p>
              Δεν ήταν δυνατή η σύνδεση με τη βάση δεδομένων Supabase. Βεβαιωθείτε ότι έχετε ρυθμίσει σωστά τις
              μεταβλητές περιβάλλοντος.
            </p>
            <p className="mt-2">Σφάλμα: {supabaseError}</p>
          </AlertDescription>
        </Alert>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Ρύθμιση Μεταβλητών Περιβάλλοντος</h2>
          <p className="mb-6 text-muted-foreground">
            Για να λειτουργήσει σωστά η εφαρμογή, χρειάζεται να ρυθμίσετε τις μεταβλητές περιβάλλοντος του Supabase.
            Μπορείτε να τις προσθέσετε παρακάτω:
          </p>

          <EnvVariablesSetup />

          <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-md font-medium mb-2">Πού θα βρω τα διαπιστευτήρια του Supabase;</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                Συνδεθείτε στο λογαριασμό σας στο{" "}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Supabase
                </a>
              </li>
              <li>Επιλέξτε το project σας</li>
              <li>Πηγαίνετε στο "Settings" &gt; "API"</li>
              <li>Αντιγράψτε το "URL" και το "anon public" key</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  // Αν το Supabase client δεν έχει αρχικοποιηθεί ακόμα, εμφανίζουμε ένα loading indicator
  if (!supabase) {
    return (
      <AdminLayout title="Διαχείριση Προϊόντων">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p>Φόρτωση σύνδεσης με τη βάση δεδομένων...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Διαχείριση Προϊόντων">
      {/* Bucket Status */}
      {!bucketExists && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Χώρος Αποθήκευσης Εικόνων</h3>
                <p className="text-sm text-muted-foreground">
                  Ο χώρος αποθήκευσης εικόνων δεν έχει ρυθμιστεί. Δεν θα είναι δυνατή η ανάρτηση εικόνων.
                </p>
              </div>
              <Button onClick={createBucket} disabled={checkingBucket} className="whitespace-nowrap">
                {checkingBucket ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Έλεγχος...
                  </>
                ) : (
                  "Δημιουργία Χώρου Αποθήκευσης"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add">Προσθήκη Προϊόντος</TabsTrigger>
          <TabsTrigger value="list">Λίστα Προϊόντων</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Προσθήκη Νέου Προϊόντος</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Όνομα Προϊόντος *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Εισάγετε όνομα προϊόντος"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Περιγραφή *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Εισάγετε περιγραφή προϊόντος"
                    rows={3}
                  />
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id="askForPrice"
                      checked={askForPrice}
                      onCheckedChange={(checked) => setAskForPrice(checked as boolean)}
                    />
                    <Label htmlFor="askForPrice" className="text-sm font-medium">
                      Ρωτήστε τιμή
                    </Label>
                  </div>
                  <Label htmlFor="price">Τιμή (σε €) {!askForPrice && "*"}</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder={askForPrice ? "Θα εμφανίζεται 'Ρωτήστε τιμή'" : "Εισάγετε τιμή"}
                    disabled={askForPrice}
                    required={!askForPrice}
                  />
                  {askForPrice && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Το προϊόν θα εμφανίζεται με "Ρωτήστε τιμή" αντί για συγκεκριμένη τιμή
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category">Κατηγορία</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Επιλέξτε κατηγορία" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vehicles">Οχήματα</SelectItem>
                      <SelectItem value="weapons">Όπλα</SelectItem>
                      <SelectItem value="properties">Ιδιοκτησίες</SelectItem>
                      <SelectItem value="clothing">Ρούχα</SelectItem>
                      <SelectItem value="mlo">MLO</SelectItem>
                      <SelectItem value="other">Άλλο</SelectItem>
                      <SelectItem value="gang">Gang</SelectItem>
                      <SelectItem value="mafia">Mafia</SelectItem>
                      <SelectItem value="cartel">Cartel</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="houses">Houses</SelectItem>
                      <SelectItem value="συνεργεία">Συνεργεία</SelectItem>
                      <SelectItem value="workshops">Workshops</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="images">Εικόνες Προϊόντος</Label>
                  <Input
                    id="images"
                    type="file"
                    onChange={handleImageChange}
                    multiple
                    accept="image/*"
                    className="mt-1"
                    disabled={!bucketExists}
                  />
                  {!bucketExists && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Η ανάρτηση εικόνων δεν είναι διαθέσιμη. Παρακαλώ δημιουργήστε πρώτα τον χώρο αποθήκευσης.
                    </p>
                  )}

                  {imageUrls.length > 0 && (
                    <div className="mt-4">
                      <Label>Προεπισκόπηση Εικόνων</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                        {imageUrls.map((url, index) => (
                          <div
                            key={index}
                            className={`relative rounded-md overflow-hidden border-2 ${
                              index === mainImageIndex ? "border-primary" : "border-gray-200"
                            }`}
                          >
                            <div className="aspect-square">
                              <img
                                src={url || "/placeholder.svg"}
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1">
                              <Button
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6 rounded-full"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              {index !== mainImageIndex && (
                                <Button
                                  variant="default"
                                  size="icon"
                                  className="h-6 w-6 rounded-full"
                                  onClick={() => setMainImage(index)}
                                >
                                  <Star className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                            {index === mainImageIndex && (
                              <Badge className="absolute bottom-2 left-2 bg-primary">Κύρια</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    <p className="text-xs mt-1 text-center">{`Ανέβασμα εικόνων: ${uploadProgress}%`}</p>
                  </div>
                )}

                <Button type="button" disabled={formLoading} className="w-full" onClick={addProduct}>
                  {formLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Προσθήκη...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Προσθήκη Προϊόντος
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Λίστα Προϊόντων</CardTitle>
              <div className="flex items-center gap-2">
                <SetupSoldColumnButton />
                <DiscountChecker />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Δεν υπάρχουν προϊόντα ακόμα</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      className={`overflow-hidden ${product.sold ? "border-2 border-red-500" : ""}`}
                    >
                      <div className="aspect-video relative bg-muted">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images.find((img: any) => img.is_main)?.url || product.images[0]?.url}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                          </div>
                        )}
                        {product.images && product.images.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                            +{product.images.length - 1} εικόνες
                          </div>
                        )}
                        {product.on_sale && product.price !== -1 && (
                          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                            -{product.discount_percentage}%
                          </div>
                        )}
                        {product.sold && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Badge className="bg-red-600 text-white px-3 py-1 text-lg">ΠΩΛΗΘΗΚΕ</Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg truncate">{product.title}</h3>
                          <div className="text-right">
                            {product.price === -1 ? (
                              <div className="text-lg font-bold text-primary">Ρωτήστε τιμή</div>
                            ) : product.on_sale ? (
                              <>
                                <div className="text-lg font-bold text-primary">
                                  {product.discount_price?.toLocaleString()}€
                                </div>
                                <div className="text-sm line-through text-muted-foreground">
                                  {product.price?.toLocaleString()}€
                                </div>
                              </>
                            ) : (
                              <div className="text-lg font-bold text-primary">{formatPrice(product.price)}</div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
                        {product.category && (
                          <Badge variant="outline" className="mb-2">
                            {product.category}
                          </Badge>
                        )}
                        {product.discount_start_date && product.discount_end_date && product.price !== -1 && (
                          <div className="text-xs text-muted-foreground mt-2">
                            <Calendar className="h-3 w-3 inline-block mr-1" />
                            Προσφορά: {new Date(product.discount_start_date).toLocaleDateString()} -{" "}
                            {new Date(product.discount_end_date).toLocaleDateString()}
                          </div>
                        )}
                        {product.slug && (
                          <div className="text-xs text-muted-foreground mt-1">
                            <Link
                              href={`/shop/${product.slug}`}
                              target="_blank"
                              className="flex items-center hover:text-primary"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              /shop/{product.slug}
                            </Link>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex flex-wrap justify-end gap-2 p-4 pt-0">
                        {product.on_sale && product.price !== -1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => removeDiscount(product.id)}
                          >
                            <Ban className="h-3 w-3 mr-1" />
                            Αφαίρεση Έκπτωσης
                          </Button>
                        )}
                        {product.price !== -1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => openDiscountDialog(product.id, product)}
                          >
                            <Percent className="h-3 w-3 mr-1" />
                            {product.on_sale ? "Αλλαγή Έκπτωσης" : "Προσθήκη Έκπτωσης"}
                          </Button>
                        )}
                        <Button
                          variant={product.sold ? "default" : "outline"}
                          size="sm"
                          className={`text-xs ${product.sold ? "bg-red-600 hover:bg-red-700 text-white" : "border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"}`}
                          onClick={() => openSoldConfirmDialog(product)}
                        >
                          {product.sold ? (
                            <>
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Επαναφορά
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Πωλήθηκε
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs" onClick={() => openEditDialog(product)}>
                          <Edit className="h-3 w-3 mr-1" />
                          Επεξεργασία
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-xs"
                        >
                          <Trash className="h-3 w-3 mr-1" />
                          Διαγραφή
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog για την επεξεργασία προϊόντος */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Επεξεργασία Προϊόντος</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editName" className="text-right">
                Όνομα
              </Label>
              <Input
                id="editName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editDescription" className="text-right">
                Περιγραφή
              </Label>
              <Textarea
                id="editDescription"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="col-span-3"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Τιμή</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="editAskForPrice"
                    checked={editAskForPrice}
                    onCheckedChange={(checked) => setEditAskForPrice(checked as boolean)}
                  />
                  <Label htmlFor="editAskForPrice" className="text-sm">
                    Ρωτήστε τιμή
                  </Label>
                </div>
                <Input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder={editAskForPrice ? "Θα εμφανίζεται 'Ρωτήστε τιμή'" : "Εισάγετε τιμή"}
                  disabled={editAskForPrice}
                  required={!editAskForPrice}
                />
                {editAskForPrice && (
                  <p className="text-xs text-muted-foreground">
                    Το προϊόν θα εμφανίζεται με "Ρωτήστε τιμή" αντί για συγκεκριμένη τιμή
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editCategory" className="text-right">
                Κατηγορία
              </Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Επιλέξτε κατηγορία" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vehicles">Οχήματα</SelectItem>
                  <SelectItem value="weapons">Όπλα</SelectItem>
                  <SelectItem value="properties">Ιδιοκτησίες</SelectItem>
                  <SelectItem value="clothing">Ρούχα</SelectItem>
                  <SelectItem value="mlo">MLO</SelectItem>
                  <SelectItem value="other">Άλλο</SelectItem>
                  <SelectItem value="gang">Gang</SelectItem>
                  <SelectItem value="mafia">Mafia</SelectItem>
                  <SelectItem value="cartel">Cartel</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="houses">Houses</SelectItem>
                  <SelectItem value="συνεργεία">Συνεργεία</SelectItem>
                  <SelectItem value="workshops">Workshops</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right">Εικόνες</Label>
              <div className="col-span-3">
                <Input
                  type="file"
                  onChange={handleEditImageChange}
                  multiple
                  accept="image/*"
                  disabled={!bucketExists}
                />
                <p className="text-xs text-muted-foreground mt-1">Προσθέστε νέες εικόνες στο προϊόν</p>

                {/* Υπάρχουσες εικόνες */}
                {existingImages.length > 0 && (
                  <div className="mt-4">
                    <Label className="mb-2 block">Υπάρχουσες εικόνες</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {existingImages.map((image) => (
                        <div
                          key={image.id}
                          className={`relative rounded-md overflow-hidden border-2 ${
                            image.is_main ? "border-primary" : "border-gray-200"
                          }`}
                        >
                          <div className="aspect-square">
                            <img
                              src={image.url || "/placeholder.svg"}
                              alt="Product"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() => removeExistingImage(image.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            {!image.is_main && (
                              <Button
                                variant="default"
                                size="icon"
                                className="h-6 w-6 rounded-full"
                                onClick={() => setMainExistingImage(image.id)}
                              >
                                <Star className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          {image.is_main && <Badge className="absolute bottom-2 left-2 bg-primary">Κύρια</Badge>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Νέες εικόνες */}
                {editImageUrls.length > 0 && (
                  <div className="mt-4">
                    <Label className="mb-2 block">Νέες εικόνες</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {editImageUrls.map((url, index) => (
                        <div key={index} className="relative rounded-md overflow-hidden border-2 border-gray-200">
                          <div className="aspect-square">
                            <img src={url || "/placeholder.svg"} alt="Product" className="w-full h-full object-cover" />
                          </div>
                          <div className="absolute top-2 right-2">
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() => removeEditImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setEditDialogOpen(false)}>
              Ακύρωση
            </Button>
            <Button type="button" disabled={savingEdit} onClick={saveEditedProduct}>
              {savingEdit ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Αποθήκευση...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Αποθήκευση
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog για την προσθήκη έκπτωσης */}
      <Dialog open={discountDialogOpen} onOpenChange={setDiscountDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Εφαρμογή Έκπτωσης</DialogTitle>
            <DialogDescription>Εισάγετε το ποσοστό έκπτωσης και τις ημερομηνίες.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discountPercentage" className="text-right">
                Ποσοστό (%)
              </Label>
              <Input
                type="number"
                id="discountPercentage"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                className="col-span-3"
                placeholder="Εισάγετε ποσοστό έκπτωσης"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discountStartDate" className="text-right">
                Έναρξη
              </Label>
              <Input
                type="datetime-local"
                id="discountStartDate"
                value={discountStartDate}
                onChange={(e) => setDiscountStartDate(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discountEndDate" className="text-right">
                Λήξη
              </Label>
              <Input
                type="datetime-local"
                id="discountEndDate"
                value={discountEndDate}
                onChange={(e) => setDiscountEndDate(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setDiscountDialogOpen(false)}>
              Ακύρωση
            </Button>
            <Button type="button" disabled={applyingDiscount} onClick={applyDiscount}>
              {applyingDiscount ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Εφαρμογή...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Εφαρμογή
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog για τη σήμανση προϊόντος ως πωλημένο */}
      <Dialog open={soldConfirmDialogOpen} onOpenChange={setSoldConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedProductForSold?.sold ? "Επαναφορά Προϊόντος" : "Σήμανση ως Πωλημένο"}</DialogTitle>
            <DialogDescription>
              {selectedProductForSold?.sold
                ? "Είστε βέβαιοι ότι θέλετε να επαναφέρετε αυτό το προϊόν ως διαθέσιμο;"
                : "Είστε βέβαιοι ότι θέλετε να σημάνετε αυτό το προϊόν ως πωλημένο;"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              {selectedProductForSold?.sold
                ? "Το προϊόν θα εμφανίζεται ξανά ως διαθέσιμο στο κατάστημα."
                : "Το προϊόν θα εμφανίζεται με κόκκινο πλαίσιο και ένδειξη 'ΠΩΛΗΘΗΚΕ'."}
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setSoldConfirmDialogOpen(false)}>
              Ακύρωση
            </Button>
            <Button
              type="button"
              disabled={markingSold}
              onClick={markProductAsSold}
              variant={selectedProductForSold?.sold ? "default" : "destructive"}
            >
              {markingSold ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Επεξεργασία...
                </>
              ) : (
                <>
                  <Tag className="mr-2 h-4 w-4" />
                  {selectedProductForSold?.sold ? "Επαναφορά ως Διαθέσιμο" : "Σήμανση ως Πωλημένο"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
