'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { mockCustomers } from '@/lib/mockData';

export default function ViewCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const customer = mockCustomers.find(c => c.id === params.id) || mockCustomers[0];

  return (
    <div>
      <ModuleHeader
        title={customer.name}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Customers', href: '/customers' },
          { title: 'Details' },
        ]}
        backAction
        primaryAction={{
          label: 'Edit Customer',
          onClick: () => router.push(`/customers/${customer.id}/edit`),
          icon: <EditOutlined />,
        }}
      />

      <Card bordered={false}>
        <Descriptions title="Customer Information" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Name">{customer.name}</Descriptions.Item>
          <Descriptions.Item label="Industry">{customer.industry}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={customer.status === 'ACTIVE' ? 'green' : 'orange'}>{customer.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Address" span={2}>{customer.address}</Descriptions.Item>
          <Descriptions.Item label="Created At">{customer.createdAt}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
