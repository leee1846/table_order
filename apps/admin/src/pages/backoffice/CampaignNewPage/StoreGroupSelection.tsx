import React, { useState, useMemo } from 'react';
import { Table, Input, Typography, Tag, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import IndividualStoreAddModal from './IndividualStoreAddModal';
import StoreGroupAddModal from './StoreGroupAddModal';

const { Text, Title } = Typography;

// --- Types ---
interface StoreGroup {
  id: string;
  name: string;
  count: number;
}

interface Store {
  key: string;
  sid: string;
  name: string;
  groupIds: string[]; // 매장이 속한 그룹 ID 배열 (복수 가능)
}

// --- Emotion Styles ---
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

// 테이블 커스텀 (헤더 및 노란색 중복 로우 스타일)
const StyledTable = styled(Table<Store>)`
  .ant-table-thead > tr > th {
    background-color: #1d2a6d !important;
    color: white !important;
    border-bottom: none;
  }

  .duplicate-row > td {
    background-color: #fffbe6 !important; /* 중복 매장 노란 배경 */
  }
`;

const FooterSummary = styled.div`
  background-color: #f0f5ff;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

// --- Mock Data ---
const MOCK_GROUPS: StoreGroup[] = [
  { id: 'g1', name: '전국 투다리 매장', count: 72 },
  { id: 'g2', name: '주류 취급 매장', count: 301 },
  { id: 'g3', name: '서울 지역', count: 148 },
  { id: 'g4', name: '직영점', count: 23 },
  { id: 'g5', name: '테스트 매장', count: 5 },
];

const MOCK_STORES: Store[] = [
  { key: '1', sid: 'S0011234', name: '투다리 강남점', groupIds: ['g1'] },
  { key: '2', sid: 'S0015892', name: '투다리 홍대점', groupIds: ['g1', 'g2'] },
  { key: '3', sid: 'S0022341', name: '투다리 신촌점', groupIds: ['g2'] },
  {
    key: '4',
    sid: 'S0031120',
    name: '투다리 이태원점',
    groupIds: ['g1', 'g2'],
  },
  { key: '5', sid: 'S0022349', name: '투다리 성수점', groupIds: ['g2'] },
  { key: '6', sid: 'S0033210', name: '투다리 합정점', groupIds: ['g1'] },
  { key: '7', sid: 'S0044501', name: '투다리 건대점', groupIds: ['g2'] },
];

export interface StoreGroupSelectionProps {
  selectedGroups: string[];
  setSelectedGroups: React.Dispatch<React.SetStateAction<string[]>>;
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>>;
}

const StoreGroupSelection: React.FC<StoreGroupSelectionProps> = ({
  selectedGroups,
  setSelectedGroups,
  selectedRowKeys,
  setSelectedRowKeys,
}) => {
  const [searchText, setSearchText] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isIndividualModalOpen, setIsIndividualModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // 노출할 매장 리스트 계산 (선택된 그룹 중 하나라도 포함된 매장 + 검색어 필터)
  const displayedStores = useMemo(() => {
    if (selectedGroups.length === 0) return []; // 선택된 그룹이 없으면 빈 배열 반환
    return MOCK_STORES.filter((store) => {
      const isGroupMatch = store.groupIds.some((id) =>
        selectedGroups.includes(id)
      );
      const isSearchMatch =
        store.name.includes(searchText) || store.sid.includes(searchText);
      return isGroupMatch && isSearchMatch;
    });
  }, [selectedGroups, searchText]);

  const paginatedStores = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return displayedStores.slice(startIndex, endIndex);
  }, [displayedStores, currentPage, pageSize]);

  // 중복(유니크 처리 대상) 매장 개수 계산
  const duplicateCount = useMemo(() => {
    return displayedStores.filter(
      (store) =>
        store.groupIds.filter((id) => selectedGroups.includes(id)).length > 1
    ).length;
  }, [displayedStores, selectedGroups]);

  const handleSearch = () => {
    setSearchText(searchInputValue);
    setCurrentPage(1); // 검색 시 1페이지로 초기화
  };

  // 테이블 컬럼 정의
  const columns: ColumnsType<Store> = [
    { title: 'SID', dataIndex: 'sid', key: 'sid', width: 120 },
    { title: '매장명', dataIndex: 'name', key: 'name', width: 200 },
    {
      title: '소속 그룹',
      key: 'groups',
      render: (_, record) => {
        // 현재 선택된 그룹 중, 이 매장이 속해있는 그룹들만 필터링
        const activeGroups = record.groupIds
          .filter((id) => selectedGroups.includes(id))
          .map((id) => MOCK_GROUPS.find((g) => g.id === id)?.name);

        const isDuplicate = activeGroups.length > 1;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              {activeGroups.map((name) => (
                <Tag key={name} color="blue" style={{ borderRadius: '12px' }}>
                  {name}
                </Tag>
              ))}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <Container>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}
      >
        <Space>
          <Input
            placeholder="SID/매장명을 입력하세요"
            style={{ width: 240, borderRadius: '6px' }}
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            onPressEnter={handleSearch}
            //prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          />
          <Button
            type="primary"
            style={{ borderRadius: '6px' }}
            onClick={handleSearch}
          >
            검색
          </Button>
        </Space>
        <Space>
          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={() => setSelectedRowKeys([])} // 임시: 선택 초기화
          >
            삭제
          </Button>
        </Space>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <Title level={5} style={{ margin: 0, color: '#003399' }}>
          추가된 매장 리스트{' '}
          <Text
            style={{ fontSize: '14px', color: '#8c8c8c', fontWeight: 'normal' }}
          >
            (총 {selectedRowKeys.length}개)
          </Text>
        </Title>
        <Space>
          <Button onClick={() => setIsIndividualModalOpen(true)}>
            개별 매장 추가
          </Button>
          <Button type="primary" onClick={() => setIsGroupModalOpen(true)}>
            매장 그룹 추가
          </Button>
        </Space>
      </div>

      <StyledTable
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={paginatedStores}
        pagination={{
          total: displayedStores.length,
          showTotal: (total) => `총 ${total}건`,
          placement: ['bottomEnd'],
          showSizeChanger: true,
          current: currentPage,
          pageSize,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size || 10);
          },
        }}
        // 중복 매장일 경우 배경색을 노란색으로 변경하기 위한 클래스 부여
        rowClassName={(record) => {
          const activeGroupCount = record.groupIds.filter((id) =>
            selectedGroups.includes(id)
          ).length;
          return activeGroupCount > 1 ? 'duplicate-row' : '';
        }}
      />

      <IndividualStoreAddModal
        isOpen={isIndividualModalOpen}
        onClose={() => setIsIndividualModalOpen(false)}
        onAdd={(keys) => {
          console.log('추가된 개별 매장 keys:', keys);
        }}
      />

      <StoreGroupAddModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onAdd={(keys) => {
          // 추가된 그룹 ID들을 기존 선택된 그룹(selectedGroups)에 중복 없이 합칩니다.
          setSelectedGroups((prev) => {
            const newSet = new Set([...prev, ...(keys as string[])]);
            return Array.from(newSet);
          });
        }}
      />

      {/*       <FooterSummary>
        <Text strong style={{ color: '#003399' }}>
          총 {selectedRowKeys.length}개 매장 선택
        </Text>
      </FooterSummary> */}
    </Container>
  );
};

export default StoreGroupSelection;
