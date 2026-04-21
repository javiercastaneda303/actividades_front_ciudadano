'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { useState } from 'react';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { ApiError } from '@/lib/api-client';

const { Title, Text } = Typography;

interface Values {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (v: Values) => {
    setError(null);
    try {
      await login.mutateAsync(v);
      router.push('/cuenta');
    } catch (err) {
      setError((err instanceof ApiError ? err : ApiError.from(err)).message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <Card>
        <Title level={3} style={{ marginTop: 0 }}>
          Iniciar sesión
        </Title>
        <Form<Values> layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Requerido' },
              { type: 'email', message: 'Email no válido' },
            ]}
          >
            <Input type="email" autoComplete="email" />
          </Form.Item>
          <Form.Item
            label="Contraseña"
            name="password"
            rules={[
              { required: true, message: 'Requerido' },
              { min: 8, message: 'Mínimo 8 caracteres' },
            ]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
          <Button type="primary" htmlType="submit" block loading={login.isPending}>
            Entrar
          </Button>
        </Form>
        <Text type="secondary" style={{ marginTop: 16, display: 'block' }}>
          ¿No tienes cuenta?{' '}
          <Link href="/registro" style={{ color: '#16a34a' }}>
            Crea una
          </Link>
        </Text>
      </Card>
    </div>
  );
}
