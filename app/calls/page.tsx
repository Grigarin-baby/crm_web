'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { mockCalls } from '@/lib/mockData';

export default function CallsPage() {
  const router = useRouter();

  const columns = [
    {
      title: 'Call Type',
      dataIndex: 'callType',
      key: 'callType',
    },
    {
      title: 'Contact',
      dataIndex: 'contactName',
      key: 'contactName',
    },
    {
      title: 'Duration (min)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Summary',
      dataIndex: 'summary',
      key: 'summary',
      ellipsis: true,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ];

  return (
    <div>
      <ModuleHeader
        title="Calls"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Calls' },
        ]}
        primaryAction={{
          label: 'Log Call',
          onClick: () => router.push('/calls/create'),
          icon: <PhoneOutlined />,
        }}
      />
      <DataTable
        columns={columns}
        dataSource={mockCalls}
        onView={(record) => router.push(`/calls/${record.id}`)}
        onEdit={(record) => router.push(`/calls/${record.id}/edit`)}
        onDelete={(record) => message.success(`Call ${record.id} deleted (mock)`)}
      />
    </div>
  );
}
