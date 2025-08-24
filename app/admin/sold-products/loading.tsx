import { AdminLayout } from "@/components/admin/admin-layout"
import { Loader2 } from "lucide-react"

export default function SoldProductsLoading() {
  return (
    <AdminLayout title="Διαχείριση Πωλημένων Προϊόντων">
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Φόρτωση...</span>
      </div>
    </AdminLayout>
  )
}
