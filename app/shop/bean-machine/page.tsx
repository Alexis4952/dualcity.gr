import ShopDetailLayout from "@/components/shop/shop-detail-layout"

export default function BeanMachinePage() {
  return (
    <ShopDetailLayout
      title="Bean Machine"
      description="Το διάσημο καφέ Bean Machine, γνωστό για τους εξαιρετικούς καφέδες και τα υλικά του."
      features={["Καφέδες υψηλής ποιότητας", "Γλυκά και σνακ", "Ειδικά ροφήματα", "Εξαιρετική εξυπηρέτηση"]}
      price={40}
      mainImage=""
      images={[]}
    />
  )
}
