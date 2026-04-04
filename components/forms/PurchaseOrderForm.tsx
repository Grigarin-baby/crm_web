'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, DatePicker, Row, Col, message, Spin } from 'antd';
import dayjs from 'dayjs';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

interface PurchaseOrderFormProps {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PurchaseOrderForm({ id, onSuccess, onCancel }: PurchaseOrderFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await api.get('/modules/vendors?take=100');
        setVendors(data.items || []);
      } catch (err) {
        message.error('Failed to load vendors');
      }
    };
    fetchVendors();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchPurchaseOrder = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/modules/purchase-orders/${id}`);
          if (response.expectedDate) {
            response.expectedDate = dayjs(response.expectedDate);
          }
          form.setFieldsValue(response);
        } catch (error: any) {
          message.error(`Failed to fetch purchase order: ${error.message}`);
          onCancel();
        } finally {
          setLoading(false);
        }
      };
      fetchPurchaseOrder();
    } else {
      form.resetFields();
    }
  }, [id, form, onCancel]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const data = {
        ...values,
        expectedDate: values.expectedDate ? values.expectedDate.toISOString() : null,
      };

      if (id) {
        await api.patch(`/modules/purchase-orders/${id}`, data);
        message.success('Purchase Order updated successfully');
      } else {
        await api.post('/modules/purchase-orders', data);
        message.success('Purchase Order created successfully');
      }
      onSuccess();
    } catch (error: any) {
      message.error(`Failed to save purchase order: ${error.message}`);
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
      submitLabel={id ? "Save Changes" : "Create PO"}
      loading={submitting}
      inDrawer={true}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="poNumber"
            label="PO Number"
            rules={[{ required: true, message: 'Please enter PO number' }]}
          >
            <Input placeholder="e.g. PO-2026-701" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="vendorId"
            label="Vendor"
            rules={[{ required: true, message: 'Please select a vendor' }]}
          >
            <Select placeholder="Select vendor">
              {vendors.map(vendor => (
                <Option key={vendor.id} value={vendor.id}>{vendor.name}</Option>
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
            name="expectedDate"
            label="Expected Date"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="status"
            label="Status"
            initialValue="PENDING"
          >
            <Select>
              <Option value="PENDING">PENDING</Option>
              <Option value="ISSUED">ISSUED</Option>
              <Option value="RECEIVED">RECEIVED</Option>
              <Option value="CANCELLED">CANCELLED</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </DataForm>
  );
}
