import { Layout, Typography } from 'antd';

export function Footer() {
  return (
    <Layout.Footer style={{ textAlign: 'center', background: '#fafafa' }}>
      <Typography.Text type="secondary">
        © {new Date().getFullYear()} Actividades · La Frontera (El Hierro)
      </Typography.Text>
    </Layout.Footer>
  );
}
