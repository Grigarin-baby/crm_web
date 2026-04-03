'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Tag, Spin, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { api } from '@/lib/api';

export default function ViewTicketPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await api.get(`/service/tickets/${params.id}`);
        setTicket(data);
      } catch (error: any) {
        message.error(`Failed to fetch ticket: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchTicket();
    }
  }, [params.id]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  }

  if (!ticket) {
    return <Card>Ticket not found</Card>;
  }

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
          <Descriptions.Item label="Customer">{ticket.customer?.name || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Category">{ticket.category}</Descriptions.Item>
          <Descriptions.Item label="Priority">
            <Tag color={ticket.priority === 'URGENT' ? 'red' : 'orange'}>{ticket.priority}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status" span={2}>
            <Tag color="blue">{ticket.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Assigned Agent">{ticket.assignedAgent?.firstName} {ticket.assignedAgent?.lastName}</Descriptions.Item>
          <Descriptions.Item label="Created At">{new Date(ticket.createdAt).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Description" span={2}>
            {ticket.description || 'No description provided.'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
