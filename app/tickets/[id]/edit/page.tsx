'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Select, message, Spin } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

export default function EditTicketPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketData, customersData, usersData] = await Promise.all([
          api.get(`/service/tickets/${params.id}`),
          api.get('/modules/customers'),
          api.get('/core/users'), // Assuming users are at /core/users
        ]);
        setTicket(ticketData);
        setCustomers(customersData.items || []);
        setUsers(usersData.items || []);
        form.setFieldsValue(ticketData);
      } catch (error: any) {
        message.error(`Failed to fetch data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchData();
    }
  }, [params.id, form]);

  const onFinish = async (values: any) => {
    try {
      await api.patch(`/service/tickets/${params.id}`, values);
      message.success('Ticket updated successfully');
      router.push(`/tickets/${params.id}`);
    } catch (error: any) {
      message.error(`Failed to update ticket: ${error.message}`);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  }

  return (
    <div>
      <ModuleHeader
        title={`Edit Ticket: ${ticket?.ticketId}`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Tickets', href: '/tickets' },
          { title: 'Details', href: `/tickets/${params.id}` },
          { title: 'Edit' },
        ]}
        backAction
      />
      
      <DataForm form={form} onFinish={onFinish} onCancel={() => router.back()}>
        <Form.Item name="ticketId" label="Ticket ID" rules={[{ required: true }]}>
          <Input disabled />
        </Form.Item>

        <Form.Item name="customerId" label="Customer">
          <Select placeholder="Select Customer">
            {customers.map(customer => (
              <Option key={customer.id} value={customer.id}>{customer.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="assignedAgentId" label="Assigned Agent">
          <Select placeholder="Select Agent">
            {users.map(user => (
              <Option key={user.id} value={user.id}>{user.firstName} {user.lastName}</Option>
            ))}
          </Select>
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
