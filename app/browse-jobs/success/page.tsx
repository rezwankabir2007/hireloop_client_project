// import { redirect } from 'next/navigation'

// import { stripe } from '@/lib/stripe'
// import { checkoutVerify } from '@/lib/actions/payments'

// export default async function PaymentSuccessPage({
//   searchParams
// }: {
//   searchParams: Promise<{ session_id?: string }>
// }) {
//   const { session_id } = await searchParams

//   if (!session_id)
//     throw new Error('Please provide a valid session_id (`cs_test_...`)')

//   const {
//     status,
//     payment_status,
//     customer_email,
//     metadata,
//     payment_intent,
//   } = await stripe.checkout.sessions.retrieve(session_id, {
//     expand: ['line_items', 'payment_intent']
//   })
//   const customerEmail = customer_email

//   if (status === 'open') {
//     return redirect('/')
//   }

//   if (status === 'complete' && payment_status === 'paid') {

// console.log(  status,
//     payment_status,
//     customer_email,
//     metadata,
//     payment_intent,);


// const result = await checkoutVerify(session_id)
// console.log({result});

//     return (
//       <section id="success">
//         <p>
//           We appreciate your business! A confirmation email will be sent to{' '}
//           . If you have any questions, please email{' '}
//           <a href="mailto:orders@example.com">orders@example.com</a>.
//         </p>
//       </section>
//     )
//   }
// }


import { redirect } from 'next/navigation'

import { stripe } from '@/lib/stripe'
import { checkoutVerify } from '@/lib/actions/payments'

export default async function PaymentSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const {
    status,
    payment_status,
    customer_email,
    metadata,
    payment_intent,
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  })
  const customerEmail = customer_email

  if (status === 'open') {
    return redirect('/')
  }

  if (status === 'complete' && payment_status === 'paid') {

    console.log( 
      status,
      payment_status,
      customer_email,
      metadata,
      payment_intent
    );

    const result = await checkoutVerify(session_id)
    console.log({ result });

    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
        <section id="success" className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-lg space-y-4">
          <h1 className="text-2xl font-bold tracking-tight text-emerald-600">Payment Successful!</h1>
          <p className="text-sm text-muted-foreground">
            We appreciate your business! A confirmation email will be sent to{' '}
            <span className="font-medium text-foreground">{customerEmail || "your email"}</span>. If you have any questions, please email{' '}
            <a href="mailto:orders@example.com" className="text-violet-600 underline">orders@example.com</a>.
          </p>
        </section>
      </main>
    )
  }
}