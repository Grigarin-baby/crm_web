'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Row, Col, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';

export default function CreateVendorPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values:', values);
    message.success('Vendor created successfully (mock)');
    router.push('/vendors');
  };

  return (
    <div>
      <ModuleHeader
        title="Create New Vendor"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Vendors', href: '/vendors' },
          { title: 'Create' },
        ]}
        backAction
      />
      
      <DataForm 
        form={form} 
        onFinish={onFinish} 
        onCancel={() => router.push('/vendors')}
        submitLabel="Create Vendor"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Vendor Name"
              rules={[{ required: true, message: 'Please enter vendor name' }]}
            >
              <Input placeholder="e.g. Global Tech Supplies" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="contactPerson"
              label="Contact Person"
            >
              <Input placeholder="e.g. Alice Wang" />
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
              <Input placeholder="alice@example.com" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Phone"
            >
              <Input placeholder="555-0101" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="category"
              label="Category"
            >
              <Input placeholder="e.g. Hardware" />
            </Form.Item>
          </Col>
        </Row>
      </DataForm>
    </div>
  );
}
