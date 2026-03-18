'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, InputNumber, Select, Row, Col, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { mockQuotes, mockCustomers } from '@/lib/mockData';

const { Option } = Select;

export default function EditQuotePage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  
  const quote = mockQuotes.find(q => q.id === params.id) || mockQuotes[0];

  useEffect(() => {
    form.setFieldsValue(quote);
  }, [quote, form]);

  const onFinish = (values: any) => {
    console.log('Updated values:', values);
    message.success('Quote updated successfully (mock)');
    router.push(`/quotes/${quote.id}`);
  };

  return (
    <div>
      <ModuleHeader
        title={`Edit Quote: ${quote.quoteNumber}`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Quotes', href: '/quotes' },
          { title: 'Details', href: `/quotes/${quote.id}` },
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
              name="quoteNumber"
              label="Quote Number"
              rules={[{ required: true, message: 'Please enter quote number' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="customerName"
              label="Customer"
              rules={[{ required: true, message: 'Please select a customer' }]}
            >
              <Select>
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
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="dealName"
              label="Related Deal"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </DataForm>
    </div>
  );
}
