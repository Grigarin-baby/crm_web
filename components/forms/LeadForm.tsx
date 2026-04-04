'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Row, Col, message, Spin } from 'antd';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

interface LeadFormProps {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function LeadForm({ id, onSuccess, onCancel }: LeadFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchLead = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/modules/leads/${id}`);
          form.setFieldsValue(response);
        } catch (error: any) {
          message.error(`Failed to fetch lead: ${error.message}`);
          onCancel();
        } finally {
          setLoading(false);
        }
      };
      fetchLead();
    } else {
      form.resetFields();
    }
  }, [id, form, onCancel]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      if (id) {
        await api.patch(`/modules/leads/${id}`, values);
        message.success('Lead updated successfully');
      } else {
        await api.post('/modules/leads', values);
        message.success('Lead created successfully');
      }
      onSuccess();
    } catch (error: any) {
      message.error(`Failed to save lead: ${error.message}`);
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
      submitLabel={id ? "Save Changes" : "Create Lead"}
      loading={submitting}
      inDrawer={true}
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
  );
}
