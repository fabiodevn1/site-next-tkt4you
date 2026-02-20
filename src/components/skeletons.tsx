import { Skeleton } from "@/components/ui/skeleton";

export function EventCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border/50">
      <div className="relative h-48">
        <Skeleton className="w-full h-full rounded-none" />
        <Skeleton className="absolute top-3 left-3 w-20 h-6 rounded-full" />
      </div>
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}

export function EventsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroCarouselSkeleton() {
  return (
    <section className="relative h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden wave-bg">
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-ticket-blue/80 via-ticket-sky/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl space-y-4">
          <Skeleton className="h-7 w-32 rounded-full" />
          <Skeleton className="h-14 w-full max-w-lg" />
          <Skeleton className="h-10 w-3/4 max-w-md" />
          <Skeleton className="h-6 w-2/3 max-w-sm" />
          <div className="flex gap-4 mt-4">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-44" />
          </div>
          <div className="flex gap-4 mt-4">
            <Skeleton className="h-14 w-44 rounded-xl" />
            <Skeleton className="h-14 w-36 rounded-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function EventDetailSkeleton() {
  return (
    <>
      {/* Hero Skeleton */}
      <section className="relative h-[50vh] min-h-[400px] wave-bg">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8 space-y-4">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-7 w-28 rounded-full" />
            <Skeleton className="h-12 w-2/3 max-w-md" />
            <Skeleton className="h-6 w-1/3 max-w-xs" />
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Info */}
              <div className="flex flex-wrap gap-6 bg-card rounded-2xl p-6 border border-border/50">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
                <Skeleton className="h-7 w-48" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>

              {/* Location */}
              <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
                <Skeleton className="h-7 w-36" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-64" />
                <Skeleton className="h-48 w-full rounded-xl" />
              </div>
            </div>

            {/* Ticket Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-2xl p-6 border border-border/50 space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-44" />
                  <div className="flex gap-2">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="w-10 h-10 rounded-full" />
                  </div>
                </div>
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-24" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="h-6 w-8" />
                    <Skeleton className="w-10 h-10 rounded-full" />
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-8 w-28" />
                  </div>
                </div>
                <Skeleton className="h-14 w-full rounded-md" />
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function TicketCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
      <Skeleton className="h-36 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-36" />
        <div className="pt-3 border-t border-border/50 flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export function TicketsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <TicketCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border/50 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-border/50">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  );
}

export function OrdersListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-4 bg-card rounded-2xl p-6 border border-border/50">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      {/* Personal Data */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>

      {/* Change Password */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* Buyer data */}
        <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Attendee */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-56" />
          <div className="bg-card rounded-2xl p-5 border border-border/50 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-10 w-full rounded-md" />
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 bg-card rounded-2xl p-6 border border-border/50 space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="flex gap-3">
            <Skeleton className="w-14 h-14 rounded-lg" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <Skeleton className="h-px w-full" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
          <Skeleton className="h-px w-full" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-7 w-24" />
          </div>
          <Skeleton className="h-14 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function TicketDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Event Banner */}
      <Skeleton className="h-48 w-full rounded-2xl" />

      {/* QR Code + Status */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 flex flex-col items-center space-y-4">
        <Skeleton className="w-[232px] h-[232px] rounded-xl" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Ticket Info */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
        <Skeleton className="h-5 w-48" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-10 flex-1 rounded-md" />
        <Skeleton className="h-10 flex-1 rounded-md" />
      </div>
    </div>
  );
}

export function OrderConfirmationSkeleton() {
  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
        <Skeleton className="h-9 w-64 mx-auto mb-2" />
        <Skeleton className="h-5 w-52 mx-auto" />
      </div>

      <Skeleton className="h-16 w-full rounded-xl mb-6" />

      {/* Order summary */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="w-16 h-16 rounded-lg" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
        <Skeleton className="h-px w-full" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>

      {/* Tickets */}
      <div className="space-y-4 mb-6">
        <Skeleton className="h-5 w-40" />
        {[1, 2].map((i) => (
          <div key={i} className="bg-card rounded-2xl p-6 border border-border/50 space-y-3">
            <div className="flex gap-3">
              <Skeleton className="w-16 h-16 rounded-lg" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
            <Skeleton className="h-px w-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-px w-full" />
            <div className="text-center">
              <Skeleton className="h-3 w-28 mx-auto mb-1" />
              <Skeleton className="h-6 w-48 mx-auto" />
            </div>
          </div>
        ))}
      </div>

      <Skeleton className="h-12 w-full rounded-md mb-3" />
      <div className="flex gap-3">
        <Skeleton className="h-12 flex-1 rounded-md" />
        <Skeleton className="h-12 flex-1 rounded-md" />
      </div>
    </>
  );
}
