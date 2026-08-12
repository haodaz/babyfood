import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '宝宝辅食记录',
  description: '简单好用的宝宝辅食追踪工具',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '辅食记录',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <main style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', position: 'relative' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
