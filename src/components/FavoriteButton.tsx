"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useToggleFavorite, useCheckFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  eventId: number;
  initialFavorited?: boolean;
  className?: string;
}

export default function FavoriteButton({
  eventId,
  initialFavorited,
  className,
}: FavoriteButtonProps) {
  const { data: session } = useSession();
  const { data: checkData } = useCheckFavorites(
    session?.accessToken ? [eventId] : []
  );
  const toggleMutation = useToggleFavorite();

  const [optimistic, setOptimistic] = useState<boolean | null>(null);

  const isFavorited =
    optimistic ??
    initialFavorited ??
    (checkData?.favorited_ids?.includes(eventId) || false);

  useEffect(() => {
    setOptimistic(null);
  }, [checkData]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Faça login para favoritar eventos.");
      return;
    }

    setOptimistic(!isFavorited);

    toggleMutation.mutate(eventId, {
      onError: () => {
        setOptimistic(null);
        toast.error("Erro ao atualizar favorito.");
      },
    });
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200",
        isFavorited
          ? "bg-red-500/90 text-white hover:bg-red-600"
          : "bg-black/40 text-white/80 hover:bg-black/60 hover:text-white",
        className
      )}
      aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart
        className={cn("w-4 h-4", isFavorited && "fill-current")}
      />
    </button>
  );
}
