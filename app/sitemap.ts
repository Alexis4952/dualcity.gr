import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://dualcity.gr"

  // Βασικές σελίδες
  const routes = ["", "/shop", "/guides", "/rules", "/community", "/performance", "/updates"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  // Προσθήκη σελίδων καταστήματος
  const shopRoutes = [
    "/shop/bahama-mamas",
    "/shop/burgershot",
    "/shop/pizzeria",
    "/shop/bean-machine",
    "/shop/koi",
    "/shop/ottos-autos",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...routes, ...shopRoutes]
}
