import { apiClient } from '@/lib/api-client';
import type { NotificationChannel, Subscription } from '@/types/api';

export interface SubscribeInput {
  categoryId: string;
  channels: NotificationChannel[];
}

export const subscriptionsApi = {
  list: () =>
    apiClient.get<{ items: Subscription[] }>('/subscriptions').then((r) => r.data.items),
  subscribe: (input: SubscribeInput) =>
    apiClient
      .post<{ subscription: Subscription }>('/subscriptions', input)
      .then((r) => r.data.subscription),
  update: (categoryId: string, channels: NotificationChannel[]) =>
    apiClient
      .patch<{ subscription: Subscription }>(`/subscriptions/${categoryId}`, { channels })
      .then((r) => r.data.subscription),
  unsubscribe: (categoryId: string) =>
    apiClient.delete(`/subscriptions/${categoryId}`),
};
