'use client';

import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../api/categories.api';

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list(),
    staleTime: 5 * 60_000,
  });
