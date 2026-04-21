'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Descriptions, Spin, Tag, Typography } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/auth.store';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';

const { Title } = Typography;

export default function CuentaPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const hydrated = useAuthHydrated();

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) router.replace('/login');
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) return <Spin />;
  if (!user) return null;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <Title level={2}>Mi cuenta</Title>
      <Card>
        <Descriptions column={1}>
          <Descriptions.Item label="Nombre">{user.name ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Rol">
            <Tag>{user.role}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <div style={{ marginTop: 16 }}>
        <Link href="/cuenta/suscripciones">
          <Button type="primary" icon={<BellOutlined />}>
            Gestionar suscripciones
          </Button>
        </Link>
      </div>
    </div>
  );
}
