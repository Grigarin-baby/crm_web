'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

export default function CreateContactPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get('/modules/customers?take=100');
        setCustomers(response.items);
      } catch (error: any) {
        message.error(`Failed to fetch customers: ${error.message}`);
      }
    };
    fetchCustomers();
  }, []);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      await api.post('/modules/contacts', values);
      message.success('Contact created successfully');
      router.push('/contacts');
    } catch (error: any) {
      message.error(`Failed to create contact: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <ModuleHeader
        title="Create New Contact"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Contacts', href: '/contacts' },
          { title: 'Create' },
        ]}
        backAction
      />

      <DataForm
        form={form}
        onFinish={onFinish}
        onCancel={() => router.push('/contacts')}
        submitLabel="Create Contact"
        loading={submitting}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: 'Please enter first name' }]}
            >
              <Input placeholder="e.g. Sarah" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: 'Please enter last name' }]} 
            >
              <Input placeholder="e.g. Connor" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input placeholder="sarah@example.com" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Phone"
            >
              <Input placeholder="111-222-3333" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="role"
              label="Role"
            >
              <Input placeholder="e.g. Operations Manager" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="customerId"
              label="Customer"
            >
              <Select placeholder="Select customer" allowClear>
                {customers.map(customer => (
                  <Option key={customer.id} value={customer.id}>{customer.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </DataForm>
    </div>
  );
}
