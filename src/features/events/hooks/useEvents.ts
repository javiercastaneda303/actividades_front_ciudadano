'use client';

import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '../api/events.api';

export const useEvents = (upcoming = true) =>
  useQuery({
    queryKey: ['events', { upcoming }],
    queryFn: () => eventsApi.list({ upcoming, pageSize: 50 }),
  });

export const useEventBySlug = (slug: string | undefined) =>
  useQuery({
    queryKey: ['event', slug],
    queryFn: () => eventsApi.getBySlug(slug!),
    enabled: !!slug,
  });
