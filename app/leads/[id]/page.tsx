'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Tag, Spin, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { api } from '@/lib/api';

export default function ViewLeadPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await api.get(`/modules/leads/${params.id}`);
        setLead(response);
      } catch (error: any) {
        message.error(`Failed to fetch lead: ${error.message}`);
        router.push('/leads');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchLead();
  }, [params.id, router]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  if (!lead) return null;

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
          <Descriptions.Item label="Created At">{new Date(lead.createdAt).toLocaleDateString()}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
