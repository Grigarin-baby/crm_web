'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { mockDeals } from '@/lib/mockData';

export default function ViewDealPage() {
  const params = useParams();
  const router = useRouter();
  const deal = mockDeals.find(d => d.id === params.id) || mockDeals[0];

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
          <Descriptions.Item label="Value">${deal.value.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Stage">
            <Tag color={deal.stage === 'WON' ? 'green' : deal.stage === 'LOST' ? 'red' : 'blue'}>
              {deal.stage}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Customer">{deal.customerName}</Descriptions.Item>
          <Descriptions.Item label="Expected Close">{deal.expectedCloseDate}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
