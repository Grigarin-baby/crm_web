'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Tag, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { mockTickets } from '@/lib/mockData';

export default function TicketsPage() {
  const router = useRouter();

  const columns = [
    {
      title: 'Ticket ID',
      dataIndex: 'ticketId',
      key: 'ticketId',
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={priority === 'URGENT' ? 'red' : 'orange'}>
          {priority}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'OPEN' ? 'blue' : 'green'}>
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <ModuleHeader
        title="Tickets"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Tickets' },
        ]}
        primaryAction={{
          label: 'New Ticket',
          onClick: () => router.push('/tickets/create'),
        }}
      />
      <DataTable
        columns={columns}
        dataSource={mockTickets}
        onView={(record) => router.push(`/tickets/${record.id}`)}
        onEdit={(record) => router.push(`/tickets/${record.id}/edit`)}
        onDelete={(record) => message.success(`Ticket ${record.id} deleted (mock)`)}
      />
    </div>
  );
}
