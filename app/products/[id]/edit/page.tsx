'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, InputNumber, Row, Col, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { mockProducts } from '@/lib/mockData';

const { TextArea } = Input;

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  
  const product = mockProducts.find(p => p.id === params.id) || mockProducts[0];

  useEffect(() => {
    form.setFieldsValue(product);
  }, [product, form]);

  const onFinish = (values: any) => {
    console.log('Updated values:', values);
    message.success('Product updated successfully (mock)');
    router.push(`/products/${product.id}`);
  };

  return (
    <div>
      <ModuleHeader
        title={`Edit Product: ${product.name}`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Products', href: '/products' },
          { title: 'Details', href: `/products/${product.id}` },
          { title: 'Edit' },
        ]}
        backAction
      />
      
      <DataForm 
        form={form} 
        onFinish={onFinish} 
        onCancel={() => router.back()}
        submitLabel="Save Changes"
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
              rules={[{ required: true, message: 'Please enter SKU' }]}
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
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
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
