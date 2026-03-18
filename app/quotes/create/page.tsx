'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, InputNumber, Select, DatePicker, Row, Col, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { mockCustomers } from '@/lib/mockData';

const { Option } = Select;

export default function CreateQuotePage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values:', values);
    message.success('Quote created successfully (mock)');
    router.push('/quotes');
  };

  return (
    <div>
      <ModuleHeader
        title="Create New Quote"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Quotes', href: '/quotes' },
          { title: 'Create' },
        ]}
        backAction
      />
      
      <DataForm 
        form={form} 
        onFinish={onFinish} 
        onCancel={() => router.push('/quotes')}
        submitLabel="Create Quote"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="quoteNumber"
              label="Quote Number"
              rules={[{ required: true, message: 'Please enter quote number' }]}
            >
              <Input placeholder="e.g. Q-2026-001" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="customerName"
              label="Customer"
              rules={[{ required: true, message: 'Please select a customer' }]}
            >
              <Select placeholder="Select customer">
                {mockCustomers.map(customer => (
                  <Option key={customer.id} value={customer.name}>{customer.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="totalAmount"
              label="Total Amount"
              rules={[{ required: true, message: 'Please enter total amount' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="validUntil"
              label="Valid Until"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="dealName"
              label="Related Deal"
            >
              <Input placeholder="e.g. Server Upgrade" />
            </Form.Item>
          </Col>
        </Row>
      </DataForm>
    </div>
  );
}
