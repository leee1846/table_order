import { theme } from '@repo/ui';
import {
  BasicButton,
  CheckButton,
  Input,
  ModalBackground,
} from '@repo/ui/components';
import { AddCircleIcon, CloseIcon, DeleteIcon } from '@repo/ui/icons';
import * as S from '@/pages/settings/CategoryMenusPage/OptionGroupManageModal/optionGroupManageModal.style';

const OPTIONS = [
  {
    id: 1,
    name: '옵션1',
    price: 1000,
    isSoldOut: false,
    posCode: '1234567890',
  },
  {
    id: 2,
    name: '옵션2',
    price: 2000,
    isSoldOut: true,
    posCode: '1234567890',
  },
  {
    id: 3,
    name: '옵션3',
    price: 3000,
    isSoldOut: false,
    posCode: '1234567890',
  },
];

interface Props {
  onClose: () => void;
}

export const OptionGroupManageModal = ({ onClose }: Props) => {
  return (
    <ModalBackground onClick={onClose}>
      <S.Container>
        <S.CloseButton type="button" onClick={onClose}>
          <CloseIcon width={32} height={32} color={theme.colors.grey[700]} />
        </S.CloseButton>
        <h1>옵션 그룹 추가</h1>

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
            {OPTIONS.length > 0 && (
              <S.OptionList>
                {OPTIONS.map((option) => (
                  <li key={option.id}>
                    <CheckButton
                      checked={false}
                      onChange={() => {
                        // noop
                      }}
                      customStyle={S.soldOutCss}
                    >
                      <span>품절</span>
                    </CheckButton>
                    <Input
                      placeholder="옵션 이름을 입력해주세요."
                      customStyle={S.inputCss}
                    />
                    <Input
                      placeholder="옵션 가격을 입력해주세요."
                      customStyle={S.inputCss}
                    />
                    <Input
                      placeholder="포스 코드"
                      customStyle={S.inputCss}
                      disabled
                    />
                    <BasicButton
                      variant="Outline_Grey_XL"
                      icon={
                        <DeleteIcon
                          width={22}
                          height={22}
                          color={theme.colors.grey[700]}
                        />
                      }
                      customStyle={S.deleteButtonCss}
                    />
                  </li>
                ))}
              </S.OptionList>
            )}

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
