import React, { useState } from 'react';
import { Modal, Input, Table, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CloseOutlined } from '@ant-design/icons';

export interface StoreGroupAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (selectedKeys: React.Key[]) => void;
}

interface GroupData {
  id: string;
  name: string;
  count: number;
}

// 임시 전체 그룹 데이터
const ALL_GROUPS: GroupData[] = [
  { id: 'g1', name: '전국 투다리 매장', count: 72 },
  { id: 'g2', name: '주류 취급 매장', count: 301 },
  { id: 'g3', name: '서울 지역', count: 148 },
  { id: 'g4', name: '직영점', count: 23 },
  { id: 'g5', name: '테스트 매장', count: 5 },
];

const StoreGroupAddModal: React.FC<StoreGroupAddModalProps> = ({
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

  const columns: ColumnsType<GroupData> = [
    { title: '그룹명', dataIndex: 'name', key: 'name' },
    {
      title: '포함 매장 수',
      dataIndex: 'count',
      key: 'count',
      width: 120,
      align: 'center',
      render: (val) => `${val}개`,
    },
  ];

  const filteredGroups = ALL_GROUPS.filter((g) => g.name.includes(searchText));

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
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={filteredGroups}
        pagination={{ pageSize: 5 }}
        size="small"
      />
    </Modal>
  );
};

export default StoreGroupAddModal;
