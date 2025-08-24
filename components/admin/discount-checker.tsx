"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function DiscountChecker() {
  const [checking, setChecking] = useState(false)
  const [lastCheckResult, setLastCheckResult] = useState<{
    timestamp: string
    expired_discounts: number
    activated_discounts: number
  } | null>(null)

  const checkDiscounts = async () => {
    try {
      setChecking(true)

      const response = await fetch("/api/check-discounts", {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      if (!response.ok) {
        throw new Error(`Error checking discounts: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        setLastCheckResult({
          timestamp: new Date(data.data.timestamp).toLocaleString(),
          expired_discounts: data.data.expired_discounts,
          activated_discounts: data.data.activated_discounts,
        })

        toast({
          title: "Έλεγχος εκπτώσεων",
          description: `Ολοκληρώθηκε ο έλεγχος εκπτώσεων. Έληξαν ${data.data.expired_discounts} και ενεργοποιήθηκαν ${data.data.activated_discounts} εκπτώσεις.`,
        })
      } else {
        throw new Error(data.error || "Σφάλμα κατά τον έλεγχο εκπτώσεων")
      }
    } catch (error) {
      console.error("Error checking discounts:", error)
      toast({
        title: "Σφάλμα",
        description: error instanceof Error ? error.message : "Σφάλμα κατά τον έλεγχο εκπτώσεων",
        variant: "destructive",
      })
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button variant="outline" size="sm" onClick={checkDiscounts} disabled={checking}>
        {checking ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Έλεγχος...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Έλεγχος Εκπτώσεων
          </>
        )}
      </Button>

      {lastCheckResult && (
        <div className="text-xs text-muted-foreground">
          Τελευταίος έλεγχος: {lastCheckResult.timestamp}
          <br />
          Έληξαν: {lastCheckResult.expired_discounts}, Ενεργοποιήθηκαν: {lastCheckResult.activated_discounts}
        </div>
      )}
    </div>
  )
}
