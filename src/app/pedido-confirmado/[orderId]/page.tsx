"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Ticket, ShoppingBag, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

const OrderSuccess = () => {
  const params = useParams();
  const orderId = params.orderId as string;
  const { orders } = useCart();

  const order = orders.find((o) => o.id === orderId);

  const handleExportTicket = () => {
    window.print();
  };

  if (!order) {
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
              Obrigado pela sua compra, {order.customer.name.split(" ")[0]}!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Enviamos a confirmação para {order.customer.email}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card rounded-2xl p-6 border border-border/50 mb-6 print-ticket"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-lg font-bold">
                Detalhes do Pedido
              </h2>
              <span className="text-xs text-muted-foreground font-mono">
                {order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>

            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <img
                    src={item.eventImage}
                    alt={item.eventTitle}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {item.eventTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.eventDate}
                    </p>
                    <p className="text-xs text-primary font-medium">
                      {item.ticketType} x{item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-sm flex-shrink-0">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="font-display text-xl font-bold ticket-text">
                R$ {order.total.toFixed(2)}
              </span>
            </div>

            <Separator className="my-4" />

            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Nome:</span>{" "}
                <span className="font-medium">{order.customer.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">E-mail:</span>{" "}
                <span className="font-medium">{order.customer.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Pagamento:</span>{" "}
                <span className="font-medium capitalize">
                  {order.paymentMethod === "card"
                    ? "Cartão de Crédito"
                    : order.paymentMethod === "pix"
                    ? "PIX"
                    : "Boleto"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Data:</span>{" "}
                <span className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </motion.div>

          <Button
            variant="ticket"
            size="lg"
            className="w-full mb-3 no-print"
            onClick={handleExportTicket}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Ingresso
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
