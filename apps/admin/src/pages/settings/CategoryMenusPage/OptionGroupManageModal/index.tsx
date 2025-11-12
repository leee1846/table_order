import { theme } from '@repo/ui';
import {
  BasicButton,
  CheckButton,
  Input,
  ModalBackground,
} from '@repo/ui/components';
import { AddCircleIcon, CloseIcon, DeleteIcon } from '@repo/ui/icons';
import { useId } from 'react';

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
  const OPTION_COUNT_INPUT_ID = `option-count-${useId()}`;
  const ADD_OPTION_INPUT_ID = `add-option-${useId()}`;
  const DUPLICATE_CHECK_INPUT_ID = `duplicate-check-${useId()}`;

  return (
    <ModalBackground onClick={onClose}>
      <div>
        <button type="button" onClick={onClose}>
          <CloseIcon width={32} height={32} color={theme.colors.grey[700]} />
        </button>
        <h1>옵션 그룹 추가</h1>

        <div>
          <div>
            <p>
              옵션 그룹명 <span>*</span>
            </p>
            <Input placeholder="옵션 그룹명을 입력해주세요." />
          </div>

          <div>
            <p>
              개별 옵션 <span>*</span>
            </p>
            {OPTIONS.map((option) => (
              <div key={option.id}>
                <CheckButton
                  id="option1"
                  checked={false}
                  onChange={() => {
                    // noop
                  }}
                >
                  <span>품절</span>
                </CheckButton>
                <Input placeholder="옵션 이름을 입력해주세요." />
                <Input placeholder="옵션 가격을 입력해주세요." />
                <Input />
                <BasicButton
                  variant="Solid_Navy_M"
                  icon={
                    <DeleteIcon
                      width={22}
                      height={22}
                      color={theme.colors.grey[700]}
                    />
                  }
                />
              </div>
            ))}

            <button type="button">
              <AddCircleIcon
                width={16}
                height={16}
                color={theme.colors.grey[600]}
              />
              <span>옵션 추가</span>
            </button>
          </div>

          <div>
            <p>추가 설정</p>
            <div>
              <div>
                필수
                <input type="number" />개 선택 (미설정 시 무제한 성택 가능)
              </div>
              <CheckButton
                id={OPTION_COUNT_INPUT_ID}
                checked={false}
                onChange={() => {}}
              >
                <span>옵션 수량 선택</span>
              </CheckButton>
              <CheckButton
                id={ADD_OPTION_INPUT_ID}
                checked={false}
                onChange={() => {}}
              >
                <span>추가 옵션</span>
              </CheckButton>
              <CheckButton
                id={DUPLICATE_CHECK_INPUT_ID}
                checked={false}
                onChange={() => {}}
              >
                <span>중복체크 허용 (선택 옵션)</span>
              </CheckButton>
            </div>
          </div>

          <div>
            <p>포스 코드 연동</p>
            <Input placeholder="옵션 그룹 코드" disabled />
            <Input placeholder="옵션 분류 코드" disabled />
          </div>
        </div>
      </div>
    </ModalBackground>
  );
};
