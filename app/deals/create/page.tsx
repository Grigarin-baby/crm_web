'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Select, InputNumber, DatePicker, Row, Col, message, Spin } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

export default function CreateDealPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get('/modules/customers?take=100');
        setCustomers(response.items || []);
      } catch (error: any) {
        message.error(`Failed to fetch customers: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      await api.post('/modules/deals', values);
      message.success('Deal created successfully');
      router.push('/deals');
    } catch (error: any) {
      message.error(`Failed to create deal: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

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
        loading={submitting}
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
              initialValue="NEW"
            >
              <Select>
                <Option value="NEW">New</Option>
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
              name="customerId"
              label="Customer"
              rules={[{ required: true, message: 'Please select a customer' }]}
            >
              <Select placeholder="Select customer">
                {customers.map(customer => (
                  <Option key={customer.id} value={customer.id}>{customer.name}</Option>
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
