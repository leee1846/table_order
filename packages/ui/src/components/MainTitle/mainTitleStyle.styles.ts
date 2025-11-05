import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { TYPOGRAPHY } from '../../theme/typography';

export const MainTitleStyle = styled.p`
  // 사용 방법 두 가지

  ${css(TYPOGRAPHY.MT_1)};

  // or
  // ...TYPOGRAPHY.MT_1,
`;
