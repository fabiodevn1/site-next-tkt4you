import type {
  ApiEvent,
  ApiHelpArticle,
  ApiPaginatedResponse,
  ApiRefund,
  ApiSiteTicketDetail,
  ApiSiteTicket,
  ApiSiteUser,
} from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8074/api";

async function fetcher<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function authFetcher<T>(endpoint: string, token: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
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
  refund_status: string | null;
  refund_requested_at: string | null;
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

// --- Site Auth API ---

export async function registerSiteUser(data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}): Promise<{ access_token: string }> {
  const res = await fetch(`${API_URL}/site/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Erro ao criar conta." }));
    throw new Error(error.message);
  }

  return res.json();
}

// --- Site Authenticated API ---

export async function fetchMyOrders(
  token: string,
  page?: number
): Promise<ApiPaginatedResponse<ApiOrderResponse>> {
  const qs = page ? `?page=${page}` : "";
  return authFetcher(`/site/orders${qs}`, token);
}

export async function fetchMyTickets(
  token: string,
  page?: number
): Promise<ApiPaginatedResponse<ApiSiteTicket>> {
  const qs = page ? `?page=${page}` : "";
  return authFetcher(`/site/tickets${qs}`, token);
}

// --- Ticket Detail ---

export async function fetchTicketDetail(
  token: string,
  hash: string
): Promise<{ data: ApiSiteTicketDetail }> {
  return authFetcher(`/site/tickets/${hash}`, token);
}

// --- Transfer ---

export async function transferTicket(
  token: string,
  hash: string,
  data: { recipient_name: string; recipient_email: string; message?: string }
): Promise<{ message: string; data: ApiSiteTicketDetail }> {
  const res = await fetch(`${API_URL}/site/tickets/${hash}/transfer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Erro ao transferir ingresso." }));
    throw new Error(error.message);
  }
  return res.json();
}

// --- Favorites ---

export async function fetchMyFavorites(
  token: string,
  page?: number
): Promise<ApiPaginatedResponse<ApiEvent>> {
  const qs = page ? `?page=${page}` : "";
  return authFetcher(`/site/favorites${qs}`, token);
}

export async function checkFavorites(
  token: string,
  eventIds: number[]
): Promise<{ favorited_ids: number[] }> {
  return authFetcher(`/site/favorites/check?event_ids=${eventIds.join(",")}`, token);
}

export async function toggleFavorite(
  token: string,
  eventId: number
): Promise<{ favorited: boolean; save_count: number }> {
  const res = await fetch(`${API_URL}/site/favorites/${eventId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Erro ao favoritar." }));
    throw new Error(error.message);
  }
  return res.json();
}

// --- Refunds ---

export async function requestRefund(
  token: string,
  hash: string,
  reason: string
): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/site/orders/${hash}/refund`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Erro ao solicitar reembolso." }));
    throw new Error(error.message);
  }
  return res.json();
}

export async function fetchMyRefunds(
  token: string,
  page?: number
): Promise<ApiPaginatedResponse<ApiRefund>> {
  const qs = page ? `?page=${page}` : "";
  return authFetcher(`/site/refunds${qs}`, token);
}

// --- Profile ---

export async function fetchMe(token: string): Promise<ApiSiteUser> {
  return authFetcher("/site/auth/me", token);
}

export async function updateProfile(
  token: string,
  data: { name?: string; email?: string; phone?: string; document?: string }
): Promise<ApiSiteUser> {
  const res = await fetch(`${API_URL}/site/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Erro ao atualizar perfil." }));
    throw new Error(error.message);
  }
  return res.json();
}

export async function changePassword(
  token: string,
  data: { current_password: string; password: string; password_confirmation: string }
): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/site/auth/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Erro ao alterar senha." }));
    throw new Error(error.message);
  }
  return res.json();
}

// --- Help Articles ---

export async function fetchHelpArticles(
  params?: { search?: string; type?: string; category?: string }
): Promise<ApiPaginatedResponse<ApiHelpArticle>> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set("search", params.search);
  if (params?.type) searchParams.set("type", params.type);
  if (params?.category) searchParams.set("category", params.category);
  const qs = searchParams.toString();
  return fetcher(`/site/help${qs ? `?${qs}` : ""}`);
}

export async function fetchHelpArticle(
  slug: string
): Promise<{ data: ApiHelpArticle }> {
  return fetcher(`/site/help/${slug}`);
}
