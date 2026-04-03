'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, InputNumber, Select, DatePicker, Row, Col, message, Spin } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

export default function CreateQuotePage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, dealsRes] = await Promise.all([
          api.get('/modules/customers?take=100'),
          api.get('/modules/deals?take=100'),
        ]);
        setCustomers(customersRes.items || []);
        setDeals(dealsRes.items || []);
      } catch (error: any) {
        message.error(`Failed to fetch data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      await api.post('/modules/quotes', values);
      message.success('Quote created successfully');
      router.push('/quotes');
    } catch (error: any) {
      message.error(`Failed to create quote: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

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
        loading={submitting}
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
                parser={value => value!.replace(/\$\s?|(,*)/g, '') as unknown as 0}
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
              name="dealId"
              label="Related Deal"
              rules={[{ required: true, message: 'Please select a deal' }]}
            >
              <Select placeholder="Select deal">
                {deals.map(deal => (
                  <Option key={deal.id} value={deal.id}>{deal.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </DataForm>
    </div>
  );
}
