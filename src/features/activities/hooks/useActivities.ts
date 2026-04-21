'use client';

import { useQuery } from '@tanstack/react-query';
import { activitiesApi, type ListActivitiesParams } from '../api/activities.api';

export const useActivities = (params: ListActivitiesParams = {}) =>
  useQuery({
    queryKey: ['activities', params],
    queryFn: () => activitiesApi.list(params),
  });

export const useActivity = (id: string | undefined) =>
  useQuery({
    queryKey: ['activity', id],
    queryFn: () => activitiesApi.getById(id!),
    enabled: !!id,
  });
