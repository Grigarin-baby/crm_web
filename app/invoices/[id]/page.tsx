'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Tag, Spin, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { api } from '@/lib/api';

export default function ViewInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await api.get(`/modules/invoices/${params.id}`);
        setInvoice(response);
      } catch (error: any) {
        message.error(`Failed to fetch invoice: ${error.message}`);
        router.push('/invoices');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchInvoice();
  }, [params.id, router]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  if (!invoice) return null;

  return (
    <div>
      <ModuleHeader
        title={invoice.invoiceNumber}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Invoices', href: '/invoices' },
          { title: 'Details' },
        ]}
        backAction
        primaryAction={{
          label: 'Edit Invoice',
          onClick: () => router.push(`/invoices/${invoice.id}/edit`),
          icon: <EditOutlined />,
        }}
      />

      <Card bordered={false}>
        <Descriptions title="Invoice Information" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Invoice Number">{invoice.invoiceNumber}</Descriptions.Item>
          <Descriptions.Item label="Customer">{invoice.customer?.name || '-'}</Descriptions.Item>
          <Descriptions.Item label="Amount">{`$${invoice.amount?.toLocaleString()}`}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={invoice.paymentStatus === 'PAID' ? 'green' : invoice.paymentStatus === 'OVERDUE' ? 'red' : 'orange'}>
              {invoice.paymentStatus}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Invoice Date">{new Date(invoice.invoiceDate).toLocaleDateString()}</Descriptions.Item>
          <Descriptions.Item label="Created At">{new Date(invoice.createdAt).toLocaleDateString()}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
