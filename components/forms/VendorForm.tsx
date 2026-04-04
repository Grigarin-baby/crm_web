'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Row, Col, message, Spin } from 'antd';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

interface VendorFormProps {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function VendorForm({ id, onSuccess, onCancel }: VendorFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchVendor = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/modules/vendors/${id}`);
          form.setFieldsValue(response);
        } catch (error: any) {
          message.error(`Failed to fetch vendor: ${error.message}`);
          onCancel();
        } finally {
          setLoading(false);
        }
      };
      fetchVendor();
    } else {
      form.resetFields();
    }
  }, [id, form, onCancel]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      if (id) {
        await api.patch(`/modules/vendors/${id}`, values);
        message.success('Vendor updated successfully');
      } else {
        await api.post(`/modules/vendors`, values);
        message.success('Vendor created successfully');
      }
      onSuccess();
    } catch (error: any) {
      message.error(`Failed to save vendor: ${error.message}`);
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
      submitLabel={id ? "Save Changes" : "Create Vendor"}
      loading={submitting}
      inDrawer={true}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Vendor Name"
            rules={[{ required: true, message: 'Please enter vendor name' }]}
          >
            <Input placeholder="e.g. Global Tech Supplies" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="contactPerson"
            label="Contact Person"
          >
            <Input placeholder="e.g. Alice Wang" />
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
            <Input placeholder="alice@example.com" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="phone"
            label="Phone"
          >
            <Input placeholder="555-0101" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="category"
            label="Category"
          >
            <Input placeholder="e.g. Hardware" />
          </Form.Item>
        </Col>
      </Row>
    </DataForm>
  );
}
