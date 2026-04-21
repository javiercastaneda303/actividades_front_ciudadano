'use client';

import Link from 'next/link';
import { Card, Tag, Typography } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import type { Activity } from '@/types/api';

const { Text, Title } = Typography;

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const startOfWeekMonday = (d: Dayjs): Dayjs => {
  const dow = d.day();
  const diff = dow === 0 ? -6 : 1 - dow;
  return d.add(diff, 'day').startOf('day');
};

interface Props {
  date: Dayjs;
  activitiesByDay: Map<string, Activity[]>;
}

export function WeekView({ date, activitiesByDay }: Props) {
  const start = startOfWeekMonday(date);
  const days = Array.from({ length: 7 }, (_, i) => start.add(i, 'day'));
  const today = dayjs();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
      {days.map((day, i) => {
        const key = day.format('YYYY-MM-DD');
        const items = activitiesByDay.get(key) ?? [];
        const isToday = day.isSame(today, 'day');
        return (
          <Card
            key={key}
            size="small"
            styles={{ body: { padding: 8 } }}
            style={{
              borderColor: isToday ? '#16a34a' : undefined,
              borderWidth: isToday ? 2 : 1,
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid #f0f0f0' }}>
              <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase' }}>
                {WEEKDAYS[i]}
              </Text>
              <Title level={4} style={{ margin: 0, color: isToday ? '#16a34a' : undefined }}>
                {day.format('D')}
              </Title>
            </div>
            {items.length === 0 ? (
              <Text type="secondary" style={{ fontSize: 11 }}>
                —
              </Text>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {items.map((a) => (
                  <Link key={a.id} href={`/actividades/${a.id}`}>
                    <div
                      style={{
                        background: a.category.color ?? '#16a34a',
                        color: '#fff',
                        padding: '4px 6px',
                        borderRadius: 4,
                        fontSize: 11,
                        cursor: 'pointer',
                      }}
                      title={a.title}
                    >
                      <div style={{ opacity: 0.9 }}>{dayjs(a.startsAt).format('HH:mm')}</div>
                      <div
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontWeight: 500,
                        }}
                      >
                        {a.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// Para usar fuera si se quiere reexportar
export { Tag as _Tag };
