'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, DatePicker, Row, Col, message, Spin } from 'antd';
import dayjs from 'dayjs';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

interface DealFormProps {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DealForm({ id, onSuccess, onCancel }: DealFormProps) {
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
      const fetchDeal = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/modules/deals/${id}`);
          if (response.expectedCloseDate) {
            response.expectedCloseDate = dayjs(response.expectedCloseDate);
          }
          form.setFieldsValue(response);
        } catch (error: any) {
          message.error(`Failed to fetch deal: ${error.message}`);
          onCancel();
        } finally {
          setLoading(false);
        }
      };
      fetchDeal();
    } else {
      form.resetFields();
    }
  }, [id, form, onCancel]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const data = {
        ...values,
        expectedCloseDate: values.expectedCloseDate ? values.expectedCloseDate.toISOString() : null,
      };

      if (id) {
        await api.patch(`/modules/deals/${id}`, data);
        message.success('Deal updated successfully');
      } else {
        await api.post('/modules/deals', data);
        message.success('Deal created successfully');
      }
      onSuccess();
    } catch (error: any) {
      message.error(`Failed to save deal: ${error.message}`);
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
      submitLabel={id ? "Save Changes" : "Create Deal"}
      loading={submitting}
      inDrawer={true}
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
  );
}
