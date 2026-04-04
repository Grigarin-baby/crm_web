'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Row, Col, message, Spin } from 'antd';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

interface BranchFormProps {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BranchForm({ id, onSuccess, onCancel }: BranchFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(false);

  useEffect(() => {
    const fetchOrgs = async () => {
      setLoadingOrgs(true);
      try {
        const response = await api.get('/core/organizations?take=100');
        setOrganizations(response.items || []);
      } catch (error: any) {
        message.error(`Failed to fetch organizations: ${error.message}`);
      } finally {
        setLoadingOrgs(false);
      }
    };
    fetchOrgs();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchBranch = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/core/branches/${id}`);
          form.setFieldsValue(response);
        } catch (error: any) {
          message.error(`Failed to fetch branch: ${error.message}`);
          onCancel();
        } finally {
          setLoading(false);
        }
      };
      fetchBranch();
    } else {
      form.resetFields();
    }
  }, [id, form, onCancel]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      if (id) {
        await api.patch(`/core/branches/${id}`, values);
        message.success('Branch updated successfully');
      } else {
        await api.post('/core/branches', values, {
          headers: { 'x-organization-id': values.organizationId }
        });
        message.success('Branch created successfully');
      }
      onSuccess();
    } catch (error: any) {
      message.error(`Failed to save branch: ${error.message}`);
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
      submitLabel={id ? "Save Changes" : "Create Branch"}
      loading={submitting}
      inDrawer={true}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="organizationId"
            label="Assign to Organization"
            rules={[{ required: true, message: 'Please select an organization' }]}
          >
            <Select placeholder="Select organization" loading={loadingOrgs} disabled={!!id}>
              {organizations.map(org => (
                <Option key={org.id} value={org.id}>{org.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Branch Name"
            rules={[{ required: true, message: 'Please enter branch name' }]}
          >
            <Input placeholder="e.g. Downtown Office" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="address"
            label="Address"
          >
            <Input placeholder="Full physical address" />
          </Form.Item>
        </Col>
      </Row>
    </DataForm>
  );
}