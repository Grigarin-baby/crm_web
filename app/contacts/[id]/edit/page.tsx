'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, message, Spin } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

export default function EditContactPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contactRes, customersRes] = await Promise.all([
          api.get(`/modules/contacts/${params.id}`),
          api.get('/modules/customers?take=100'),
        ]);
        setCustomers(customersRes.items);
        form.setFieldsValue(contactRes);
      } catch (error: any) {
        message.error(`Failed to fetch data: ${error.message}`);
        router.push('/contacts');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchData();
  }, [params.id, form, router]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      await api.patch(`/modules/contacts/${params.id}`, values);
      message.success('Contact updated successfully');
      router.push(`/contacts/${params.id}`);
    } catch (error: any) {
      message.error(`Failed to update contact: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

  return (
    <div>
      <ModuleHeader
        title="Edit Contact"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Contacts', href: '/contacts' },
          { title: 'Details', href: `/contacts/${params.id}` },
          { title: 'Edit' },
        ]}
        backAction
      />

      <DataForm
        form={form}
        onFinish={onFinish}
        onCancel={() => router.back()}
        submitLabel="Save Changes"
        loading={submitting}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: 'Please enter first name' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: 'Please enter last name' }]}
            >
              <Input />
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
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Phone"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="role"
              label="Role"
            >
              <Input />
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
