'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Tag, Spin, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { api } from '@/lib/api';

export default function ViewCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await api.get(`/modules/customers/${params.id}`);
        setCustomer(response);
      } catch (error: any) {
        message.error(`Failed to fetch customer: ${error.message}`);
        router.push('/customers');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchCustomer();
  }, [params.id, router]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  if (!customer) return null;

  return (
    <div>
      <ModuleHeader
        title={customer.name}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Customers', href: '/customers' },
          { title: 'Details' },
        ]}
        backAction
        primaryAction={{
          label: 'Edit Customer',
          onClick: () => router.push(`/customers/${customer.id}/edit`),
          icon: <EditOutlined />,
        }}
      />

      <Card bordered={false}>
        <Descriptions title="Customer Information" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Name">{customer.name}</Descriptions.Item>
          <Descriptions.Item label="Industry">{customer.industry}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={customer.status === 'ACTIVE' ? 'green' : 'orange'}>{customer.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Address" span={2}>{customer.address}</Descriptions.Item>
          <Descriptions.Item label="Created At">{new Date(customer.createdAt).toLocaleDateString()}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
