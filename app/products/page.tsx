'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { mockProducts } from '@/lib/mockData';

export default function ProductsPage() {
  const router = useRouter();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  return (
    <div>
      <ModuleHeader
        title="Products"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Products' },
        ]}
        primaryAction={{
          label: 'Create Product',
          onClick: () => router.push('/products/create'),
          icon: <ShoppingOutlined />,
        }}
      />
      <DataTable
        columns={columns}
        dataSource={mockProducts}
        onView={(record) => router.push(`/products/${record.id}`)}
        onEdit={(record) => router.push(`/products/${record.id}/edit`)}
        onDelete={(record) => message.success(`Product ${record.id} deleted (mock)`)}
      />
    </div>
  );
}
