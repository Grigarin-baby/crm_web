'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Tag, Spin, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { api } from '@/lib/api';

export default function ViewSalesOrderPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await api.get(`/modules/sales-orders/${params.id}`);
        setOrder(data);
      } catch (error: any) {
        message.error(error.message || 'Failed to fetch sales order details');
        router.push('/sales-orders');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" description="Loading order details..." />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div>
      <ModuleHeader
        title={order.orderNumber}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Sales Orders', href: '/sales-orders' },
          { title: 'Details' },
        ]}
        backAction
        primaryAction={{
          label: 'Edit Order',
          onClick: () => router.push(`/sales-orders/${order.id}/edit`),
          icon: <EditOutlined />,
        }}
      />

      <Card bordered={false}>
        <Descriptions title="Order Information" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Order Number">{order.orderNumber}</Descriptions.Item>
          <Descriptions.Item label="Customer">{order.customer?.name || order.customerName}</Descriptions.Item>
          <Descriptions.Item label="Order Status">
            <Tag color={order.orderStatus === 'CONFIRMED' ? 'green' : 'blue'}>{order.orderStatus}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Payment Status">
            <Tag color={order.paymentStatus === 'PAID' ? 'green' : 'orange'}>{order.paymentStatus}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
