import ShopDetailLayout from "@/components/shop/shop-detail-layout"

export default function OttosAutosPage() {
  return (
    <ShopDetailLayout
      title="Otto's Autos"
      description="Πλήρως εξοπλισμένο συνεργείο αυτοκινήτων με βενζινάδικο, κατάστημα 24/7 και υπηρεσία διαχείρισης."
      features={["Επισκευή οχημάτων", "Βενζινάδικο 24/7", "Κατάστημα ανταλλακτικών", "Υπηρεσίες οδικής βοήθειας"]}
      price={40}
      mainImage=""
      images={[]}
    />
  )
}
