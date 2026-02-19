"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { requestRefund } from "@/lib/api";

interface RefundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderHash: string;
}

export default function RefundDialog({
  open,
  onOpenChange,
  orderHash,
}: RefundDialogProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState("");

  const mutation = useMutation({
    mutationFn: () => requestRefund(session!.accessToken, orderHash, reason),
    onSuccess: () => {
      toast.success("Solicitação de reembolso enviada com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      setReason("");
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitar Reembolso</DialogTitle>
          <DialogDescription>
            Descreva o motivo da sua solicitação de reembolso.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Por que deseja o reembolso?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            maxLength={1000}
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {reason.length}/1000
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={!reason.trim() || mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Solicitar Reembolso
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
