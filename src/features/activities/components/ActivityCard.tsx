'use client';

import Link from 'next/link';
import { Card, Tag, Typography } from 'antd';
import type { Activity } from '@/types/api';
import { formatDateShort } from '@/lib/i18n';

const { Title, Text, Paragraph } = Typography;

export function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <Link href={`/actividades/${activity.id}`} style={{ display: 'block', height: '100%' }}>
      <Card hoverable style={{ height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
          <Title level={5} style={{ margin: 0, flex: 1 }}>
            {activity.title}
          </Title>
          <Tag color={activity.category.color ?? undefined} style={{ margin: 0, flexShrink: 0 }}>
            {activity.category.name}
          </Tag>
        </div>
        {activity.event && (
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
            {activity.event.name}
          </Text>
        )}
        <Text strong style={{ display: 'block' }}>
          {activity.place.name}
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {activity.place.address}
        </Text>
        <div style={{ marginTop: 6 }}>
          <Text>{formatDateShort(activity.startsAt)}</Text>
        </div>
        {activity.description && (
          <Paragraph
            type="secondary"
            ellipsis={{ rows: 2 }}
            style={{ marginTop: 8, marginBottom: 0, fontSize: 13 }}
          >
            {activity.description}
          </Paragraph>
        )}
      </Card>
    </Link>
  );
}
