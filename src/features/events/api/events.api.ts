import { apiClient } from '@/lib/api-client';
import type { Event, Paginated } from '@/types/api';

export const eventsApi = {
  list: (params: { upcoming?: boolean; page?: number; pageSize?: number } = {}) =>
    apiClient.get<Paginated<Event>>('/events', { params }).then((r) => r.data),
  getBySlug: (slug: string) =>
    apiClient
      .get<{ event: Event }>(`/events/slug/${slug}`)
      .then((r) => r.data.event),
};
