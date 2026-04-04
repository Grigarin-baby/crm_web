'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Row, Col, message, Spin } from 'antd';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

interface ContactFormProps {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ContactForm({ id, onSuccess, onCancel }: ContactFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get('/modules/customers?take=100');
        setCustomers(response.items || []);
      } catch (error: any) {
        message.error(`Failed to fetch customers: ${error.message}`);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchContact = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/modules/contacts/${id}`);
          form.setFieldsValue(response);
        } catch (error: any) {
          message.error(`Failed to fetch contact: ${error.message}`);
          onCancel();
        } finally {
          setLoading(false);
        }
      };
      fetchContact();
    } else {
      form.resetFields();
    }
  }, [id, form, onCancel]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      if (id) {
        await api.patch(`/modules/contacts/${id}`, values);
        message.success('Contact updated successfully');
      } else {
        await api.post('/modules/contacts', values);
        message.success('Contact created successfully');
      }
      onSuccess();
    } catch (error: any) {
      message.error(`Failed to save contact: ${error.message}`);
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
      submitLabel={id ? "Save Changes" : "Create Contact"}
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
            <Input placeholder="e.g. Sarah" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please enter last name' }]} 
          >
            <Input placeholder="e.g. Connor" />
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
            <Input placeholder="sarah@example.com" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="phone"
            label="Phone"
          >
            <Input placeholder="111-222-3333" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="role"
            label="Role"
          >
            <Input placeholder="e.g. Operations Manager" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="customerId"
            label="Customer"
          >
            <Select placeholder="Select customer" allowClear>
              {customers.map(customer => (
                <Option key={customer.id} value={customer.id}>{customer.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </DataForm>
  );
}
