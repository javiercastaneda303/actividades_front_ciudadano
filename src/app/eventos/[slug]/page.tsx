'use client';

import Link from 'next/link';
import { use } from 'react';
import { Button, Col, Empty, Row, Space, Spin, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useEventBySlug } from '@/features/events/hooks/useEvents';
import { ActivityCard } from '@/features/activities/components/ActivityCard';
import { formatDate } from '@/lib/i18n';

const { Title, Paragraph } = Typography;

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: event, isLoading, isError } = useEventBySlug(slug);

  if (isLoading) return <Spin />;
  if (isError || !event) return <Empty description="Evento no encontrado" />;

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Link href="/eventos">
        <Button type="link" icon={<ArrowLeftOutlined />} style={{ paddingLeft: 0 }}>
          Volver a eventos
        </Button>
      </Link>
      <header>
        <Title level={2} style={{ marginTop: 0 }}>
          {event.name}
        </Title>
        <Paragraph type="secondary">
          {formatDate(event.startsAt)} → {formatDate(event.endsAt)}
        </Paragraph>
        {event.description && <Paragraph>{event.description}</Paragraph>}
      </header>

      <section>
        <Title level={3}>Actividades</Title>
        {event.activities && event.activities.length > 0 ? (
          <Row gutter={[16, 16]}>
            {event.activities.map((a) => (
              <Col key={a.id} xs={24} sm={12}>
                <ActivityCard activity={a} />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="Aún no hay actividades programadas" />
        )}
      </section>
    </Space>
  );
}
