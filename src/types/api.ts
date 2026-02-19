export interface ApiVenue {
  name: string;
  city: string;
  state: string;
}

export interface ApiCategory {
  name: string;
  slug: string;
}

export interface ApiOrganizer {
  name: string;
  slug: string;
  logo_url: string | null;
}

export interface ApiTicketTier {
  id: number;
  event_id: number;
  batch_id: number | null;
  name: string;
  description: string | null;
  price: string;
  original_price: string | null;
  max_per_order: number;
  total_quantity: number;
  sold_quantity: number;
  available_quantity: number;
  starts_at: string | null;
  ends_at: string | null;
  is_visible: boolean;
  is_active: boolean;
  is_half_price: boolean;
  gender_restriction: string | null;
  min_age: number | null;
  pos_enabled: boolean;
  online_enabled: boolean;
  sort_order: number;
}

export interface ApiGalleryItem {
  id: number;
  image_url: string;
  caption: string | null;
  sort_order: number;
  media_type: string | null;
  thumbnail_url: string | null;
  alt_text: string | null;
  is_cover: boolean;
  is_visible: boolean;
}

export interface ApiPartner {
  id: number;
  name: string;
  logo_url: string | null;
  website: string | null;
  partner_type: string | null;
  sort_order: number;
  description: string | null;
  is_visible: boolean;
}

export interface ApiEvent {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  cover_image_url: string | null;
  banner_image_url: string | null;
  starts_at: string;
  ends_at: string;
  doors_open_at: string | null;
  venue: ApiVenue;
  is_online: boolean;
  age_rating: string | null;
  is_featured: boolean;
  min_price: number | null;
  lineup: string[] | null;
  category?: ApiCategory;
  organizer?: ApiOrganizer;
  ticket_tiers?: ApiTicketTier[];
  gallery?: ApiGalleryItem[];
  partners?: ApiPartner[];
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
}

// --- Site Types ---

export interface ApiSiteUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  document: string | null;
}

export interface ApiSiteTicket {
  hash: string;
  ticket_number: string | null;
  tier_name: string | null;
  holder_name: string | null;
  holder_email: string | null;
  status: string;
  checked_in_at: string | null;
  event: {
    name: string;
    slug: string;
    cover_image_url: string | null;
    starts_at: string | null;
    venue_name: string | null;
    venue_city: string | null;
  } | null;
  order_hash: string | null;
  price_paid: string | null;
  created_at: string;
}

export interface ApiCheckin {
  action: string;
  result: string;
  scanned_at: string | null;
  checkpoint_name: string | null;
}

export interface ApiSiteTicketDetail extends Omit<ApiSiteTicket, "event"> {
  holder_document: string | null;
  holder_phone: string | null;
  qr_data: string;
  transfer_count: number;
  max_transfers: number;
  transferred_at: string | null;
  transferred_to_email: string | null;
  transfer_message: string | null;
  is_transferable: boolean;
  checkins: ApiCheckin[];
  event: {
    id: number;
    name: string;
    slug: string;
    cover_image_url: string | null;
    banner_image_url: string | null;
    starts_at: string | null;
    ends_at: string | null;
    venue_name: string | null;
    venue_address: string | null;
    venue_city: string | null;
    allow_transfer: boolean;
  } | null;
}

export interface ApiRefund {
  id: number;
  order_hash: string | null;
  event_name: string | null;
  amount: string;
  reason: string;
  status: string;
  created_at: string;
}

export interface ApiHelpArticle {
  id: number;
  type: string;
  title: string;
  slug: string | null;
  content: string | null;
  category: string | null;
  sort_order: number;
  created_at: string;
}
