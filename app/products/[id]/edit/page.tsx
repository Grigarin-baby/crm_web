'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, InputNumber, Row, Col, message, Spin, Result, Button } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { TextArea } = Input;

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/products/${params.id}`);
        form.setFieldsValue(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to fetch product for editing');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, form]);

  const onFinish = async (values: any) => {
    try {
      setSubmitting(true);
      await api.patch(`/products/${params.id}`, values);
      message.success('Product updated successfully');
      router.push(`/products/${params.id}`);
    } catch (err: any) {
      console.error('Error updating product:', err);
      message.error(err.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" description="Loading product data..." />
      </div>
    );
  }

  if (error) {
    return (
      <Result
        status="error"
        title="Error Loading Product"
        subTitle={error}
        extra={[
          <Button type="primary" key="back" onClick={() => router.push('/products')}>
            Back to Products
          </Button>
        ]}
      />
    );
  }

  return (
    <div>
      <ModuleHeader
        title={`Edit Product: ${form.getFieldValue('name')}`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Products', href: '/products' },
          { title: 'Details', href: `/products/${params.id}` },
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
              label="Product Name"
              rules={[{ required: true, message: 'Please enter product name' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="sku"
              label="SKU"
            >
              <Input />
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
              <TextArea rows={4} />
            </Form.Item>
          </Col>
        </Row>
      </DataForm>
    </div>
  );
}
