'use client';

import React from 'react';
import { Form, Card, Button, Space } from 'antd';
import type { FormProps } from 'antd';

interface DataFormProps extends FormProps {
  children: React.ReactNode;
  onCancel?: () => void;
  submitLabel?: string;
  loading?: boolean;
}

const DataForm: React.FC<DataFormProps> = ({
  children,
  onCancel,
  submitLabel = 'Submit',
  loading,
  ...formProps
}) => {
  return (
    <Card bordered={false}>
      <Form
        layout="vertical"
        size="large"
        {...formProps}
      >
        {children}
        
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
    </Card>
  );
};

export default DataForm;
