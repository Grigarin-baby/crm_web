'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { message, TablePaginationConfig } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { api } from '@/lib/api';

export default function QuotesPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchQuotes = useCallback(async (current: number, pageSize: number) => {
    setLoading(true);
    try {
      const skip = (current - 1) * pageSize;
      const response = await api.get(`/modules/quotes?skip=${skip}&take=${pageSize}`);
      setData(response.items);
      setPagination(prev => ({
        ...prev,
        current,
        pageSize,
        total: response.total,
      }));
    } catch (error: any) {
      message.error(`Failed to fetch quotes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes(pagination.current || 1, pagination.pageSize || 10);
  }, [fetchQuotes]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchQuotes(newPagination.current || 1, newPagination.pageSize || 10);
  };

  const handleDelete = async (record: any) => {
    try {
      await api.delete(`/modules/quotes/${record.id}`);
      message.success('Quote deleted successfully');
      fetchQuotes(pagination.current || 1, pagination.pageSize || 10);
    } catch (error: any) {
      message.error(`Failed to delete quote: ${error.message}`);
    }
  };

  const columns = [
    {
      title: 'Quote Number',
      dataIndex: 'quoteNumber',
      key: 'quoteNumber',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer: any) => customer?.name || '-',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `$${amount.toLocaleString()}`,
    },
    {
      title: 'Valid Until',
      dataIndex: 'validUntil',
      key: 'validUntil',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: 'Deal',
      dataIndex: 'deal',
      key: 'deal',
      render: (deal: any) => deal?.name || '-',
    },
  ];

  return (
    <div>
      <ModuleHeader
        title="Quotes"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Quotes' },
        ]}
        primaryAction={{
          label: 'Create Quote',
          onClick: () => router.push('/quotes/create'),
          icon: <FileTextOutlined />,
        }}
      />
      <DataTable
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        onView={(record) => router.push(`/quotes/${record.id}`)}
        onEdit={(record) => router.push(`/quotes/${record.id}/edit`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
