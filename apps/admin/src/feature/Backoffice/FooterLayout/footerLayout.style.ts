import styled from '@emotion/styled';
import { Layout, Divider } from 'antd';

const { Footer } = Layout;

export const StyledFooter = styled(Footer)`
  background-color: #ffffff !important;
  border-top: 1px solid #eeeeee;
  padding: 20px 0 30px 0 !important; /* 가이드: 상단 20, 하단 30 */
  width: 100%;
  flex-shrink: 0;
`;

export const FooterInner = styled.div`
  max-width: 1280px; /* 가이드 사양: 컨텐츠 가로폭 1280 */
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
`;

export const TopSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

export const LogoArea = styled.div`
  margin-right: 40px; /* 가이드 사양: BI와 메뉴 간격 */
  display: flex;
  align-items: center;

  img {
    height: 24px; /* 로고 이미지 높이에 맞게 조절 가능 */
    object-fit: contain;
  }
`;

export const LinkArea = styled.div`
  display: flex;
  align-items: center;

  .link-item {
    font-size: 14px;
    color: #666666;
    text-decoration: none;

    &.bold {
      font-weight: 700; /* 가이드 사양: 개인정보처리방침 Bold */
      color: #000000;
    }
  }
`;

export const CustomDivider = styled(Divider)`
  border-left: 1px solid #e3e3e3 !important;
  height: 10px !important;
  margin: 0 20px !important; /* 가이드 사양: Divider 좌우 간격 */
`;

export const BottomSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

export const InfoArea = styled.div`
  .company-details {
    font-size: 12px;
    color: #999999;
    line-height: 1.8;
    .bar {
      margin: 0 8px;
      color: #e3e3e3;
    }
  }
  .copyright {
    font-size: 12px;
    color: #999999;
    margin-top: 4px;
    font-family: 'Arial', sans-serif;
  }
`;
