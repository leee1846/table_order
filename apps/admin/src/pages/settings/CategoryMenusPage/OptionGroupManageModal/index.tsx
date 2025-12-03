import { theme } from '@repo/ui';
import {
  BasicButton,
  CheckButton,
  Input,
  ModalBackground,
} from '@repo/ui/components';
import { AddCircleIcon, CloseIcon } from '@repo/ui/icons';
import * as S from '@/pages/settings/CategoryMenusPage/MenuManageModal/OptionSetting/OptionGroupManageModal/optionGroupManageModal.style';

interface Props {
  onClose: () => void;
  optionGroupSeq?: number | null;
}

export const OptionGroupManageModal = ({ onClose, optionGroupSeq }: Props) => {
  const isEditMode = optionGroupSeq !== null && optionGroupSeq !== undefined;
  const modalTitle = isEditMode ? '옵션 그룹 수정' : '옵션 그룹 추가';

  return (
    <ModalBackground onClick={onClose}>
      <S.Container>
        <S.CloseButton type="button" onClick={onClose}>
          <CloseIcon width={32} height={32} color={theme.colors.grey[700]} />
        </S.CloseButton>
        <h1>{modalTitle}</h1>

        <S.Contents>
          <S.TitleContainer>
            <p>
              옵션 그룹명 <span>*</span>
            </p>
            <Input
              placeholder="옵션 그룹명을 입력해주세요."
              customStyle={S.inputCss}
            />
          </S.TitleContainer>

          <S.TitleContainer>
            <p>
              개별 옵션 <span>*</span>
            </p>
            <S.OptionAddButton type="button">
              <AddCircleIcon
                width={16}
                height={16}
                color={theme.colors.grey[600]}
              />
              <span>옵션 추가</span>
            </S.OptionAddButton>
          </S.TitleContainer>

          <S.TitleContainer>
            <p>추가 설정</p>
            <S.AdditionalsContainer>
              <div>
                필수
                <input type="number" />개 선택 (미설정 시 무제한 성택 가능)
              </div>
              <CheckButton
                checked={false}
                onChange={() => {}}
                customStyle={S.checkButtonCss}
              >
                <span>옵션 수량 선택</span>
              </CheckButton>
              <CheckButton
                checked={false}
                onChange={() => {}}
                customStyle={S.checkButtonCss}
              >
                <span>추가 옵션</span>
              </CheckButton>
              <CheckButton
                checked={false}
                onChange={() => {}}
                customStyle={S.checkButtonCss}
              >
                <span>중복체크 허용 (선택 옵션)</span>
              </CheckButton>
            </S.AdditionalsContainer>
          </S.TitleContainer>

          <S.TitleContainer>
            <p>포스 코드 연동</p>
            <S.CodeContainer>
              <Input
                placeholder="옵션 그룹 코드"
                disabled
                customStyle={S.inputCss}
              />
              <Input
                placeholder="옵션 분류 코드"
                disabled
                customStyle={S.inputCss}
              />
            </S.CodeContainer>
          </S.TitleContainer>
        </S.Contents>

        <S.FloatingButtonContainer>
          <BasicButton variant="Solid_Navy_2XL">저장하기</BasicButton>
        </S.FloatingButtonContainer>
      </S.Container>
    </ModalBackground>
  );
};
