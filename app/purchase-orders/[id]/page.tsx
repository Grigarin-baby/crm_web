'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Tag, Spin, Result, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { api } from '@/lib/api';
import dayjs from 'dayjs';

export default function ViewPurchaseOrderPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/purchase-orders/${params.id}`);
        setOrder(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching purchase order:', err);
        setError(err.message || 'Failed to fetch purchase order details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" tip="Loading purchase order..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <Result
        status="error"
        title="Failed to Load Purchase Order"
        subTitle={error || 'Purchase order not found'}
        extra={[
          <Button type="primary" key="back" onClick={() => router.push('/purchase-orders')}>
            Back to Purchase Orders
          </Button>
        ]}
      />
    );
  }

  return (
    <div>
      <ModuleHeader
        title={order.poNumber}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Purchase Orders', href: '/purchase-orders' },
          { title: 'Details' },
        ]}
        backAction
        primaryAction={{
          label: 'Edit PO',
          onClick: () => router.push(`/purchase-orders/${order.id}/edit`),
          icon: <EditOutlined />,
        }}
      />

      <Card bordered={false}>
        <Descriptions title="PO Information" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="PO Number">{order.poNumber}</Descriptions.Item>
          <Descriptions.Item label="Vendor">{order.vendor?.name || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Total Amount">${(order.totalAmount || 0).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={order.status === 'RECEIVED' ? 'green' : 'blue'}>{order.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Expected Date">
            {order.expectedDate ? dayjs(order.expectedDate).format('YYYY-MM-DD') : 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
