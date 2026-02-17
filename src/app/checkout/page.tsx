"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  QrCode,
  FileText,
  ShoppingCart,
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

const Checkout = () => {
  const router = useRouter();
  const { items, cartTotal, completePurchase } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");

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

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !cpf.trim() || !phone.trim()) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    const order = completePurchase(
      { name: name.trim(), email: email.trim(), cpf: cpf.trim(), phone: phone.trim() },
      paymentMethod
    );

    toast.success("Compra realizada com sucesso!");
    router.push(`/pedido-confirmado/${order.id}`);
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
            <div className="lg:col-span-2 space-y-8">
              {/* Customer data */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-6 border border-border/50"
              >
                <h2 className="font-display text-xl font-bold mb-6">
                  Dados pessoais
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo *</Label>
                    <Input
                      id="name"
                      placeholder="Seu nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={(e) => setCpf(maskCPF(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      placeholder="(00) 00000-0000"
                      value={phone}
                      onChange={(e) => setPhone(maskPhone(e.target.value))}
                    />
                  </div>
                </div>
              </motion.div>

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
                    <TabsTrigger value="card" className="gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span className="hidden sm:inline">Cartão</span>
                    </TabsTrigger>
                    <TabsTrigger value="pix" className="gap-2">
                      <QrCode className="w-4 h-4" />
                      <span className="hidden sm:inline">PIX</span>
                    </TabsTrigger>
                    <TabsTrigger value="boleto" className="gap-2">
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
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardCVV">CVV</Label>
                        <Input
                          id="cardCVV"
                          placeholder="000"
                          value={cardCVV}
                          onChange={(e) => setCardCVV(maskCVV(e.target.value))}
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
                          {Array.from({ length: 30 }).map((_, i) => (
                            <div
                              key={i}
                              className="bg-muted-foreground"
                              style={{
                                width: Math.random() > 0.5 ? 3 : 1,
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
                >
                  Confirmar Compra
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
