'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Tag, message, TablePaginationConfig } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { api } from '@/lib/api';

export default function DealsPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchDeals = useCallback(async (current: number, pageSize: number) => {
    setLoading(true);
    try {
      const skip = (current - 1) * pageSize;
      const response = await api.get(`/modules/deals?skip=${skip}&take=${pageSize}`);
      setData(response.items);
      setPagination(prev => ({
        ...prev,
        current,
        pageSize,
        total: response.total,
      }));
    } catch (error: any) {
      message.error(`Failed to fetch deals: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals(pagination.current || 1, pagination.pageSize || 10);
  }, [fetchDeals]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchDeals(newPagination.current || 1, newPagination.pageSize || 10);
  };

  const handleDelete = async (record: any) => {
    try {
      await api.delete(`/modules/deals/${record.id}`);
      message.success('Deal deleted successfully');
      fetchDeals(pagination.current || 1, pagination.pageSize || 10);
    } catch (error: any) {
      message.error(`Failed to delete deal: ${error.message}`);
    }
  };

  const columns = [
    {
      title: 'Deal Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => value ? `$${value.toLocaleString()}` : '-',
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage: string) => (
        <Tag color={stage === 'WON' ? 'green' : stage === 'LOST' ? 'red' : 'blue'}>
          {stage}
        </Tag>
      ),
    },
    {
      title: 'Expected Close',
      dataIndex: 'expectedCloseDate',
      key: 'expectedCloseDate',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer: any) => customer?.name || '-',
    },
  ];

  return (
    <div>
      <ModuleHeader
        title="Deals"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Deals' },
        ]}
        primaryAction={{
          label: 'Create Deal',
          onClick: () => router.push('/deals/create'),
          icon: <DollarOutlined />,
        }}
      />
      <DataTable
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        onView={(record) => router.push(`/deals/${record.id}`)}
        onEdit={(record) => router.push(`/deals/${record.id}/edit`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
