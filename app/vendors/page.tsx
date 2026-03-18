'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { mockVendors } from '@/lib/mockData';

export default function VendorsPage() {
  const router = useRouter();

  const columns = [
    {
      title: 'Vendor Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Contact Person',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
  ];

  return (
    <div>
      <ModuleHeader
        title="Vendors"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Vendors' },
        ]}
        primaryAction={{
          label: 'Create Vendor',
          onClick: () => router.push('/vendors/create'),
          icon: <TeamOutlined />,
        }}
      />
      <DataTable
        columns={columns}
        dataSource={mockVendors}
        onView={(record) => router.push(`/vendors/${record.id}`)}
        onEdit={(record) => router.push(`/vendors/${record.id}/edit`)}
        onDelete={(record) => message.success(`Vendor ${record.id} deleted (mock)`)}
      />
    </div>
  );
}
