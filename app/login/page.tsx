'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAppDispatch } from '@/store';
import { setCredentials } from '@/store/authSlice';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await api.post('/core/auth/login', {
        email: values.email,
        password: values.password,
      });

      const { access_token, refresh_token, user } = response;
      
      dispatch(setCredentials({
        accessToken: access_token,
        user: {
          id: user.id,
          email: user.email,
          organizationId: user.organizationId,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          organization: user.organization,
          branch: user.branch,
        },
      }));

      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('organizationId', user.organizationId);

      message.success('Login successful');
      router.push('/');
    } catch (error: any) {
      message.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5' 
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ color: '#1677ff', marginBottom: 8 }}>CRM Portal</Title>
          <Text type="secondary">Enter your credentials to access your dashboard</Text>
        </div>

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'Invalid email format' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a style={{ float: 'right' }} href="">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
