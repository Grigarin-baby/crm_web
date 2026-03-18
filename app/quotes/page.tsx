'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { mockQuotes } from '@/lib/mockData';

export default function QuotesPage() {
  const router = useRouter();

  const columns = [
    {
      title: 'Quote Number',
      dataIndex: 'quoteNumber',
      key: 'quoteNumber',
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `$${amount.toLocaleString()}`,
    },
    {
      title: 'Valid Until',
      dataIndex: 'validUntil',
      key: 'validUntil',
    },
    {
      title: 'Deal',
      dataIndex: 'dealName',
      key: 'dealName',
    },
  ];

  return (
    <div>
      <ModuleHeader
        title="Quotes"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Quotes' },
        ]}
        primaryAction={{
          label: 'Create Quote',
          onClick: () => router.push('/quotes/create'),
          icon: <FileTextOutlined />,
        }}
      />
      <DataTable
        columns={columns}
        dataSource={mockQuotes}
        onView={(record) => router.push(`/quotes/${record.id}`)}
        onEdit={(record) => router.push(`/quotes/${record.id}/edit`)}
        onDelete={(record) => message.success(`Quote ${record.id} deleted (mock)`)}
      />
    </div>
  );
}
