'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

export default function CreateOrganizationPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      await api.post('/core/organizations', values);
      message.success('Organization created successfully');
      router.push('/admin/organizations');
    } catch (error: any) {
      message.error(`Failed to create organization: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <ModuleHeader
        title="Create New Organization"
        breadcrumbItems={[
          { title: 'SaaS Dashboard', href: '/' },
          { title: 'Organizations', href: '/admin/organizations' },
          { title: 'Create' },
        ]}
        backAction
      />
      
      <DataForm 
        form={form} 
        onFinish={onFinish} 
        onCancel={() => router.push('/admin/organizations')}
        submitLabel="Create Organization"
        loading={submitting}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Organization Name"
              rules={[{ required: true, message: 'Please enter organization name' }]}
            >
              <Input placeholder="e.g. Acme Corp" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="domain"
              label="Domain"
            >
              <Input placeholder="e.g. acme.com" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="subscriptionPlan"
              label="Subscription Plan"
              initialValue="FREE"
            >
              <Select placeholder="Select plan">
                <Option value="FREE">Free</Option>
                <Option value="PRO">Pro</Option>
                <Option value="ENTERPRISE">Enterprise</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Status"
              initialValue="ACTIVE"
            >
              <Select placeholder="Select status">
                <Option value="ACTIVE">Active</Option>
                <Option value="INACTIVE">Inactive</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </DataForm>
    </div>
  );
}
