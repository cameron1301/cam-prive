/**
 * Helcim Payment API. The API token stays in the server environment (HELCIM_API_TOKEN).
 * Card numbers are never accepted or stored here. HelcimPay.js tokenizes the card,
 * and only the token is sent to these calls.
 * Live calls run only after the owner connects a merchant account. Until then this returns not configured.
 */

import { createHash } from "node:crypto";

const ENDPOINT = "https://api.helcim.com/v2/payment";

export function helcimConfigured(): boolean {
  return Boolean(process.env.HELCIM_API_TOKEN);
}

type HelcimResult = { ok: true; transactionId: string } | { ok: false; error: string };

/** Helcim requires a 25–36 character idempotency key. Hash longer logical keys so retries stay stable. */
function idempotencyKey(key: string): string {
  const clean = key.replace(/[^a-zA-Z0-9_-]/g, "");
  if (clean.length >= 25 && clean.length <= 36) return clean;
  return createHash("sha256").update(key).digest("hex").slice(0, 32);
}

async function post(path: string, body: Record<string, unknown>, key: string): Promise<HelcimResult> {
  const token = process.env.HELCIM_API_TOKEN;
  if (!token) return { ok: false, error: "Helcim is not connected." };
  const response = await fetch(`${ENDPOINT}/${path}`, {
    method: "POST",
    headers: {
      "api-token": token,
      "content-type": "application/json",
      "idempotency-key": idempotencyKey(key),
    },
    body: JSON.stringify({ ipAddress: "127.0.0.1", ecommerce: true, ...body }),
  });
  const payload = (await response.json().catch(() => null)) as { transactionId?: string | number; errors?: unknown } | null;
  if (!response.ok || !payload?.transactionId) {
    return { ok: false, error: "Helcim did not accept that transaction." };
  }
  return { ok: true, transactionId: String(payload.transactionId) };
}

export function helcimPurchase(amount: number, cardToken: string, key: string, ipAddress: string) {
  return post("purchase", { amount, currency: "USD", ipAddress, cardData: { cardToken } }, key);
}

export function helcimPreauth(amount: number, cardToken: string, key: string, ipAddress: string) {
  return post("preauth", { amount, currency: "USD", ipAddress, cardData: { cardToken } }, key);
}

export function helcimCapture(transactionId: string, amount: number, key: string) {
  return post("capture", { transactionId: Number(transactionId) || transactionId, amount }, key);
}

export function helcimRefund(transactionId: string, amount: number, key: string) {
  return post("refund", { transactionId: Number(transactionId) || transactionId, amount }, key);
}

/**
 * Reverse an uncaptured preauth or an unsettled purchase.
 * Helcim documents reverse for an open batch. A preauth that cannot be reversed is left in place until it expires.
 * This never marks a hold released by itself.
 */
export function helcimVoid(transactionId: string, key: string) {
  return post("reverse", { transactionId: Number(transactionId) || transactionId }, key);
}