import { es } from 'date-fns/locale';
import type { Locale } from 'date-fns';

export type LocaleCode = 'es-ES';

interface LocaleDef {
  code: LocaleCode;
  dateFnsLocale: Locale;
  intlLocale: string;
  timeZone: string;
}

export const locales: Record<LocaleCode, LocaleDef> = {
  'es-ES': { code: 'es-ES', dateFnsLocale: es, intlLocale: 'es-ES', timeZone: 'Europe/Madrid' },
};

export const defaultLocale: LocaleCode = 'es-ES';

export const getLocale = (code?: string): LocaleDef =>
  locales[(code as LocaleCode) in locales ? (code as LocaleCode) : defaultLocale];

export const formatDate = (date: Date | string, opts: Intl.DateTimeFormatOptions = {}): string => {
  const l = getLocale();
  return new Intl.DateTimeFormat(l.intlLocale, {
    timeZone: l.timeZone,
    dateStyle: 'long',
    timeStyle: 'short',
    ...opts,
  }).format(typeof date === 'string' ? new Date(date) : date);
};

export const formatDateShort = (date: Date | string): string =>
  formatDate(date, { dateStyle: 'medium', timeStyle: 'short' });

export const formatTime = (date: Date | string): string =>
  formatDate(date, { dateStyle: undefined, timeStyle: 'short' });

export const t = {
  nav: {
    home: 'Inicio',
    calendar: 'Calendario',
    activities: 'Actividades',
    events: 'Eventos',
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    register: 'Registrarse',
    account: 'Mi cuenta',
    subscriptions: 'Suscripciones',
  },
  common: {
    loading: 'Cargando…',
    error: 'Ha ocurrido un error',
    retry: 'Reintentar',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    search: 'Buscar',
    filterBy: 'Filtrar por',
    allCategories: 'Todas las categorías',
    when: 'Cuándo',
    where: 'Dónde',
    category: 'Categoría',
    event: 'Evento',
    noResults: 'No se han encontrado resultados',
  },
  auth: {
    emailLabel: 'Email',
    passwordLabel: 'Contraseña',
    nameLabel: 'Nombre',
    loginTitle: 'Iniciar sesión',
    registerTitle: 'Crear cuenta',
    submitLogin: 'Entrar',
    submitRegister: 'Crear cuenta',
    invalidCredentials: 'Email o contraseña incorrectos',
  },
};
