'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Row, Col, message, Spin } from 'antd';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

interface UserFormProps {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UserForm({ id, onSuccess, onCancel }: UserFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/core/users/${id}`);
          form.setFieldsValue(response);
        } catch (error: any) {
          message.error(`Failed to fetch user: ${error.message}`);
          onCancel();
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    } else {
      form.resetFields();
    }
  }, [id, form, onCancel]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      if (id) {
        await api.patch(`/core/users/${id}`, values);
        message.success('User updated successfully');
      } else {
        await api.post('/core/users', values);
        message.success('User created successfully');
      }
      onSuccess();
    } catch (error: any) {
      message.error(`Failed to save user: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

  return (
    <DataForm 
      form={form} 
      onFinish={onFinish} 
      onCancel={onCancel}
      submitLabel={id ? "Save Changes" : "Create User"}
      loading={submitting}
      inDrawer={true}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input placeholder="user@example.com" disabled={!!id} />
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

      {!id && (
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
              name="password"
              label="Password"
              rules={[{ required: true, min: 6 }]}
            >
              <Input.Password placeholder="Min 6 characters" />
            </Form.Item>
          </Col>
        </Row>
      )}

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
  );
}
