'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, message, Spin } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/core/users/${params.id}`);
        form.setFieldsValue(response);
      } catch (error: any) {
        message.error(`Failed to fetch user: ${error.message}`);
        router.push('/admin/users');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchUser();
  }, [params.id, form, router]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      await api.patch(`/core/users/${params.id}`, values);
      message.success('User updated successfully');
      router.push('/admin/users');
    } catch (error: any) {
      message.error(`Failed to update user: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" description="Loading user..." /></div>;

  return (
    <div>
      <ModuleHeader
        title="Edit User"
        breadcrumbItems={[
          { title: 'SaaS Dashboard', href: '/' },
          { title: 'Users', href: '/admin/users' },
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
              name="email"
              label="Email"
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="SUPER_ADMIN">Super Admin (Global)</Option>
                <Option value="ADMIN">Admin (Tenant)</Option>
                <Option value="USER">User (Tenant)</Option>
                <Option value="SALES_MANAGER">Sales Manager</Option>
                <Option value="SALES_REP">Sales Rep</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="firstName"
              label="First Name"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastName"
              label="Last Name"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </DataForm>
    </div>
  );
}
