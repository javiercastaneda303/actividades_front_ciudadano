'use client';

import { Select } from 'antd';
import type { Place } from '@/types/api';

const ALL = '__all__';

interface Props {
  places: Place[];
  value: string | null;
  onChange: (id: string | null) => void;
}

export function PlaceFilter({ places, value, onChange }: Props) {
  return (
    <Select
      showSearch
      optionFilterProp="label"
      value={value ?? ALL}
      onChange={(v) => onChange(v === ALL ? null : v)}
      style={{ minWidth: 220 }}
      options={[
        { value: ALL, label: 'Todos los lugares' },
        ...places.map((p) => ({ value: p.id, label: p.name })),
      ]}
    />
  );
}
