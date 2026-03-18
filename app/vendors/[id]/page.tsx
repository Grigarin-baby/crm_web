'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { mockVendors } from '@/lib/mockData';

export default function ViewVendorPage() {
  const params = useParams();
  const router = useRouter();
  const vendor = mockVendors.find(v => v.id === params.id) || mockVendors[0];

  return (
    <div>
      <ModuleHeader
        title={vendor.name}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Vendors', href: '/vendors' },
          { title: 'Details' },
        ]}
        backAction
        primaryAction={{
          label: 'Edit Vendor',
          onClick: () => router.push(`/vendors/${vendor.id}/edit`),
          icon: <EditOutlined />,
        }}
      />

      <Card bordered={false}>
        <Descriptions title="Vendor Information" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Vendor Name">{vendor.name}</Descriptions.Item>
          <Descriptions.Item label="Contact Person">{vendor.contactPerson}</Descriptions.Item>
          <Descriptions.Item label="Email">{vendor.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{vendor.phone}</Descriptions.Item>
          <Descriptions.Item label="Category">{vendor.category}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
