import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createServerClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")!

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = await createServerClient()

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object
      const userId = session.metadata?.userId

      if (userId) {
        // Update user to premium
        await supabase.from("user_profiles").update({ is_premium: true }).eq("id", userId)
      }
      break

    case "customer.subscription.deleted":
      // Handle subscription cancellation
      const subscription = event.data.object
      // You would need to store customer ID to user mapping
      // For now, this is a placeholder
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
