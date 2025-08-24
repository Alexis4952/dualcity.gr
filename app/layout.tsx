import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin", "greek"] })

export const metadata: Metadata = {
  title: "Dual City RP",
  description: "Ο καλύτερος ελληνικός FiveM server",
    generator: 'v0.app'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Αφαιρέθηκε ο έλεγχος των εκπτώσεων που χρειαζόταν τη μεταβλητή NEXT_PUBLIC_SITE_URL

  return (
    <html lang="el" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/new-logo.png" sizes="any" />
        <link rel="canonical" href="https://dualcity.gr" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
