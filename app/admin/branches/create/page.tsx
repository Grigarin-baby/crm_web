'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

export default function CreateBranchPage() {
  const router = useRouter();
  const [form] = Form.useForm();
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

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      // For SaaS Admin, we send organizationId in the body or use header.
      // Our refactored controller uses TenantId (header), but if provided in body it might work if we updated service.
      // Let's assume the SaaS Admin selects an organization from the dropdown.
      await api.post('/core/branches', values, {
        headers: { 'x-organization-id': values.organizationId }
      });
      message.success('Branch created successfully');
      router.push('/admin/branches');
    } catch (error: any) {
      message.error(`Failed to create branch: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <ModuleHeader
        title="Create New Branch"
        breadcrumbItems={[
          { title: 'SaaS Dashboard', href: '/' },
          { title: 'Branches', href: '/admin/branches' },
          { title: 'Create' },
        ]}
        backAction
      />
      
      <DataForm 
        form={form} 
        onFinish={onFinish} 
        onCancel={() => router.push('/admin/branches')}
        submitLabel="Create Branch"
        loading={submitting}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="organizationId"
              label="Assign to Organization"
              rules={[{ required: true, message: 'Please select an organization' }]}
            >
              <Select placeholder="Select organization" loading={loadingOrgs}>
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
    </div>
  );
}
