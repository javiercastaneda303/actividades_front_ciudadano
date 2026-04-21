'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { useState } from 'react';
import { useRegister } from '@/features/auth/hooks/useLogin';
import { ApiError } from '@/lib/api-client';

const { Title, Text } = Typography;

interface Values {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const reg = useRegister();
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (v: Values) => {
    setError(null);
    try {
      await reg.mutateAsync(v);
      router.push('/cuenta/suscripciones');
    } catch (err) {
      setError((err instanceof ApiError ? err : ApiError.from(err)).message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <Card>
        <Title level={3} style={{ marginTop: 0 }}>
          Crear cuenta
        </Title>
        <Form<Values> layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item label="Nombre" name="name" rules={[{ required: true, message: 'Requerido' }]}>
            <Input autoComplete="name" />
          </Form.Item>
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
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
          <Button type="primary" htmlType="submit" block loading={reg.isPending}>
            Crear cuenta
          </Button>
        </Form>
        <Text type="secondary" style={{ marginTop: 16, display: 'block' }}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" style={{ color: '#16a34a' }}>
            Inicia sesión
          </Link>
        </Text>
      </Card>
    </div>
  );
}
