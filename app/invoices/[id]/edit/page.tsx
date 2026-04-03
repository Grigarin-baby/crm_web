'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, InputNumber, Select, Row, Col, message, Spin, DatePicker } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';
import dayjs from 'dayjs';

const { Option } = Select;

export default function EditInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoiceRes, customersRes] = await Promise.all([
          api.get(`/modules/invoices/${params.id}`),
          api.get('/modules/customers?take=100'),
        ]);
        setCustomers(customersRes.items);
        form.setFieldsValue({
          ...invoiceRes,
          invoiceDate: invoiceRes.invoiceDate ? dayjs(invoiceRes.invoiceDate) : null,
        });
      } catch (error: any) {
        message.error(`Failed to fetch data: ${error.message}`);
        router.push('/invoices');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchData();
  }, [params.id, form, router]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const data = {
        ...values,
        invoiceDate: values.invoiceDate ? values.invoiceDate.toISOString() : null,
      };
      await api.patch(`/modules/invoices/${params.id}`, data);
      message.success('Invoice updated successfully');
      router.push(`/invoices/${params.id}`);
    } catch (error: any) {
      message.error(`Failed to update invoice: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

  return (
    <div>
      <ModuleHeader
        title="Edit Invoice"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Invoices', href: '/invoices' },
          { title: 'Details', href: `/invoices/${params.id}` },
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
          <Col span={12}>
            <Form.Item
              name="invoiceNumber"
              label="Invoice Number"
              rules={[{ required: true, message: 'Please enter invoice number' }]}
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
    </div>
  );
}
