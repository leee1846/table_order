import React from 'react';
import * as S from './footerLayout.style';

import adtLogo from '@/assets/adt.png';

/**
 * SK Shieldus / ADT Caps 디자인 가이드 사양:
 * - 가로 폭: 1280px (중앙 정렬)
 * - 배경색: #FFFFFF
 * - 상단 경계선: #EEEEEE (1px)
 * - 텍스트 색상: 주요(#666666), 보조(#999999)
 * - 폰트: 14px (메뉴), 12px (정보)
 */

const CorporateFooter: React.FC = () => {
  return (
    <S.StyledFooter>
      <S.FooterInner>
        {/* 상단 영역: BI 및 주요 링크 */}
        <S.TopSection>
          <S.LogoArea>
            <img src={adtLogo} alt="ADT 캡스" />
          </S.LogoArea>

          <S.LinkArea>
            <a
              href="https://www.skshieldus.com/privacy-policy/sk/v37"
              className="link-item bold"
              target="_blank"
              rel="noopener noreferrer"
            >
              개인정보처리방침
            </a>
            <S.CustomDivider orientation="vertical" />
            <a /* href="/terms" */ className="link-item">이용약관</a>
            <S.CustomDivider orientation="vertical" />
            <span className="link-item">고객센터 1500-6400</span>
          </S.LinkArea>
        </S.TopSection>

        {/* 하단 영역: 기업 정보 및 패밀리 사이트 */}
        <S.BottomSection>
          <S.InfoArea>
            <div className="company-details">
              <span>에스케이쉴더스 주식회사</span>
              <span className="bar">|</span>
              <span>사업자등록번호 120-86-07747</span>
              <span className="bar">|</span>
              <span>
                주소 : 13486 경기도 성남시 분당구 판교로 227번길 23, 485층
              </span>
            </div>
            <div className="copyright">
              COPYRIGHT © 2026 SK SHIELDUS. ALL RIGHTS RESERVED.
            </div>
          </S.InfoArea>

          {/*           <FamilySiteArea>
            <StyledSelect
              defaultValue="default"
              size="small"
              suffixIcon={<GlobalOutlined />}
            >
              <Option value="default">링크 페이지</Option>
              <Option value="site1">SK 쉴더스</Option>
              <Option value="site2">ADT 캡스몰</Option>
              <Option value="site3">인재채용</Option>
            </StyledSelect>
          </FamilySiteArea> */}
        </S.BottomSection>
      </S.FooterInner>
    </S.StyledFooter>
  );
};

export default CorporateFooter;
