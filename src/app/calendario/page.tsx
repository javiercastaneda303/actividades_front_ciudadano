'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Calendar,
  Card,
  Col,
  Row,
  Segmented,
  Space,
  Tag,
  Typography,
} from 'antd';
import type { CalendarProps } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useActivities } from '@/features/activities/hooks/useActivities';
import { CategoryFilter } from '@/features/activities/components/CategoryFilter';
import { DateRangeFilter, defaultRange } from '@/features/activities/components/DateRangeFilter';
import { PlaceFilter } from '@/features/activities/components/PlaceFilter';
import { UpcomingActivities } from '@/features/activities/components/UpcomingActivities';
import { WeekView } from '@/features/activities/components/WeekView';
import type { Activity, Place } from '@/types/api';

const { Title, Text } = Typography;

type View = 'week' | 'month' | 'year';

export default function CalendarioPage() {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [view, setView] = useState<View>('month');
  const [cursor, setCursor] = useState<Dayjs>(() => dayjs());

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

  const byDay = useMemo(() => {
    const m = new Map<string, Activity[]>();
    for (const a of visible) {
      const key = dayjs(a.startsAt).format('YYYY-MM-DD');
      const arr = m.get(key) ?? [];
      arr.push(a);
      m.set(key, arr);
    }
    return m;
  }, [visible]);

  const countByMonth = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of visible) {
      const key = dayjs(a.startsAt).format('YYYY-MM');
      m.set(key, (m.get(key) ?? 0) + 1);
    }
    return m;
  }, [visible]);

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') {
      const key = (current as Dayjs).format('YYYY-MM-DD');
      const items = byDay.get(key) ?? [];
      if (items.length === 0) return null;
      return (
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {items.slice(0, 3).map((a) => (
            <li key={a.id}>
              <Link href={`/actividades/${a.id}`}>
                <Tag
                  color={a.category.color ?? undefined}
                  style={{
                    width: '100%',
                    margin: 0,
                    fontSize: 11,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    cursor: 'pointer',
                  }}
                  title={a.title}
                >
                  {dayjs(a.startsAt).format('HH:mm')} · {a.title}
                </Tag>
              </Link>
            </li>
          ))}
          {items.length > 3 && (
            <li>
              <Text type="secondary" style={{ fontSize: 11 }}>
                + {items.length - 3} más
              </Text>
            </li>
          )}
        </ul>
      );
    }
    if (info.type === 'month') {
      const key = (current as Dayjs).format('YYYY-MM');
      const count = countByMonth.get(key) ?? 0;
      if (count === 0) return info.originNode;
      return (
        <div style={{ padding: 8, textAlign: 'center' }}>
          <div style={{ color: '#16a34a', fontWeight: 600, fontSize: 16 }}>{count}</div>
          <Text type="secondary" style={{ fontSize: 11 }}>
            actividades
          </Text>
        </div>
      );
    }
    return info.originNode;
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={16}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <Title level={2} style={{ margin: 0 }}>
              Calendario
            </Title>
            <Segmented<View>
              value={view}
              onChange={setView}
              options={[
                { label: 'Semana', value: 'week' },
                { label: 'Mes', value: 'month' },
                { label: 'Año', value: 'year' },
              ]}
            />
          </div>

          <Space wrap>
            <DateRangeFilter value={range} onChange={setRange} />
            <PlaceFilter places={availablePlaces} value={placeId} onChange={setPlaceId} />
            <CategoryFilter value={categoryId} onChange={setCategoryId} />
          </Space>

          {view === 'week' ? (
            <Card styles={{ body: { padding: 12 } }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Text strong>
                  Semana del {cursor.startOf('week').add(1, 'day').format('DD MMM')}
                </Text>
                <Space>
                  <a onClick={() => setCursor(cursor.subtract(1, 'week'))}>← Anterior</a>
                  <a onClick={() => setCursor(dayjs())}>Hoy</a>
                  <a onClick={() => setCursor(cursor.add(1, 'week'))}>Siguiente →</a>
                </Space>
              </div>
              <WeekView date={cursor} activitiesByDay={byDay} />
            </Card>
          ) : (
            <Card styles={{ body: { padding: 16 } }}>
              <Calendar
                mode={view}
                value={cursor}
                onPanelChange={(d) => setCursor(d)}
                onSelect={(d, selectInfo) => {
                  setCursor(d);
                  if (selectInfo?.source === 'date' && view === 'year') {
                    setView('month');
                  }
                }}
                cellRender={cellRender}
              />
            </Card>
          )}
        </Space>
      </Col>
      <Col xs={24} lg={8}>
        <UpcomingActivities
          limit={10}
          title="Próximas"
          categoryId={categoryId ?? undefined}
          placeId={placeId ?? undefined}
          stickyTop={88}
        />
      </Col>
    </Row>
  );
}
