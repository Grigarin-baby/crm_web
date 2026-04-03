'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, message, Spin } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

export default function EditSalesOrderPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderData, customersData, quotesData] = await Promise.all([
          api.get(`/modules/sales-orders/${params.id}`),
          api.get('/modules/customers'),
          api.get('/modules/quotes'),
        ]);
        setCustomers(customersData.items || []);
        setQuotes(quotesData.items || []);
        form.setFieldsValue(orderData);
      } catch (error: any) {
        message.error(`Failed to fetch data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchData();
    }
  }, [params.id, form]);

  const onFinish = async (values: any) => {
    try {
      await api.patch(`/modules/sales-orders/${params.id}`, values);
      message.success('Sales Order updated successfully');
      router.push(`/sales-orders/${params.id}`);
    } catch (error: any) {
      message.error(`Failed to update sales order: ${error.message}`);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  }

  return (
    <div>
      <ModuleHeader
        title={`Edit Sales Order`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Sales Orders', href: '/sales-orders' },
          { title: 'Details', href: `/sales-orders/${params.id}` },
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
              name="orderNumber"
              label="Order Number"
              rules={[{ required: true, message: 'Please enter order number' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="customerId"
              label="Customer"
              rules={[{ required: true, message: 'Please select a customer' }]}
            >
              <Select placeholder="Select Customer">
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
              name="quoteId"
              label="Quote"
              rules={[{ required: true, message: 'Please select a quote' }]}
            >
              <Select placeholder="Select Quote">
                {quotes.map(quote => (
                  <Option key={quote.id} value={quote.id}>{quote.quoteNumber}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="orderStatus"
              label="Order Status"
            >
              <Select>
                <Option value="DRAFT">DRAFT</Option>
                <Option value="CONFIRMED">CONFIRMED</Option>
                <Option value="SHIPPED">SHIPPED</Option>
                <Option value="DELIVERED">DELIVERED</Option>
                <Option value="CANCELLED">CANCELLED</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="paymentStatus"
              label="Payment Status"
            >
              <Select>
                <Option value="UNPAID">UNPAID</Option>
                <Option value="PAID">PAID</Option>
                <Option value="PARTIAL">PARTIAL</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </DataForm>
    </div>
  );
}
