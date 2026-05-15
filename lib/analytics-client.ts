"use client";

const ANALYTICS_VISITOR_KEY = "clubemp_analytics_visitor_id";

export type ClubempAnalyticsEventType =
  | "company_page_viewed"
  | "company_card_clicked"
  | "company_whatsapp_clicked"
  | "company_phone_clicked"
  | "company_site_clicked"
  | "company_offer_clicked"
  | "product_viewed"
  | "coupon_copied"
  | "favorite_added"
  | "order_completed";

export function trackClubempAnalytics(payload: {
  eventType: ClubempAnalyticsEventType | string;
  metadata?: Record<string, string | number | boolean | null>;
  subjectId?: number | string;
  subjectType?: string;
  tenantId: number | string;
}) {
  const apiUrl =
    process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace(/\/+$/, "") || "";
  if (!apiUrl || typeof window === "undefined") {
    return;
  }

  const body = JSON.stringify({
    event_type: payload.eventType,
    metadata: payload.metadata || {},
    page_url: window.location.href,
    referrer: document.referrer || null,
    source: "clubemp-dashboard",
    subject_id: payload.subjectId || null,
    subject_type: payload.subjectType || null,
    tenant_id: payload.tenantId,
    visitor_id: visitorId(),
  });
  const endpoint = `${apiUrl}/analytics/events`;

  if (navigator.sendBeacon) {
    const queued = navigator.sendBeacon(
      endpoint,
      new Blob([body], { type: "application/json; charset=UTF-8" }),
    );
    if (queued) {
      return;
    }
  }

  void fetch(endpoint, {
    body,
    headers: {
      "Content-Type": "application/json",
    },
    keepalive: true,
    method: "POST",
  }).catch(() => undefined);
}

function visitorId() {
  const existing = window.localStorage.getItem(ANALYTICS_VISITOR_KEY);
  if (existing) {
    return existing;
  }

  const generated =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(ANALYTICS_VISITOR_KEY, generated);

  return generated;
}
