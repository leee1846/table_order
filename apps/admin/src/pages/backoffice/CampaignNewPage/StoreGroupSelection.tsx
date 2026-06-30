import React, { useState, useEffect } from 'react';
import { Table, Typography, Tag, Button, Space, Tooltip, App } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, CloseOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import IndividualStoreAddModal from './IndividualStoreAddModal';
import StoreGroupAddModal from './StoreGroupAddModal';
import { useGetStoresByGroups } from '@repo/api/queries';

const { Text, Title } = Typography;

// --- Types ---
export interface ShopGroupInfo {
  shopGroupSeq: number;
  groupName: string;
}

export interface CampaignShopData {
  shopSeq: number;
  shopCode: string;
  shopName: string;
  startDate: string;
  endDate: string;
  shopGroup: ShopGroupInfo[];
}

// --- Emotion Styles ---
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

// 테이블 커스텀 (헤더 및 노란색 중복 로우 스타일)
const StyledTable = styled(Table<CampaignShopData>)`
  .ant-table-thead > tr > th {
    background-color: #1d2a6d !important;
    color: white !important;
    border-bottom: none;
  }

  .duplicate-row > td {
    background-color: #fffbe6 !important; /* 중복 매장 노란 배경 */
  }
`;

export interface StoreGroupSelectionProps {
  stores?: CampaignShopData[];
  onChange: (stores: CampaignShopData[]) => void;
}

const StoreGroupSelection: React.FC<StoreGroupSelectionProps> = ({
  stores = [],
  onChange,
}) => {
  const { message } = App.useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isIndividualModalOpen, setIsIndividualModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // 테이블 행 선택(체크박스) 상태
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  // 모달에서 추가 시 선택된 그룹 시퀀스 목록 (API 호출 트리거용)
  const [pendingGroupKeys, setPendingGroupKeys] = useState<number[]>([]);

  // StoreGroupAddModal onAdd 호출 시 동작하여 해당 그룹 매장 목록을 조회
  const { data: groupStoresResponse, isFetching: isGroupFetching } =
    useGetStoresByGroups(pendingGroupKeys);

  const handleDeleteChecked = () => {
    onChange(
      stores.filter((store) => !checkedKeys.includes(String(store.shopSeq)))
    );
    setCheckedKeys([]);
  };

  useEffect(() => {
    const groupStores = groupStoresResponse?.data || [];
    if (groupStores.length === 0) {
      return;
    }

    // 2. API에서 조회된 그룹 매장 목록 변환 및 중복 합치기
    const newData = [...stores];
    let hasChanges = false;
    const addedStores: CampaignShopData[] = [];

    groupStores.forEach((member) => {
      const shopCode = String(member.shopCode);
      const existingIndex = newData.findIndex(
        (s) => s.shopSeq === member.shopSeq
      );
      const groupName = member.groupName || '';
      const groupId = member.shopGroupSeq;

      if (existingIndex > -1) {
        const existingItem = newData[existingIndex];
        if (existingItem) {
          const isGroupExist = existingItem.shopGroup.some(
            (g) => g.shopGroupSeq === Number(groupId)
          );
          if (!isGroupExist) {
            newData[existingIndex] = {
              ...existingItem,
              shopGroup: [
                ...existingItem.shopGroup,
                { shopGroupSeq: Number(groupId), groupName },
              ],
            };
            hasChanges = true;
          }
        }
      } else {
        addedStores.push({
          shopSeq: member.shopSeq || 0,
          shopCode,
          shopName: member.shopName || '',
          startDate: '',
          endDate: '',
          shopGroup: [{ shopGroupSeq: Number(groupId), groupName }],
        });
        hasChanges = true;
      }
    });

    if (hasChanges) {
      onChange([...addedStores, ...newData]);
    }
  }, [groupStoresResponse?.data]);

  // 테이블 컬럼 정의
  const columns: ColumnsType<CampaignShopData> = [
    { title: '매장 ID', dataIndex: 'shopCode', key: 'shopCode', width: 120 },
    { title: '매장명', dataIndex: 'shopName', key: 'shopName', width: 200 },
    {
      title: '소속 그룹',
      key: 'groups',
      render: (_, record) => {
        return (
          <Space size={[8, 8]} wrap>
            {record.shopGroup?.map((group) => {
              const TAG_COLORS = [
                // 'magenta',
                // 'red',
                'volcano',
                'orange',
                'gold',
                'lime',
                'green',
                'cyan',
                'blue',
                'geekblue',
                'purple',
              ];
              // 그룹명 문자열을 기반으로 일관된 랜덤 색상을 선택하여 리렌더링 시 깜빡임 방지
              const colorIndex =
                group.groupName
                  ?.split('')
                  ?.reduce((acc, char) => acc + char.charCodeAt(0), 0) %
                TAG_COLORS.length;

              return (
                <Tag
                  key={group.shopGroupSeq}
                  color={TAG_COLORS[colorIndex]}
                  style={{ borderRadius: '12px' }}
                >
                  {group.groupName}
                </Tag>
              );
            })}
          </Space>
        );
      },
    },
    {
      title: '관리',
      key: 'management',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <Tooltip title="삭제">
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => {
              onChange(
                stores.filter((item) => item.shopSeq !== record.shopSeq)
              );
              message.warning(`'${record.shopName}' 삭제되었습니다.`);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Container>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '24px',
        }}
      >
        {/*         <Space>
          {<Input
            placeholder="매장명을 입력하세요"
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
          </Button> }
        </Space> */}
        <Space>
          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={checkedKeys.length === 0}
            onClick={handleDeleteChecked}
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
            (총 {stores.length}개)
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
          selectedRowKeys: checkedKeys,
          onChange: setCheckedKeys,
        }}
        rowKey={(record) => String(record.shopSeq)}
        columns={columns}
        dataSource={stores}
        pagination={{
          total: stores.length,
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
        loading={isGroupFetching}
        // 중복 매장일 경우 배경색을 노란색으로 변경하기 위한 클래스 부여
        rowClassName={(record) => {
          return record.shopGroup && record.shopGroup.length > 1
            ? 'duplicate-row'
            : '';
        }}
      />

      <IndividualStoreAddModal
        isOpen={isIndividualModalOpen}
        onClose={() => setIsIndividualModalOpen(false)}
        onAdd={(addedModalStores) => {
          const newData = [...stores];
          const addedStores: CampaignShopData[] = [];

          addedModalStores.forEach((store) => {
            const shopCode = String(store.shopCode);
            const existingStoreIndex = newData.findIndex(
              (s) => s.shopSeq === store.shopSeq
            );

            if (existingStoreIndex < 0) {
              addedStores.push({
                shopSeq: store.shopSeq || 0,
                shopCode,
                shopName: store.shopName || '',
                startDate: '',
                endDate: '',
                shopGroup: [],
              });
            }
          });
          onChange([...addedStores, ...newData]);
        }}
      />

      <StoreGroupAddModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onAdd={(keys) => {
          // 모달에서 선택한 매장 그룹 시퀀스를 넘겨 useGetStoresByGroups를 동작시킵니다.
          setPendingGroupKeys(keys.map(Number));
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
