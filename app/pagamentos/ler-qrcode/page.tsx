import { PaymentScanner } from "@/components/payment-scanner";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="py-4">
      <PaymentScanner />
    </div>
  );
}
