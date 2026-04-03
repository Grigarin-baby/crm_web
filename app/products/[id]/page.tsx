'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Spin, Result, Button } from 'antd';
import { EditOutlined, ShoppingOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { api } from '@/lib/api';

export default function ViewProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/products/${params.id}`);
        setProduct(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" description="Loading product details..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <Result
        status="error"
        title="Failed to Load Product"
        subTitle={error || 'Product not found'}
        extra={[
          <Button type="primary" key="back" onClick={() => router.push('/products')}>
            Back to Products
          </Button>
        ]}
      />
    );
  }

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
          icon: <EditOutlined />,
        }}
      />

      <Card bordered={false}>
        <Descriptions title="Product Information" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Name">{product.name}</Descriptions.Item>
          <Descriptions.Item label="SKU">{product.sku || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Price">${product.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Descriptions.Item>
          <Descriptions.Item label="Description" span={3}>{product.description || 'No description available'}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
