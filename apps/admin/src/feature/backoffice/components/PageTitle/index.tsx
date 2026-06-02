import React from 'react';
import { Typography, Divider } from 'antd';
import styled from '@emotion/styled';

const { Title, Text } = Typography;

// --- Types ---
interface PageTitleProps {
  title: string; // 예: '매장 관리', '캠페인 관리'
  subtitle?: string; // 예: '목록', '등록'
}

// --- Emotion Styles ---
const TitleWrapper = styled.div`
  display: flex;
  align-items: center; /* 완벽한 수직 중앙 정렬의 핵심 */
  margin-bottom: 24px;
`;

// --- Component ---
const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle }) => {
  return (
    <TitleWrapper>
      {/* 메인 타이틀 (진하고 굵게) */}
      <Title level={4} style={{ margin: 0, color: '#141414', fontWeight: 600 }}>
        {title}
      </Title>

      {/* 서브 타이틀이 있을 경우에만 구분선과 함께 렌더링 */}
      {subtitle && (
        <>
          <Divider
            orientation="vertical"
            style={{
              margin: '0 12px', // 좌우 여백
              height: '16px', // 텍스트 높이에 맞춘 얇은 선
              backgroundColor: '#bfbfbf', // 옅은 회색
              top: 0, // Ant Design Divider의 기본 미세 틀어짐 방지
            }}
          />
          <Text style={{ fontSize: '15px', color: '#8c8c8c' }}>{subtitle}</Text>
        </>
      )}
    </TitleWrapper>
  );
};

export default PageTitle;
