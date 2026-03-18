'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { message, Tag } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { mockSalesOrders } from '@/lib/mockData';

export default function SalesOrdersPage() {
  const router = useRouter();

  const columns = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Order Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status: string) => {
        let color = 'blue';
        if (status === 'CONFIRMED') color = 'green';
        if (status === 'DELIVERED') color = 'cyan';
        if (status === 'CANCELLED') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string) => {
        let color = 'orange';
        if (status === 'PAID') color = 'green';
        if (status === 'PARTIAL') color = 'blue';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div>
      <ModuleHeader
        title="Sales Orders"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Sales Orders' },
        ]}
        primaryAction={{
          label: 'Create Order',
          onClick: () => router.push('/sales-orders/create'),
          icon: <ShoppingCartOutlined />,
        }}
      />
      <DataTable
        columns={columns}
        dataSource={mockSalesOrders}
        onView={(record) => router.push(`/sales-orders/${record.id}`)}
        onEdit={(record) => router.push(`/sales-orders/${record.id}/edit`)}
        onDelete={(record) => message.success(`Sales Order ${record.id} deleted (mock)`)}
      />
    </div>
  );
}
