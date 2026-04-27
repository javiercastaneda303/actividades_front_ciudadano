'use client';

import { DatePicker } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

export const MAX_RANGE_DAYS = 60;

// Por defecto: del 1 al 30 de abril del anyo en curso.
export const defaultRange = (): [Dayjs, Dayjs] => {
  const year = dayjs().year();
  return [
    dayjs(`${year}-04-01`).startOf('day'),
    dayjs(`${year}-04-30`).endOf('day'),
  ];
};

interface Props {
  value: [Dayjs, Dayjs];
  onChange: (range: [Dayjs, Dayjs]) => void;
}

export function DateRangeFilter({ value, onChange }: Props) {
  return (
    <RangePicker
      value={value}
      allowClear={false}
      format="DD/MM/YYYY"
      disabledDate={(current, info) => {
        if (info?.from) {
          return Math.abs(current.diff(info.from, 'day')) > MAX_RANGE_DAYS;
        }
        return false;
      }}
      onChange={(dates) => {
        if (dates?.[0] && dates[1]) {
          const diff = Math.abs(dates[1].diff(dates[0], 'day'));
          if (diff <= MAX_RANGE_DAYS) {
            onChange([dates[0].startOf('day'), dates[1].endOf('day')]);
          }
        }
      }}
    />
  );
}
