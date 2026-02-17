"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo-ticket4you.png";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50 py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between gap-8 mb-8">
          {/* Brand */}
          <div className="md:max-w-sm">
            <Link href="/" className="inline-block mb-4">
              <Image src={logo} alt="Ticket4You" className="h-28 w-auto" />
            </Link>
            <p className="text-muted-foreground text-sm">
              A melhor plataforma de ingressos online do Brasil.
            </p>
          </div>

          <div className="flex gap-16">
          {/* Links */}
          <div>
            <h4 className="font-display font-bold mb-4 text-foreground">Navegação</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/eventos" className="hover:text-primary transition-colors">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href="/meus-ingressos" className="hover:text-primary transition-colors">
                  Meus Ingressos
                </Link>
              </li>
              <li>
                <Link href="/meus-pedidos" className="hover:text-primary transition-colors">
                  Meus Pedidos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4 text-foreground">Ajuda</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/ajuda" className="hover:text-primary transition-colors">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">
                  Perguntas Frequentes
                </Link>
              </li>
            </ul>
          </div>
          </div>

        </div>

        <div className="border-t border-border/50 pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 Ticket4You. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
