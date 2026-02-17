"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const faqs = [
  {
    question: "Como faço para comprar ingressos?",
    answer:
      "Basta acessar a página do evento desejado, selecionar o tipo de ingresso e a quantidade, e clicar em 'Comprar Agora' ou 'Adicionar ao Carrinho'. Depois, finalize a compra na página de checkout preenchendo seus dados.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "Aceitamos cartão de crédito, PIX e boleto bancário. O pagamento via PIX é processado instantaneamente, enquanto o boleto pode levar até 3 dias úteis para compensar.",
  },
  {
    question: "Como recebo meus ingressos?",
    answer:
      "Após a confirmação do pagamento, seus ingressos ficam disponíveis na seção 'Meus Ingressos'. Você pode exportar em PDF ou apresentar diretamente pelo celular na entrada do evento.",
  },
  {
    question: "Posso cancelar minha compra?",
    answer:
      "Sim, você pode solicitar o cancelamento em até 7 dias após a compra, desde que a data do evento não tenha passado. Entre em contato conosco pela página de Ajuda para solicitar o reembolso.",
  },
  {
    question: "Como transfiro meu ingresso para outra pessoa?",
    answer:
      "No momento, a transferência de ingressos não está disponível. O ingresso é vinculado ao CPF informado no momento da compra.",
  },
  {
    question: "O que fazer se não recebi o e-mail de confirmação?",
    answer:
      "Verifique sua caixa de spam. Se ainda assim não encontrar, acesse 'Meus Pedidos' para verificar o status da compra ou entre em contato conosco pela página de Ajuda.",
  },
  {
    question: "Crianças pagam ingresso?",
    answer:
      "Depende do evento. Geralmente, crianças até 2 anos não pagam se ficarem no colo. Verifique as informações específicas na página de cada evento.",
  },
  {
    question: "Posso parcelar minha compra?",
    answer:
      "Sim, compras no cartão de crédito podem ser parceladas em até 12x. As condições de parcelamento são exibidas na página de checkout.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 lg:pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              <span className="cosmic-text">Perguntas Frequentes</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Encontre respostas para as dúvidas mais comuns.
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl border border-border/50 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-medium text-foreground pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
