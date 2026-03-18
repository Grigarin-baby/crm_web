'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';

const { Option } = Select;

export default function CreateLeadPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values:', values);
    message.success('Lead created successfully (mock)');
    router.push('/leads');
  };

  return (
    <div>
      <ModuleHeader
        title="Create New Lead"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Leads', href: '/leads' },
          { title: 'Create' },
        ]}
        backAction
      />
      
      <DataForm 
        form={form} 
        onFinish={onFinish} 
        onCancel={() => router.push('/leads')}
        submitLabel="Create Lead"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: 'Please enter first name' }]}
            >
              <Input placeholder="e.g. John" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: 'Please enter last name' }]}
            >
              <Input placeholder="e.g. Doe" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="company"
              label="Company"
            >
              <Input placeholder="e.g. TechCorp" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="source"
              label="Lead Source"
            >
              <Select placeholder="Select source">
                <Option value="Website">Website</Option>
                <Option value="Referral">Referral</Option>
                <Option value="LinkedIn">LinkedIn</Option>
                <Option value="Cold Call">Cold Call</Option>
              </Select>
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
              <Input placeholder="john@example.com" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Phone"
            >
              <Input placeholder="123-456-7890" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="notes"
          label="Notes"
        >
          <Input.TextArea rows={4} placeholder="Additional information..." />
        </Form.Item>
      </DataForm>
    </div>
  );
}
