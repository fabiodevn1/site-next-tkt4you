"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  QrCode,
  FileText,
  ShoppingCart,
  Loader2,
  Ticket,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import type { AttendeeData } from "@/lib/api";

function maskCPF(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskPhone(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

function maskCardNumber(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

function maskExpiry(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 4)
    .replace(/(\d{2})(\d)/, "$1/$2");
}

function maskCVV(value: string): string {
  return value.replace(/\D/g, "").slice(0, 4);
}

interface ExpandedTicket {
  key: string;
  ticketTierId: number;
  ticketType: string;
  indexInTier: number;
}

const BOLETO_BAR_WIDTHS = [3,1,1,3,1,3,3,1,1,3,1,1,3,1,3,1,1,3,3,1,1,3,1,3,1,1,3,1,3,1];

const Checkout = () => {
  const router = useRouter();
  const { items, cartTotal, cartCount, completePurchase, isHydrated } = useCart();

  // Buyer data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Expand cart items into individual tickets
  const expandedTickets: ExpandedTicket[] = useMemo(() => {
    const result: ExpandedTicket[] = [];
    for (const item of items) {
      for (let i = 0; i < item.quantity; i++) {
        result.push({
          key: `${item.ticketTierId}-${i}`,
          ticketTierId: item.ticketTierId,
          ticketType: item.ticketType,
          indexInTier: i,
        });
      }
    }
    return result;
  }, [items]);

  // Attendee data per ticket: key -> { name, email, cpf }
  const [attendees, setAttendees] = useState<Record<string, AttendeeData>>({});

  const updateAttendee = useCallback(
    (key: string, field: keyof AttendeeData, value: string) => {
      setAttendees((prev) => ({
        ...prev,
        [key]: {
          name: prev[key]?.name ?? "",
          email: prev[key]?.email ?? "",
          cpf: prev[key]?.cpf ?? "",
          [field]: value,
        },
      }));
    },
    []
  );

  const copyBuyerToAttendee = useCallback(
    (key: string) => {
      setAttendees((prev) => ({
        ...prev,
        [key]: {
          name: name,
          email: email,
          cpf: cpf,
        },
      }));
    },
    [name, email, cpf]
  );

  if (!isHydrated) {
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 lg:pt-28 pb-16 px-4">
          <div className="container mx-auto flex flex-col items-center justify-center py-20 text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground text-lg mb-4">
              Seu carrinho está vazio.
            </p>
            <Link
              href="/eventos"
              className="text-primary hover:underline font-medium"
            >
              Ver eventos disponíveis
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async () => {
    // Validate buyer
    if (!name.trim() || !email.trim() || !cpf.trim() || !phone.trim()) {
      toast.error("Preencha todos os dados do comprador.");
      return;
    }

    // Validate all attendees
    for (const ticket of expandedTickets) {
      const att = attendees[ticket.key];
      if (!att?.name?.trim() || !att?.email?.trim() || !att?.cpf?.trim()) {
        toast.error(
          `Preencha os dados do participante: ${ticket.ticketType} #${ticket.indexInTier + 1}`
        );
        return;
      }
    }

    // Build attendeesMap grouped by ticketTierId
    const attendeesMap: Record<number, AttendeeData[]> = {};
    for (const ticket of expandedTickets) {
      const att = attendees[ticket.key];
      if (!attendeesMap[ticket.ticketTierId]) {
        attendeesMap[ticket.ticketTierId] = [];
      }
      attendeesMap[ticket.ticketTierId].push({
        name: att.name.trim(),
        email: att.email.trim(),
        cpf: att.cpf.trim(),
      });
    }

    setIsSubmitting(true);
    try {
      const order = await completePurchase(
        { name: name.trim(), email: email.trim(), cpf: cpf.trim(), phone: phone.trim() },
        paymentMethod,
        attendeesMap
      );

      toast.success("Compra realizada com sucesso!");
      router.push(`/pedido-confirmado/${order.hash}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao processar pedido.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 lg:pt-28 pb-16 px-4">
        <div className="container mx-auto">
          <Link
            href="/eventos"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Continuar comprando
          </Link>

          <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">
            <span className="cosmic-text">Checkout</span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Buyer data */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-6 border border-border/50"
              >
                <h2 className="font-display text-xl font-bold mb-6">
                  Dados do comprador
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo *</Label>
                    <Input
                      id="name"
                      placeholder="Seu nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={(e) => setCpf(maskCPF(e.target.value))}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      placeholder="(00) 00000-0000"
                      value={phone}
                      onChange={(e) => setPhone(maskPhone(e.target.value))}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Individual attendee cards */}
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold">
                  Dados dos participantes
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({cartCount} {cartCount === 1 ? "ingresso" : "ingressos"})
                  </span>
                </h2>

                {expandedTickets.map((ticket, idx) => {
                  const raw = attendees[ticket.key];
                  const att = { name: raw?.name ?? "", email: raw?.email ?? "", cpf: raw?.cpf ?? "" };
                  return (
                    <motion.div
                      key={ticket.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * idx }}
                      className="bg-card rounded-2xl p-5 border border-border/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Ticket className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-sm">
                            {ticket.ticketType}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            — Ingresso {ticket.indexInTier + 1}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyBuyerToAttendee(ticket.key)}
                          disabled={isSubmitting}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                        >
                          <Copy className="w-3 h-3" />
                          Copiar dados do comprador
                        </button>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <Label
                            htmlFor={`att-name-${ticket.key}`}
                            className="text-xs"
                          >
                            Nome completo *
                          </Label>
                          <Input
                            id={`att-name-${ticket.key}`}
                            placeholder="Nome do participante"
                            value={att.name}
                            onChange={(e) =>
                              updateAttendee(ticket.key, "name", e.target.value)
                            }
                            disabled={isSubmitting}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label
                            htmlFor={`att-email-${ticket.key}`}
                            className="text-xs"
                          >
                            E-mail *
                          </Label>
                          <Input
                            id={`att-email-${ticket.key}`}
                            type="email"
                            placeholder="email@exemplo.com"
                            value={att.email}
                            onChange={(e) =>
                              updateAttendee(ticket.key, "email", e.target.value)
                            }
                            disabled={isSubmitting}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label
                            htmlFor={`att-cpf-${ticket.key}`}
                            className="text-xs"
                          >
                            CPF *
                          </Label>
                          <Input
                            id={`att-cpf-${ticket.key}`}
                            placeholder="000.000.000-00"
                            value={att.cpf}
                            onChange={(e) =>
                              updateAttendee(
                                ticket.key,
                                "cpf",
                                maskCPF(e.target.value)
                              )
                            }
                            disabled={isSubmitting}
                            className="h-9 text-sm"
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Payment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border/50"
              >
                <h2 className="font-display text-xl font-bold mb-6">
                  Forma de pagamento
                </h2>
                <Tabs
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="card" className="gap-2" disabled={isSubmitting}>
                      <CreditCard className="w-4 h-4" />
                      <span className="hidden sm:inline">Cartão</span>
                    </TabsTrigger>
                    <TabsTrigger value="pix" className="gap-2" disabled={isSubmitting}>
                      <QrCode className="w-4 h-4" />
                      <span className="hidden sm:inline">PIX</span>
                    </TabsTrigger>
                    <TabsTrigger value="boleto" className="gap-2" disabled={isSubmitting}>
                      <FileText className="w-4 h-4" />
                      <span className="hidden sm:inline">Boleto</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número do cartão</Label>
                      <Input
                        id="cardNumber"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(maskCardNumber(e.target.value))}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Validade</Label>
                        <Input
                          id="cardExpiry"
                          placeholder="MM/AA"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(maskExpiry(e.target.value))}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardCVV">CVV</Label>
                        <Input
                          id="cardCVV"
                          placeholder="000"
                          value={cardCVV}
                          onChange={(e) => setCardCVV(maskCVV(e.target.value))}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Pagamento via cartão de crédito.
                    </p>
                  </TabsContent>

                  <TabsContent value="pix" className="mt-6">
                    <div className="flex flex-col items-center py-8">
                      <div className="w-48 h-48 bg-muted rounded-2xl flex items-center justify-center mb-4">
                        <QrCode className="w-24 h-24 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        O QR Code será gerado após a confirmação do pedido.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="boleto" className="mt-6">
                    <div className="flex flex-col items-center py-8">
                      <div className="w-full max-w-sm h-20 bg-muted rounded-xl flex items-center justify-center mb-4">
                        <div className="flex gap-[2px]">
                          {BOLETO_BAR_WIDTHS.map((w, i) => (
                            <div
                              key={i}
                              className="bg-muted-foreground"
                              style={{
                                width: w,
                                height: 40,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        O boleto será gerado após a confirmação do pedido.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-24 bg-card rounded-2xl p-6 border border-border/50"
              >
                <h2 className="font-display text-xl font-bold mb-4">
                  Resumo do pedido
                </h2>

                <div className="space-y-4 mb-4">
                  {items.map((item) => (
                    <div
                      key={`${item.eventId}-${item.ticketType}`}
                      className="flex gap-3"
                    >
                      <img
                        src={item.eventImage}
                        alt={item.eventTitle}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">
                          {item.eventTitle}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.ticketType} x{item.quantity}
                        </p>
                        <p className="text-sm font-semibold">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>R$ {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa de serviço</span>
                    <span className="text-green-600">Grátis</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center mb-6">
                  <span className="font-semibold">Total</span>
                  <span className="font-display text-2xl font-bold ticket-text">
                    R$ {cartTotal.toFixed(2)}
                  </span>
                </div>

                <Button
                  variant="ticket"
                  size="xl"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Confirmar Compra"
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground mt-4">
                  Pagamento 100% seguro
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
