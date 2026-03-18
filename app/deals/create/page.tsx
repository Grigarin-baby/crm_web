'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Select, InputNumber, DatePicker, Row, Col, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { mockCustomers } from '@/lib/mockData';

const { Option } = Select;

export default function CreateDealPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values:', values);
    message.success('Deal created successfully (mock)');
    router.push('/deals');
  };

  return (
    <div>
      <ModuleHeader
        title="Create New Deal"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Deals', href: '/deals' },
          { title: 'Create' },
        ]}
        backAction
      />
      
      <DataForm 
        form={form} 
        onFinish={onFinish} 
        onCancel={() => router.push('/deals')}
        submitLabel="Create Deal"
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Deal Name"
              rules={[{ required: true, message: 'Please enter deal name' }]}
            >
              <Input placeholder="e.g. Q2 Server Expansion" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="value"
              label="Deal Value"
              rules={[{ required: true, message: 'Please enter value' }]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                prefix="$" 
                placeholder="0.00"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="stage"
              label="Stage"
              initialValue="PROSPECTING"
            >
              <Select>
                <Option value="PROSPECTING">Prospecting</Option>
                <Option value="QUALIFICATION">Qualification</Option>
                <Option value="PROPOSAL">Proposal</Option>
                <Option value="NEGOTIATION">Negotiation</Option>
                <Option value="CLOSED_WON">Closed Won</Option>
                <Option value="CLOSED_LOST">Closed Lost</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
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
          <Col span={12}>
            <Form.Item
              name="expectedCloseDate"
              label="Expected Close Date"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </DataForm>
    </div>
  );
}
