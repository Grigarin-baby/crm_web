'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { message, Tag } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { mockPurchaseOrders } from '@/lib/mockData';

export default function PurchaseOrdersPage() {
  const router = useRouter();

  const columns = [
    {
      title: 'PO Number',
      dataIndex: 'poNumber',
      key: 'poNumber',
    },
    {
      title: 'Vendor',
      dataIndex: 'vendorName',
      key: 'vendorName',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `$${amount.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'blue';
        if (status === 'ISSUED') color = 'cyan';
        if (status === 'RECEIVED') color = 'green';
        if (status === 'CANCELLED') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Expected Date',
      dataIndex: 'expectedDate',
      key: 'expectedDate',
    },
  ];

  return (
    <div>
      <ModuleHeader
        title="Purchase Orders"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Purchase Orders' },
        ]}
        primaryAction={{
          label: 'Create PO',
          onClick: () => router.push('/purchase-orders/create'),
          icon: <DollarOutlined />,
        }}
      />
      <DataTable
        columns={columns}
        dataSource={mockPurchaseOrders}
        onView={(record) => router.push(`/purchase-orders/${record.id}`)}
        onEdit={(record) => router.push(`/purchase-orders/${record.id}/edit`)}
        onDelete={(record) => message.success(`Purchase Order ${record.id} deleted (mock)`)}
      />
    </div>
  );
}
