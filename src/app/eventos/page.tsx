'use client';

import Link from 'next/link';
import { Card, Col, Empty, Row, Spin, Typography } from 'antd';
import { useEvents } from '@/features/events/hooks/useEvents';
import { formatDateShort } from '@/lib/i18n';

const { Title, Paragraph } = Typography;

export default function EventosPage() {
  const { data, isLoading } = useEvents(true);

  return (
    <div>
      <Title level={2}>Eventos</Title>
      {isLoading ? (
        <Spin />
      ) : data && data.items.length > 0 ? (
        <Row gutter={[16, 16]}>
          {data.items.map((e) => (
            <Col key={e.id} xs={24} sm={12}>
              <Link href={`/eventos/${e.slug}`}>
                <Card hoverable>
                  <Title level={4} style={{ marginTop: 0 }}>
                    {e.name}
                  </Title>
                  <Paragraph type="secondary" style={{ marginBottom: 8 }}>
                    {formatDateShort(e.startsAt)} → {formatDateShort(e.endsAt)}
                  </Paragraph>
                  {e.description && (
                    <Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 0 }}>
                      {e.description}
                    </Paragraph>
                  )}
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="No hay eventos próximos" />
      )}
    </div>
  );
}
