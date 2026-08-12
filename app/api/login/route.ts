import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Check against env variable, fallback to '123456' for local testing
    const correctPassword = process.env.APP_PASSWORD || '123456';
    
    if (password === correctPassword) {
      const cookieStore = await cookies();
      cookieStore.set('auth_token', 'logged_in', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
