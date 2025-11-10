import { BasicButton, ModalBackground } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from '@/pages/settings/CategoriesPage/CategoryTimeRangeModal/categoryTimeRangeModal.style';

interface Props {
  onClose: () => void;
}
export const CategoryTimeRangeModal = ({ onClose }: Props) => {
  return (
    <ModalBackground onClick={onClose}>
      <S.Container>
        <S.CloseButton type="button" onClick={onClose}>
          <CloseIcon width={32} height={32} color={theme.colors.grey[600]} />
        </S.CloseButton>

        <p>판매 시간 설정</p>

        <div>
          <p>판매 시작 시간</p>
          <input
            type="time"
            value="00:00"
            onChange={(e) => {
              console.log(e.target.value);
            }}
          />
        </div>
        <div>
          <p>판매 종료 시간</p>
          <input
            type="time"
            value="00:00"
            onChange={(e) => {
              console.log(e.target.value);
            }}
          />
        </div>

        <BasicButton variant="Solid_Navy_2XL" onClick={() => {}}>
          설정완료
        </BasicButton>
      </S.Container>
    </ModalBackground>
  );
};
