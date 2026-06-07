import { requireAuth } from "../server/auth.js";
import { json, readJson } from "../server/db.js";

const allowedOffers = new Set(["booking", "plus", "black"]);

const subscriptionOffers = {
  plus: {
    name: "AURA Plus",
    amountCents: Number(process.env.AURA_PLUS_MONTHLY_CENTS || 4900),
    priceId: process.env.STRIPE_AURA_PLUS_PRICE_ID || process.env.STRIPE_PLUS_PRICE_ID || ""
  },
  black: {
    name: "AURA Black",
    amountCents: Number(process.env.AURA_BLACK_MONTHLY_CENTS || 19900),
    priceId: process.env.STRIPE_AURA_BLACK_PRICE_ID || process.env.STRIPE_BLACK_PRICE_ID || ""
  }
};

export async function OPTIONS() {
  return json({ ok: true });
}

function clampAmount(value, min = 500, max = 250000) {
  const amount = Math.round(Number(value || 0));
  if (!Number.isFinite(amount)) return min;
  return Math.max(min, Math.min(max, amount));
}

function cleanMetadata(value, max = 480) {
  return String(value || "")
    .replace(/[\r\n\t]+/g, " ")
    .trim()
    .slice(0, max);
}

function appOrigin(request) {
  const requestUrl = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || requestUrl.host;
  const proto = request.headers.get("x-forwarded-proto") || requestUrl.protocol.replace(":", "") || "https";
  return `${proto}://${host}`;
}

function configuredOfferLink(offerType) {
  const key = offerType.toUpperCase();
  return (
    process.env[`AURA_${key}_OFFER_LINK`] ||
    process.env[`AURA_${key}_PAYMENT_LINK`] ||
    process.env[`STRIPE_${key}_PAYMENT_LINK`] ||
    process.env.AURA_DEFAULT_OFFER_LINK ||
    ""
  );
}

function checkoutOffer(body) {
  const offerType = allowedOffers.has(String(body.offerType)) ? String(body.offerType) : "booking";
  if (offerType !== "booking") {
    const offer = subscriptionOffers[offerType] || subscriptionOffers.plus;
    return {
      type: offerType,
      mode: "subscription",
      name: offer.name,
      amountCents: clampAmount(offer.amountCents, 100, 500000),
      priceId: offer.priceId
    };
  }

  const service = cleanMetadata(body.serviceCategory || "personal assistant", 80);
  const amountCents = clampAmount(body.budgetCents || body.amountCents || 14000, 6500, 250000);
  return {
    type: "booking",
    mode: "payment",
    name: `AURA ${service} reservation`,
    amountCents,
    priceId: process.env.STRIPE_AURA_BOOKING_PRICE_ID || process.env.STRIPE_BOOKING_PRICE_ID || ""
  };
}

function addLineItem(params, offer) {
  params.set("line_items[0][quantity]", "1");

  if (offer.priceId) {
    params.set("line_items[0][price]", offer.priceId);
    return;
  }

  params.set("line_items[0][price_data][currency]", process.env.STRIPE_CURRENCY || "usd");
  params.set("line_items[0][price_data][unit_amount]", String(offer.amountCents));
  params.set("line_items[0][price_data][product_data][name]", offer.name);

  if (offer.mode === "subscription") {
    params.set("line_items[0][price_data][recurring][interval]", process.env.AURA_SUBSCRIPTION_INTERVAL || "month");
  }
}

function checkoutParams(request, authUser, body, offer) {
  const origin = appOrigin(request);
  const successUrl = `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}#booking-engine`;
  const cancelUrl = `${origin}/?checkout=cancelled#booking-engine`;
  const params = new URLSearchParams();

  params.set("mode", offer.mode);
  params.set("success_url", successUrl);
  params.set("cancel_url", cancelUrl);
  params.set("client_reference_id", cleanMetadata(authUser.sub, 200));
  params.set("allow_promotion_codes", "true");
  params.set("metadata[aura_offer_type]", offer.type);
  params.set("metadata[aura_market]", cleanMetadata(body.market || "Your market", 80));
  params.set("metadata[aura_service]", cleanMetadata(body.serviceCategory || "home", 80));
  params.set("metadata[aura_task]", cleanMetadata(body.taskSummary || "", 480));

  if (authUser.email) {
    params.set("customer_email", cleanMetadata(authUser.email, 240));
  }

  if (offer.mode === "payment") {
    params.set("payment_intent_data[metadata][aura_offer_type]", offer.type);
    params.set("payment_intent_data[metadata][aura_service]", cleanMetadata(body.serviceCategory || "home", 80));
  } else {
    params.set("subscription_data[metadata][aura_offer_type]", offer.type);
  }

  addLineItem(params, offer);
  return params;
}

export async function POST(request) {
  const auth = await requireAuth(request);
  if (auth.response) return auth.response;

  const body = await readJson(request);
  const offer = checkoutOffer(body);
  const offerLink = configuredOfferLink(offer.type);

  if (!process.env.STRIPE_SECRET_KEY) {
    if (offerLink) {
      return json({
        ok: true,
        mode: "offer_link",
        data: {
          url: offerLink,
          offer
        }
      });
    }

    return json(
      {
        ok: false,
        code: "CHECKOUT_NOT_CONFIGURED",
        message: "Set STRIPE_SECRET_KEY for Checkout Sessions or configure an AURA offer link."
      },
      503
    );
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: checkoutParams(request, auth.user, body, offer)
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    return json(
      {
        ok: false,
        code: "STRIPE_CHECKOUT_FAILED",
        message: result.error?.message || "Secure checkout could not be created."
      },
      502
    );
  }

  return json({
    ok: true,
    mode: "stripe_checkout",
    data: {
      id: result.id,
      url: result.url,
      mode: offer.mode,
      offer
    }
  });
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") return OPTIONS(request);
    if (request.method === "POST") return POST(request);
    return json({ ok: false, message: `${request.method} is not supported` }, 405);
  }
};
