'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { mockSalesOrders } from '@/lib/mockData';

export default function ViewSalesOrderPage() {
  const params = useParams();
  const router = useRouter();
  const order = mockSalesOrders.find(so => so.id === params.id) || mockSalesOrders[0];

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
          <Descriptions.Item label="Customer">{order.customerName}</Descriptions.Item>
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
