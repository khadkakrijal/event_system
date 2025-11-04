// app/buyticket/page.tsx
import { Suspense } from "react";
import BuyTicket from "@/app/components/buyTicket/buyTicket";

export default function BuyTicketPage() {
  return (
    <Suspense fallback={<div className="p-6 text-white">Loading…</div>}>
      <BuyTicket />
    </Suspense>
  );
}
