'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { Col, Row, Skeleton, Space, Typography } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import { useActivities } from '@/features/activities/hooks/useActivities';
import { CategoryFilter } from '@/features/activities/components/CategoryFilter';
import { DateRangeFilter, defaultRange } from '@/features/activities/components/DateRangeFilter';
import { PlaceFilter } from '@/features/activities/components/PlaceFilter';
import { UpcomingActivities } from '@/features/activities/components/UpcomingActivities';
import type { Place } from '@/types/api';

const { Title, Paragraph } = Typography;

const ActivitiesMap = dynamic(
  () => import('@/features/activities/components/ActivitiesMap'),
  {
    ssr: false,
    loading: () => (
      <Skeleton.Node active style={{ width: '100%', height: '70vh', borderRadius: 8 }} />
    ),
  },
);

export default function HomePage() {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [range, setRange] = useState<[Dayjs, Dayjs]>(() => defaultRange());
  const { data } = useActivities({
    pageSize: 100,
    from: range[0].toISOString(),
    to: range[1].toISOString(),
    ...(categoryId && { categoryId }),
  });

  const items = data?.items ?? [];
  const availablePlaces = useMemo(() => {
    const m = new Map<string, Place>();
    for (const a of items) m.set(a.placeId, a.place);
    return Array.from(m.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);
  const visible = useMemo(
    () => (placeId ? items.filter((a) => a.placeId === placeId) : items),
    [items, placeId],
  );

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <div>
        <Title level={2} style={{ marginBottom: 4 }}>
          <AimOutlined style={{ marginRight: 8, color: '#16a34a' }} />
          Eventos en La Frontera
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Qué pasa hoy en el municipio de La Frontera (El Hierro). El mapa se centra en el
          valle de El Golfo.
        </Paragraph>
      </div>

      <Space wrap>
        <DateRangeFilter value={range} onChange={setRange} />
        <PlaceFilter places={availablePlaces} value={placeId} onChange={setPlaceId} />
        <CategoryFilter value={categoryId} onChange={setCategoryId} />
      </Space>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <ActivitiesMap activities={visible} height="70vh" />
        </Col>
        <Col xs={24} lg={8}>
          <UpcomingActivities
            limit={10}
            title="Próximas · por fecha"
            stickyTop={88}
            categoryId={categoryId ?? undefined}
            placeId={placeId ?? undefined}
          />
        </Col>
      </Row>
    </Space>
  );
}
