'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // Refresh the router to apply middleware redirects
        router.refresh();
        router.push('/');
      } else {
        setError('密码错误，请重试');
      }
    } catch (err) {
      setError('网络错误，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: 'var(--bg-color)'
    }}>
      <div className="glass-card animate-fade-in" style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '32px 24px', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          overflow: 'hidden',
          marginBottom: '20px',
          border: '2px solid var(--border-color)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <Image 
            src="/images/hero.png" 
            alt="百家饭" 
            width={120} 
            height={120}
            style={{ objectFit: 'cover' }}
          />
        </div>
        
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '4px', fontFamily: 'var(--font-serif)' }}>
          百家饭
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '32px', fontFamily: 'var(--font-serif)', letterSpacing: '0.5px' }}>
          吃了百家饭，一生无忧愁
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入访问密码"
            className="form-input"
            style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '2px' }}
            required
          />
          
          {error && <div style={{ color: '#EF4444', fontSize: '13px', fontWeight: 500 }}>{error}</div>}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isLoading}
            style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '8px', fontFamily: 'var(--font-serif)' }}
          >
            {isLoading ? '登录中...' : '进入记录表'}
          </button>
        </form>
      </div>
    </div>
  );
}
