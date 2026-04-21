'use client';

import Link from 'next/link';
import { use } from 'react';
import { Button, Card, Descriptions, Empty, Space, Spin, Tag, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useActivity } from '@/features/activities/hooks/useActivities';
import { formatDate } from '@/lib/i18n';

const { Title, Paragraph } = Typography;

export default function ActivityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: activity, isLoading, isError } = useActivity(id);

  if (isLoading) return <Spin />;
  if (isError || !activity) return <Empty description="Actividad no encontrada" />;

  return (
    <article style={{ maxWidth: 720, margin: '0 auto' }}>
      <Link href="/actividades">
        <Button type="link" icon={<ArrowLeftOutlined />} style={{ paddingLeft: 0 }}>
          Volver a actividades
        </Button>
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginTop: 8 }}>
        <Title level={2} style={{ marginTop: 0 }}>
          {activity.title}
        </Title>
        <Tag color={activity.category.color ?? undefined}>{activity.category.name}</Tag>
      </div>

      {activity.event && (
        <Paragraph type="secondary">
          Parte de:{' '}
          <Link href={`/eventos/${activity.event.slug}`} style={{ color: '#16a34a' }}>
            {activity.event.name}
          </Link>
        </Paragraph>
      )}

      <Card>
        <Descriptions column={1}>
          <Descriptions.Item label="Lugar">
            {activity.place.name}
            <div style={{ color: '#888', fontSize: 12 }}>{activity.place.address}</div>
          </Descriptions.Item>
          <Descriptions.Item label="Inicio">{formatDate(activity.startsAt)}</Descriptions.Item>
          <Descriptions.Item label="Fin">{formatDate(activity.endsAt)}</Descriptions.Item>
        </Descriptions>
      </Card>

      {activity.description && (
        <Paragraph style={{ marginTop: 16 }}>{activity.description}</Paragraph>
      )}

      <Space style={{ marginTop: 16 }}>
        <a
          href={`https://www.openstreetmap.org/?mlat=${activity.place.latitude}&mlon=${activity.place.longitude}#map=17/${activity.place.latitude}/${activity.place.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button>Abrir en OpenStreetMap ↗</Button>
        </a>
      </Space>
    </article>
  );
}
