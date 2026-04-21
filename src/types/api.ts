export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'CITIZEN';
export type NotificationChannel = 'EMAIL' | 'WHATSAPP';
export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  locale: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  color: string | null;
  icon: string | null;
}

export interface Event {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  startsAt: string;
  endsAt: string;
  coverImage: string | null;
  color: string | null;
  activities?: Activity[];
}

export interface Activity {
  id: string;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string;
  placeId: string;
  categoryId: string;
  eventId: string | null;
  place: Place;
  category: Category;
  event: Event | null;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  categoryId: string;
  channels: NotificationChannel[];
  category: Category;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  activityId: string | null;
  channel: NotificationChannel;
  status: NotificationStatus;
  subject: string;
  body: string;
  error: string | null;
  sentAt: string | null;
  createdAt: string;
  user?: { email: string; name: string | null };
}

export interface Paginated<T> {
  items: T[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
}

export interface ApiErrorResponse {
  error: { code: string; message: string; details?: unknown };
}
