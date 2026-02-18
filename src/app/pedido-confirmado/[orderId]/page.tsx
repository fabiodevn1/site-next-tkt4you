"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Ticket, ShoppingBag, Download, Loader2, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchOrderByHash, type ApiOrderResponse } from "@/lib/api";

const OrderSuccess = () => {
  const params = useParams();
  const orderHash = params.orderId as string;
  const [order, setOrder] = useState<ApiOrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchOrderByHash(orderHash)
      .then((res) => setOrder(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [orderHash]);

  const handleExportTicket = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 lg:pt-28 pb-16 px-4">
          <div className="container mx-auto flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 lg:pt-28 pb-16 px-4">
          <div className="container mx-auto flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground text-lg mb-4">
              Pedido não encontrado.
            </p>
            <Link href="/" className="text-primary hover:underline font-medium">
              Voltar ao início
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const paymentLabel =
    order.payment_method === "credit_card"
      ? "Cartão de Crédito"
      : order.payment_method === "debit_card"
      ? "Cartão de Débito"
      : order.payment_method === "pix"
      ? "PIX"
      : order.payment_method === "boleto"
      ? "Boleto"
      : order.payment_method;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 lg:pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8 no-print"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Compra Confirmada!
            </h1>
            <p className="text-muted-foreground">
              Seu pedido foi processado com sucesso.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-muted/50 rounded-xl p-5 mb-6 text-center no-print"
          >
            <p className="font-medium text-foreground">
              Obrigado pela sua compra, {order.billing_name?.split(" ")[0]}!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Enviamos a confirmação para {order.billing_email}
            </p>
          </motion.div>

          {/* Order summary - visible on screen, hidden on print */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card rounded-2xl p-6 border border-border/50 mb-6 no-print"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-lg font-bold">
                Resumo do Pedido
              </h2>
              <span className="text-xs text-muted-foreground font-mono">
                {order.hash}
              </span>
            </div>

            {order.event && (
              <div className="flex gap-3 mb-4">
                {order.event.cover_image_url && (
                  <img
                    src={order.event.cover_image_url}
                    alt={order.event.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {order.event.name}
                  </p>
                  {order.event.starts_at && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.event.starts_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                  {order.event.venue_name && (
                    <p className="text-xs text-muted-foreground">
                      {order.event.venue_name}
                      {order.event.venue_city ? `, ${order.event.venue_city}` : ""}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{item.ticket_tier_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity}x R$ {parseFloat(item.unit_price).toFixed(2)}
                    </p>
                  </div>
                  <span className="font-semibold text-sm">
                    R$ {parseFloat(item.subtotal).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {parseFloat(order.discount_amount) > 0 && (
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-muted-foreground">
                  Desconto {order.coupon_code ? `(${order.coupon_code})` : ""}
                </span>
                <span className="text-green-600">
                  - R$ {parseFloat(order.discount_amount).toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="font-display text-xl font-bold ticket-text">
                R$ {parseFloat(order.total).toFixed(2)}
              </span>
            </div>

            <Separator className="my-4" />

            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Nome:</span>{" "}
                <span className="font-medium">{order.billing_name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">E-mail:</span>{" "}
                <span className="font-medium">{order.billing_email}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Pagamento:</span>{" "}
                <span className="font-medium">{paymentLabel}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Data:</span>{" "}
                <span className="font-medium">
                  {new Date(order.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Individual ticket cards - each one is a separate print-ticket */}
          {order.issued_tickets && order.issued_tickets.length > 0 && (
            <div className="space-y-4 mb-6">
              <h2 className="font-display text-lg font-bold no-print">
                Seus Ingressos ({order.issued_tickets.length})
              </h2>
              {order.issued_tickets.map((ticket, idx) => (
                <motion.div
                  key={ticket.hash}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  className="bg-card rounded-2xl p-6 border border-border/50 print-ticket"
                >
                  {/* Event info */}
                  {order.event && (
                    <div className="flex gap-3 mb-4">
                      {order.event.cover_image_url && (
                        <img
                          src={order.event.cover_image_url}
                          alt={order.event.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">
                          {order.event.name}
                        </p>
                        {order.event.starts_at && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(order.event.starts_at).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        )}
                        {order.event.venue_name && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {order.event.venue_name}
                            {order.event.venue_city ? `, ${order.event.venue_city}` : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <Separator className="my-3" />

                  {/* Ticket details */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-primary" />
                      <span className="font-semibold">{ticket.tier_name}</span>
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                      {ticket.status === "valid" ? "Válido" : ticket.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-muted-foreground">Participante:</span>{" "}
                      <span className="font-medium">{ticket.holder_name || order.billing_name}</span>
                    </div>
                    {ticket.holder_email && (
                      <div>
                        <span className="text-muted-foreground">E-mail:</span>{" "}
                        <span className="font-medium">{ticket.holder_email}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Pedido:</span>{" "}
                      <span className="font-medium font-mono text-xs">{order.hash}</span>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  {/* Ticket hash as code - prominent for check-in */}
                  <div className="text-center py-2">
                    <p className="text-xs text-muted-foreground mb-1">Código do ingresso</p>
                    <p className="font-mono text-lg font-bold tracking-wider ticket-text">
                      {ticket.hash}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <Button
            variant="ticket"
            size="lg"
            className="w-full mb-3 no-print"
            onClick={handleExportTicket}
          >
            <Download className="w-4 h-4 mr-2" />
            Imprimir {order.issued_tickets && order.issued_tickets.length > 1 ? "Ingressos" : "Ingresso"}
          </Button>

          <div className="flex flex-col sm:flex-row gap-3 no-print">
            <Button variant="outline" size="lg" className="flex-1" asChild>
              <Link href="/meus-pedidos">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Meus Pedidos
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="flex-1" asChild>
              <Link href="/meus-ingressos">
                <Ticket className="w-4 h-4 mr-2" />
                Meus Ingressos
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
