import { apiClient } from '@/lib/api-client';
import type { Paginated, Place } from '@/types/api';

export const placesApi = {
  list: (params: { page?: number; pageSize?: number; city?: string; search?: string } = {}) =>
    apiClient.get<Paginated<Place>>('/places', { params }).then((r) => r.data),
  getById: (id: string) =>
    apiClient.get<{ place: Place }>(`/places/${id}`).then((r) => r.data.place),
};
