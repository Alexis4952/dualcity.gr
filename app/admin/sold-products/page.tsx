import { AdminLayout } from "@/components/admin/admin-layout"
import SoldProductsManager from "@/components/admin/sold-products-manager"

export default function SoldProductsPage() {
  return (
    <AdminLayout title="Διαχείριση Πωλημένων Προϊόντων">
      <SoldProductsManager />
    </AdminLayout>
  )
}
