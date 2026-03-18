'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { mockCalls } from '@/lib/mockData';

export default function ViewCallPage() {
  const params = useParams();
  const router = useRouter();
  const call = mockCalls.find(c => c.id === params.id) || mockCalls[0];

  return (
    <div>
      <ModuleHeader
        title={`${call.callType} Call Details`}
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
        <Descriptions title="Call Information" bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Call Type">{call.callType}</Descriptions.Item>
          <Descriptions.Item label="Related Contact">{call.contactName}</Descriptions.Item>
          <Descriptions.Item label="Duration (min)">{call.duration}</Descriptions.Item>
          <Descriptions.Item label="Date">{call.createdAt}</Descriptions.Item>
          <Descriptions.Item label="Summary" span={2}>{call.summary}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
