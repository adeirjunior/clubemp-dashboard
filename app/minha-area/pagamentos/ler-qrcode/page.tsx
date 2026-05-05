import { customerNavItems, DashboardShell } from "@/components/dashboard-shell";
import { PaymentScanner } from "@/components/payment-scanner";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <DashboardShell
      activeMenu="payment-scanner"
      headerIcon="scan-qr-code"
      headerTitle="Ler QR Code"
      navItems={customerNavItems}
      panelDescription="Acesso do cliente"
      panelTitle="Portal do cliente"
    >
      <div className="py-4">
        <PaymentScanner />
      </div>
    </DashboardShell>
  );
}
