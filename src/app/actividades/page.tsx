'use client';

import { useMemo, useState } from 'react';
import { Col, Empty, Input, Row, Space, Spin, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import { useActivities } from '@/features/activities/hooks/useActivities';
import { ActivityCard } from '@/features/activities/components/ActivityCard';
import { CategoryFilter } from '@/features/activities/components/CategoryFilter';
import { DateRangeFilter, defaultRange } from '@/features/activities/components/DateRangeFilter';
import { PlaceFilter } from '@/features/activities/components/PlaceFilter';
import type { Place } from '@/types/api';

const { Title, Paragraph } = Typography;

export default function ActivitiesPage() {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [range, setRange] = useState<[Dayjs, Dayjs]>(() => defaultRange());
  const { data, isLoading } = useActivities({
    pageSize: 50,
    from: range[0].toISOString(),
    to: range[1].toISOString(),
    ...(categoryId && { categoryId }),
    ...(search.trim() && { search: search.trim() }),
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
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2} style={{ marginBottom: 4 }}>
          Actividades
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Próximas actividades en La Frontera (El Hierro).
        </Paragraph>
      </div>

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Input.Search
          placeholder="Buscar por título o descripción…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ maxWidth: 480 }}
        />
        <Space wrap>
          <DateRangeFilter value={range} onChange={setRange} />
          <PlaceFilter places={availablePlaces} value={placeId} onChange={setPlaceId} />
          <CategoryFilter value={categoryId} onChange={setCategoryId} />
        </Space>
      </Space>

      {isLoading ? (
        <Spin />
      ) : visible.length > 0 ? (
        <Row gutter={[16, 16]}>
          {visible.map((a) => (
            <Col key={a.id} xs={24} sm={12} lg={8}>
              <ActivityCard activity={a} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="No se han encontrado actividades" />
      )}
    </Space>
  );
}
