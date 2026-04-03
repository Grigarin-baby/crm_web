'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Spin, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { api } from '@/lib/api';

export default function ViewCallPage() {
  const params = useParams();
  const router = useRouter();
  const [call, setCall] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCall = async () => {
      try {
        const response = await api.get(`/activity/calls/${params.id}`);
        setCall(response);
      } catch (error: any) {
        message.error(`Failed to fetch call: ${error.message}`);
        router.push('/calls');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchCall();
  }, [params.id, router]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  if (!call) return null;

  return (
    <div>
      <ModuleHeader
        title={`${call.callType} Call`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Calls', href: '/calls' },
          { title: 'Details' },
        ]}
        backAction
        primaryAction={{
          label: 'Edit Call',
          onClick: () => router.push(`/calls/${call.id}/edit`),
          icon: <EditOutlined />,
        }}
      />

      <Card bordered={false}>
        <Descriptions title="Call Information" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Call Type">{call.callType}</Descriptions.Item>
          <Descriptions.Item label="Duration">{`${call.duration || 0} min`}</Descriptions.Item>
          <Descriptions.Item label="Contact">{call.contact ? `${call.contact.firstName} ${call.contact.lastName}` : '-'}</Descriptions.Item>
          <Descriptions.Item label="Date">{new Date(call.createdAt).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Summary" span={3}>{call.summary || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
