'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Spin, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { api } from '@/lib/api';

export default function ViewQuotePage() {
  const params = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await api.get(`/modules/quotes/${params.id}`);
        setQuote(response);
      } catch (error: any) {
        message.error(`Failed to fetch quote: ${error.message}`);
        router.push('/quotes');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchQuote();
  }, [params.id, router]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  if (!quote) return null;

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
          <Descriptions.Item label="Customer">{quote.customer?.name || '-'}</Descriptions.Item>
          <Descriptions.Item label="Total Amount">{quote.totalAmount ? `$${quote.totalAmount.toLocaleString()}` : '-'}</Descriptions.Item>
          <Descriptions.Item label="Valid Until">{quote.validUntil ? new Date(quote.validUntil).toLocaleDateString() : '-'}</Descriptions.Item>
          <Descriptions.Item label="Deal">{quote.deal?.name || '-'}</Descriptions.Item>
          <Descriptions.Item label="Created At">{new Date(quote.createdAt).toLocaleDateString()}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
