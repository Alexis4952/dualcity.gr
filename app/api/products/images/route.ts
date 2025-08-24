import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET: Ανάκτηση εικόνων για ένα συγκεκριμένο προϊόν
export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .order("position", { ascending: true })

    if (error) {
      console.error("Error fetching product images:", error)
      return NextResponse.json({ error: "Failed to fetch product images" }, { status: 500 })
    }

    return NextResponse.json({ images: data })
  } catch (error) {
    console.error("Error in GET product images:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Ανέβασμα νέας εικόνας για ένα προϊόν
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const productId = formData.get("productId") as string
    const isMain = formData.get("isMain") === "true"

    if (!file || !productId) {
      return NextResponse.json({ error: "File and product ID are required" }, { status: 400 })
    }

    const supabase = createClient()

    // Αν είναι η κύρια εικόνα, πρώτα αφαιρούμε το is_main από όλες τις άλλες εικόνες
    if (isMain) {
      const { error: updateError } = await supabase
        .from("product_images")
        .update({ is_main: false })
        .eq("product_id", productId)

      if (updateError) {
        console.error("Error updating main image status:", updateError)
        return NextResponse.json({ error: "Failed to update main image status" }, { status: 500 })
      }
    }

    // Ανέβασμα του αρχείου στο storage
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `products/${productId}/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage.from("images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (uploadError) {
      console.error("Error uploading image:", uploadError)
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
    }

    // Δημιουργία δημόσιου URL για την εικόνα
    const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(uploadData.path)

    // Αποθήκευση των πληροφοριών της εικόνας στη βάση δεδομένων
    const { data: imageData, error: imageError } = await supabase
      .from("product_images")
      .insert([
        {
          product_id: productId,
          url: publicUrlData.publicUrl,
          is_main: isMain,
          position: 0, // Θα ενημερωθεί αργότερα
        },
      ])
      .select()

    if (imageError) {
      console.error("Error saving image data:", imageError)
      return NextResponse.json({ error: "Failed to save image data" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      image: imageData[0],
    })
  } catch (error) {
    console.error("Error in POST product image:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE: Διαγραφή μιας εικόνας
export async function DELETE(request: NextRequest) {
  try {
    const imageId = request.nextUrl.searchParams.get("imageId")

    if (!imageId) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Παίρνουμε πρώτα τα στοιχεία της εικόνας για να βρούμε το path στο storage
    const { data: imageData, error: imageError } = await supabase
      .from("product_images")
      .select("*")
      .eq("id", imageId)
      .single()

    if (imageError) {
      console.error("Error fetching image data:", imageError)
      return NextResponse.json({ error: "Failed to fetch image data" }, { status: 500 })
    }

    // Διαγραφή από τη βάση δεδομένων
    const { error: deleteError } = await supabase.from("product_images").delete().eq("id", imageId)

    if (deleteError) {
      console.error("Error deleting image from database:", deleteError)
      return NextResponse.json({ error: "Failed to delete image from database" }, { status: 500 })
    }

    // Προσπαθούμε να διαγράψουμε και το αρχείο από το storage
    try {
      const url = imageData.url
      // Εξαγωγή του path από το URL
      const urlParts = url.split("/")
      const bucketName = "images"
      // Το path είναι συνήθως μετά το όνομα του bucket στο URL
      const bucketIndex = urlParts.findIndex((part: string) => part === bucketName)
      if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
        const path = urlParts.slice(bucketIndex + 1).join("/")
        await supabase.storage.from(bucketName).remove([path])
      }
    } catch (storageError) {
      console.warn("Could not delete image file from storage:", storageError)
      // Συνεχίζουμε ακόμα κι αν αποτύχει η διαγραφή του αρχείου
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE product image:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH: Ενημέρωση της θέσης μιας εικόνας
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageId, isMain } = body

    if (!imageId) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Παίρνουμε πρώτα τα στοιχεία της εικόνας για να βρούμε το product_id
    const { data: imageData, error: imageError } = await supabase
      .from("product_images")
      .select("product_id")
      .eq("id", imageId)
      .single()

    if (imageError) {
      console.error("Error fetching image data:", imageError)
      return NextResponse.json({ error: "Failed to fetch image data" }, { status: 500 })
    }

    // Αν θέλουμε να ορίσουμε την εικόνα ως κύρια
    if (isMain) {
      // Πρώτα αφαιρούμε το is_main από όλες τις εικόνες του προϊόντος
      const { error: updateError } = await supabase
        .from("product_images")
        .update({ is_main: false })
        .eq("product_id", imageData.product_id)

      if (updateError) {
        console.error("Error updating main image status:", updateError)
        return NextResponse.json({ error: "Failed to update main image status" }, { status: 500 })
      }

      // Μετά ορίζουμε τη νέα κύρια εικόνα
      const { error } = await supabase.from("product_images").update({ is_main: true }).eq("id", imageId)

      if (error) {
        console.error("Error setting main image:", error)
        return NextResponse.json({ error: "Failed to set main image" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in PATCH product image:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
