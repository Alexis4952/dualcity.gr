"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "react-hot-toast"
import { Loader2, Plus, Trash2, Edit, Save, X, ImageIcon } from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  image_url: string | null
  discount_percentage: number | null
  is_featured: boolean
  stock: number
  created_at: string
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    discount_percentage: 0,
    is_featured: false,
    stock: 0,
  })
  const [showNewForm, setShowNewForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Νέα state για "Ρωτήστε τιμή"
  const [askForPrice, setAskForPrice] = useState(false)
  const [editAskForPrice, setEditAskForPrice] = useState(false)

  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Σφάλμα κατά τη φόρτωση προϊόντων")
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setUploading(true)

      // Validate form
      if (!newProduct.name || !newProduct.description || (!askForPrice && newProduct.price <= 0)) {
        toast.error("Συμπληρώστε όλα τα υποχρεωτικά πεδία")
        return
      }

      let imageUrl = null

      // Upload image if selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `product-images/${fileName}`

        const { error: uploadError, data } = await supabase.storage.from("products").upload(filePath, imageFile)

        if (uploadError) throw uploadError

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("products").getPublicUrl(filePath)

        imageUrl = publicUrl
      }

      // Insert product to database
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            ...newProduct,
            price: askForPrice ? -1 : newProduct.price, // Χρησιμοποιούμε -1 για "Ρωτήστε τιμή"
            image_url: imageUrl,
          },
        ])
        .select()

      if (error) throw error

      toast.success("Το προϊόν προστέθηκε επιτυχώς!")
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        category: "",
        discount_percentage: 0,
        is_featured: false,
        stock: 0,
      })
      setAskForPrice(false)
      setImageFile(null)
      setImagePreview(null)
      setShowNewForm(false)
      fetchProducts()
    } catch (error) {
      console.error("Error adding product:", error)
      toast.error("Σφάλμα κατά την προσθήκη προϊόντος")
    } finally {
      setUploading(false)
    }
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    try {
      setUploading(true)

      let imageUrl = editingProduct.image_url

      // Upload new image if selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `product-images/${fileName}`

        const { error: uploadError } = await supabase.storage.from("products").upload(filePath, imageFile)

        if (uploadError) throw uploadError

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("products").getPublicUrl(filePath)

        imageUrl = publicUrl

        // Delete old image if exists
        if (editingProduct.image_url) {
          const oldPath = editingProduct.image_url.split("/").pop()
          if (oldPath) {
            await supabase.storage.from("products").remove([`product-images/${oldPath}`])
          }
        }
      }

      // Update product
      const { error } = await supabase
        .from("products")
        .update({
          ...editingProduct,
          price: editAskForPrice ? -1 : editingProduct.price, // Χρησιμοποιούμε -1 για "Ρωτήστε τιμή"
          image_url: imageUrl,
        })
        .eq("id", editingProduct.id)

      if (error) throw error

      toast.success("Το προϊόν ενημερώθηκε επιτυχώς!")
      setEditingProduct(null)
      setEditAskForPrice(false)
      setImageFile(null)
      setImagePreview(null)
      fetchProducts()
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Σφάλμα κατά την ενημέρωση προϊόντος")
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το προϊόν;")) return

    try {
      // Find product to get image URL
      const product = products.find((p) => p.id === id)

      // Delete product from database
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) throw error

      // Delete image if exists
      if (product?.image_url) {
        const path = product.image_url.split("/").pop()
        if (path) {
          await supabase.storage.from("products").remove([`product-images/${path}`])
        }
      }

      toast.success("Το προϊόν διαγράφηκε επιτυχώς!")
      fetchProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Σφάλμα κατά τη διαγραφή προϊόντος")
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleEditClick = (product: Product) => {
    setEditingProduct(product)
    setEditAskForPrice(product.price === -1) // Ελέγχουμε αν η τιμή είναι -1
    setImagePreview(product.image_url)
  }

  const cancelEdit = () => {
    setEditingProduct(null)
    setEditAskForPrice(false)
    setImageFile(null)
    setImagePreview(null)
  }

  const cancelNewProduct = () => {
    setShowNewForm(false)
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      category: "",
      discount_percentage: 0,
      is_featured: false,
      stock: 0,
    })
    setAskForPrice(false)
    setImageFile(null)
    setImagePreview(null)
  }

  // Βοηθητική συνάρτηση για την εμφάνιση τιμής
  const formatPrice = (price: number) => {
    if (price === -1) {
      return "Ρωτήστε τιμή"
    }
    return `${price.toFixed(2)} €`
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Διαχείριση Προϊόντων</h1>
        <button
          onClick={() => setShowNewForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
          disabled={showNewForm}
        >
          <Plus className="mr-2" size={18} />
          Νέο Προϊόν
        </button>
      </div>

      {/* New Product Form */}
      {showNewForm && (
        <div className="bg-gray-800 p-6 rounded-lg mb-8 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Προσθήκη Νέου Προϊόντος</h2>
            <button onClick={cancelNewProduct} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Όνομα Προϊόντος*</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Κατηγορία</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                >
                  <option value="">Επιλέξτε Κατηγορία</option>
                  <option value="vehicles">Οχήματα</option>
                  <option value="properties">Ιδιοκτησίες</option>
                  <option value="weapons">Όπλα</option>
                  <option value="clothing">Ρούχα</option>
                  <option value="misc">Διάφορα</option>
                  <option value="gang">Gang</option>
                  <option value="mafia">Mafia</option>
                  <option value="cartel">Cartel</option>
                  <option value="services">Services</option>
                  <option value="houses">Houses</option>
                  <option value="συνεργεία">Συνεργεία</option>
                  <option value="workshops">Workshops</option>
                  <option value="house">House</option>
                </select>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="ask_for_price"
                    checked={askForPrice}
                    onChange={(e) => setAskForPrice(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="ask_for_price" className="text-sm font-medium">
                    Ρωτήστε τιμή
                  </label>
                </div>
                <label className="block text-sm font-medium mb-1">Τιμή{!askForPrice && "*"}</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number.parseFloat(e.target.value) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                  min="0"
                  step="0.01"
                  disabled={askForPrice}
                  required={!askForPrice}
                />
                {askForPrice && (
                  <p className="text-xs text-gray-400 mt-1">
                    Το προϊόν θα εμφανίζεται με "Ρωτήστε τιμή" αντί για συγκεκριμένη τιμή
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Έκπτωση (%)</label>
                <input
                  type="number"
                  value={newProduct.discount_percentage || 0}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, discount_percentage: Number.parseFloat(e.target.value) })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                  min="0"
                  max="100"
                  disabled={askForPrice}
                />
                {askForPrice && (
                  <p className="text-xs text-gray-400 mt-1">
                    Οι εκπτώσεις δεν είναι διαθέσιμες για προϊόντα με "Ρωτήστε τιμή"
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Απόθεμα</label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: Number.parseInt(e.target.value) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                  min="0"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={newProduct.is_featured}
                  onChange={(e) => setNewProduct({ ...newProduct, is_featured: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="is_featured" className="text-sm font-medium">
                  Προβεβλημένο Προϊόν
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Περιγραφή*</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 h-32"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Εικόνα Προϊόντος</label>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
                  >
                    <ImageIcon className="mr-2" size={18} />
                    Επιλογή Εικόνας
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null)
                          setImagePreview(null)
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={cancelNewProduct}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md mr-2"
                >
                  Ακύρωση
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={18} />
                      Αποθήκευση...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={18} />
                      Αποθήκευση
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Edit Product Form */}
      {editingProduct && (
        <div className="bg-gray-800 p-6 rounded-lg mb-8 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Επεξεργασία Προϊόντος</h2>
            <button onClick={cancelEdit} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleUpdateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Όνομα Προϊόντος*</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Κατηγορία</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                >
                  <option value="">Επιλέξτε Κατηγορία</option>
                  <option value="vehicles">Οχήματα</option>
                  <option value="properties">Ιδιοκτησίες</option>
                  <option value="weapons">Όπλα</option>
                  <option value="clothing">Ρούχα</option>
                  <option value="misc">Διάφορα</option>
                  <option value="gang">Gang</option>
                  <option value="mafia">Mafia</option>
                  <option value="cartel">Cartel</option>
                  <option value="services">Services</option>
                  <option value="houses">Houses</option>
                  <option value="συνεργεία">Συνεργεία</option>
                  <option value="workshops">Workshops</option>
                  <option value="house">House</option>
                </select>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="edit_ask_for_price"
                    checked={editAskForPrice}
                    onChange={(e) => setEditAskForPrice(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="edit_ask_for_price" className="text-sm font-medium">
                    Ρωτήστε τιμή
                  </label>
                </div>
                <label className="block text-sm font-medium mb-1">Τιμή{!editAskForPrice && "*"}</label>
                <input
                  type="number"
                  value={editingProduct.price === -1 ? 0 : editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number.parseFloat(e.target.value) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                  min="0"
                  step="0.01"
                  disabled={editAskForPrice}
                  required={!editAskForPrice}
                />
                {editAskForPrice && (
                  <p className="text-xs text-gray-400 mt-1">
                    Το προϊόν θα εμφανίζεται με "Ρωτήστε τιμή" αντί για συγκεκριμένη τιμή
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Έκπτωση (%)</label>
                <input
                  type="number"
                  value={editingProduct.discount_percentage || 0}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, discount_percentage: Number.parseFloat(e.target.value) })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                  min="0"
                  max="100"
                  disabled={editAskForPrice}
                />
                {editAskForPrice && (
                  <p className="text-xs text-gray-400 mt-1">
                    Οι εκπτώσεις δεν είναι διαθέσιμες για προϊόντα με "Ρωτήστε τιμή"
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Απόθεμα</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number.parseInt(e.target.value) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                  min="0"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="edit_is_featured"
                  checked={editingProduct.is_featured}
                  onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="edit_is_featured" className="text-sm font-medium">
                  Προβεβλημένο Προϊόν
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Περιγραφή*</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 h-32"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Εικόνα Προϊόντος</label>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
                  >
                    <ImageIcon className="mr-2" size={18} />
                    {editingProduct.image_url ? "Αλλαγή Εικόνας" : "Προσθήκη Εικόνας"}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null)
                          setImagePreview(editingProduct.image_url)
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md mr-2"
                >
                  Ακύρωση
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={18} />
                      Ενημέρωση...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={18} />
                      Ενημέρωση
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="animate-spin mr-2" size={24} />
            <span>Φόρτωση προϊόντων...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-gray-400">Δεν υπάρχουν προϊόντα. Προσθέστε το πρώτο σας προϊόν!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Εικόνα
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Όνομα
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Κατηγορία
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Τιμή
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Έκπτωση
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Απόθεμα
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Προβεβλημένο
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ενέργειες
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.image_url ? (
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-700 flex items-center justify-center">
                          <ImageIcon size={16} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{product.category || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{formatPrice(product.price)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {product.price === -1
                          ? "-"
                          : product.discount_percentage
                            ? `${product.discount_percentage}%`
                            : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{product.stock}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{product.is_featured ? "Ναι" : "Όχι"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => handleEditClick(product)} className="text-blue-400 hover:text-blue-300">
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
