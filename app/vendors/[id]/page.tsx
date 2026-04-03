'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Spin, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { api } from '@/lib/api';

export default function ViewVendorPage() {
  const params = useParams();
  const router = useRouter();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await api.get(`/modules/vendors/${params.id}`);
        setVendor(response);
      } catch (error: any) {
        message.error(`Failed to fetch vendor: ${error.message}`);
        router.push('/vendors');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchVendor();
  }, [params.id, router]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  if (!vendor) return null;

  return (
    <div>
      <ModuleHeader
        title={vendor.name}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Vendors', href: '/vendors' },
          { title: 'Details' },
        ]}
        backAction
        primaryAction={{
          label: 'Edit Vendor',
          onClick: () => router.push(`/vendors/${vendor.id}/edit`),
          icon: <EditOutlined />,
        }}
      />

      <Card bordered={false}>
        <Descriptions title="Vendor Information" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Vendor Name">{vendor.name}</Descriptions.Item>
          <Descriptions.Item label="Created At">{new Date(vendor.createdAt).toLocaleDateString()}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
