"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, Ticket, LogOut, User, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getInitials(name?: string | null): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0][0].toUpperCase();
}

export default function UserMenu() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="h-8 w-8">
          <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? "Avatar"} />
          <AvatarFallback className="text-xs">{getInitials(session.user.name)}</AvatarFallback>
        </Avatar>
        <span className="hidden lg:block text-sm font-medium max-w-[120px] truncate">
          {session.user.name?.split(" ")[0]}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/perfil" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Meu Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/favoritos" className="cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            Favoritos
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/meus-pedidos" className="cursor-pointer">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Meus Pedidos
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/meus-ingressos" className="cursor-pointer">
            <Ticket className="mr-2 h-4 w-4" />
            Meus Ingressos
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
