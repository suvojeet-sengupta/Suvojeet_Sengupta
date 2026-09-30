import AdminLoginPage from '@/components/dashboard/AdminLoginPage';

export const metadata = {
  robots: { index: false, follow: false },
  title: 'Admin sign in',
  description: 'Admin login for blog management.',
};

export default function Page() {
  return <AdminLoginPage />;
}
