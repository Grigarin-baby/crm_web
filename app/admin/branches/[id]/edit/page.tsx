'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, message, Spin } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

export default function EditBranchPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const response = await api.get(`/core/branches/${params.id}`);
        form.setFieldsValue(response);
      } catch (error: any) {
        message.error(`Failed to fetch branch: ${error.message}`);
        router.push('/admin/branches');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchBranch();
  }, [params.id, form, router]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      await api.patch(`/core/branches/${params.id}`, values);
      message.success('Branch updated successfully');
      router.push('/admin/branches');
    } catch (error: any) {
      message.error(`Failed to update branch: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" description="Loading branch..." /></div>;

  return (
    <div>
      <ModuleHeader
        title="Edit Branch"
        breadcrumbItems={[
          { title: 'SaaS Dashboard', href: '/' },
          { title: 'Branches', href: '/admin/branches' },
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
              name="name"
              label="Branch Name"
              rules={[{ required: true, message: 'Please enter branch name' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="organizationId"
              label="Organization ID"
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="address"
              label="Address"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </DataForm>
    </div>
  );
}
