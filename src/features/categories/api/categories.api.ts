import { apiClient } from '@/lib/api-client';
import type { Category } from '@/types/api';

export const categoriesApi = {
  list: (search?: string) =>
    apiClient
      .get<{ items: Category[] }>('/categories', { params: { search } })
      .then((r) => r.data.items),
};
