"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

const MyOrders = () => {
  const { orders } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 lg:pt-28 pb-16 px-4">
        <div className="container mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            <span className="cosmic-text">Meus Pedidos</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Acompanhe o histórico dos seus pedidos.
          </p>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground text-lg">
                Você ainda não possui pedidos.
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Seus pedidos aparecerão aqui após a compra.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, idx) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={`/pedido-confirmado/${order.id}`}
                    className="block bg-card rounded-2xl p-5 border border-border/50 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-muted-foreground">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                          Confirmado
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex gap-3 flex-shrink-0">
                          <img
                            src={item.eventImage}
                            alt={item.eventTitle}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate max-w-[200px]">
                              {item.eventTitle}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.ticketType} x{item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50">
                      <span className="text-sm text-muted-foreground">
                        {order.paymentMethod === "card"
                          ? "Cartão de Crédito"
                          : order.paymentMethod === "pix"
                          ? "PIX"
                          : "Boleto"}
                      </span>
                      <span className="font-display font-bold ticket-text">
                        R$ {order.total.toFixed(2)}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyOrders;
