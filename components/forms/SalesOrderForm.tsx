'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Row, Col, message, Spin } from 'antd';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

interface SalesOrderFormProps {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SalesOrderForm({ id, onSuccess, onCancel }: SalesOrderFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersData, quotesData] = await Promise.all([
          api.get('/modules/customers?take=100'),
          api.get('/modules/quotes?take=100'),
        ]);
        setCustomers(customersData.items || []);
        setQuotes(quotesData.items || []);
      } catch (error: any) {
        message.error(`Failed to fetch data: ${error.message}`);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchSalesOrder = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/modules/sales-orders/${id}`);
          form.setFieldsValue(response);
        } catch (error: any) {
          message.error(`Failed to fetch sales order: ${error.message}`);
          onCancel();
        } finally {
          setLoading(false);
        }
      };
      fetchSalesOrder();
    } else {
      form.resetFields();
    }
  }, [id, form, onCancel]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      if (id) {
        await api.patch(`/modules/sales-orders/${id}`, values);
        message.success('Sales Order updated successfully');
      } else {
        await api.post('/modules/sales-orders', values);
        message.success('Sales Order created successfully');
      }
      onSuccess();
    } catch (error: any) {
      message.error(`Failed to save sales order: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

  return (
    <DataForm 
      form={form} 
      onFinish={onFinish} 
      onCancel={onCancel}
      submitLabel={id ? "Save Changes" : "Create Order"}
      loading={submitting}
      inDrawer={true}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="orderNumber"
            label="Order Number"
            rules={[{ required: true, message: 'Please enter order number' }]}
          >
            <Input placeholder="e.g. SO-2026-501" />
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
            name="quoteId"
            label="Quote"
            rules={[{ required: true, message: 'Please select a quote' }]}
          >
            <Select placeholder="Select quote">
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
            initialValue="DRAFT"
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
            initialValue="UNPAID"
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
  );
}
