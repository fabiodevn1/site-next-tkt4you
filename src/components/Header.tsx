"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Menu, X, Moon, Sun, ShoppingCart, LogIn, ShoppingBag, Ticket, LogOut, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/contexts/CartContext";
import CartSidebar from "@/components/CartSidebar";
import UserMenu from "@/components/UserMenu";
import LoginDialog from "@/components/LoginDialog";
import logo from "@/assets/logo-ticket4you.png";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { name: "Início", href: "/" },
  { name: "Eventos", href: "/eventos" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { theme, setTheme } = useTheme();
  const { cartCount, setIsCartOpen } = useCart();
  const { data: session } = useSession();

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={logo}
                  alt="Ticket4You"
                  className="h-20 lg:h-24 w-auto dark:brightness-125 dark:contrast-110"
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-bold">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {mounted && theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>

              {/* Auth: Desktop */}
              <div className="hidden md:flex items-center">
                {session ? (
                  <UserMenu />
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setShowLoginDialog(true)}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Entrar
                  </Button>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden py-4 border-t border-border/50"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block py-3 text-muted-foreground hover:text-foreground transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {session ? (
                <>
                  <Separator className="my-2" />
                  <Link
                    href="/perfil"
                    className="flex items-center gap-2 py-3 text-muted-foreground hover:text-foreground transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Meu Perfil
                  </Link>
                  <Link
                    href="/favoritos"
                    className="flex items-center gap-2 py-3 text-muted-foreground hover:text-foreground transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart className="h-4 w-4" />
                    Favoritos
                  </Link>
                  <Link
                    href="/meus-pedidos"
                    className="flex items-center gap-2 py-3 text-muted-foreground hover:text-foreground transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Meus Pedidos
                  </Link>
                  <Link
                    href="/meus-ingressos"
                    className="flex items-center gap-2 py-3 text-muted-foreground hover:text-foreground transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Ticket className="h-4 w-4" />
                    Meus Ingressos
                  </Link>
                  <Separator className="my-2" />
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex items-center gap-2 py-3 text-destructive hover:text-destructive/80 transition-colors font-medium w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Separator className="my-2" />
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowLoginDialog(true);
                    }}
                    className="flex items-center gap-2 py-3 text-primary hover:text-primary/80 transition-colors font-medium w-full text-left"
                  >
                    <LogIn className="h-4 w-4" />
                    Entrar
                  </button>
                </>
              )}
            </motion.nav>
          )}
        </div>
      </header>
      <CartSidebar />
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </>
  );
};

export default Header;
