import {
  Collapse,
  Typography,
  Button,
  Popconfirm,
  type CollapseProps,
} from 'antd';
import { CloseOutlined, UnorderedListOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import type { ICreateAdminMemberRequest } from '@repo/api/types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const { Title, Text } = Typography;

// --- Types ---
interface AdItem {
  id: string;
  type: string;
  fileName: string;
}

interface CampaignInfo {
  id: string;
  name: string;
  period: string;
  status: string;
  items: AdItem[];
}

// --- Emotion Styles ---
const Container = styled.div`
  background-color: #fff;
  padding: 24px;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SectionTitle = styled(Title)`
  && {
    font-size: 16px;
    margin-bottom: 0;
    color: #262626;
  }
`;

// Collapse 컴포넌트 커스텀 스타일 (v6 CSS Variables 구조에도 호환)
const StyledCollapse = styled(Collapse)`
  background-color: transparent;
  border: none;

  .ant-collapse-item {
    border: none;
    margin-bottom: 16px;
  }

  .ant-collapse-header {
    background-color: #e6f4ff !important;
    border: 1px solid #91caff !important;
    border-radius: 4px !important;
    padding: 12px 16px !important;
    align-items: center !important;
  }

  .ant-collapse-content {
    border: none;
    border-top: none;
    background-color: transparent;
  }

  /* 내부 패딩 제거하여 커스텀 리스트 꽉 채우기 */
  .ant-collapse-content-box {
    padding: 0 !important;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const AdListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-top: none;
  background-color: #fff;

  &:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

// --- Mock Data ---
const MOCK_DATA: CampaignInfo[] = [
  {
    id: 'c1',
    name: '새로 소주 여름 캠페인',
    period: '2024.06.01 ~ 2024.08.31',
    status: '진행 중',
    items: [
      { id: 'i1', type: '전면 대기', fileName: '한맥.mp4' },
      { id: 'i2', type: '상단 배너', fileName: '한맥여름.jpg' },
      { id: 'i3', type: '주문 완료', fileName: 'promo_popup.png' },
    ],
  },
  {
    id: 'c2',
    name: '투다리 매장 홍보',
    period: '2024.05.15 ~ 2024.12.31',
    status: '진행 중',
    items: [
      { id: 'i4', type: '전면 대기', fileName: 'store_intro.jpg' },
      { id: 'i5', type: '전면 대기', fileName: 'discount_event.png' },
    ],
  },
];

interface Props {
  //formData: ICreateAdminMemberRequest;
  updateFormData: (updates: Partial<ICreateAdminMemberRequest>) => void;
}

export const StoreAdInfoTab = ({
  //formData,
  updateFormData,
}: Props) => {
  const navigate = useNavigate();

  // 패널의 헤더 UI를 생성하는 함수
  // const hasMember = !!formData.memberId;
  const renderHeader = (campaign: CampaignInfo) => (
    <HeaderWrapper>
      <div>
        <Text strong style={{ color: '#0050b3', fontSize: '15px' }}>
          {campaign.name}
        </Text>
        <Text type="secondary" style={{ margin: '0 8px', color: '#bfbfbf' }}>
          |
        </Text>
        <Text type="secondary" style={{ fontSize: '13px' }}>
          기간: {campaign.period}
        </Text>
      </div>
      {/* <Text strong style={{ color: '#389e0d' }}>
        {campaign.status}
      </Text> */}
    </HeaderWrapper>
  );

  const handleUpdateFormData = ({ memberName }: ICreateAdminMemberRequest) => {
    updateFormData({ memberName: 'name' });
  };

  const collapseItems: CollapseProps['items'] = MOCK_DATA.map((campaign) => ({
    key: campaign.id,
    label: renderHeader(campaign),
    showArrow: true, // 개별 패널의 화살표 아이콘 숨김 처리
    children: (
      <>
        {campaign.items.map((item) => (
          <AdListItem key={item.id}>
            <ItemInfo>
              <Text style={{ color: '#262626', fontSize: '14px' }}>
                {item.type}
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {item.fileName}
              </Text>
            </ItemInfo>
            {/* v6의 variant 속성을 활용하여 더 깔끔하게 명시 가능 */}
            <Popconfirm
              title="해당 광고를 이 매장에서 제외하시겠습니까?"
              okText="확인"
              cancelText="취소"
              onConfirm={() => console.log('광고 제외:', item.id)}
            >
              <Button
                color="danger"
                variant="outlined"
                icon={<CloseOutlined />}
                style={{ borderRadius: '4px' }}
              >
                {/*  이 매장만 제외 */}
              </Button>
            </Popconfirm>
          </AdListItem>
        ))}
      </>
    ),
  }));

  return (
    <Container>
      <TitleWrapper>
        <SectionTitle level={4}>매장 광고 정보</SectionTitle>
        <Button
          color="default"
          variant="filled"
          icon={<UnorderedListOutlined />}
          onClick={() => navigate(ROUTES.BACKOFFICE.CAMPAIGN.generate())}
        >
          캠페인 관리 목록
        </Button>
      </TitleWrapper>
      <StyledCollapse
        defaultActiveKey={['c1', 'c2']}
        items={collapseItems} // v6 핵심 API
        expandIconPlacement="start"
      />
    </Container>
  );
};

export default StoreAdInfoTab;
