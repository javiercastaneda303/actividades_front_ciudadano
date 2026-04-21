'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, List, Spin, Tag, Typography } from 'antd';
import { useAuthStore } from '@/store/auth.store';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { useCategories } from '@/features/categories/hooks/useCategories';
import {
  useSubscribe,
  useSubscriptions,
  useUnsubscribe,
} from '@/features/subscriptions/hooks/useSubscriptions';

const { Title, Paragraph } = Typography;

export default function SuscripcionesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const hydrated = useAuthHydrated();
  const { data: categories } = useCategories();
  const { data: subs } = useSubscriptions();
  const subscribe = useSubscribe();
  const unsubscribe = useUnsubscribe();

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) router.replace('/login');
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) return <Spin />;

  const subscribedIds = new Set((subs ?? []).map((s) => s.categoryId));

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <Title level={2}>Mis suscripciones</Title>
      <Paragraph type="secondary">
        Recibirás un email cuando se publique una nueva actividad de las categorías suscritas.
      </Paragraph>

      <List
        bordered
        dataSource={categories ?? []}
        renderItem={(c) => {
          const isSubscribed = subscribedIds.has(c.id);
          return (
            <List.Item
              actions={[
                <Button
                  key="toggle"
                  type={isSubscribed ? 'default' : 'primary'}
                  size="small"
                  loading={subscribe.isPending || unsubscribe.isPending}
                  onClick={() =>
                    isSubscribed
                      ? unsubscribe.mutate(c.id)
                      : subscribe.mutate({ categoryId: c.id, channels: ['EMAIL'] })
                  }
                >
                  {isSubscribed ? 'Suscrito · quitar' : 'Suscribirme'}
                </Button>,
              ]}
            >
              <Tag color={c.color ?? undefined} style={{ marginRight: 8 }}>
                {c.name}
              </Tag>
            </List.Item>
          );
        }}
      />
    </div>
  );
}
