'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Tag, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { mockCustomers } from '@/lib/mockData';

export default function CustomersPage() {
  const router = useRouter();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Industry',
      dataIndex: 'industry',
      key: 'industry',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ];

  return (
    <div>
      <ModuleHeader
        title="Customers"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Customers' },
        ]}
        primaryAction={{
          label: 'Create Customer',
          onClick: () => router.push('/customers/create'),
          icon: <UserOutlined />,
        }}
      />
      <DataTable
        columns={columns}
        dataSource={mockCustomers}
        onView={(record) => router.push(`/customers/${record.id}`)}
        onEdit={(record) => router.push(`/customers/${record.id}/edit`)}
        onDelete={(record) => message.success(`Customer ${record.id} deleted (mock)`)}
      />
    </div>
  );
}
