export interface CartItem {
  eventId: string;
  eventTitle: string;
  eventImage: string;
  eventDate: string;
  ticketType: string;
  price: number;
  quantity: number;
}

export interface CustomerData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
}

export interface OrderItem {
  eventId: string;
  eventTitle: string;
  eventImage: string;
  eventDate: string;
  ticketType: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  customer: CustomerData;
  paymentMethod: string;
  createdAt: string;
}

export interface PurchasedTicket {
  id: string;
  orderId: string;
  eventId: string;
  eventTitle: string;
  eventImage: string;
  eventDate: string;
  ticketType: string;
  customerName: string;
  purchasedAt: string;
}
