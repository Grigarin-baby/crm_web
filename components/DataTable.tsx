'use client';

import React from 'react';
import { Table, Button, Space, Popconfirm } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';

interface DataTableProps<T> {
  columns: ColumnsType<T>;
  dataSource: T[];
  onView?: (record: T) => void;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  loading?: boolean;
  rowKey?: string;
  pagination?: TablePaginationConfig | false;
  onChange?: (pagination: TablePaginationConfig) => void;
}

const DataTable = <T extends { id: string }>({
  columns,
  dataSource,
  onView,
  onEdit,
  onDelete,
  loading,
  rowKey = 'id',
  pagination,
  onChange,
}: DataTableProps<T>) => {
  const actionColumn = {
    title: 'Actions',
    key: 'actions',
    width: 150,
    render: (_: any, record: T) => (
      <Space size="middle">
        {onView && (
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => onView(record)} 
          />
        )}
        {onEdit && (
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)} 
          />
        )}
        {onDelete && (
          <Popconfirm
            title="Are you sure you want to delete this record?"
            onConfirm={() => onDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        )}
      </Space>
    ),
  };

  const allColumns = [...columns, actionColumn];

  return (
    <Table
      columns={allColumns}
      dataSource={dataSource}
      rowKey={rowKey}
      loading={loading}
      pagination={pagination ? {
        ...pagination,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} items`,
      } : false}
      onChange={(p) => onChange && onChange(p)}
    />
  );
};

export default DataTable;
