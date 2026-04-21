'use client';

import Link from 'next/link';
import { Card, Empty, List, Skeleton, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useActivities } from '@/features/activities/hooks/useActivities';

const { Title, Text } = Typography;

interface Props {
  title?: string;
  limit?: number;
  categoryId?: string;
  placeId?: string;
  stickyTop?: number;
}

export function UpcomingActivities({
  title = 'Próximas',
  limit = 10,
  categoryId,
  placeId,
  stickyTop,
}: Props) {
  const { data, isLoading } = useActivities({
    upcoming: true,
    pageSize: limit,
    ...(categoryId && { categoryId }),
    ...(placeId && { placeId }),
  });
  const items = data?.items ?? [];

  const card = (
    <Card
      styles={{ body: { padding: 0 } }}
      style={{ height: '100%' }}
    >
      <div
        style={{
          padding: 16,
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          {title}
        </Title>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {items.length} resultados
        </Text>
      </div>
      {isLoading ? (
        <div style={{ padding: 16 }}>
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      ) : items.length === 0 ? (
        <div style={{ padding: 16 }}>
          <Empty description="Sin próximas actividades" />
        </div>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={items}
          style={{ maxHeight: 'calc(100vh - 240px)', overflowY: 'auto' }}
          renderItem={(a) => (
            <List.Item style={{ padding: 12 }}>
              <Link href={`/actividades/${a.id}`} style={{ display: 'block' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text strong style={{ display: 'block', marginBottom: 2 }} ellipsis={{ tooltip: a.title }}>
                      {a.title}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                      {dayjs(a.startsAt).format('DD MMM · HH:mm')}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block' }} ellipsis>
                      {a.place.name}
                    </Text>
                  </div>
                  <Tag color={a.category.color ?? undefined} style={{ flexShrink: 0, marginInlineEnd: 0 }}>
                    {a.category.name}
                  </Tag>
                </div>
              </Link>
            </List.Item>
          )}
        />
      )}
    </Card>
  );

  if (stickyTop !== undefined) {
    return <div style={{ position: 'sticky', top: stickyTop }}>{card}</div>;
  }
  return card;
}
