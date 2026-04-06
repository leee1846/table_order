import React, { useState } from 'react';
import { Modal, Input, Table, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CloseOutlined } from '@ant-design/icons';

export interface IndividualStoreAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (selectedKeys: React.Key[]) => void;
}

interface StoreData {
  key: string;
  sid: string;
  name: string;
}

// 임시 전체 매장 데이터
const ALL_STORES: StoreData[] = [
  { key: '101', sid: 'S0011234', name: '투다리 강남점' },
  { key: '102', sid: 'S0015892', name: '투다리 홍대점' },
  { key: '103', sid: 'S0022341', name: '투다리 신촌점' },
  { key: '104', sid: 'S0031120', name: '투다리 이태원점' },
  { key: '105', sid: 'S0022349', name: '투다리 성수점' },
];

const IndividualStoreAddModal: React.FC<IndividualStoreAddModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');

  const handleAdd = () => {
    onAdd(selectedRowKeys);
    setSelectedRowKeys([]); // 선택 초기화
    setSearchText('');
    setSearchInputValue('');
    onClose();
  };

  const handleCancel = () => {
    setSelectedRowKeys([]);
    setSearchText('');
    setSearchInputValue('');
    onClose();
  };

  const handleSearch = () => {
    setSearchText(searchInputValue);
  };

  const columns: ColumnsType<StoreData> = [
    { title: 'SID', dataIndex: 'sid', key: 'sid', width: 120 },
    { title: '매장명', dataIndex: 'name', key: 'name' },
  ];

  const filteredStores = ALL_STORES.filter(
    (s) => s.name.includes(searchText) || s.sid.includes(searchText)
  );

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
            placeholder="SID 또는 매장명을 검색하세요"
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
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={filteredStores}
        pagination={{ pageSize: 5 }}
        size="small"
      />
    </Modal>
  );
};

export default IndividualStoreAddModal;
