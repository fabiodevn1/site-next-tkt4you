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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { transferTicket } from "@/lib/api";

interface TransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticketHash: string;
}

export default function TransferDialog({
  open,
  onOpenChange,
  ticketHash,
}: TransferDialogProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      transferTicket(session!.accessToken, ticketHash, {
        recipient_name: recipientName,
        recipient_email: recipientEmail,
        message: message || undefined,
      }),
    onSuccess: () => {
      toast.success("Ingresso transferido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["ticket-detail"] });
      queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
      setRecipientName("");
      setRecipientEmail("");
      setMessage("");
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const canSubmit = recipientName.trim() && recipientEmail.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transferir Ingresso</DialogTitle>
          <DialogDescription>
            Informe os dados do destinatário para transferir este ingresso.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipient-name">Nome do destinatário</Label>
            <Input
              id="recipient-name"
              placeholder="Nome completo"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient-email">Email do destinatário</Label>
            <Input
              id="recipient-email"
              type="email"
              placeholder="email@exemplo.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transfer-message">Mensagem (opcional)</Label>
            <Textarea
              id="transfer-message"
              placeholder="Deixe uma mensagem para o destinatário..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>
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
            disabled={!canSubmit || mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Transferir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
