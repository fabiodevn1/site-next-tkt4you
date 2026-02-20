"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight, LogIn } from "lucide-react";
import { OrdersListSkeleton } from "@/components/skeletons";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RefundDialog from "@/components/RefundDialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { fetchMyOrders } from "@/lib/api";

const refundStatusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Reembolso Pendente", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400" },
  approved: { label: "Reembolso Aprovado", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" },
  processed: { label: "Reembolsado", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" },
  rejected: { label: "Reembolso Negado", color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" },
};

const MyOrders = () => {
  const { orders: localOrders } = useCart();
  const { data: session, status: authStatus } = useSession();
  const [refundOrderHash, setRefundOrderHash] = useState<string | null>(null);

  const { data: apiData, isLoading } = useQuery({
    queryKey: ["my-orders", session?.accessToken],
    queryFn: () => fetchMyOrders(session!.accessToken),
    enabled: !!session?.accessToken,
  });

  const apiOrders = apiData?.data ?? [];
  const isAuthenticated = authStatus === "authenticated";
  const isAuthLoading = authStatus === "loading";

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

          {/* Not authenticated banner */}
          {!isAuthenticated && !isAuthLoading && (
            <div className="bg-card rounded-2xl border border-border/50 p-6 mb-8 text-center">
              <LogIn className="w-10 h-10 text-muted-foreground/60 mx-auto mb-3" />
              <p className="text-muted-foreground mb-1">
                Faça login para ver todos os seus pedidos.
              </p>
              <p className="text-xs text-muted-foreground">
                Clique em &quot;Entrar&quot; no menu para acessar sua conta.
              </p>
            </div>
          )}

          {/* Loading state */}
          {(isLoading || isAuthLoading) && (
            <OrdersListSkeleton count={4} />
          )}

          {/* Authenticated: API orders */}
          {isAuthenticated && !isLoading && apiOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground text-lg">
                Você ainda não possui pedidos.
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Seus pedidos aparecerão aqui após a compra.
              </p>
            </div>
          )}

          {isAuthenticated && !isLoading && apiOrders.length > 0 && (
            <div className="space-y-4">
              {apiOrders.map((order, idx) => {
                const refundInfo = order.refund_status
                  ? refundStatusLabels[order.refund_status]
                  : null;
                const hasRefund = !!refundInfo;
                const canRequestRefund = order.paid_at && !hasRefund;

                return (
                  <motion.div
                    key={order.hash}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-card rounded-2xl border border-border/50 hover:border-primary/40 transition-colors"
                  >
                    <Link
                      href={`/pedido-confirmado/${order.hash}`}
                      className="block p-5"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono text-muted-foreground">
                            #{order.hash.slice(0, 8).toUpperCase()}
                          </span>
                          {order.status && (
                            <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                              {order.status.display_name}
                            </span>
                          )}
                          {refundInfo && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${refundInfo.color}`}>
                              {refundInfo.label}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString("pt-BR")}
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>

                      {order.event && (
                        <div className="flex gap-3 pb-1">
                          {order.event.cover_image_url && (
                            <img
                              src={order.event.cover_image_url}
                              alt={order.event.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate max-w-[250px]">
                              {order.event.name}
                            </p>
                            {order.items && order.items.length > 0 && (
                              <p className="text-xs text-muted-foreground">
                                {order.items.map((i) => `${i.ticket_tier_name} x${i.quantity}`).join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50">
                        <span className="text-sm text-muted-foreground">
                          {order.payment_method === "credit_card"
                            ? "Cartão de Crédito"
                            : order.payment_method === "debit_card"
                            ? "Cartão de Débito"
                            : order.payment_method === "pix"
                            ? "PIX"
                            : order.payment_method === "boleto"
                            ? "Boleto"
                            : order.payment_method}
                        </span>
                        <span className="font-display font-bold ticket-text">
                          R$ {order.total}
                        </span>
                      </div>
                    </Link>

                    {canRequestRefund && (
                      <div className="px-5 pb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-destructive hover:text-destructive"
                          onClick={() => setRefundOrderHash(order.hash)}
                        >
                          Solicitar Reembolso
                        </Button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Fallback: localStorage orders for unauthenticated users */}
          {!isAuthenticated && !isAuthLoading && localOrders.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">Pedidos desta sessão:</p>
              {localOrders.map((order, idx) => (
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

      {refundOrderHash && (
        <RefundDialog
          open={!!refundOrderHash}
          onOpenChange={(open) => !open && setRefundOrderHash(null)}
          orderHash={refundOrderHash}
        />
      )}
    </div>
  );
};

export default MyOrders;
