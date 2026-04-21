'use client';

import { Card, Col, Row, Skeleton, Space, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface Props {
  variant?: 'list' | 'detail';
}

export function PageSkeleton({ variant = 'list' }: Props) {
  return (
    <div style={{ position: 'relative', minHeight: 500 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Skeleton.Input active size="large" style={{ width: 260 }} />

        {variant === 'list' && (
          <Row gutter={[16, 16]}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Col key={i} xs={24} sm={12} lg={8}>
                <Card>
                  <Skeleton active paragraph={{ rows: 3 }} />
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {variant === 'detail' && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Card>
              <Skeleton active paragraph={{ rows: 4 }} />
            </Card>
            <Card>
              <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
          </Space>
        )}
      </Space>

      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 48, color: '#16a34a' }} spin />}
        />
      </div>
    </div>
  );
}
