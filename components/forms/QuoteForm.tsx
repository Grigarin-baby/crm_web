'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, DatePicker, Row, Col, message, Spin } from 'antd';
import dayjs from 'dayjs';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

interface QuoteFormProps {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function QuoteForm({ id, onSuccess, onCancel }: QuoteFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
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
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchQuote = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/modules/quotes/${id}`);
          if (response.validUntil) {
            response.validUntil = dayjs(response.validUntil);
          }
          form.setFieldsValue(response);
        } catch (error: any) {
          message.error(`Failed to fetch quote: ${error.message}`);
          onCancel();
        } finally {
          setLoading(false);
        }
      };
      fetchQuote();
    } else {
      form.resetFields();
    }
  }, [id, form, onCancel]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const data = {
        ...values,
        validUntil: values.validUntil ? values.validUntil.toISOString() : null,
      };

      if (id) {
        await api.patch(`/modules/quotes/${id}`, data);
        message.success('Quote updated successfully');
      } else {
        await api.post('/modules/quotes', data);
        message.success('Quote created successfully');
      }
      onSuccess();
    } catch (error: any) {
      message.error(`Failed to save quote: ${error.message}`);
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
      submitLabel={id ? "Save Changes" : "Create Quote"}
      loading={submitting}
      inDrawer={true}
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
  );
}
