'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Row, Col, message, Spin } from 'antd';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

interface CustomerFormProps {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CustomerForm({ id, onSuccess, onCancel }: CustomerFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchCustomer = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/modules/customers/${id}`);
          form.setFieldsValue(response);
        } catch (error: any) {
          message.error(`Failed to fetch customer: ${error.message}`);
          onCancel();
        } finally {
          setLoading(false);
        }
      };
      fetchCustomer();
    } else {
      form.resetFields();
    }
  }, [id, form, onCancel]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      if (id) {
        await api.patch(`/modules/customers/${id}`, values);
        message.success('Customer updated successfully');
      } else {
        await api.post('/modules/customers', values);
        message.success('Customer created successfully');
      }
      onSuccess();
    } catch (error: any) {
      message.error(`Failed to save customer: ${error.message}`);
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
      submitLabel={id ? "Save Changes" : "Create Customer"}
      loading={submitting}
      inDrawer={true}
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
  );
}
