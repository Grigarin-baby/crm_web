'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Tag, message } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { mockDeals } from '@/lib/mockData';

export default function DealsPage() {
  const router = useRouter();

  const columns = [
    {
      title: 'Deal Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage: string) => (
        <Tag color={stage === 'WON' ? 'green' : stage === 'LOST' ? 'red' : 'blue'}>
          {stage}
        </Tag>
      ),
    },
    {
      title: 'Expected Close',
      dataIndex: 'expectedCloseDate',
      key: 'expectedCloseDate',
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
  ];

  return (
    <div>
      <ModuleHeader
        title="Deals"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Deals' },
        ]}
        primaryAction={{
          label: 'Create Deal',
          onClick: () => router.push('/deals/create'),
          icon: <DollarOutlined />,
        }}
      />
      <DataTable
        columns={columns}
        dataSource={mockDeals}
        onView={(record) => router.push(`/deals/${record.id}`)}
        onEdit={(record) => router.push(`/deals/${record.id}/edit`)}
        onDelete={(record) => message.success(`Deal ${record.id} deleted (mock)`)}
      />
    </div>
  );
}
