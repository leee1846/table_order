import { t } from '@/config/i18n';
import { useId, useCallback } from 'react';
import { Input } from '@repo/ui/components';
import {
  bestOnIcon,
  bestOffIcon,
  newOffIcon,
  newOnIcon,
  spicyLevel1Icon,
  spicyLevel2Icon,
  spicyLevel3Icon,
} from '@repo/ui/icons';
import * as S from '@/pages/settings/CategoryMenusPage/MenuManageModal/BasicSetting/basicSetting.style';
import { ImageSection } from './ImageSection';
import { useMenuForm } from '../context/MenuManageModalContext';
import { formatCurrency, allowOnlyNumbers } from '@repo/util/string';
import { MAX_NAME_LENGTH, MAX_DESCRIPTION_LENGTH } from '@repo/util/constants';

const SPICE_LEVELS = [1, 2, 3] as const;

interface Props {
  isPosLinked: boolean;
  hideImageSection?: boolean;
}

const SPICE_LEVEL_ICONS: Record<number, string> = {
  1: spicyLevel1Icon,
  2: spicyLevel2Icon,
  3: spicyLevel3Icon,
};

const SPICE_LEVEL_LABELS: Record<(typeof SPICE_LEVELS)[number], string> = {
  1: '약간 매움',
  2: '매움',
  3: '많이 매움',
};

export const BasicSetting = ({ isPosLinked, hideImageSection }: Props) => {
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
      // 콤마를 제거한 숫자만 추출
      const numericValue = allowOnlyNumbers(value);
      updateFormValues({
        menuPrice: numericValue.length > 0 ? Number(numericValue) : 0,
      });
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
    <S.Container contentOnly={hideImageSection}>
      {!hideImageSection && <ImageSection />}

      <S.ContentsSection>
        <S.HorizontalLayout>
          <S.VerticalLayout>
            <S.Title>
              {t('메뉴명')}
              <span>*</span>
            </S.Title>
            <Input
              placeholder={t('메뉴명을 입력해 주세요.')}
              customStyle={S.inputCss}
              value={formValues.menuName ?? ''}
              onChange={handleMenuNameChange}
            />
          </S.VerticalLayout>

          <S.VerticalLayout>
            <S.PriceTitleContainer>
              <S.Title>
                {t('가격')}
                <span>*</span>
              </S.Title>
            </S.PriceTitleContainer>
            <Input
              inputMode="numeric"
              placeholder="0"
              customStyle={S.inputCss}
              value={formatCurrency(formValues.menuPrice ?? 0)}
              onChange={handlePriceChange}
              disabled={isPosLinked}
            />
          </S.VerticalLayout>
        </S.HorizontalLayout>

        <S.VerticalLayout flex>
          <S.Title>{t('메뉴 설명')}</S.Title>
          <S.Textarea
            id={`menu-description-${descriptionInputId}`}
            value={formValues.menuDescription ?? ''}
            placeholder={t('메뉴 설명을 입력해 주세요.')}
            onChange={handleMenuDescriptionChange}
            maxLength={MAX_DESCRIPTION_LENGTH}
          />
        </S.VerticalLayout>

        <S.VerticalLayout>
          <S.Title>{t('스티커 추가')}</S.Title>

          <S.SubTitle>{t('매운맛 선택')}</S.SubTitle>
          <S.SpiceLevelContainer>
            <S.SpiceLevelButtons>
              {SPICE_LEVELS.map((level) => (
                <S.ChiliLevelButton
                  key={level}
                  type="button"
                  onClick={() => handleSpiceLevelClick(level)}
                  selected={currentSpiceLevel >= level}
                  aria-pressed={currentSpiceLevel >= level}
                >
                  <img
                    src={SPICE_LEVEL_ICONS[level]}
                    alt={`매운맛 ${level}단계`}
                  />
                  <span>{`${t(`${level}단계`)} (${t(SPICE_LEVEL_LABELS[level] ?? '')})`}</span>
                </S.ChiliLevelButton>
              ))}
            </S.SpiceLevelButtons>
          </S.SpiceLevelContainer>

          <S.SubTitle>{t('특별 메뉴(최대 2개)')}</S.SubTitle>
          <S.BadgeContainer gap={10}>
            <div>
              <S.BadgeButton
                type="button"
                onClick={() =>
                  updateFormValues({ isNew: !(formValues.isNew ?? false) })
                }
              >
                <img
                  src={formValues.isNew ? newOnIcon : newOffIcon}
                  alt={t('신규')}
                />
              </S.BadgeButton>
            </div>

            <div>
              <S.BadgeButton
                type="button"
                onClick={() =>
                  updateFormValues({ isBest: !(formValues.isBest ?? false) })
                }
              >
                <img
                  src={formValues.isBest ? bestOnIcon : bestOffIcon}
                  alt={t('베스트')}
                />
              </S.BadgeButton>
            </div>
          </S.BadgeContainer>
        </S.VerticalLayout>
      </S.ContentsSection>
    </S.Container>
  );
};
