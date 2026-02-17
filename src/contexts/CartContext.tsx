"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import type { CartItem, Order, PurchasedTicket, CustomerData } from "@/types/cart";

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
  completePurchase: (customer: CustomerData, paymentMethod: string) => Order;
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
  const [orders, setOrders] = useState<Order[]>(() =>
    loadFromStorage("tkt4you-orders", [])
  );
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("tkt4you-cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("tkt4you-orders", JSON.stringify(orders));
  }, [orders]);

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.eventId === item.eventId && i.ticketType === item.ticketType
      );
      if (existing) {
        return prev.map((i) =>
          i.eventId === item.eventId && i.ticketType === item.ticketType
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

  const tickets: PurchasedTicket[] = useMemo(() => {
    const result: PurchasedTicket[] = [];
    for (const order of orders) {
      for (const item of order.items) {
        for (let i = 0; i < item.quantity; i++) {
          result.push({
            id: `${order.id}-${item.eventId}-${item.ticketType}-${i}`,
            orderId: order.id,
            eventId: item.eventId,
            eventTitle: item.eventTitle,
            eventImage: item.eventImage,
            eventDate: item.eventDate,
            ticketType: item.ticketType,
            customerName: order.customer.name,
            purchasedAt: order.createdAt,
          });
        }
      }
    }
    return result;
  }, [orders]);

  const completePurchase = (customer: CustomerData, paymentMethod: string): Order => {
    const order: Order = {
      id: crypto.randomUUID(),
      items: items.map((i) => ({ ...i })),
      total: cartTotal,
      customer,
      paymentMethod,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
    return order;
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
        orders,
        tickets,
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
