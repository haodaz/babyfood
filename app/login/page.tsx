'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
        textAlign: 'center' 
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>👶🏻</div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '8px' }}>
          宝宝的 100 种辅食
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>
          请输入密码以访问记录 (默认测试密码: 123456)
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
            style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '8px' }}
          >
            {isLoading ? '登录中...' : '进入记录表'}
          </button>
        </form>
      </div>
    </div>
  );
}
