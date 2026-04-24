import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Switch,
  Radio,
  Tooltip,
  DatePicker,
  App,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  LinkOutlined,
  FileSyncOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { ROUTES } from '@/constants/routes';
import PageTitle from '@/feature/Backoffice/components/PageTitle';
import { useConfirmDialog } from '@/feature/Backoffice/hooks/useConfirmDialog';
import {
  useGetCampaignList,
  usePatchUpdateCampaignActive,
  usePostCopyCampaign,
  usePatchUpdateCampaign,
} from '@repo/api/queries';

// --- Types ---
type CampaignStatus = '집행중' | '대기' | '중지' | '집행종료';

interface CampaignDataType {
  campaignSeq: number;
  code: string;
  name: string;
  nickname: string;
  storeCount: number;
  period: string;
  status: CampaignStatus;
  isActive: boolean;
}

// --- Emotion Styles (이미지 디자인 완벽 반영) ---
const Container = styled.div`
  background-color: #f4f7fa;
  height: 100%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ContentCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-shrink: 0;
`;

type FilterStatus = CampaignStatus | '전체';

// --- Status Mapping Helpers ---
const mapToDisplayStatus = (backendStatus?: string): CampaignStatus => {
  switch (backendStatus) {
    case 'PROGRESS':
      return '집행중';
    case 'WAITING':
      return '대기';
    case 'PAUSED':
      return '중지';
    case 'TERMINATED':
      return '집행종료';
    default:
      return '대기';
  }
};

const mapToBackendStatus = (
  displayStatus: FilterStatus
): string | undefined => {
  switch (displayStatus) {
    case '집행중':
      return 'PROGRESS';
    case '대기':
      return 'WAITING';
    case '중지':
      return 'PAUSED';
    case '집행종료':
      return 'TERMINATED';
    default:
      return undefined;
  }
};

const StyledRadioGroup = styled(Radio.Group)`
  .ant-radio-button-wrapper {
    /* 선택되지 않았을 때 마우스 호버 시 텍스트 색상 */
    &.status-active:hover {
      color: #52c41a;
    }
    &.status-waiting:hover {
      color: #faad14;
    }
    &.status-stopped:hover {
      color: #8c8c8c;
    }
    &.status-ended:hover {
      color: #fa541c;
    }

    /* 선택(Checked) 되었을 때의 배경 및 테두리 색상 */
    &.ant-radio-button-wrapper-checked {
      color: #fff !important; /* 선택 시 텍스트는 흰색 고정 */

      &.status-all {
        background-color: #1d2a6d;
        border-color: #1d2a6d;
      }
      &.status-active {
        background-color: #52c41a; /* green */
        border-color: #52c41a;
      }
      &.status-waiting {
        background-color: #faad14; /* gold */
        border-color: #faad14;
      }
      &.status-stopped {
        background-color: #8c8c8c; /* default (회색) */
        border-color: #8c8c8c;
      }
      &.status-ended {
        background-color: #fa541c; /* volcano */
        border-color: #fa541c;
      }

      /* 선택된 상태에서 마우스 호버 시 살짝 투명해지는 효과 */
      &:hover {
        opacity: 0.85;
      }
    }
  }
`;
// ... (Emotion 스타일 정의 생략: Container, TitleSection, ContentCard, TopBar 등 기존과 동일) ...

// 테이블 상단 라디오 버튼과 테이블 사이의 간격을 주기 위한 래퍼
const FilterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-shrink: 0;
`;

const StyledTable = styled(Table<CampaignDataType>)`
  .ant-table-thead > tr > th {
    background-color: #1d2a6d !important;
    color: white !important;
    border-bottom: none;
  }

  .duplicate-row > td {
    background-color: #fffbe6 !important; /* 중복 매장 노란 배경 */
  }
`;

const CampaignPage: React.FC = () => {
  const { message } = App.useApp();
  const { showConfirm } = useConfirmDialog();
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [dateStrings, setDateStrings] = useState<[string, string]>(['', '']);
  const [appliedSearchText, setAppliedSearchText] = useState('');
  const [appliedDateStrings, setAppliedDateStrings] = useState<
    [string, string]
  >(['', '']);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // API 연동: 캠페인 목록 조회
  const {
    data: campaignResponse,
    isFetching,
    refetch,
  } = useGetCampaignList({
    page: currentPage - 1, // 백엔드는 보통 0부터 시작
    size: pageSize,
    name: appliedSearchText || undefined,
    status: mapToBackendStatus(statusFilter),
    startDate: appliedDateStrings[0] || undefined,
    endDate: appliedDateStrings[1] || undefined,
  });

  const { mutateAsync: updateCampaignActive } = usePatchUpdateCampaignActive();
  const { mutateAsync: copyCampaign } = usePostCopyCampaign();
  const { mutateAsync: updateCampaign } = usePatchUpdateCampaign();

  const campaigns: CampaignDataType[] = useMemo(() => {
    return (campaignResponse?.data?.content || []).map((item) => ({
      campaignSeq: item.campaignSeq,
      code: item.campaignCode || '-',
      name: item.campaignName || '-',
      nickname: item.campaignAlias || '-',
      storeCount: item.shopCount || 0,
      period: `${item.startDate || ''} ~ ${item.endDate || ''}`,
      status: mapToDisplayStatus(item.campaignStatus),
      isActive: item.isActive,
    }));
  }, [campaignResponse?.data?.content]);

  const totalCount = campaignResponse?.data?.totalElements || 0;

  const handleSearch = () => {
    setAppliedSearchText(searchText);
    setAppliedDateStrings(dateStrings);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  // 상태 변경 로직
  const updateStatus = async (keys: React.Key[], isActive: boolean) => {
    try {
      await updateCampaignActive({
        campaignSeqs: keys.map(Number),
        isActive,
      });
      message.success(
        `선택한 캠페인이 ${isActive ? 'ON' : 'OFF'} 처리되었습니다.`
      );
      setSelectedRowKeys([]); // 변경 후 선택 해제
      refetch(); // 목록 새로고침
    } catch (error) {
      // 글로벌 에러 핸들러에서 처리됨
    }
  };

  const handleCopy = (record: CampaignDataType) => {
    showConfirm({
      title: '캠페인 복사',
      targetName: '캠페인',
      itemName: record.name,
      okText: '복사',
      content: (
        <div style={{ marginTop: '16px' }}>
          <style>
            {`
              .custom-cancel-btn:hover,
              .custom-cancel-btn:focus {
                color: #1d2a6d !important;
                border-color: #1d2a6d !important;
              }
            `}
          </style>
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            캠페인 <strong style={{ color: '#d4380d' }}>`{record.name}`</strong>
            을(를) 복사하시겠습니까?
          </p>
        </div>
      ),
      onConfirm: async () => {
        try {
          await copyCampaign({ campaignSeq: record.campaignSeq });
          message.success(`'${record.name}' 캠페인이 복사되었습니다.`);
          refetch(); // 목록 새로고침
        } catch (error) {
          // 글로벌 에러 핸들러에서 처리됨
        }
      },
    });
  };

  const columns: ColumnsType<CampaignDataType> = [
    {
      title: 'No.',
      key: 'no',
      width: 60,
      align: 'center',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    { title: '캠페인 ID', dataIndex: 'code', key: 'code', width: 120 },
    { title: '캠페인명', dataIndex: 'name', key: 'name' },
    { title: '별명', dataIndex: 'nickname', key: 'nickname' },
    {
      title: '등록 매장수',
      dataIndex: 'storeCount',
      key: 'storeCount',
      width: 120,
      // sorter: (a, b) => a.storeCount - b.storeCount,
      render: (val) => `${val}개`,
    },
    { title: '집행기간', dataIndex: 'period', key: 'period', width: 220 },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: CampaignStatus) => {
        const colors = {
          집행중: 'green',
          대기: 'gold',
          중지: 'default',
          집행종료: 'volcano',
        };
        // (대기 : WATING, 진행 : PROGRESS, 종료 : TERMINATED, 일시정지 : PAUSED)
        return (
          <Tag color={colors[status]} variant="outlined">
            {status}
          </Tag>
        );
      },
    },
    {
      title: '관리',
      key: 'management',
      width: 180,
      render: (_, record) => (
        <Space size={0}>
          <Tooltip title="수정">
            <Button
              type="text"
              icon={<EditOutlined />}
              disabled={false /* record.status === '집행중' */}
              onClick={() =>
                navigate(
                  ROUTES.BACKOFFICE.CAMPAIGN_EDIT.generate(
                    String(record.campaignSeq)
                  )
                )
              }
            />
          </Tooltip>
          <Tooltip title="삭제">
            <Button
              type="text"
              //danger
              icon={<DeleteOutlined />}
              disabled={record.status === '집행중'}
              onClick={() => {
                showConfirm({
                  title: '캠페인 삭제',
                  targetName: '캠페인',
                  itemName: record.name,
                  onConfirm: async () => {
                    try {
                      await updateCampaign({
                        campaignSeq: record.campaignSeq,
                        request: {
                          campaignName: record.name, // 필수값 유지
                          isDeleted: true,
                        },
                      });
                      message.success(
                        `'${record.name}' 캠페인이 삭제되었습니다.`
                      );
                      setSelectedRowKeys([]); // 삭제 후 선택 해제
                      refetch(); // 목록 새로고침
                    } catch (error) {
                      // 글로벌 에러 핸들러에서 처리됨
                    }
                  },
                });
              }}
            />
          </Tooltip>
          <Tooltip title="복사">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleCopy(record)}
            />
          </Tooltip>
          <Tooltip title="메뉴 태그 동기화 현황">
            <Button
              type="text"
              icon={<FileSyncOutlined />}
              onClick={() =>
                navigate(
                  ROUTES.BACKOFFICE.MENU_GROUP_STATUS.generate(
                    record.campaignSeq
                  )
                )
              }
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: 'ON/OFF',
      key: 'onoff',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Switch
          size="small"
          checkedChildren="on"
          unCheckedChildren="off"
          checked={record.isActive}
          onChange={(checked) => updateStatus([record.campaignSeq], checked)}
          style={{
            backgroundColor: record.isActive ? '#52c41a' : '#bfbfbf',
          }}
        />
      ),
    },
  ];

  return (
    <Container>
      <PageTitle title="캠페인 관리" subtitle="목록" />
      <ContentCard>
        <TopBar>
          <Space>
            <Input
              placeholder="캠페인명 검색"
              style={{ width: 240, borderRadius: '6px' }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <DatePicker.RangePicker
              placeholder={['집행 시작일', '집행 종료일']}
              style={{ borderRadius: '6px', height: '32px' }}
              onChange={(_, dateStrs) =>
                setDateStrings(dateStrs as [string, string])
              }
            />
            <Button
              type="primary"
              //color="primary"
              //variant="outlined"
              onClick={handleSearch}
              style={{ borderRadius: '6px' }}
            >
              검색
            </Button>
          </Space>
        </TopBar>
        <FilterWrapper>
          <StyledRadioGroup
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1); // 탭 이동 시 첫 페이지로 이동
            }}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="전체" className="status-all">
              전체
            </Radio.Button>
            <Radio.Button value="대기" className="status-waiting">
              대기
            </Radio.Button>
            <Radio.Button value="집행중" className="status-active">
              집행중
            </Radio.Button>
            <Radio.Button value="집행종료" className="status-ended">
              집행종료
            </Radio.Button>
            <Radio.Button value="중지" className="status-stopped">
              중지
            </Radio.Button>
          </StyledRadioGroup>
          <Space>
            <Button
              variant="solid"
              color="green"
              disabled={selectedRowKeys.length === 0}
              onClick={() => updateStatus(selectedRowKeys, true)}
            >
              ON
            </Button>
            <Button
              variant="solid"
              style={{
                backgroundColor: '#bfbfbf',
                borderColor: '#bfbfbf',
                color: '#fff',
              }}
              disabled={selectedRowKeys.length === 0}
              onClick={() => updateStatus(selectedRowKeys, false)}
            >
              OFF
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{
                borderRadius: '8px',
                height: '40px',
                padding: '0 20px',
                fontWeight: 600,
              }}
              onClick={() =>
                navigate(ROUTES.BACKOFFICE.CAMPAIGN_NEW.generate())
              }
            >
              캠페인 등록
            </Button>
          </Space>
        </FilterWrapper>
        <StyledTable
          rowKey="campaignSeq"
          loading={isFetching}
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          columns={columns}
          dataSource={campaigns}
          rowClassName={(record) =>
            record.status === '중지' ? 'stopped-row' : ''
          }
          pagination={{
            current: currentPage,
            pageSize,
            total: totalCount,
            showTotal: (total) => `총 ${total}건`,
            placement: ['bottomEnd'], // 이미지와 동일하게 우측 하단 배치
            showSizeChanger: true,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
          // scroll={
          //   filteredData.length > 10 ? { y: 'calc(100vh - 530px)' } : undefined
          // }
        />
      </ContentCard>
    </Container>
  );
};

export default CampaignPage;
