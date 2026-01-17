import DashboardLayout from '@/components/DashboardLayout';
import { AuthProvider } from '@/context/AuthContext';
import NewOrderAlarm from '@/components/NewOrderAlarm';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <NewOrderAlarm />
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  );
}
