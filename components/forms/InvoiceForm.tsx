'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, DatePicker, Row, Col, message, Spin } from 'antd';
import dayjs from 'dayjs';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

interface InvoiceFormProps {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function InvoiceForm({ id, onSuccess, onCancel }: InvoiceFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get('/modules/customers?take=100');
        setCustomers(response.items || []);
      } catch (error: any) {
        message.error(`Failed to fetch customers: ${error.message}`);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchInvoice = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/modules/invoices/${id}`);
          if (response.invoiceDate) {
            response.invoiceDate = dayjs(response.invoiceDate);
          }
          form.setFieldsValue(response);
        } catch (error: any) {
          message.error(`Failed to fetch invoice: ${error.message}`);
          onCancel();
        } finally {
          setLoading(false);
        }
      };
      fetchInvoice();
    } else {
      form.resetFields();
    }
  }, [id, form, onCancel]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const data = {
        ...values,
        invoiceDate: values.invoiceDate ? values.invoiceDate.toISOString() : null,
      };

      if (id) {
        await api.patch(`/modules/invoices/${id}`, data);
        message.success('Invoice updated successfully');
      } else {
        await api.post('/modules/invoices', data);
        message.success('Invoice created successfully');
      }
      onSuccess();
    } catch (error: any) {
      message.error(`Failed to save invoice: ${error.message}`);
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
      submitLabel={id ? "Save Changes" : "Create Invoice"}
      loading={submitting}
      inDrawer={true}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="invoiceNumber"
            label="Invoice Number"
            rules={[{ required: true, message: 'Please enter invoice number' }]}
          >
            <Input placeholder="e.g. INV-2026-901" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="customerId"
            label="Customer"
            rules={[{ required: true, message: 'Please select a customer' }]}
          >
            <Select placeholder="Select customer" allowClear>
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
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please enter amount' }]}    
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
            name="invoiceDate"
            label="Invoice Date"
          >
            <DatePicker style={{ width: '100%' }} />
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
              <Option value="OVERDUE">OVERDUE</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </DataForm>
  );
}
