import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ClientHome from './ClientHome';

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');
  
  if (!token) {
    redirect('/login');
  }
  
  return <ClientHome />;
}
