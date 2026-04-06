import React from 'react';
import { Typography, Card } from 'antd';
import styled from '@emotion/styled';

const { Text } = Typography;

// --- Emotion Styles ---
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  background-color: #f4f7fa; /* 전체 배경색 */
  padding: 40px;
`;

// 요약 정보의 각 행(Row)
const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;

  /* 마지막 행은 밑줄 제거 */
  &:last-child {
    border-bottom: none;
  }
`;

const StyledCard = styled(Card)`
  width: 100%;
`;

const CardTitle = styled.span`
  color: #1d2a6d;
`;

const LabelText = styled(Text)`
  color: #8c8c8c;
`;

// --- Component ---
const ConfirmAndSave: React.FC = () => {
  // 실제 환경에서는 상위 컴포넌트나 상태 관리 툴에서 등록된 데이터를 받아와서 렌더링합니다.
  const campaignData = {
    name: '새로 소주 여름 이벤트',
    type: '전면 대기_영상 / 상단 배너_이미지',
    storeCount: '128개',
    period: '2026-06-01 ~ 2026-08-31',
    status: '집행 대기',
  };

  return (
    <Container>
      {/* 2. 등록 정보 요약 박스 */}
      <StyledCard
        title={<CardTitle>캠페인 등록 요약</CardTitle>}
        variant="borderless"
      >
        <SummaryRow>
          <LabelText>캠페인명</LabelText>
          <Text strong>{campaignData.name}</Text>
        </SummaryRow>

        <SummaryRow>
          <LabelText>광고 유형</LabelText>
          <Text strong>{campaignData.type}</Text>
        </SummaryRow>

        <SummaryRow>
          <LabelText>등록 매장</LabelText>
          <Text strong>{campaignData.storeCount}</Text>
        </SummaryRow>

        <SummaryRow>
          <LabelText>집행 기간</LabelText>
          <Text strong>{campaignData.period}</Text>
        </SummaryRow>
      </StyledCard>
    </Container>
  );
};

export default ConfirmAndSave;
