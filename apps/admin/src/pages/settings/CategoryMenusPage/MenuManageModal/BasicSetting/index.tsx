import { useId, useCallback } from 'react';
import { CheckButton, Input } from '@repo/ui/components';
import {
  bestOnIcon,
  chiliOffIcon,
  chiliOnIcon,
  bestOffIcon,
  newOffIcon,
  newOnIcon,
} from '@repo/ui/icons';
import * as S from '@/pages/settings/CategoryMenusPage/MenuManageModal/BasicSetting/basicSetting.style';
import { ImageSection } from './ImageSection';
import { useMenuForm } from '../context/MenuManageModalContext';
import { formatCurrency } from '@repo/util/string';
import { MAX_NAME_LENGTH, MAX_DESCRIPTION_LENGTH } from '@repo/util/constants';

const SPICE_LEVELS = [1, 2, 3] as const;

export const BasicSetting = () => {
  const descriptionInputId = useId();
  const { formValues, updateFormValues } = useMenuForm();
  const currentSpiceLevel = formValues.spiceLevel ?? 0;

  const handleSpiceLevelClick = useCallback(
    (level: number) => {
      // 같은 레벨 클릭 시 한 단계 낮춤, 아니면 해당 레벨로 설정
      const nextLevel = currentSpiceLevel === level ? level - 1 : level;
      updateFormValues({ spiceLevel: Math.max(0, nextLevel) });
    },
    [currentSpiceLevel, updateFormValues]
  );

  const handlePriceChange = useCallback(
    (value: string) => {
      const numericString = value.replace(/[^0-9]/g, '');
      // 약 15-16자리 이상의 정수는 정밀도 손실이 발생해서 숫자 이상해짐, 16자리로 제한함
      if (numericString.length <= 16) {
        updateFormValues({
          menuPrice:
            numericString.length > 0 ? Number(numericString) : undefined,
        });
      }
    },
    [updateFormValues]
  );

  const handleMenuNameChange = useCallback(
    (value: string) => {
      if (value.length <= MAX_NAME_LENGTH) {
        updateFormValues({ menuName: value });
      }
    },
    [updateFormValues]
  );

  const handleMenuDescriptionChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value;
      if (value.length <= MAX_DESCRIPTION_LENGTH) {
        updateFormValues({ menuDescription: value });
      }
    },
    [updateFormValues]
  );

  return (
    <S.Container>
      <ImageSection />

      <S.ContentsSection>
        <S.HorizontalLayout>
          <S.VerticalLayout>
            <S.Title>
              메뉴명 <span>*</span>
            </S.Title>
            <Input
              placeholder="메뉴명을 입력해 주세요."
              customStyle={S.inputCss}
              value={formValues.menuName ?? ''}
              onChange={handleMenuNameChange}
            />
          </S.VerticalLayout>

          <S.VerticalLayout>
            <S.Title>뱃지 선택</S.Title>
            <S.BadgeContainer gap={10}>
              <S.BadgeButton
                type="button"
                onClick={() =>
                  updateFormValues({ isBest: !(formValues.isBest ?? false) })
                }
              >
                <img
                  src={formValues.isBest ? bestOnIcon : bestOffIcon}
                  alt="베스트"
                />
              </S.BadgeButton>
              <S.BadgeButton
                type="button"
                onClick={() =>
                  updateFormValues({ isNew: !(formValues.isNew ?? false) })
                }
              >
                <img
                  src={formValues.isNew ? newOnIcon : newOffIcon}
                  alt="신규"
                />
              </S.BadgeButton>
            </S.BadgeContainer>
          </S.VerticalLayout>
        </S.HorizontalLayout>

        <S.HorizontalLayout>
          <S.VerticalLayout>
            <S.PriceTitleContainer>
              <S.Title>
                가격 <span>*</span>
              </S.Title>
              <CheckButton
                checked={formValues.isTaxFree ?? false}
                onChange={(checked) => updateFormValues({ isTaxFree: checked })}
                customStyle={S.TaxFreeCss}
                disabled={true}
              >
                <span>면세</span>
              </CheckButton>
            </S.PriceTitleContainer>
            <Input
              placeholder="가격을 입력해 주세요."
              customStyle={S.inputCss}
              value={
                formValues.menuPrice ? formatCurrency(formValues.menuPrice) : ''
              }
              onChange={handlePriceChange}
            />
          </S.VerticalLayout>

          <S.VerticalLayout>
            <S.Title>매운맛정도</S.Title>
            <S.BadgeContainer>
              {SPICE_LEVELS.map((level) => (
                <S.ChiliLevelButton
                  key={level}
                  type="button"
                  onClick={() => handleSpiceLevelClick(level)}
                >
                  <img
                    src={
                      currentSpiceLevel >= level ? chiliOnIcon : chiliOffIcon
                    }
                    alt={`매운맛 ${level}단계`}
                  />
                </S.ChiliLevelButton>
              ))}
            </S.BadgeContainer>
          </S.VerticalLayout>
        </S.HorizontalLayout>

        <S.VerticalLayout flex>
          <S.Title>메뉴 설명</S.Title>
          <S.Textarea
            id={`menu-description-${descriptionInputId}`}
            value={formValues.menuDescription ?? ''}
            placeholder="메뉴 설명을 입력해 주세요."
            onChange={handleMenuDescriptionChange}
            maxLength={MAX_DESCRIPTION_LENGTH}
          />
        </S.VerticalLayout>
      </S.ContentsSection>
    </S.Container>
  );
};
