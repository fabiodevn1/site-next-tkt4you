import type { ApiEvent, ApiPaginatedResponse } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function fetcher<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// --- Checkout types ---

export interface AttendeeData {
  name: string;
  email: string;
  cpf: string;
}

export interface CheckoutPayload {
  event_id: number;
  customer: {
    name: string;
    email: string;
    cpf: string;
    phone?: string;
  };
  items: {
    ticket_tier_id: number;
    quantity: number;
    attendees: AttendeeData[];
  }[];
  payment_method: string;
  coupon_code?: string;
}

export interface ApiOrderItem {
  ticket_tier_name: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

export interface ApiIssuedTicket {
  hash: string;
  tier_name: string;
  holder_name: string;
  holder_email: string;
  status: string;
}

export interface ApiOrderResponse {
  hash: string;
  event: {
    id: number;
    name: string;
    slug: string;
    cover_image_url: string | null;
    starts_at: string;
    venue_name: string;
    venue_city: string;
  };
  status: {
    name: string;
    display_name: string;
  };
  items: ApiOrderItem[];
  issued_tickets: ApiIssuedTicket[];
  subtotal: string;
  discount_amount: string;
  total: string;
  payment_method: string;
  coupon_code: string | null;
  billing_name: string;
  billing_email: string;
  billing_phone: string | null;
  billing_document: string;
  paid_at: string | null;
  created_at: string;
}

export interface ApiErrorResponse {
  message: string;
}

// --- Checkout API ---

export async function submitCheckout(
  payload: CheckoutPayload
): Promise<{ data: ApiOrderResponse }> {
  const res = await fetch(`${API_URL}/public/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error: ApiErrorResponse = await res.json().catch(() => ({
      message: "Erro ao processar pedido.",
    }));
    throw new Error(error.message);
  }

  return res.json();
}

export async function fetchOrderByHash(
  hash: string
): Promise<{ data: ApiOrderResponse }> {
  return fetcher<{ data: ApiOrderResponse }>(`/public/orders/${hash}`);
}

export async function validateCoupon(
  code: string,
  eventId: number,
  orderValue: number
): Promise<{ valid: boolean; discount?: number; message?: string }> {
  const res = await fetch(`${API_URL}/public/coupons/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ code, event_id: eventId, order_value: orderValue }),
  });

  return res.json();
}

export interface FetchEventsParams {
  search?: string;
  category?: string;
  city?: string;
  per_page?: number;
  page?: number;
  sort?: string;
  direction?: "asc" | "desc";
}

export async function fetchEvents(
  params: FetchEventsParams = {}
): Promise<ApiPaginatedResponse<ApiEvent>> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.category) searchParams.set("category", params.category);
  if (params.city) searchParams.set("city", params.city);
  if (params.per_page) searchParams.set("per_page", String(params.per_page));
  if (params.page) searchParams.set("page", String(params.page));
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.direction) searchParams.set("direction", params.direction);

  const qs = searchParams.toString();
  return fetcher<ApiPaginatedResponse<ApiEvent>>(
    `/public/events${qs ? `?${qs}` : ""}`
  );
}

export async function fetchEventBySlug(slug: string): Promise<{ data: ApiEvent }> {
  return fetcher<{ data: ApiEvent }>(`/public/events/${slug}`);
}

export async function fetchCategories(): Promise<{ id: number; name: string; slug: string }[]> {
  return fetcher(`/public/categories`);
}
