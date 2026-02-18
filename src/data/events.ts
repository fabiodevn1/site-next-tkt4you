import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { ApiEvent } from "@/types/api";

export interface EventTicket {
  id: number;
  type: string;
  price: number;
  available: number;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  location: string;
  address: string;
  price: number;
  image: string;
  category: string;
  description: string;
  lineup: string[];
  tickets: EventTicket[];
}

export function mapApiEventToEvent(apiEvent: ApiEvent): Event {
  const startsAt = new Date(apiEvent.starts_at);

  const minPrice =
    apiEvent.min_price ??
    (apiEvent.ticket_tiers && apiEvent.ticket_tiers.length > 0
      ? Math.min(...apiEvent.ticket_tiers.map((t) => parseFloat(t.price)))
      : 0);

  const tickets: EventTicket[] = apiEvent.ticket_tiers
    ? apiEvent.ticket_tiers.map((t) => ({
        id: t.id,
        type: t.name,
        price: parseFloat(t.price),
        available: t.available_quantity,
      }))
    : [];

  return {
    id: String(apiEvent.id),
    slug: apiEvent.slug,
    title: apiEvent.name,
    subtitle: apiEvent.short_description || apiEvent.organizer?.name || "",
    date: format(startsAt, "dd MMM yyyy", { locale: ptBR }),
    time: format(startsAt, "HH:mm"),
    location: apiEvent.is_online
      ? "Evento Online"
      : `${apiEvent.venue.name}, ${apiEvent.venue.city}`,
    address: apiEvent.is_online
      ? "Online"
      : `${apiEvent.venue.name} - ${apiEvent.venue.city}/${apiEvent.venue.state}`,
    price: minPrice,
    image: apiEvent.cover_image_url || "/placeholder.svg",
    category: apiEvent.category?.name || "Evento",
    description: apiEvent.description || "",
    lineup: apiEvent.lineup || [],
    tickets,
  };
}
