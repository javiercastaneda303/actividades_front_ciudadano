'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';
import type { Activity } from '@/types/api';
import { cn } from '@/lib/utils';

interface Props {
  activities: Activity[];
}

export function ActivityCalendar({ activities }: Props) {
  const [cursor, setCursor] = useState<Date>(() => new Date());

  const days = useMemo(() => {
    const monthStart = startOfMonth(cursor);
    const monthEnd = endOfMonth(cursor);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const list: Date[] = [];
    for (let d = gridStart; d <= gridEnd; d = new Date(d.getTime() + 86_400_000)) {
      list.push(new Date(d));
    }
    return list;
  }, [cursor]);

  const activitiesByDay = useMemo(() => {
    const map = new Map<string, Activity[]>();
    for (const a of activities) {
      const key = format(new Date(a.startsAt), 'yyyy-MM-dd');
      const arr = map.get(key) ?? [];
      arr.push(a);
      map.set(key, arr);
    }
    return map;
  }, [activities]);

  const weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="rounded-lg border border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
        <h2 className="text-lg font-semibold capitalize">
          {format(cursor, 'MMMM yyyy', { locale: es })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCursor(subMonths(cursor, 1))}
            className="rounded-md border border-neutral-300 px-3 py-1 text-sm hover:border-brand"
          >
            ←
          </button>
          <button
            onClick={() => setCursor(new Date())}
            className="rounded-md border border-neutral-300 px-3 py-1 text-sm hover:border-brand"
          >
            Hoy
          </button>
          <button
            onClick={() => setCursor(addMonths(cursor, 1))}
            className="rounded-md border border-neutral-300 px-3 py-1 text-sm hover:border-brand"
          >
            →
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px border-b border-neutral-200 bg-neutral-100 text-xs font-medium text-neutral-500">
        {weekdays.map((d) => (
          <div key={d} className="bg-white px-2 py-2 text-center">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-neutral-100">
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd');
          const items = activitiesByDay.get(key) ?? [];
          const inMonth = isSameMonth(day, cursor);
          const today = isSameDay(day, new Date());
          return (
            <div
              key={key}
              className={cn(
                'min-h-[90px] bg-white p-1.5 text-xs',
                !inMonth && 'bg-neutral-50 text-neutral-400',
              )}
            >
              <div
                className={cn(
                  'mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px]',
                  today && 'bg-brand text-brand-foreground font-semibold',
                )}
              >
                {format(day, 'd')}
              </div>
              <ul className="space-y-0.5">
                {items.slice(0, 3).map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/actividades/${a.id}`}
                      className="block truncate rounded px-1 py-0.5 hover:bg-neutral-100"
                      style={{ color: a.category.color ?? '#374151' }}
                      title={a.title}
                    >
                      • {a.title}
                    </Link>
                  </li>
                ))}
                {items.length > 3 && (
                  <li className="text-[10px] text-neutral-500">+ {items.length - 3} más</li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
