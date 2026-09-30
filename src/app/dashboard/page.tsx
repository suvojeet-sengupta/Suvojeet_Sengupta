import AdminDashboardPage from '@/components/dashboard/AdminDashboardPage';

export const metadata = {
  robots: { index: false, follow: false },
  title: 'Dashboard',
  description: 'Admin dashboard to manage blog posts, comments and stats.',
};

export default function Page() {
  return <AdminDashboardPage />;
}
