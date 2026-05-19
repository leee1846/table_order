import React, { useState } from 'react';
import { Modal, Input, Table, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CloseOutlined } from '@ant-design/icons';
import { useGetStoreGroupList } from '@repo/api/queries';
import type { IStoreGroup } from '@repo/api/types';

export interface StoreGroupAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (selectedKeys: React.Key[]) => void;
}

const StoreGroupAddModal: React.FC<StoreGroupAddModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: storeGroupResponse, isFetching } = useGetStoreGroupList({
    page: currentPage - 1,
    size: pageSize,
    name: searchText || undefined,
  });

  const storeGroups = storeGroupResponse?.data?.content || [];
  const totalElements = storeGroupResponse?.data?.totalElements || 0;

  const handleAdd = () => {
    onAdd(selectedRowKeys);
    setSelectedRowKeys([]); // 선택 초기화
    setSearchText('');
    setSearchInputValue('');
    setCurrentPage(1);
    onClose();
  };

  const handleCancel = () => {
    setSelectedRowKeys([]);
    setSearchText('');
    setSearchInputValue('');
    setCurrentPage(1);
    onClose();
  };

  const handleSearch = () => {
    setSearchText(searchInputValue);
    setCurrentPage(1);
  };

  const columns: ColumnsType<IStoreGroup> = [
    { title: '매장 그룹명', dataIndex: 'groupName', key: 'groupName' },
    {
      title: '포함 매장 수',
      dataIndex: 'storeCount',
      key: 'storeCount',
      width: 120,
      align: 'center',
      render: (val) => `${val ?? 0}개`,
    },
  ];

  return (
    <Modal
      title={
        <span style={{ color: '#fff', fontSize: '18px' }}>매장 그룹 추가</span>
      }
      open={isOpen}
      onCancel={handleCancel}
      width={600}
      closeIcon={<CloseOutlined style={{ color: '#fff' }} />}
      styles={{
        header: {
          backgroundColor: '#1d2a6d',
          padding: '20px 24px',
          margin: 0,
          borderRadius: '8px 8px 0 0',
        },
        body: { padding: '24px' },
        container: { padding: 0, overflow: 'hidden' },
      }}
      footer={
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
            padding: '16px 24px',
            borderTop: '1px solid #f0f0f0',
          }}
        >
          <Button size="large" onClick={handleCancel}>
            취소
          </Button>
          <Button
            size="large"
            type="primary"
            onClick={handleAdd}
            disabled={selectedRowKeys.length === 0}
          >
            추가
          </Button>
        </div>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="그룹명을 검색하세요"
            allowClear
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 240, borderRadius: '6px' }}
          />
          <Button
            type="primary"
            style={{ borderRadius: '6px' }}
            onClick={handleSearch}
          >
            검색
          </Button>
        </Space>
      </div>
      <Table
        rowKey={(record) => String(record.storeGroupSeq)}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
          preserveSelectedRowKeys: true,
        }}
        columns={columns}
        dataSource={storeGroups}
        loading={isFetching}
        pagination={{
          current: currentPage,
          pageSize,
          total: totalElements,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
        size="small"
      />
    </Modal>
  );
};

export default StoreGroupAddModal;
