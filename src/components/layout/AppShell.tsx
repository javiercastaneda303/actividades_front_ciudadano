'use client';

import type { ReactNode } from 'react';
import { Layout } from 'antd';
import { Header } from './Header';
import { Footer } from './Footer';

const { Content } = Layout;

// Ancho máximo estilo Tailwind: max-w-7xl = 80rem = 1280px
export const MAX_WIDTH = 1280;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Header />
      <Content style={{ padding: '24px 16px', width: '100%' }}>
        <div style={{ maxWidth: MAX_WIDTH, margin: '0 auto', width: '100%' }}>{children}</div>
      </Content>
      <Footer />
    </Layout>
  );
}
