import { createClient } from "@supabase/supabase-js"

// Τύποι δεδομένων
export interface Product {
  id: string
  title: string
  description: string
  long_description?: string
  price: number
  discount_price?: number
  discount_percentage?: number
  on_sale?: boolean
  discount_start_date?: string // Προσθήκη ημερομηνίας έναρξης έκπτωσης
  discount_end_date?: string // Προσθήκη ημερομηνίας λήξης έκπτωσης
  category: string
  features?: string[]
  created_at?: string
  updated_at?: string
  slug?: string
  sold?: boolean
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  is_main: boolean
  created_at?: string
  position?: number
}

// Τύπος για τα αποτελέσματα του ελέγχου εκπτώσεων
export interface DiscountCheckResult {
  success: boolean
  expired_discounts: number
  activated_discounts: number
  timestamp: string
}

// Δημιουργία Supabase client για server-side λειτουργίες
function createSupabaseServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables")
    return null
  }

  return createClient(supabaseUrl, supabaseKey)
}

// Λειτουργίες για τα προϊόντα
export async function getProducts() {
  try {
    const supabase = createSupabaseServerClient()
    if (!supabase) return []

    // Πρώτα ελέγχουμε και ενημερώνουμε τις εκπτώσεις
    try {
      const { data, error } = await supabase.rpc("check_and_update_discounts")
      if (error) {
        console.error("Error checking discounts via RPC:", error)
      } else {
        console.log("Successfully checked discounts via RPC:", data)
      }
    } catch (checkError) {
      console.error("Error in discount check:", checkError)
    }

    // Χρησιμοποιούμε την επιλογή { head: false } για να αποφύγουμε το caching
    const { data, error } = await supabase
      .from("products")
      .select("*", { head: false, count: "exact" })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getProducts:", error)
    return []
  }
}

export async function getProductById(id: string) {
  try {
    const supabase = createSupabaseServerClient()
    if (!supabase) return null

    // Πρώτα ελέγχουμε και ενημερώνουμε τις εκπτώσεις
    try {
      await supabase.rpc("check_and_update_discounts")
    } catch (checkError) {
      console.error("Error in discount check:", checkError)
    }

    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching product with id ${id}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error(`Error in getProductById for id ${id}:`, error)
    return null
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const supabase = createSupabaseServerClient()
    if (!supabase) return null

    // Πρώτα ελέγχουμε και ενημερώνουμε τις εκπτώσεις
    try {
      await supabase.rpc("check_and_update_discounts")
    } catch (checkError) {
      console.error("Error in discount check:", checkError)
    }

    const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single()

    if (error) {
      console.error(`Error fetching product with slug ${slug}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error(`Error in getProductBySlug for slug ${slug}:`, error)
    return null
  }
}

export async function getProductImages(productId: string) {
  try {
    const supabase = createSupabaseServerClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .order("is_main", { ascending: false })

    if (error) {
      console.error(`Error fetching images for product ${productId}:`, error)
      return []
    }

    return data || []
  } catch (error) {
    console.error(`Error in getProductImages for product ${productId}:`, error)
    return []
  }
}

export async function getMainImageForProduct(productId: string) {
  try {
    const supabase = createSupabaseServerClient()
    if (!supabase) return null

    const { data, error } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .eq("is_main", true)
      .single()

    if (error) {
      // Αν δεν υπάρχει κύρια εικόνα, επιστρέφουμε την πρώτη εικόνα
      const { data: firstImage, error: firstImageError } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", productId)
        .limit(1)
        .single()

      if (firstImageError) {
        console.error(`Error fetching any image for product ${productId}:`, firstImageError)
        return null
      }

      return firstImage
    }

    return data
  } catch (error) {
    console.error(`Error in getMainImageForProduct for product ${productId}:`, error)
    return null
  }
}

// Λειτουργίες για το admin panel
export async function createProduct(product: Omit<Product, "id" | "created_at" | "updated_at">) {
  try {
    const supabase = createSupabaseServerClient()
    if (!supabase) return null

    const { data, error } = await supabase.from("products").insert([product]).select()

    if (error) {
      console.error("Error creating product:", error)
      return null
    }

    return data?.[0] || null
  } catch (error) {
    console.error("Error in createProduct:", error)
    return null
  }
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  try {
    const supabase = createSupabaseServerClient()
    if (!supabase) {
      console.error("Failed to create Supabase client")
      return null
    }

    console.log(`Updating product ${id} with:`, updates)

    // Προσθέτουμε το updated_at
    const updatesWithTimestamp = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("products").update(updatesWithTimestamp).eq("id", id).select()

    if (error) {
      console.error(`Error updating product ${id}:`, error)
      return null
    }

    console.log(`Product ${id} updated successfully:`, data?.[0])
    return data?.[0] || null
  } catch (error) {
    console.error(`Error in updateProduct for id ${id}:`, error)
    return null
  }
}

// Ενημερωμένη λειτουργία για την ενημέρωση της έκπτωσης ενός προϊόντος με ημερομηνίες
export async function updateProductDiscount(
  id: string,
  discountPercentage: number | null,
  startDate: string | null = null,
  endDate: string | null = null,
) {
  try {
    const supabase = createSupabaseServerClient()
    if (!supabase) {
      console.error("Failed to create Supabase client in updateProductDiscount")
      return null
    }

    console.log("Updating product discount:", {
      id,
      discountPercentage,
      startDate,
      endDate,
    })

    // Πρώτα παίρνουμε το προϊόν για να υπολογίσουμε την τιμή με έκπτωση
    const { data: product, error: productError } = await supabase.from("products").select("price").eq("id", id).single()

    if (productError) {
      console.error(`Error fetching product ${id} for discount update:`, productError)
      return null
    }

    console.log("Product price:", product.price)

    let updates: Partial<Product> = {
      updated_at: new Date().toISOString(),
    }

    if (discountPercentage && discountPercentage > 0) {
      const discountPrice = product.price - (product.price * discountPercentage) / 100

      // Έλεγχος αν η έκπτωση πρέπει να είναι ενεργή τώρα βάσει ημερομηνιών
      let isActive = true
      if (startDate && endDate) {
        const currentDate = new Date()
        const discountStartDate = new Date(startDate)
        const discountEndDate = new Date(endDate)
        isActive = currentDate >= discountStartDate && currentDate <= discountEndDate

        console.log("Discount active status:", {
          isActive,
          currentDate,
          discountStartDate,
          discountEndDate,
        })
      }

      updates = {
        ...updates,
        discount_percentage: discountPercentage,
        discount_price: Number.parseFloat(discountPrice.toFixed(2)),
        on_sale: isActive,
        discount_start_date: startDate,
        discount_end_date: endDate,
      }
    } else {
      updates = {
        ...updates,
        discount_percentage: null,
        discount_price: null,
        on_sale: false,
        discount_start_date: null,
        discount_end_date: null,
      }
    }

    console.log("Updating product with:", updates)

    const { data, error } = await supabase.from("products").update(updates).eq("id", id).select()

    if (error) {
      console.error(`Error updating product discount ${id}:`, error)
      return null
    }

    console.log("Discount updated successfully:", data?.[0])
    return data?.[0] || null
  } catch (error) {
    console.error(`Error in updateProductDiscount for id ${id}:`, error)
    return null
  }
}

export async function deleteProduct(id: string) {
  try {
    const supabase = createSupabaseServerClient()
    if (!supabase) return false

    // Πρώτα διαγράφουμε όλες τις εικόνες του προϊόντος
    const { error: imagesError } = await supabase.from("product_images").delete().eq("product_id", id)

    if (imagesError) {
      console.error(`Error deleting images for product ${id}:`, imagesError)
      return false
    }

    // Μετά διαγράφουμε το προϊόν
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting product ${id}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Error in deleteProduct for id ${id}:`, error)
    return false
  }
}

export async function uploadProductImage(productId: string, file: File, isMain = false) {
  try {
    // Χρησιμοποιούμε το service role key για να έχουμε πλήρη δικαιώματα
    const supabaseAdmin = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "")

    // Δημιουργία μοναδικού ονόματος αρχείου
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `products/${productId}/${fileName}`

    // Μετατροπή του File σε ArrayBuffer για το server-side upload
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    // Ανέβασμα του αρχείου στο storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("images") // Χρησιμοποιούμε τον bucket 'images'
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
      })

    if (uploadError) {
      console.error(`Error uploading image for product ${productId}:`, uploadError)
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Δημιουργία δημόσιου URL για την εικόνα
    const { data: publicUrlData } = supabaseAdmin.storage.from("images").getPublicUrl(uploadData.path)

    const url = publicUrlData.publicUrl
    console.log(`File uploaded successfully. Public URL: ${url}`)

    // Αν είναι η κύρια εικόνα, πρώτα αφαιρούμε το is_main από όλες τις άλλες εικόνες
    if (isMain) {
      await supabaseAdmin.from("product_images").update({ is_main: false }).eq("product_id", productId)
    }

    // Αποθήκευση των πληροφοριών της εικόνας στη βάση δεδομένων
    const { data: imageData, error: imageError } = await supabaseAdmin
      .from("product_images")
      .insert([
        {
          product_id: productId,
          url,
          is_main: isMain,
        },
      ])
      .select()

    if (imageError) {
      console.error(`Error saving image data for product ${productId}:`, imageError)
      throw new Error(`Database error: ${imageError.message}`)
    }

    return imageData?.[0] || null
  } catch (error) {
    console.error(`Error in uploadProductImage for product ${productId}:`, error)
    throw error // Επαναπροωθούμε το σφάλμα για καλύτερο χειρισμό
  }
}

export async function deleteProductImage(imageId: string) {
  try {
    // Χρησιμοποιούμε το service role key για να έχουμε πλήρη δικαιώματα
    const supabaseAdmin = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "")

    // Παίρνουμε πρώτα τα στοιχεία της εικόνας για να βρούμε το path στο storage
    const { data: imageData, error: imageError } = await supabaseAdmin
      .from("product_images")
      .select("*")
      .eq("id", imageId)
      .single()

    if (imageError) {
      console.error(`Error fetching image data for image ${imageId}:`, imageError)
      return false
    }

    // Διαγραφή από τη βάση δεδομένων
    const { error } = await supabaseAdmin.from("product_images").delete().eq("id", imageId)

    if (error) {
      console.error(`Error deleting image ${imageId}:`, error)
      return false
    }

    // Προσπαθούμε να διαγράψουμε και το αρχείο από το storage
    try {
      const url = imageData.url
      // Εξαγωγή του path από το URL
      const urlParts = url.split("/")
      const bucketName = "images"
      // Το path είναι συνήθως μετά το όνομα του bucket στο URL
      const bucketIndex = urlParts.findIndex((part) => part === bucketName)
      if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
        const path = urlParts.slice(bucketIndex + 1).join("/")
        await supabaseAdmin.storage.from(bucketName).remove([path])
      }
    } catch (storageError) {
      console.warn(`Could not delete image file from storage:`, storageError)
      // Συνεχίζουμε ακόμα κι αν αποτύχει η διαγραφή του αρχείου
    }

    return true
  } catch (error) {
    console.error(`Error in deleteProductImage for image ${imageId}:`, error)
    return false
  }
}

export async function setMainProductImage(imageId: string, productId: string) {
  try {
    const supabase = createSupabaseServerClient()
    if (!supabase) return false

    // Πρώτα αφαιρούμε το is_main από όλες τις εικόνες του προϊόντος
    const { error: resetError } = await supabase
      .from("product_images")
      .update({ is_main: false })
      .eq("product_id", productId)

    if (resetError) {
      console.error(`Error resetting main image for product ${productId}:`, resetError)
      return false
    }

    // Μετά ορίζουμε τη νέα κύρια εικόνα
    const { error } = await supabase.from("product_images").update({ is_main: true }).eq("id", imageId)

    if (error) {
      console.error(`Error setting main image ${imageId} for product ${productId}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Error in setMainProductImage for image ${imageId}, product ${productId}:`, error)
    return false
  }
}

// Ενημερωμένη λειτουργία για τον έλεγχο και την ενημέρωση των εκπτώσεων βάσει ημερομηνιών
export async function checkAndUpdateDiscounts(): Promise<DiscountCheckResult | null> {
  try {
    const supabase = createSupabaseServerClient()
    if (!supabase) {
      console.error("Failed to create Supabase client in checkAndUpdateDiscounts")
      return null
    }

    // Καλούμε τη συνάρτηση της βάσης δεδομένων
    const { data, error } = await supabase.rpc("check_and_update_discounts")

    if (error) {
      console.error("Error calling check_and_update_discounts RPC:", error)
      return null
    }

    console.log("Discount check results:", data)
    return data as DiscountCheckResult
  } catch (error) {
    console.error("Error in checkAndUpdateDiscounts:", error)
    return null
  }
}

// Νέα συνάρτηση για τη σήμανση ενός προϊόντος ως πωλημένο
export async function markProductAsSold(productId: string, sold: boolean) {
  try {
    const supabase = createSupabaseServerClient()
    if (!supabase) {
      console.error("Failed to create Supabase client in markProductAsSold")
      return null
    }

    console.log(`Marking product ${productId} as ${sold ? "sold" : "available"}`)

    // Ελέγχουμε πρώτα αν το προϊόν υπάρχει
    const { data: existingProduct, error: checkError } = await supabase
      .from("products")
      .select("id, title, price, category, description")
      .eq("id", productId)
      .single()

    if (checkError) {
      console.error(`Error checking if product ${productId} exists:`, checkError)
      return null
    }

    if (!existingProduct) {
      console.error(`Product ${productId} not found`)
      return null
    }

    // Ενημερώνουμε την κατάσταση πώλησης του προϊόντος
    const updateData = {
      sold: sold,
      updated_at: new Date().toISOString(),
    }

    console.log(`Updating product ${productId} with:`, updateData)

    const { data, error } = await supabase.from("products").update(updateData).eq("id", productId).select()

    if (error) {
      console.error(`Error marking product ${productId} as ${sold ? "sold" : "available"}:`, error)
      return null
    }

    console.log(`Product update result:`, data)

    // Επιστρέφουμε το ενημερωμένο προϊόν
    const updatedProduct =
      data && data.length > 0
        ? data[0]
        : {
            ...existingProduct,
            sold: sold,
            updated_at: new Date().toISOString(),
          }

    console.log(`Product ${productId} marked as ${sold ? "sold" : "available"} successfully:`, updatedProduct)
    return updatedProduct
  } catch (error) {
    console.error(`Error in markProductAsSold for product ${productId}:`, error)
    return null
  }
}
