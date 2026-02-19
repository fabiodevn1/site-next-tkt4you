"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Lock, LogIn, Loader2, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchMe, updateProfile, changePassword } from "@/lib/api";

const Perfil = () => {
  const { data: session, status: authStatus } = useSession();
  const isAuthenticated = authStatus === "authenticated";
  const isAuthLoading = authStatus === "loading";

  const { data: user, isLoading } = useQuery({
    queryKey: ["me", session?.accessToken],
    queryFn: () => fetchMe(session!.accessToken),
    enabled: !!session?.accessToken,
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [document, setDocument] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      setPhone(user.phone ?? "");
      setDocument(user.document ?? "");
    }
  }, [user]);

  const profileMutation = useMutation({
    mutationFn: () =>
      updateProfile(session!.accessToken, { name, email, phone, document }),
    onSuccess: () => {
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: () =>
      changePassword(session!.accessToken, {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      }),
    onSuccess: () => {
      toast.success("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 lg:pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            <span className="cosmic-text">Meu Perfil</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Gerencie suas informações pessoais.
          </p>

          {!isAuthenticated && !isAuthLoading && (
            <div className="bg-card rounded-2xl border border-border/50 p-6 mb-8 text-center">
              <LogIn className="w-10 h-10 text-muted-foreground/60 mx-auto mb-3" />
              <p className="text-muted-foreground mb-1">
                Faça login para acessar seu perfil.
              </p>
              <p className="text-xs text-muted-foreground">
                Clique em &quot;Entrar&quot; no menu para acessar sua conta.
              </p>
            </div>
          )}

          {(isLoading || isAuthLoading) && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {isAuthenticated && !isLoading && user && (
            <div className="space-y-6">
              {/* Avatar Display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 bg-card rounded-2xl p-6 border border-border/50"
              >
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar_url ?? undefined} />
                  <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-display text-lg font-bold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </motion.div>

              {/* Personal Data */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border/50"
              >
                <div className="flex items-center gap-2 mb-6">
                  <User className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-lg font-bold">Dados Pessoais</h2>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="document">CPF/Documento</Label>
                      <Input
                        id="document"
                        value={document}
                        onChange={(e) => setDocument(e.target.value)}
                        placeholder="000.000.000-00"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => profileMutation.mutate()}
                    disabled={profileMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {profileMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Salvar Alterações
                  </Button>
                </div>
              </motion.div>

              {/* Change Password */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl p-6 border border-border/50"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-lg font-bold">Alterar Senha</h2>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha atual</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Sua senha atual"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova senha</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repita a nova senha"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => passwordMutation.mutate()}
                    disabled={
                      passwordMutation.isPending ||
                      !currentPassword ||
                      !newPassword ||
                      !confirmPassword
                    }
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    {passwordMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Alterar Senha
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Perfil;
