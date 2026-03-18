'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Tag, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { mockLeads } from '@/lib/mockData';

export default function LeadsPage() {
  const router = useRouter();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'name',
      render: (text: string, record: any) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'NEW' ? 'blue' : 'green'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
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
        title="Leads"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Leads' },
        ]}
        primaryAction={{
          label: 'Create Lead',
          onClick: () => router.push('/leads/create'),
        }}
      />
      <DataTable
        columns={columns}
        dataSource={mockLeads}
        onView={(record) => router.push(`/leads/${record.id}`)}
        onEdit={(record) => router.push(`/leads/${record.id}/edit`)}
        onDelete={(record) => message.success(`Lead ${record.id} deleted (mock)`)}
      />
    </div>
  );
}
