'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Select, InputNumber, DatePicker, Row, Col, message, Spin } from 'antd';
import dayjs from 'dayjs';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

export default function EditDealPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dealResponse, customersResponse] = await Promise.all([
          api.get(`/modules/deals/${params.id}`),
          api.get('/modules/customers?take=100'),
        ]);
        
        setCustomers(customersResponse.items || []);
        
        form.setFieldsValue({
          ...dealResponse,
          expectedCloseDate: dealResponse.expectedCloseDate ? dayjs(dealResponse.expectedCloseDate) : null,
        });
      } catch (error: any) {
        message.error(`Failed to fetch data: ${error.message}`);
        router.push('/deals');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchData();
  }, [params.id, form, router]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      await api.patch(`/modules/deals/${params.id}`, values);
      message.success('Deal updated successfully');
      router.push(`/deals/${params.id}`);
    } catch (error: any) {
      message.error(`Failed to update deal: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

  return (
    <div>
      <ModuleHeader
        title="Edit Deal"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Deals', href: '/deals' },
          { title: 'Details', href: `/deals/${params.id}` },
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
              name="customerId"
              label="Customer"
              rules={[{ required: true, message: 'Please select a customer' }]}
            >
              <Select placeholder="Select a customer">
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
