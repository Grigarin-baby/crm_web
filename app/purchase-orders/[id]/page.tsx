'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { mockPurchaseOrders } from '@/lib/mockData';

export default function ViewPurchaseOrderPage() {
  const params = useParams();
  const router = useRouter();
  const order = mockPurchaseOrders.find(po => po.id === params.id) || mockPurchaseOrders[0];

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
          <Descriptions.Item label="Vendor">{order.vendorName}</Descriptions.Item>
          <Descriptions.Item label="Total Amount">${order.totalAmount.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={order.status === 'RECEIVED' ? 'green' : 'blue'}>{order.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Expected Date">{order.expectedDate}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
