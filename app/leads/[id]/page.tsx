'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Tag, Button, Space } from 'antd';
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { mockLeads } from '@/lib/mockData';

export default function ViewLeadPage() {
  const params = useParams();
  const router = useRouter();
  const lead = mockLeads.find(l => l.id === params.id) || mockLeads[0];

  return (
    <div>
      <ModuleHeader
        title={`${lead.firstName} ${lead.lastName}`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Leads', href: '/leads' },
          { title: 'Details' },
        ]}
        backAction
        primaryAction={{
          label: 'Edit Lead',
          onClick: () => router.push(`/leads/${lead.id}/edit`),
          icon: <EditOutlined />,
        }}
      />

      <Card bordered={false}>
        <Descriptions title="Lead Information" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="First Name">{lead.firstName}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{lead.lastName}</Descriptions.Item>
          <Descriptions.Item label="Company">{lead.company}</Descriptions.Item>
          <Descriptions.Item label="Email">{lead.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{lead.phone}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={lead.status === 'NEW' ? 'blue' : 'green'}>{lead.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Source">{lead.source}</Descriptions.Item>
          <Descriptions.Item label="Created At">{lead.createdAt}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
