'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Tag, Spin, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { api } from '@/lib/api';

export default function ViewDealPage() {
  const params = useParams();
  const router = useRouter();
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const response = await api.get(`/modules/deals/${params.id}`);
        setDeal(response);
      } catch (error: any) {
        message.error(`Failed to fetch deal: ${error.message}`);
        router.push('/deals');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchDeal();
  }, [params.id, router]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  if (!deal) return null;

  return (
    <div>
      <ModuleHeader
        title={deal.name}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Deals', href: '/deals' },
          { title: 'Details' },
        ]}
        backAction
        primaryAction={{
          label: 'Edit Deal',
          onClick: () => router.push(`/deals/${deal.id}/edit`),
          icon: <EditOutlined />,
        }}
      />

      <Card bordered={false}>
        <Descriptions title="Deal Information" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Deal Name">{deal.name}</Descriptions.Item>
          <Descriptions.Item label="Value">{deal.value ? `$${deal.value.toLocaleString()}` : '-'}</Descriptions.Item>
          <Descriptions.Item label="Stage">
            <Tag color={deal.stage === 'WON' ? 'green' : deal.stage === 'LOST' ? 'red' : 'blue'}>
              {deal.stage}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Customer">{deal.customer?.name || '-'}</Descriptions.Item>
          <Descriptions.Item label="Expected Close">{deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : '-'}</Descriptions.Item>
          <Descriptions.Item label="Assigned User">{deal.assignedUser ? `${deal.assignedUser.firstName} ${deal.assignedUser.lastName}` : '-'}</Descriptions.Item>
          <Descriptions.Item label="Created At">{new Date(deal.createdAt).toLocaleDateString()}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
