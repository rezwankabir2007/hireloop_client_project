const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export async function checkoutVerify(sessionId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/payments/checkout-verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId }),
  })

  if (!response.ok) {
    throw new Error(
      `Checkout verification failed: ${response.status} ${response.statusText}`,
    )
  }
}