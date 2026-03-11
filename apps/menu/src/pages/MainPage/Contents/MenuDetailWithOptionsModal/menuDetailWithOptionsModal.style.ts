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
  overflow: hidden;
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
  padding: 24px;
  min-height: 0;
  background-color: ${({ theme }) => theme.mode.grey[50]};
`;

export const SwiperContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: 0.5rem;
  overflow: hidden;

  .swiper-pagination-bullet {
    background-color: rgba(255, 255, 255,0.7);
    opacity: 1;
  }

  .swiper-pagination-bullet-active {
    background-color: ${({ theme }) => theme.mode.primary[500]};
    ;
  }
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

export const MenuQuantityContainer = styled.div`
  padding-top: 12px;
`;

export const RightWrapper = styled.div`
  width: 65%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const OptionsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 1;
  padding: 24px 54px 24px 24px;
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
  }

  & > span {
    margin-left: 8px;
  }
`;

export const Options = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;

  & > li {
    min-width: 0;
  }
`;

export const OptionText = styled.span<{ soldOut: boolean }>`
  ${TYPOGRAPHY.MT_7}
  color: ${({ soldOut, theme }) =>
    soldOut ? theme.mode.grey[400] : theme.mode.grey[700]};
  word-break: break-word;
`;

export const NumberInputContainer = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  min-width: 0;

  & > span {
    flex: 1;
    min-width: 0;
    word-break: break-word;
  }
`;

export const TotalContainer = styled.div`
  border-top: 1px solid ${({ theme }) => theme.mode.grey[200]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
`;

export const TotalInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  & > h3 {
    color: ${({ theme }) => theme.mode.grey[800]};
    ${TYPOGRAPHY.MT_2}
  }
  & > p {
    color: ${({ theme }) => theme.mode.primary[500]};
    ${TYPOGRAPHY.MT_2}
  }
`;
