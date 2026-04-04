'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Row, Col, message, Spin } from 'antd';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { TextArea } = Input;

interface ProductFormProps {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ id, onSuccess, onCancel }: ProductFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/modules/products/${id}`);
          form.setFieldsValue(response);
        } catch (error: any) {
          message.error(`Failed to fetch product: ${error.message}`);
          onCancel();
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else {
      form.resetFields();
    }
  }, [id, form, onCancel]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      if (id) {
        await api.patch(`/modules/products/${id}`, values);
        message.success('Product updated successfully');
      } else {
        await api.post('/modules/products', values);
        message.success('Product created successfully');
      }
      onSuccess();
    } catch (error: any) {
      message.error(`Failed to save product: ${error.message}`);
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
      submitLabel={id ? "Save Changes" : "Create Product"}
      loading={submitting}
      inDrawer={true}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input placeholder="e.g. Premium Subscription" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="sku"
            label="SKU"
            rules={[{ required: true, message: 'Please enter SKU' }]}
          >
            <Input placeholder="e.g. SUB-PRM" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '') as unknown as 0}
              min={0}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={4} placeholder="Enter product description" />
          </Form.Item>
        </Col>
      </Row>
    </DataForm>
  );
}
