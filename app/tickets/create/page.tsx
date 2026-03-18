'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Select, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';

const { Option } = Select;

export default function CreateTicketPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Ticket created:', values);
    message.success('Ticket created successfully (mock)');
    router.push('/tickets');
  };

  return (
    <div>
      <ModuleHeader
        title="Create New Ticket"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Tickets', href: '/tickets' },
          { title: 'Create' },
        ]}
        backAction
      />
      
      <DataForm form={form} onFinish={onFinish} onCancel={() => router.push('/tickets')}>
        <Form.Item name="ticketId" label="Ticket ID" rules={[{ required: true }]}>
          <Input placeholder="e.g. TKT-1002" />
        </Form.Item>

        <Form.Item name="customerId" label="Customer" rules={[{ required: true }]}>
          <Select placeholder="Select customer">
            <Option value="1">Acme Corp</Option>
            <Option value="2">Cyberdyne Systems</Option>
          </Select>
        </Form.Item>

        <Form.Item name="category" label="Category">
          <Select placeholder="Select category">
            <Option value="Technical">Technical</Option>
            <Option value="Billing">Billing</Option>
            <Option value="Feature Request">Feature Request</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item name="priority" label="Priority" initialValue="MEDIUM">
          <Select>
            <Option value="URGENT">Urgent</Option>
            <Option value="HIGH">High</Option>
            <Option value="MEDIUM">Medium</Option>
            <Option value="LOW">Low</Option>
          </Select>
        </Form.Item>

        <Form.Item name="description" label="Problem Description">
          <Input.TextArea rows={4} placeholder="Describe the issue in detail..." />
        </Form.Item>
      </DataForm>
    </div>
  );
}
