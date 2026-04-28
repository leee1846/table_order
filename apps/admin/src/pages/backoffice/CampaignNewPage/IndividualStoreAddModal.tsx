import React, { useState } from 'react';
import { Modal, Input, Table, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CloseOutlined } from '@ant-design/icons';
import { useGetStoreList } from '@repo/api/queries';
import type { IStore } from '@repo/api/types';

export interface IndividualStoreAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (selectedStores: IStore[]) => void;
}

const IndividualStoreAddModal: React.FC<IndividualStoreAddModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [selectedStores, setSelectedStores] = useState<IStore[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data: storeResponse, isFetching } = useGetStoreList({
    page: currentPage - 1,
    size: pageSize,
    keyword: searchText || undefined,
    ungrouped: true,
  });

  const stores = storeResponse?.data?.content || [];
  const totalElements = storeResponse?.data?.totalCount || 0;

  const handleAdd = () => {
    onAdd(selectedStores);
    setSelectedStores([]); // 선택 초기화
    setSearchText('');
    setSearchInputValue('');
    setCurrentPage(1);
    onClose();
  };

  const handleCancel = () => {
    setSelectedStores([]);
    setSearchText('');
    setSearchInputValue('');
    setCurrentPage(1);
    onClose();
  };

  const handleSearch = () => {
    setSearchText(searchInputValue);
    setCurrentPage(1);
  };

  const columns: ColumnsType<IStore> = [
    { title: '매장 ID', dataIndex: 'shopCode', key: 'shopCode', width: 120 },
    { title: '매장명', dataIndex: 'shopName', key: 'shopName' },
  ];

  return (
    <Modal
      title={
        <span style={{ color: '#fff', fontSize: '18px' }}>개별 매장 추가</span>
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
            disabled={selectedStores.length === 0}
          >
            추가
          </Button>
        </div>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="매장명을 검색하세요"
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
        rowKey={(record) => String(record.shopSeq)}
        rowSelection={{
          selectedRowKeys: selectedStores.map((s) => String(s.shopSeq)),
          onSelect: (record, selected) => {
            if (selected) {
              setSelectedStores((prev) => [...prev, record]);
            } else {
              setSelectedStores((prev) =>
                prev.filter((s) => String(s.shopSeq) !== String(record.shopSeq))
              );
            }
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
            if (selected) {
              setSelectedStores((prev) => {
                const prevCodes = new Set(prev.map((s) => String(s.shopSeq)));
                const newItems = changeRows.filter(
                  (r) => !prevCodes.has(String(r.shopSeq))
                );
                return [...prev, ...newItems];
              });
            } else {
              const changeCodes = new Set(
                changeRows.map((r) => String(r.shopSeq))
              );
              setSelectedStores((prev) =>
                prev.filter((p) => !changeCodes.has(String(p.shopSeq)))
              );
            }
          },
        }}
        columns={columns}
        dataSource={stores}
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

export default IndividualStoreAddModal;
