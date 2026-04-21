import { apiClient } from '@/lib/api-client';
import type { Activity, Paginated } from '@/types/api';

export interface ListActivitiesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
  eventId?: string;
  placeId?: string;
  from?: string;
  to?: string;
  upcoming?: boolean;
}

export const activitiesApi = {
  list: (params: ListActivitiesParams = {}) =>
    apiClient.get<Paginated<Activity>>('/activities', { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<{ activity: Activity }>(`/activities/${id}`).then((r) => r.data.activity),
};
