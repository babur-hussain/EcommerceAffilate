import DashboardLayout from '@/components/DashboardLayout';
import { AuthProvider } from '@/context/AuthContext';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  );
}
