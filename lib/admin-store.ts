export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  images?: string[]
  featured?: boolean
  slug?: string
  longDescription?: string
  features?: string[]
}

export interface Announcement {
  id: string
  title: string
  content: string
  createdAt: string
  important: boolean
}

export interface Order {
  id: string
  userId: string
  products: { productId: string; quantity: number }[]
  total: number
  createdAt: string
  status: "pending" | "completed" | "cancelled"
}

export interface SiteSettings {
  siteName: string
  maintenanceMode: boolean
  allowRegistration: boolean
  shopEnabled: boolean
  footerText: string
  contactEmail: string
}

export interface Statistics {
  totalUsers: number
  newUsersThisMonth: number
  totalSales: number
  salesThisMonth: number
  totalSupportTickets: number
  openSupportTickets: number
  popularProducts: { name: string; category: string; sales: number; revenue: number }[]
  serverStats: {
    maxPlayers: number
    averagePlayers: number
    totalPlaytime: number
    uptime: number
  }
}

export interface SupportTicket {
  id: string
  userId: string
  userName: string
  subject: string
  message: string
  createdAt: string
  status: "open" | "answered" | "closed"
  adminReply?: string
}

// Mock data store (replace with database calls in a real app)
const products: Product[] = [
  {
    id: "bahama-mamas",
    name: "Bahama Mamas",
    description: "Πολυτελές νυχτερινό κέντρο διασκέδασης με μπαρ, πίστες χορού, VIP χώρους και ιδιωτικά δωμάτια.",
    price: 40,
    category: "mlo",
    images: ["/images/shops/bahamas1.png", "/images/shops/bahamas2.png"],
    slug: "bahama-mamas",
    featured: true,
  },
  {
    id: "burgershot",
    name: "Burgershot",
    description: "Δημοφιλές εστιατόριο γρήγορου φαγητού με πλήρως λειτουργικό εξοπλισμό, ταμεία και χώρο εστίασης.",
    price: 40,
    category: "mlo",
    images: ["/images/shops/burgershot.png", "/images/shops/burgershot1.png"],
    slug: "burgershot",
  },
  {
    id: "pizzeria",
    name: "Pizzeria",
    description:
      "Αυθεντική ιταλική πιτσαρία με παραδοσιακό φούρνο, χώρο εστίασης, κελάρι κρασιών και ιδιωτικό γραφείο.",
    price: 40,
    category: "mlo",
    images: ["/images/shops/pizzeria.png", "/images/shops/pizzeria1.png"],
    slug: "pizzeria",
  },
  {
    id: "bean-machine",
    name: "Bean Machine",
    description: "Το διάσημο καφέ Bean Machine, γνωστό για τους εξαιρετικούς καφέδες και τα γλυκά του.",
    price: 40,
    category: "other",
    images: [],
    slug: "bean-machine",
  },
  {
    id: "koi",
    name: "Koi",
    description:
      "Πολυτελές ασιατικό εστιατόριο και lounge με μοντέρνα διακόσμηση, κόκκινα φανάρια και εξαιρετική ατμόσφαιρα.",
    price: 40,
    category: "other",
    images: [],
    slug: "koi",
  },
  {
    id: "ottos-autos",
    name: "Otto's Autos",
    description: "Πλήρως εξοπλισμένο συνεργείο αυτοκινήτων με βενζινάδικο, κατάστημα 24/7 και γραφεία διαχείρισης.",
    price: 40,
    category: "other",
    images: [],
    slug: "ottos-autos",
  },
]

let announcements: Announcement[] = [
  {
    id: "announcement-1",
    title: "Καλώς ήρθατε στον νέο server!",
    content: "Είμαστε ενθουσιασμένοι που σας έχουμε μαζί μας!",
    createdAt: new Date().toISOString(),
    important: true,
  },
]

const orders: Order[] = [
  {
    id: "order-1",
    userId: "user-123",
    products: [{ productId: "bahama-mamas", quantity: 1 }],
    total: 40,
    createdAt: new Date().toISOString(),
    status: "pending",
  },
]

let siteSettings: SiteSettings = {
  siteName: "Dual City",
  maintenanceMode: false,
  allowRegistration: true,
  shopEnabled: true,
  footerText: "© 2024 Dual City FiveM Roleplay Server. All rights reserved.",
  contactEmail: "info@example.com",
}

const supportTickets: SupportTicket[] = [
  {
    id: "ticket-1",
    userId: "user-123",
    userName: "JohnDoe",
    subject: "Πρόβλημα με την σύνδεση",
    message: "Δεν μπορώ να συνδεθώ στον server. Μπορείτε να βοηθήσετε;",
    createdAt: new Date().toISOString(),
    status: "open",
  },
]

export const getStatistics = (): Statistics => {
  return {
    totalUsers: 150,
    newUsersThisMonth: 12,
    totalSales: 5200,
    salesThisMonth: 480,
    totalSupportTickets: 32,
    openSupportTickets: 5,
    popularProducts: [
      { name: "Bahama Mamas", category: "MLO", sales: 25, revenue: 1000 },
      { name: "Burgershot", category: "MLO", sales: 20, revenue: 800 },
      { name: "Pizzeria", category: "MLO", sales: 15, revenue: 600 },
    ],
    serverStats: {
      maxPlayers: 128,
      averagePlayers: 65,
      totalPlaytime: 12500,
      uptime: 99.9,
    },
  }
}

export const getProducts = (): Product[] => {
  return products
}

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((product) => product.slug === slug)
}

export const getAnnouncements = (): Announcement[] => {
  return announcements
}

export const createAnnouncement = (announcement: Omit<Announcement, "id" | "createdAt">): Announcement | null => {
  const newAnnouncement: Announcement = {
    id: `announcement-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString(),
    ...announcement,
  }
  announcements.push(newAnnouncement)
  return newAnnouncement
}

export const updateAnnouncement = (id: string, updates: Partial<Announcement>): Announcement | null => {
  const announcementIndex = announcements.findIndex((announcement) => announcement.id === id)

  if (announcementIndex !== -1) {
    announcements[announcementIndex] = { ...announcements[announcementIndex], ...updates } as Announcement
    return announcements[announcementIndex]
  }

  return null
}

export const deleteAnnouncement = (id: string): boolean => {
  const initialLength = announcements.length
  announcements = announcements.filter((announcement) => announcement.id !== id)
  return announcements.length < initialLength
}

export const getOrders = (): Order[] => {
  return orders
}

export const updateOrderStatus = (orderId: string, status: Order["status"]): Order | null => {
  const orderIndex = orders.findIndex((order) => order.id === orderId)

  if (orderIndex !== -1) {
    orders[orderIndex] = { ...orders[orderIndex], status }
    return orders[orderIndex]
  }

  return null
}

export const getProduct = (productId: string): { name: string; price: number } | undefined => {
  const product = products.find((product) => product.id === productId)
  return product ? { name: product.name, price: product.price } : undefined
}

export const getSiteSettings = (): SiteSettings => {
  return siteSettings
}

export const updateSiteSettings = (updates: Partial<SiteSettings>): SiteSettings => {
  siteSettings = { ...siteSettings, ...updates }
  return siteSettings
}

export const getSupportTickets = (): SupportTicket[] => {
  return supportTickets
}

export const updateSupportTicket = (ticketId: string, updates: Partial<SupportTicket>): SupportTicket | null => {
  const ticketIndex = supportTickets.findIndex((ticket) => ticket.id === ticketId)

  if (ticketIndex !== -1) {
    supportTickets[ticketIndex] = { ...supportTickets[ticketIndex], ...updates } as SupportTicket
    return supportTickets[ticketIndex]
  }

  return null
}
