'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { mockQuotes } from '@/lib/mockData';

export default function ViewQuotePage() {
  const params = useParams();
  const router = useRouter();
  const quote = mockQuotes.find(q => q.id === params.id) || mockQuotes[0];

  return (
    <div>
      <ModuleHeader
        title={quote.quoteNumber}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Quotes', href: '/quotes' },
          { title: 'Details' },
        ]}
        backAction
        primaryAction={{
          label: 'Edit Quote',
          onClick: () => router.push(`/quotes/${quote.id}/edit`),
          icon: <EditOutlined />,
        }}
      />

      <Card bordered={false}>
        <Descriptions title="Quote Information" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Quote Number">{quote.quoteNumber}</Descriptions.Item>
          <Descriptions.Item label="Customer">{quote.customerName}</Descriptions.Item>
          <Descriptions.Item label="Total Amount">${quote.totalAmount.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Valid Until">{quote.validUntil}</Descriptions.Item>
          <Descriptions.Item label="Deal">{quote.dealName}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
