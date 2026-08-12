import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ClientDashboard from './ClientDashboard';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');
  
  if (!token) {
    redirect('/login');
  }
  
  return <ClientDashboard />;
}
