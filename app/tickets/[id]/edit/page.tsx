'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Select, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { mockTickets } from '@/lib/mockData';

const { Option } = Select;

export default function EditTicketPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  
  const ticket = mockTickets.find(t => t.id === params.id) || mockTickets[0];

  useEffect(() => {
    form.setFieldsValue(ticket);
  }, [ticket, form]);

  const onFinish = (values: any) => {
    console.log('Ticket updated:', values);
    message.success('Ticket updated successfully (mock)');
    router.push(`/tickets/${ticket.id}`);
  };

  return (
    <div>
      <ModuleHeader
        title={`Edit Ticket: ${ticket.ticketId}`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Tickets', href: '/tickets' },
          { title: 'Details', href: `/tickets/${ticket.id}` },
          { title: 'Edit' },
        ]}
        backAction
      />
      
      <DataForm form={form} onFinish={onFinish} onCancel={() => router.back()}>
        <Form.Item name="ticketId" label="Ticket ID" rules={[{ required: true }]}>
          <Input disabled />
        </Form.Item>

        <Form.Item name="category" label="Category">
          <Select>
            <Option value="Technical">Technical</Option>
            <Option value="Billing">Billing</Option>
            <Option value="Feature Request">Feature Request</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item name="priority" label="Priority">
          <Select>
            <Option value="URGENT">Urgent</Option>
            <Option value="HIGH">High</Option>
            <Option value="MEDIUM">Medium</Option>
            <Option value="LOW">Low</Option>
          </Select>
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select>
            <Option value="OPEN">Open</Option>
            <Option value="IN_PROGRESS">In Progress</Option>
            <Option value="RESOLVED">Resolved</Option>
            <Option value="CLOSED">Closed</Option>
          </Select>
        </Form.Item>
      </DataForm>
    </div>
  );
}
