'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionsApi, type SubscribeInput } from '../api/subscriptions.api';
import type { NotificationChannel } from '@/types/api';

export const useSubscriptions = () =>
  useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => subscriptionsApi.list(),
  });

export const useSubscribe = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SubscribeInput) => subscriptionsApi.subscribe(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscriptions'] }),
  });
};

export const useUnsubscribe = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: string) => subscriptionsApi.unsubscribe(categoryId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscriptions'] }),
  });
};

export const useUpdateSubscription = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId, channels }: { categoryId: string; channels: NotificationChannel[] }) =>
      subscriptionsApi.update(categoryId, channels),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscriptions'] }),
  });
};
