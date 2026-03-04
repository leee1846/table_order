import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  background-color: ${theme.colors.white};
  padding: 40px 24px 40px 30px;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 24px;
  color: ${theme.colors.grey[800]};
  ${TYPOGRAPHY.MT_1}

  & > div {
    width: 0.125rem;
    height: 1.25rem;
    background-color: ${theme.colors.grey[800]};
  }

  & > span {
    color: ${theme.colors.grey[600]};
    ${TYPOGRAPHY.ST_1}
  }
`;

export const List = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`;

export const Item = styled.div`
  flex: 1;
  height: 9.375rem;
  border-radius: 1rem;
  border: 1px solid ${theme.colors.primary[200]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

export const SubTitle = styled.p`
  color: ${theme.colors.grey[900]};
  ${TYPOGRAPHY.ST_4}
`;

export const Price = styled.p`
  display: flex;
  gap: 4px;
  align-items: center;
  color: ${theme.colors.primary[500]};
  ${TYPOGRAPHY.MT_1}

  & > span {
    ${TYPOGRAPHY.ST_3}
  }
`;

export const Description = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  color: ${theme.colors.grey[500]};
  ${TYPOGRAPHY.BD_2}
`;

export const IconWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding: 4px;
`;

export const Tooltip = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  z-index: ${theme.zIndex.tooltip};
  background-color: ${theme.colors.grey[800]};
  color: ${theme.colors.white};
  padding: 8px 12px;
  border-radius: 8px;
  white-space: nowrap;
  ${TYPOGRAPHY.ST_4}
  pointer-events: none;
`;

export const TooltipText = styled.span`
  display: block;
`;

export const TooltipArrow = styled.div`
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid ${theme.colors.grey[800]};
`;
