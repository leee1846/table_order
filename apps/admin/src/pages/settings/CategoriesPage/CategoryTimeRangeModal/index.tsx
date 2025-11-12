import { BasicButton, ModalBackground } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from '@/pages/settings/CategoriesPage/CategoryTimeRangeModal/categoryTimeRangeModal.style';
import { useId } from 'react';

interface Props {
  onClose: () => void;
}
export const CategoryTimeRangeModal = ({ onClose }: Props) => {
  const SALE_START_HOUR_ID = `sale-start-hour-${useId()}`;
  const SALE_START_MINUTE_ID = `sale-start-minute-${useId()}`;
  const SALE_END_HOUR_ID = `sale-end-hour-${useId()}`;
  const SALE_END_MINUTE_ID = `sale-end-minute-${useId()}`;

  return (
    <ModalBackground onClick={onClose}>
      <S.Container>
        <S.CloseButton type="button" onClick={onClose}>
          <CloseIcon width={32} height={32} color={theme.colors.grey[600]} />
        </S.CloseButton>

        <S.Title>판매 시간 설정</S.Title>

        <S.Contents>
          <S.Content>
            <p>판매 시작 시간</p>
            <div>
              <input
                id={SALE_START_HOUR_ID}
                onChange={() => {
                  // noop
                }}
                type="number"
                placeholder="00"
              />
              <span>시</span>
              <input
                id={SALE_START_MINUTE_ID}
                onChange={() => {
                  // noop
                }}
                type="number"
                placeholder="00"
              />
              <span>분</span>
            </div>
          </S.Content>
          <S.Content>
            <p>판매 종료 시간</p>
            <div>
              <input
                id={SALE_END_HOUR_ID}
                onChange={() => {
                  // noop
                }}
                type="number"
                placeholder="00"
              />
              <span>시</span>
              <input
                id={SALE_END_MINUTE_ID}
                onChange={() => {
                  // noop
                }}
                type="number"
                placeholder="00"
              />
              <span>분</span>
            </div>
          </S.Content>
        </S.Contents>

        <BasicButton
          variant="Solid_Navy_2XL"
          onClick={() => {
            // noop
          }}
          fullWidth
        >
          설정완료
        </BasicButton>
      </S.Container>
    </ModalBackground>
  );
};
