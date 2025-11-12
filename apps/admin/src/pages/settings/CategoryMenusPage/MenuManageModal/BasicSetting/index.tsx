import { useId } from 'react';
import { theme } from '@repo/ui';
import { CheckButton, Input } from '@repo/ui/components';
import {
  AddIcon,
  bestOnIcon,
  chiliOffIcon,
  chiliOnIcon,
  newOnIcon,
} from '@repo/ui/icons';

export const BasicSetting = () => {
  const TAX_FREE_ID = `tax-free-${useId()}`;
  const CHILI_LEVEL = 1;

  return (
    <div>
      <div>
        <div>
          <span>여기는 아이콘</span>
          <p>메인 사진 (1장) 을 선택해 주세요</p>
          <span>(700*500 px 권장)</span>
        </div>
        <div>
          <input type="file" />
          <AddIcon width={20} height={20} color={theme.colors.grey[600]} />
          <span>추가할 이미지가 있다면 선택해 주세요 </span>
        </div>
      </div>

      <div>
        <div>
          <div>
            <p>
              메뉴명 <span>*</span>
            </p>
            <Input placeholder="메뉴명을 입력해 주세요." />
          </div>
          <div>
            <p>뱃지 선택</p>
            <div>
              <button type="button">
                <img src={bestOnIcon} alt="베스트" />
              </button>
              <button type="button">
                <img src={newOnIcon} alt="신규" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <div>
            <div>
              <p>
                가격 <span>*</span>
              </p>
              <CheckButton id={TAX_FREE_ID} checked={false} onChange={() => {}}>
                <span>면세</span>
              </CheckButton>
            </div>
            <Input placeholder="가격을 입력해 주세요." />
          </div>

          <div>
            <p>매운맛정도</p>
            <div>
              <button type="button">
                <img
                  src={CHILI_LEVEL > 0 ? chiliOnIcon : chiliOffIcon}
                  alt="매운맛 1단계"
                />
              </button>
              <button type="button">
                <img
                  src={CHILI_LEVEL > 1 ? chiliOnIcon : chiliOffIcon}
                  alt="매운맛 2단계"
                />
              </button>
              <button type="button">
                <img
                  src={CHILI_LEVEL > 2 ? chiliOnIcon : chiliOffIcon}
                  alt="매운맛 3단계"
                />
              </button>
            </div>
          </div>

          <div>
            <p>메뉴 설명</p>
            <textarea placeholder="메뉴 설명을 입력해 주세요." />
          </div>
        </div>
      </div>
    </div>
  );
};
