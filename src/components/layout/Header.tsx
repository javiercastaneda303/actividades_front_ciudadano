'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Dropdown, Layout, Menu, Space, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/auth.store';
import { t } from '@/lib/i18n';
import { MAX_WIDTH } from './AppShell';

const { Header: AntHeader } = Layout;

const navItems = [
  { key: '/', href: '/', label: t.nav.home },
  { key: '/calendario', href: '/calendario', label: t.nav.calendar },
  { key: '/actividades', href: '/actividades', label: t.nav.activities },
  { key: '/eventos', href: '/eventos', label: t.nav.events },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, clear } = useAuthStore();

  const selectedKey =
    navItems.find((i) => (i.href === '/' ? pathname === '/' : pathname.startsWith(i.href)))?.key ??
    '';

  return (
    <AntHeader
      style={{
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: 0,
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <div
        style={{
          maxWidth: MAX_WIDTH,
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          gap: 16,
        }}
      >
        <Link href="/" style={{ marginRight: 16 }}>
          <Typography.Text strong style={{ color: '#16a34a', fontSize: 18 }}>
            Fiestas
          </Typography.Text>
        </Link>

        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey]}
          style={{ flex: 1, borderBottom: 'none', background: 'transparent', minWidth: 0 }}
          items={navItems.map((i) => ({ key: i.key, label: <Link href={i.href}>{i.label}</Link> }))}
        />

        <Space>
          {isAuthenticated ? (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'account',
                    label: <Link href="/cuenta">{t.nav.account}</Link>,
                  },
                  {
                    key: 'subs',
                    label: <Link href="/cuenta/suscripciones">{t.nav.subscriptions}</Link>,
                  },
                  { type: 'divider' },
                  {
                    key: 'logout',
                    label: t.nav.logout,
                    onClick: () => {
                      clear();
                      router.replace('/');
                    },
                  },
                ],
              }}
            >
              <Button type="text" icon={<UserOutlined />}>
                {user?.name ?? user?.email}
              </Button>
            </Dropdown>
          ) : (
            <>
              <Link href="/login">
                <Button type="text">{t.nav.login}</Button>
              </Link>
              <Link href="/registro">
                <Button type="primary">{t.nav.register}</Button>
              </Link>
            </>
          )}
        </Space>
      </div>
    </AntHeader>
  );
}
