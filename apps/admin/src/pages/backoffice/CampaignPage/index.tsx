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
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { ROUTES } from '@/constants/routes';
import PageTitle from '@/feature/Backoffice/components/PageTitle';
import { useConfirmDialog } from '@/feature/Backoffice/hooks/useConfirmDialog';

// --- Types ---
type CampaignStatus = '집행중' | '대기' | '중지' | '집행종료';

interface CampaignDataType {
  key: string;
  code: string;
  name: string;
  nickname: string;
  storeCount: number;
  period: string;
  status: CampaignStatus;
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

// --- Mock Data ---
const initialData: CampaignDataType[] = [
  {
    key: '1',
    code: 'CP-001',
    name: '봄 시즌 기획전',
    nickname: 'SPRING_24',
    storeCount: 45,
    period: '2024-03-01 ~ 2024-03-31',
    status: '집행중',
  },
  {
    key: '2',
    code: 'CP-002',
    name: '신규 가입 혜택',
    nickname: 'WELCOME',
    storeCount: 150,
    period: '2024-04-01 ~ 2024-12-31',
    status: '대기',
  },
  {
    key: '3',
    code: 'CP-003',
    name: '라스트미닛 딜',
    nickname: 'LAST_CALL',
    storeCount: 12,
    period: '2024-02-01 ~ 2024-02-28',
    status: '집행종료',
  },
  {
    key: '4',
    code: 'CP-003',
    name: '라스트미닛 딜',
    nickname: 'LAST_CALL',
    storeCount: 12,
    period: '2024-02-01 ~ 2024-02-28',
    status: '중지',
  },
  {
    key: '5',
    code: 'CP-003',
    name: '라스트미닛 딜',
    nickname: 'LAST_CALL',
    storeCount: 12,
    period: '2024-02-01 ~ 2024-02-28',
    status: '중지',
  },
  {
    key: '6',
    code: 'CP-003',
    name: '라스트미닛 딜',
    nickname: 'LAST_CALL',
    storeCount: 12,
    period: '2024-02-01 ~ 2024-02-28',
    status: '중지',
  },
  {
    key: '7',
    code: 'CP-003',
    name: '라스트미닛 딜',
    nickname: 'LAST_CALL',
    storeCount: 12,
    period: '2024-02-01 ~ 2024-02-28',
    status: '중지',
  },
  {
    key: '8',
    code: 'CP-003',
    name: '라스트미닛 딜',
    nickname: 'LAST_CALL',
    storeCount: 12,
    period: '2024-02-01 ~ 2024-02-28',
    status: '중지',
  },
  {
    key: '9',
    code: 'CP-003',
    name: '라스트미닛 딜',
    nickname: 'LAST_CALL',
    storeCount: 12,
    period: '2024-02-01 ~ 2024-02-28',
    status: '중지',
  },
  {
    key: '10',
    code: 'CP-003',
    name: '라스트미닛 딜',
    nickname: 'LAST_CALL',
    storeCount: 12,
    period: '2024-02-01 ~ 2024-02-28',
    status: '중지',
  },
  {
    key: '11',
    code: 'CP-003',
    name: '라스트미닛 딜',
    nickname: 'LAST_CALL',
    storeCount: 12,
    period: '2024-02-01 ~ 2024-02-28',
    status: '중지',
  },
  {
    key: '12',
    code: 'CP-003',
    name: '라스트미닛 딜',
    nickname: 'LAST_CALL',
    storeCount: 12,
    period: '2024-02-01 ~ 2024-02-28',
    status: '중지',
  },
  {
    key: '13',
    code: 'CP-003',
    name: '라스트미닛 딜',
    nickname: 'LAST_CALL',
    storeCount: 12,
    period: '2024-02-01 ~ 2024-02-28',
    status: '중지',
  },
];

type FilterStatus = CampaignStatus | '전체';

interface CampaignDataType {
  key: string;
  code: string;
  name: string;
  nickname: string;
  storeCount: number;
  period: string;
  status: CampaignStatus;
}

const StyledRadioGroup = styled(Radio.Group)`
  margin-bottom: 16px;

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
  const [dataSource, setDataSource] = useState<CampaignDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [dateStrings, setDateStrings] = useState<[string, string]>(['', '']);
  const [appliedSearchText, setAppliedSearchText] = useState('');
  const [appliedDateStrings, setAppliedDateStrings] = useState<
    [string, string]
  >(['', '']);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('전체');

  // API 데이터 호출 로직

  const fetchCampaignList = async () => {
    setLoading(true);
    try {
      // TODO: 실제 API 호출 로직으로 교체 (예: const res = await axios.get('/api/campaigns'); setDataSource(res.data); )
      await new Promise((resolve) => setTimeout(resolve, 500)); // API 지연 시간 Mocking
      setDataSource(initialData); // 가져온 데이터를 상태에 저장
    } catch (error) {
      console.error('API Error:', error);
      message.error('캠페인 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignList();
  }, []);

  const handleSearch = () => {
    setAppliedSearchText(searchText);
    setAppliedDateStrings(dateStrings);
  };

  // 상태 변경 로직
  const updateStatus = (keys: React.Key[], nextStatus: CampaignStatus) => {
    setDataSource((prev) =>
      prev.map((item) =>
        keys.includes(item.key) ? { ...item, status: nextStatus } : item
      )
    );
    message.success('상태가 변경되었습니다.');
    if (keys.length > 1) {
      setSelectedRowKeys([]);
    }
  };

  const columns: ColumnsType<CampaignDataType> = [
    { title: '캠페인코드', dataIndex: 'code', key: 'code', width: 120 },
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
              disabled={record.status !== '중지'}
              onClick={() =>
                navigate(ROUTES.BACKOFFICE.CAMPAIGN_EDIT.generate(record.code))
              }
            />
          </Tooltip>
          <Tooltip title="삭제">
            <Button
              type="text"
              //danger
              icon={<DeleteOutlined />}
              disabled={record.status !== '중지'}
              onClick={() => {
                showConfirm({
                  title: '캠페인 삭제',
                  targetName: '캠페인',
                  itemName: record.name,
                  onConfirm: () => {
                    message.warning(`'${record.name}' 삭제`);
                  },
                });
              }}
            />
          </Tooltip>
          <Tooltip title="복사">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => message.info(`'${record.name}' 복사`)}
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
          checked={record.status !== '중지'}
          onChange={(checked) =>
            updateStatus([record.key], checked ? '집행중' : '중지')
          }
          style={{
            backgroundColor: record.status !== '중지' ? '#52c41a' : '#bfbfbf',
          }}
        />
      ),
    },
  ];

  const filteredData = useMemo(() => {
    return dataSource.filter((item) => {
      // 1. 캠페인명 검색
      const matchName = item.name.includes(appliedSearchText);

      // 2. 상태 필터 적용
      const matchStatus =
        statusFilter === '전체' || item.status === statusFilter;

      // 3. 집행기간 검색 (기간이 겹치는 경우 모두 검색되도록 조건 설정)
      let matchPeriod = true;
      if (
        appliedDateStrings &&
        appliedDateStrings[0] &&
        appliedDateStrings[1]
      ) {
        const [itemStart, itemEnd] = item.period.split(' ~ ');
        // YYYY-MM-DD 포맷이므로 문자열 비교가 가능합니다.
        if (itemStart && itemEnd) {
          matchPeriod =
            itemStart <= appliedDateStrings[1] &&
            itemEnd >= appliedDateStrings[0];
        }
      }
      return matchName && matchStatus && matchPeriod;
    });
  }, [dataSource, appliedSearchText, statusFilter, appliedDateStrings]);

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
          <Space>
            <Button
              variant="solid"
              color="green"
              disabled={selectedRowKeys.length === 0}
              onClick={() => updateStatus(selectedRowKeys, '집행중')}
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
              onClick={() => updateStatus(selectedRowKeys, '중지')}
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
        </TopBar>
        <FilterWrapper>
          <StyledRadioGroup
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
        </FilterWrapper>
        <StyledTable
          loading={loading}
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          columns={columns}
          dataSource={filteredData}
          rowClassName={(record) =>
            record.status === '중지' ? 'stopped-row' : ''
          }
          pagination={{
            total: filteredData.length,
            showTotal: (total) => `총 ${total}건`,
            placement: ['bottomEnd'], // 이미지와 동일하게 우측 하단 배치
            showSizeChanger: true,
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
