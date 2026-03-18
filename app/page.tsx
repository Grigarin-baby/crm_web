'use client';

import React from 'react';
import { Row, Col, Card, Statistic, Typography, Divider, List, Tag } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  UserOutlined, 
  DollarOutlined, 
  RocketOutlined, 
  CheckCircleOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Dashboard() {
  const recentActivities = [
    { title: 'New lead created: John Doe', time: '2 hours ago', type: 'Lead' },
    { title: 'Deal "Project X" moved to Negotiation', time: '4 hours ago', type: 'Deal' },
    { title: 'Quote sent to Acme Corp', time: 'Yesterday', type: 'Quote' },
    { title: 'Task completed: Follow up with Sarah', time: 'Yesterday', type: 'Task' },
  ];

  return (
    <div>
      <Title level={2}>Dashboard Overview</Title>
      <Text type="secondary">Welcome back! Here is what is happening with your organization today.</Text>
      
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Revenue"
              value={45200}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="USD"
              valueStyle={{ color: '#3f8600' }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="green"><ArrowUpOutlined /> 12%</Tag>
              <Text type="secondary">since last month</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Active Deals"
              value={18}
              prefix={<RocketOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="blue"><ArrowUpOutlined /> 5%</Tag>
              <Text type="secondary">new deals added</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="New Leads"
              value={124}
              prefix={<UserOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="red"><ArrowDownOutlined /> 2%</Tag>
              <Text type="secondary">conversion rate</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Tasks Completed"
              value={92}
              suffix="/ 100"
              prefix={<CheckCircleOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">8 tasks remaining</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Recent Activity" bordered={false}>
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<a href="#">{item.title}</a>}
                    description={item.time}
                  />
                  <Tag color={item.type === 'Deal' ? 'gold' : 'blue'}>{item.type}</Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
