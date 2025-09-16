import crypto from "crypto";

const getSigningSecret = () =>
  process.env.NEWSLETTER_UNSUBSCRIBE_SECRET ||
  process.env.RESEND_API_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "dev-secret";

export function signUnsubscribeToken(payload: string) {
  const secret = getSigningSecret();
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function buildUnsubscribeUrl(origin: string, email: string, id: string) {
  const payload = `${id}:${email.toLowerCase()}`;
  const token = signUnsubscribeToken(payload);
  const url = new URL("/api/subscribers/unsubscribe", origin);
  url.searchParams.set("e", email);
  url.searchParams.set("id", id);
  url.searchParams.set("t", token);
  return url.toString();
}

export function verifyUnsubscribeToken(email: string, id: string, token: string) {
  const expected = signUnsubscribeToken(`${id}:${email.toLowerCase()}`);
  // constant-time comparison
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

