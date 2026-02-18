"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import type { CartItem, CustomerData, Order, PurchasedTicket } from "@/types/cart";
import {
  submitCheckout,
  type ApiOrderResponse,
  type CheckoutPayload,
  type AttendeeData,
} from "@/lib/api";

const PAYMENT_METHOD_MAP: Record<string, string> = {
  card: "credit_card",
  pix: "pix",
  boleto: "boleto",
};

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (eventId: string, ticketType: string) => void;
  updateQuantity: (eventId: string, ticketType: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  orders: Order[];
  tickets: PurchasedTicket[];
  completePurchase: (
    customer: CustomerData,
    paymentMethod: string,
    attendeesMap: Record<number, AttendeeData[]>
  ) => Promise<ApiOrderResponse>;
}

const CartContext = createContext<CartContextType | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() =>
    loadFromStorage("tkt4you-cart", [])
  );
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("tkt4you-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      // Single-event restriction: all items must belong to the same event
      if (prev.length > 0 && prev[0].eventId !== item.eventId) {
        toast.error(
          "Seu carrinho já possui ingressos de outro evento. Limpe o carrinho para adicionar ingressos de um evento diferente."
        );
        return prev;
      }

      const existing = prev.find(
        (i) => i.eventId === item.eventId && i.ticketTierId === item.ticketTierId
      );
      if (existing) {
        return prev.map((i) =>
          i.eventId === item.eventId && i.ticketTierId === item.ticketTierId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (eventId: string, ticketType: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.eventId === eventId && i.ticketType === ticketType))
    );
  };

  const updateQuantity = (eventId: string, ticketType: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(eventId, ticketType);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.eventId === eventId && i.ticketType === ticketType
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const cartTotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const cartCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const completePurchase = async (
    customer: CustomerData,
    paymentMethod: string,
    attendeesMap: Record<number, AttendeeData[]>
  ): Promise<ApiOrderResponse> => {
    const eventId = Number(items[0].eventId);

    const payload: CheckoutPayload = {
      event_id: eventId,
      customer: {
        name: customer.name,
        email: customer.email,
        cpf: customer.cpf,
        phone: customer.phone || undefined,
      },
      items: items.map((i) => ({
        ticket_tier_id: i.ticketTierId,
        quantity: i.quantity,
        attendees: attendeesMap[i.ticketTierId] || [],
      })),
      payment_method: PAYMENT_METHOD_MAP[paymentMethod] || paymentMethod,
    };

    const response = await submitCheckout(payload);
    clearCart();
    return response.data;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        orders: [],
        tickets: [],
        completePurchase,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
