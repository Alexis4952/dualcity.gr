import { AdminLayout } from "@/components/admin/admin-layout"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <AdminLayout title="Προϊόντα">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48 bg-gray-800" />
        <Skeleton className="h-10 w-32 bg-gray-800" />
      </div>

      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <Skeleton className="h-6 w-32 bg-gray-800 mb-2" />
          <Skeleton className="h-4 w-64 bg-gray-800" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-full bg-gray-800" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
