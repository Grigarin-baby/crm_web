'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

export default function CreateUserPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(false);

  useEffect(() => {
    const fetchOrgs = async () => {
      setLoadingOrgs(true);
      try {
        const response = await api.get('/core/organizations?take=100');
        setOrganizations(response.items || []);
      } catch (error: any) {
        message.error(`Failed to fetch organizations: ${error.message}`);
      } finally {
        setLoadingOrgs(false);
      }
    };
    fetchOrgs();
  }, []);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      await api.post('/core/users', values);
      message.success('User created successfully');
      router.push('/admin/users');
    } catch (error: any) {
      message.error(`Failed to create user: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <ModuleHeader
        title="Create Global User"
        breadcrumbItems={[
          { title: 'SaaS Dashboard', href: '/' },
          { title: 'Users', href: '/admin/users' },
          { title: 'Create' },
        ]}
        backAction
      />
      
      <DataForm 
        form={form} 
        onFinish={onFinish} 
        onCancel={() => router.push('/admin/users')}
        submitLabel="Create User"
        loading={submitting}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="organizationId"
              label="Organization (Tenant)"
              tooltip="Leave empty for SUPER_ADMIN"
            >
              <Select placeholder="Select organization (Optional)" loading={loadingOrgs} allowClear>
                {organizations.map(org => (
                  <Option key={org.id} value={org.id}>{org.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="role"
              label="Role"
              initialValue="ADMIN"
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
              name="email"
              label="Email"
              rules={[{ required: true, type: 'email' }]}
            >
              <Input placeholder="user@example.com" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, min: 6 }]}
            >
              <Input.Password placeholder="Min 6 characters" />
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
