'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, message, Spin } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

export default function EditOrganizationPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const response = await api.get(`/core/organizations/${params.id}`);
        form.setFieldsValue(response);
      } catch (error: any) {
        message.error(`Failed to fetch organization: ${error.message}`);
        router.push('/admin/organizations');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchOrg();
  }, [params.id, form, router]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      await api.patch(`/core/organizations/${params.id}`, values);
      message.success('Organization updated successfully');
      router.push('/admin/organizations');
    } catch (error: any) {
      message.error(`Failed to update organization: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" description="Loading organization..." /></div>;

  return (
    <div>
      <ModuleHeader
        title="Edit Organization"
        breadcrumbItems={[
          { title: 'SaaS Dashboard', href: '/' },
          { title: 'Organizations', href: '/admin/organizations' },
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
              name="name"
              label="Organization Name"
              rules={[{ required: true, message: 'Please enter organization name' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="domain"
              label="Domain"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="subscriptionPlan"
              label="Subscription Plan"
            >
              <Select>
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
            >
              <Select>
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
