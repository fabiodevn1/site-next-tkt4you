"use client";

import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";

const CartSidebar = () => {
  const router = useRouter();
  const {
    items,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Carrinho ({cartCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <ShoppingCart className="w-16 h-16 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">Seu carrinho está vazio.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Adicione ingressos para continuar.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {items.map((item) => (
                <div
                  key={`${item.eventId}-${item.ticketType}`}
                  className="bg-muted/50 rounded-xl p-4 space-y-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.eventImage}
                      alt={item.eventTitle}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">
                        {item.eventTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.eventDate}</p>
                      <p className="text-xs text-primary font-medium">
                        {item.ticketType}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.eventId, item.ticketType)}
                      className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.eventId,
                            item.ticketType,
                            item.quantity - 1
                          )
                        }
                        className="w-7 h-7 rounded-full bg-background flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-semibold text-sm w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.eventId,
                            item.ticketType,
                            item.quantity + 1
                          )
                        }
                        className="w-7 h-7 rounded-full bg-background flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-bold text-sm">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-4">
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total</span>
                <span className="font-display text-2xl font-bold ticket-text">
                  R$ {cartTotal.toFixed(2)}
                </span>
              </div>
              <Button
                variant="ticket"
                size="xl"
                className="w-full"
                onClick={handleCheckout}
              >
                Finalizar Compra
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
