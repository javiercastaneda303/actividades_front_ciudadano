'use client';

import { useQuery } from '@tanstack/react-query';
import { placesApi } from '../api/places.api';

export const usePlaces = () =>
  useQuery({
    queryKey: ['places'],
    queryFn: () => placesApi.list({ pageSize: 100 }),
  });
