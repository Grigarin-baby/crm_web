'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { mockTickets } from '@/lib/mockData';

export default function ViewTicketPage() {
  const params = useParams();
  const router = useRouter();
  const ticket = mockTickets.find(t => t.id === params.id) || mockTickets[0];

  return (
    <div>
      <ModuleHeader
        title={`Ticket: ${ticket.ticketId}`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Tickets', href: '/tickets' },
          { title: 'Details' },
        ]}
        backAction
        primaryAction={{
          label: 'Edit Ticket',
          onClick: () => router.push(`/tickets/${ticket.id}/edit`),
          icon: <EditOutlined />,
        }}
      />

      <Card bordered={false}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Ticket ID">{ticket.ticketId}</Descriptions.Item>
          <Descriptions.Item label="Customer">{ticket.customerName}</Descriptions.Item>
          <Descriptions.Item label="Category">{ticket.category}</Descriptions.Item>
          <Descriptions.Item label="Priority">
            <Tag color={ticket.priority === 'URGENT' ? 'red' : 'orange'}>{ticket.priority}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status" span={2}>
            <Tag color="blue">{ticket.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={2}>
            Mock description of the customer issue would go here.
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
