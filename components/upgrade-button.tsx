"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Crown } from "lucide-react"

export function UpgradeButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
      })

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      const stripe = (await import("@stripe/stripe-js")).loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

      const stripeInstance = await stripe
      await stripeInstance?.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error("Error creating checkout session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleUpgrade} disabled={isLoading} className="w-full">
      <Crown className="mr-2 h-4 w-4" />
      {isLoading ? "Loading..." : "Upgrade to Pro"}
    </Button>
  )
}
