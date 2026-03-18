'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions } from 'antd';
import { EditOutlined, ShoppingOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { mockProducts } from '@/lib/mockData';

export default function ViewProductPage() {
  const params = useParams();
  const router = useRouter();
  const product = mockProducts.find(p => p.id === params.id) || mockProducts[0];

  return (
    <div>
      <ModuleHeader
        title={product.name}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Products', href: '/products' },
          { title: 'Details' },
        ]}
        backAction
        primaryAction={{
          label: 'Edit Product',
          onClick: () => router.push(`/products/${product.id}/edit`),
          icon: <ShoppingOutlined />,
        }}
      />

      <Card bordered={false}>
        <Descriptions title="Product Information" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Name">{product.name}</Descriptions.Item>
          <Descriptions.Item label="SKU">{product.sku}</Descriptions.Item>
          <Descriptions.Item label="Price">${product.price.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="Description" span={3}>{product.description}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
