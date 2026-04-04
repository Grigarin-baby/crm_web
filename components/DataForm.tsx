'use client';

import React from 'react';
import { Form, Card, Button, Space } from 'antd';
import type { FormProps } from 'antd';

interface DataFormProps extends FormProps {
  children: React.ReactNode;
  onCancel?: () => void;
  submitLabel?: string;
  loading?: boolean;
  inDrawer?: boolean;
}

const DataForm: React.FC<DataFormProps> = ({
  children,
  onCancel,
  submitLabel = 'Submit',
  loading,
  inDrawer = false,
  ...formProps
}) => {
  const content = (
    <Form
      layout="vertical"
      size="large"
      {...formProps}
      style={{ display: 'flex', flexDirection: 'column', height: inDrawer ? '100%' : 'auto', ...formProps.style }}
    >
      <div style={{ flex: 1, overflowY: inDrawer ? 'auto' : 'visible' }}>
        {children}
      </div>
      
      <div style={{ marginTop: 24, borderTop: '1px solid #f0f0f0', paddingTop: 24, textAlign: 'right' }}>
        <Space>
          {onCancel && (
            <Button onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          )}
          <Button type="primary" htmlType="submit" loading={loading}>
            {submitLabel}
          </Button>
        </Space>
      </div>
    </Form>
  );

  if (inDrawer) {
    return content;
  }

  return (
    <Card bordered={false}>
      {content}
    </Card>
  );
};

export default DataForm;