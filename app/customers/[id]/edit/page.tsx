'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { mockCustomers } from '@/lib/mockData';

const { Option } = Select;

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  
  const customer = mockCustomers.find(c => c.id === params.id) || mockCustomers[0];

  useEffect(() => {
    form.setFieldsValue(customer);
  }, [customer, form]);

  const onFinish = (values: any) => {
    console.log('Updated values:', values);
    message.success('Customer updated successfully (mock)');
    router.push(`/customers/${customer.id}`);
  };

  return (
    <div>
      <ModuleHeader
        title={`Edit Customer: ${customer.name}`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Customers', href: '/customers' },
          { title: 'Details', href: `/customers/${customer.id}` },
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
          <Col span={24}>
            <Form.Item
              name="name"
              label="Customer Name"
              rules={[{ required: true, message: 'Please enter customer name' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="industry"
              label="Industry"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Status"
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
          <Input.TextArea rows={3} />
        </Form.Item>
      </DataForm>
    </div>
  );
}
