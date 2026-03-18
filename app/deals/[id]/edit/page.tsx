'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Select, InputNumber, DatePicker, Row, Col, message } from 'antd';
import dayjs from 'dayjs';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { mockDeals, mockCustomers } from '@/lib/mockData';

const { Option } = Select;

export default function EditDealPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  
  const deal = mockDeals.find(d => d.id === params.id) || mockDeals[0];

  useEffect(() => {
    form.setFieldsValue({
      ...deal,
      expectedCloseDate: deal.expectedCloseDate ? dayjs(deal.expectedCloseDate) : null,
    });
  }, [deal, form]);

  const onFinish = (values: any) => {
    console.log('Updated values:', values);
    message.success('Deal updated successfully (mock)');
    router.push(`/deals/${deal.id}`);
  };

  return (
    <div>
      <ModuleHeader
        title={`Edit Deal: ${deal.name}`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Deals', href: '/deals' },
          { title: 'Details', href: `/deals/${deal.id}` },
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
              label="Deal Name"
              rules={[{ required: true, message: 'Please enter deal name' }]}
            >
              <Input />
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
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="stage"
              label="Stage"
            >
              <Select>
                <Option value="PROSPECTING">Prospecting</Option>
                <Option value="QUALIFICATION">Qualification</Option>
                <Option value="PROPOSAL">Proposal</Option>
                <Option value="NEGOTIATION">Negotiation</Option>
                <Option value="WON">Won</Option>
                <Option value="LOST">Lost</Option>
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
              <Select>
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
