import ShopDetailLayout from "@/components/shop/shop-detail-layout"

export default function KoiPage() {
  return (
    <ShopDetailLayout
      title="Koi"
      description="Πολυτελές ασιατικό εστιατόριο και lounge με μοντέρνα διακόσμηση, κόκκινα φανάρια και εξαιρετική ατμόσφαιρα."
      features={["Αυθεντική ασιατική κουζίνα", "Sushi και noodles", "Κοκτέιλ και ποτά", "VIP χώροι"]}
      price={40}
      mainImage=""
      images={[]}
    />
  )
}
