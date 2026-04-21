'use client';

import { Space, Tag } from 'antd';
import { useCategories } from '@/features/categories/hooks/useCategories';

interface Props {
  value: string | null;
  onChange: (id: string | null) => void;
}

export function CategoryFilter({ value, onChange }: Props) {
  const { data: categories } = useCategories();

  return (
    <Space wrap>
      <Tag.CheckableTag checked={!value} onChange={() => onChange(null)}>
        Todas
      </Tag.CheckableTag>
      {categories?.map((c) => {
        const active = value === c.id;
        return (
          <Tag.CheckableTag
            key={c.id}
            checked={active}
            onChange={() => onChange(active ? null : c.id)}
            style={active && c.color ? { backgroundColor: c.color, borderColor: c.color } : undefined}
          >
            {c.name}
          </Tag.CheckableTag>
        );
      })}
    </Space>
  );
}
