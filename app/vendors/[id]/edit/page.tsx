'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Row, Col, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { mockVendors } from '@/lib/mockData';

export default function EditVendorPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  
  const vendor = mockVendors.find(v => v.id === params.id) || mockVendors[0];

  useEffect(() => {
    form.setFieldsValue(vendor);
  }, [vendor, form]);

  const onFinish = (values: any) => {
    console.log('Updated values:', values);
    message.success('Vendor updated successfully (mock)');
    router.push(`/vendors/${vendor.id}`);
  };

  return (
    <div>
      <ModuleHeader
        title={`Edit Vendor: ${vendor.name}`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Vendors', href: '/vendors' },
          { title: 'Details', href: `/vendors/${vendor.id}` },
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
              label="Vendor Name"
              rules={[{ required: true, message: 'Please enter vendor name' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="contactPerson"
              label="Contact Person"
            >
              <Input />
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
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Phone"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="category"
              label="Category"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </DataForm>
    </div>
  );
}
