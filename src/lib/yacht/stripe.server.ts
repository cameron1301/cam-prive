/**
 * Stripe PaymentIntents. The secret key stays in STRIPE_SECRET_KEY on the server.
 * Card numbers are never accepted here. Stripe.js creates a payment method, and only that id is stored.
 * Live calls run only after the owner connects Stripe. Until then these return not configured.
 * An uncaptured PaymentIntent is the security hold. Canceling it releases the hold. Capturing it is the charge.
 */

const ENDPOINT = "https://api.stripe.com/v1";

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

type StripeResult = { ok: true; id: string; status: string } | { ok: false; error: string; code: string };

function cents(amount: number): string {
  return String(Math.round(amount * 100));
}

async function request(method: "GET" | "POST", path: string, params: Record<string, string>, key?: string): Promise<StripeResult> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return { ok: false, error: "Stripe is not connected.", code: "not_configured" };
  const headers: Record<string, string> = { authorization: `Bearer ${secret}` };
  let body: string | undefined;
  if (method === "POST") {
    headers["content-type"] = "application/x-www-form-urlencoded";
    if (key) headers["idempotency-key"] = key.slice(0, 255);
    body = new URLSearchParams(params).toString();
  }
  const response = await fetch(`${ENDPOINT}/${path}`, { method, headers, body });
  const payload = (await response.json().catch(() => null)) as {
    id?: string;
    status?: string;
    error?: { message?: string; code?: string };
  } | null;
  if (!response.ok || !payload?.id) {
    return { ok: false, error: "Stripe did not accept that transaction.", code: payload?.error?.code || "declined" };
  }
  return { ok: true, id: payload.id, status: payload.status || "" };
}

export function stripeCreateCustomer(name: string, key: string) {
  return request("POST", "customers", { name: name.slice(0, 120), description: "CAM Prive guest" }, key);
}

export function stripeAttachPaymentMethod(paymentMethodId: string, customerId: string, key: string) {
  return request("POST", `payment_methods/${encodeURIComponent(paymentMethodId)}/attach`, { customer: customerId }, key);
}

/** Charge the stay. This is a normal payment, separate from the security hold. */
export function stripePurchase(amount: number, paymentMethodId: string, customerId: string, key: string) {
  return request(
    "POST",
    "payment_intents",
    {
      amount: cents(amount),
      currency: "usd",
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: "true",
      confirm: "true",
      description: "CAM Prive stay",
      "payment_method_options[card][stored_credential_usage]": "unscheduled",
    },
    key,
  );
}

/** Place the refundable security hold. Funds are authorized, not captured. */
export function stripePreauth(amount: number, paymentMethodId: string, customerId: string, key: string) {
  return request(
    "POST",
    "payment_intents",
    {
      amount: cents(amount),
      currency: "usd",
      customer: customerId,
      payment_method: paymentMethodId,
      capture_method: "manual",
      off_session: "true",
      confirm: "true",
      description: "CAM Prive refundable security hold",
      "payment_method_options[card][stored_credential_usage]": "unscheduled",
    },
    key,
  );
}

/** Capture some or all of an uncaptured hold. Stripe releases whatever is not captured. */
export function stripeCapture(paymentIntentId: string, amount: number, key: string) {
  return request(
    "POST",
    `payment_intents/${encodeURIComponent(paymentIntentId)}/capture`,
    { amount_to_capture: cents(amount) },
    key,
  );
}

/** Cancel an uncaptured PaymentIntent. That releases the authorization. It is not a refund. */
export function stripeCancel(paymentIntentId: string, key: string) {
  return request(
    "POST",
    `payment_intents/${encodeURIComponent(paymentIntentId)}/cancel`,
    { cancellation_reason: "requested_by_customer" },
    key,
  );
}

export function stripeRefund(paymentIntentId: string, amount: number, key: string) {
  return request(
    "POST",
    "refunds",
    { payment_intent: paymentIntentId, amount: cents(amount) },
    key,
  );
}

export function stripeRetrieve(paymentIntentId: string) {
  return request("GET", `payment_intents/${encodeURIComponent(paymentIntentId)}`, {});
}
