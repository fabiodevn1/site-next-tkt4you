"use client";

import { CheckCircle, LogOut, AlertCircle } from "lucide-react";
import type { ApiCheckin } from "@/types/api";

interface CheckinTimelineProps {
  checkins: ApiCheckin[];
}

export default function CheckinTimeline({ checkins }: CheckinTimelineProps) {
  if (checkins.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        Nenhum check-in registrado.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {checkins.map((checkin, idx) => {
        const isIn = checkin.action === "in";
        const isSuccess = checkin.result === "success";
        const isOut = checkin.action === "out";

        let Icon = AlertCircle;
        let iconColor = "text-yellow-500";
        let bgColor = "bg-yellow-500/10";

        if (isIn && isSuccess) {
          Icon = CheckCircle;
          iconColor = "text-green-500";
          bgColor = "bg-green-500/10";
        } else if (isOut) {
          Icon = LogOut;
          iconColor = "text-blue-500";
          bgColor = "bg-blue-500/10";
        }

        return (
          <div key={idx} className="flex items-start gap-3">
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full ${bgColor} flex items-center justify-center`}
            >
              <Icon className={`w-4 h-4 ${iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                {isIn ? "Entrada" : isOut ? "Saída" : "Verificação"}
                {checkin.result && !isSuccess && (
                  <span className="text-yellow-500 ml-1">({checkin.result})</span>
                )}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {checkin.scanned_at && (
                  <span>
                    {new Date(checkin.scanned_at).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
                {checkin.checkpoint_name && (
                  <>
                    <span>&middot;</span>
                    <span>{checkin.checkpoint_name}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
