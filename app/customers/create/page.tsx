'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';

const { Option } = Select;

export default function CreateCustomerPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values:', values);
    message.success('Customer created successfully (mock)');
    router.push('/customers');
  };

  return (
    <div>
      <ModuleHeader
        title="Create New Customer"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Customers', href: '/customers' },
          { title: 'Create' },
        ]}
        backAction
      />
      
      <DataForm 
        form={form} 
        onFinish={onFinish} 
        onCancel={() => router.push('/customers')}
        submitLabel="Create Customer"
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Customer Name"
              rules={[{ required: true, message: 'Please enter customer name' }]}
            >
              <Input placeholder="e.g. Acme Corp" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="industry"
              label="Industry"
            >
              <Input placeholder="e.g. Manufacturing" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Status"
              initialValue="ACTIVE"
            >
              <Select>
                <Option value="ACTIVE">Active</Option>
                <Option value="INACTIVE">Inactive</Option>
                <Option value="PROSPECT">Prospect</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="address"
          label="Address"
        >
          <Input.TextArea rows={3} placeholder="Full address..." />
        </Form.Item>
      </DataForm>
    </div>
  );
}
