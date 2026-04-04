'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Row, Col, message, Spin } from 'antd';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

interface OrganizationFormProps {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function OrganizationForm({ id, onSuccess, onCancel }: OrganizationFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchOrg = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/core/organizations/${id}`);
          form.setFieldsValue(response);
        } catch (error: any) {
          message.error(`Failed to fetch organization: ${error.message}`);
          onCancel();
        } finally {
          setLoading(false);
        }
      };
      fetchOrg();
    } else {
      form.resetFields();
    }
  }, [id, form, onCancel]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      if (id) {
        await api.patch(`/core/organizations/${id}`, values);
        message.success('Organization updated successfully');
      } else {
        await api.post('/core/organizations', values);
        message.success('Organization created successfully');
      }
      onSuccess();
    } catch (error: any) {
      message.error(`Failed to save organization: ${error.message}`);
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
      submitLabel={id ? "Save Changes" : "Create Organization"}
      loading={submitting}
      inDrawer={true}
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
  );
}