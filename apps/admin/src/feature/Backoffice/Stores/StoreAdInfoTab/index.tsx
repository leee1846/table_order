import {
  Collapse,
  Typography,
  Button,
  Popconfirm,
  Spin,
  Empty,
  Tag,
  type CollapseProps,
} from 'antd';
import { CloseOutlined, UnorderedListOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import type { ICampaignStatus } from '@repo/api/types';
import { useNavigate } from 'react-router-dom';
import {
  useGetShopCampaignStatus,
  usePatchToggleContentExclusion,
  queryKeys,
} from '@repo/api/queries';
import { useQueryClient } from '@repo/api/tanstack-query';
import { ROUTES } from '@/constants/routes';

const { Title, Text } = Typography;

// --- Types ---

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

const getAdTypeLabel = (adType: string) => {
  if (adType.includes('STANDBY')) {
    return '주문 대기';
  }
  if (adType.includes('TOP_BANNER')) {
    return '상단 배너';
  }
  if (adType.includes('AD_MENU')) {
    return '광고 메뉴';
  }
  if (adType.includes('ORDER_COMP')) {
    return '주문 완료';
  }
  return adType;
};

interface Props {
  shopSeq?: number;
  //formData: ICreateAdminMemberRequest;
  //updateFormData: (updates: Partial<ICreateAdminMemberRequest>) => void;
}

export const StoreAdInfoTab = ({
  shopSeq,
  //formData,
  //updateFormData,
}: Props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: campaignStatusRes, isLoading } = useGetShopCampaignStatus({
    shopSeq,
    isActive: true,
  });

  const campaigns =
    campaignStatusRes?.data?.filter((campaign) => campaign.isActive) || [];

  const { mutate: toggleContentExclusion } = usePatchToggleContentExclusion({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaign.shopStatus(shopSeq),
      });
    },
  });

  const handleToggleExclusion = (campaignSeq: number, contentSeq: number) => {
    if (!shopSeq) {
      return;
    }
    toggleContentExclusion({ shopSeq, campaignSeq, contentSeq });
  };

  // 패널의 헤더 UI를 생성하는 함수
  const renderHeader = (campaign: ICampaignStatus) => (
    <HeaderWrapper>
      <div>
        <Text strong style={{ color: '#0050b3', fontSize: '15px' }}>
          {campaign.campaignName}
        </Text>
        <Text type="secondary" style={{ margin: '0 8px', color: '#bfbfbf' }}>
          |
        </Text>
        <Text type="secondary" style={{ fontSize: '13px' }}>
          기간: {campaign.startDate} ~ {campaign.endDate}
        </Text>
      </div>
      <div>
        {campaign.isActive ? (
          <Tag color="green">집행 중</Tag>
        ) : (
          <Tag color="default">중지</Tag>
        )}
        {campaign.isExcluded && <Tag color="error">제외됨</Tag>}
      </div>
    </HeaderWrapper>
  );

  const collapseItems: CollapseProps['items'] = campaigns.map((campaign) => ({
    key: String(campaign.campaignSeq),
    label: renderHeader(campaign),
    showArrow: true, // 개별 패널의 화살표 아이콘 숨김 처리
    children: (
      <>
        {campaign.contents.map((ad) => (
          <AdListItem key={`${campaign.campaignSeq}-${ad.contentSeq}`}>
            <ItemInfo>
              <Text style={{ color: '#262626', fontSize: '14px' }}>
                {getAdTypeLabel(ad.adType)}
                {ad.menuGroupName && ` (${ad.menuGroupName})`}
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {ad.fileName}
              </Text>
            </ItemInfo>
            {/* v6의 variant 속성을 활용하여 더 깔끔하게 명시 가능 */}
            <Popconfirm
              title={
                ad.excluded
                  ? '제외를 해제하시겠습니까?'
                  : '해당 광고를 이 매장에서 제외하시겠습니까?'
              }
              okText="확인"
              cancelText="취소"
              onConfirm={() =>
                handleToggleExclusion(campaign.campaignSeq, ad.contentSeq)
              }
            >
              <Button
                color={ad.excluded ? 'default' : 'danger'}
                variant="outlined"
                icon={!ad.excluded && <CloseOutlined />}
                style={{ borderRadius: '4px' }}
              >
                {ad.excluded ? '제외 해제' : '이 매장만 제외'}
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
          캠페인 목록
        </Button>
      </TitleWrapper>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : campaigns.length > 0 ? (
        <StyledCollapse
          defaultActiveKey={campaigns.map((c) => String(c.campaignSeq))}
          items={collapseItems} // v6 핵심 API
          expandIconPlacement="start"
        />
      ) : (
        <Empty
          description="등록된 매장 광고가 없습니다."
          style={{ padding: '40px 0' }}
        />
      )}
    </Container>
  );
};

export default StoreAdInfoTab;
