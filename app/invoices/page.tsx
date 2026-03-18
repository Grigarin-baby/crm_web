'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { message, Tag } from 'antd';
import { FileTextOutlined, AuditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { mockInvoices } from '@/lib/mockData';

export default function InvoicesPage() {
  const router = useRouter();

  const columns = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `$${amount.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string) => {
        let color = 'orange';
        if (status === 'PAID') color = 'green';
        if (status === 'OVERDUE') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
    },
  ];

  return (
    <div>
      <ModuleHeader
        title="Invoices"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Invoices' },
        ]}
        primaryAction={{
          label: 'Create Invoice',
          onClick: () => router.push('/invoices/create'),
          icon: <FileTextOutlined />,
        }}
      />
      <DataTable
        columns={columns}
        dataSource={mockInvoices}
        onView={(record) => router.push(`/invoices/${record.id}`)}
        onEdit={(record) => router.push(`/invoices/${record.id}/edit`)}
        onDelete={(record) => message.success(`Invoice ${record.id} deleted (mock)`)}
      />
    </div>
  );
}
