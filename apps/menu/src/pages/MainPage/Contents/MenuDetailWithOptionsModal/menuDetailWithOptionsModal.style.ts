import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  position: relative;
  width: 1140px;
  max-width: calc(100vw - 2rem);
  height: 700px;
  max-height: calc(100vh - 2rem);
  background-color: ${({ theme }) => theme.mode.undefined_palette[100]};
  display: flex;
  border-radius: 1.25rem;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const MenuInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 35%;
  padding: 24px 24px 40px;
  min-height: 0;
`;

interface IImageWrapper {
  hasImage: boolean;
}

export const ImageWrapper = styled.div<IImageWrapper>`
  position: relative;
  width: 100%;
  flex-shrink: 0;
  background-color: ${({ theme, hasImage }) =>
    hasImage ? 'transparent' : theme.mode.grey[200]};
  border-radius: 0.5rem;
  overflow: hidden;
  ${({ hasImage }) => !hasImage && 'aspect-ratio: 4 / 3;'}
  ${({ hasImage }) => !hasImage && 'min-height: 200px;'}
`;

export const Image = styled.img`
  display: block;
  width: 100%;
  height: auto;
  border-radius: 0.5rem;
`;

export const BestIcon = styled.img`
  position: absolute;
  top: 0;
  left: 20px;
  width: 64px;
  height: 43px;
`;

export const ChiliIcons = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
`;

export const MenuName = styled.p`
  ${TYPOGRAPHY.MT_7}
  color: ${({ theme }) => theme.mode.grey[800]};
  margin: 14px 0 6px;
`;

export const Price = styled.p`
  ${TYPOGRAPHY.MT_1}
  color: ${({ theme }) => theme.mode.grey[800]};
  margin-bottom: 14px;
`;

export const Description = styled.p`
  ${TYPOGRAPHY.MT_7}
  color: ${({ theme }) => theme.mode.grey[500]};
  overflow-y: auto;
  flex: 1;
  min-height: 0;
`;

export const OptionsContainer = styled.div`
  width: 35%;
  height: 100%;
  overflow-y: auto;
  padding: 24px;
  background-color: ${({ theme }) => theme.mode.grey[50]};
`;

export const OptionsList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export const OptionGroupName = styled.p`
  ${TYPOGRAPHY.ST_1}
  color: ${({ theme }) => theme.mode.grey[600]};
  margin-bottom: 27px;

  & > span {
    ${TYPOGRAPHY.CT_2}
    color: ${({ theme }) => theme.mode.semantic[400]};
    margin-left: 8px;
  }
`;

export const Options = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const OptionText = styled.span`
  ${TYPOGRAPHY.MT_7}
  color: ${({ theme }) => theme.mode.grey[700]};
`;

export const NumberInputContainer = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
`;

export const SelectedOptionsContainer = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  padding: 24px 24px 40px;
  background-color: ${({ theme }) => theme.mode.undefined_palette[100]};
  min-height: 0;
`;

export const Title = styled.p`
  ${TYPOGRAPHY.MT_1}
  color: ${({ theme }) => theme.mode.grey[800]};
  margin-bottom: 24px;
`;

export const SelectedOptionsList = styled.ul`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  ${TYPOGRAPHY.ST_4}
  color: ${({ theme }) => theme.mode.grey[500]};
`;

export const TotalContainer = styled.div`
  flex-shrink: 0;
  padding-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const TotalInfo = styled.div`
  border-top: 1px solid ${({ theme }) => theme.mode.grey[200]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 8px 0;

  & > p:first-of-type {
    color: ${({ theme }) => theme.mode.grey[800]};
    ${TYPOGRAPHY.MT_2}
  }
  & > p:last-of-type {
    color: ${({ theme }) => theme.mode.primary[500]};
    ${TYPOGRAPHY.MT_2}
  }
`;
