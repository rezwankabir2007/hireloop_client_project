import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { getSession } from '../core/server'

export async function POST() {

    const userSession = await getSession()

  try {
    const headersList = await headers()
    const origin = headersList.get('origin') || 'http://localhost:3000'

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID of the product you want to sell
          price: 'price_1Ub1snDCajm0CRUQ8FH0DoOq',
          quantity: 1,
        },
      ],
      mode: 'payment',

      customer_email:userSession?.user.email,

      metadata:{
        userId: userSession?.user.id ?? null,
      },
      

      success_url: `${origin}/browse-jobs/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      integration_identifier: 'hireloop_web_001',
    })

    // ফ্রন্টএন্ড fetch() কল করার কারণে JSON হিসেবে url রিটার্ন করতে হবে
    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err))
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}