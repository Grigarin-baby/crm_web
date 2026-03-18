'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { mockInvoices } from '@/lib/mockData';

export default function ViewInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const invoice = mockInvoices.find(inv => inv.id === params.id) || mockInvoices[0];

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
          <Descriptions.Item label="Customer">{invoice.customerName}</Descriptions.Item>
          <Descriptions.Item label="Amount">${invoice.amount.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={invoice.paymentStatus === 'PAID' ? 'green' : 'orange'}>{invoice.paymentStatus}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Invoice Date">{invoice.invoiceDate}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
