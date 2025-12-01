import { useId } from 'react';
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
import { ImageSection } from '@/pages/settings/CategoryMenusPage/MenuManageModal/BasicSetting/ImageSection';
import type { ICreateMenuRequest, IMenu } from '@repo/api/types';

interface BasicSettingProps {
  menu?: IMenu;
  values?: Partial<ICreateMenuRequest>;
  onChange?: (nextValue: Partial<ICreateMenuRequest>) => void;
  onAddFiles?: (files: FileList | null) => void;
}

export const BasicSetting = ({
  menu,
  values,
  onChange,
  onAddFiles,
}: BasicSettingProps) => {
  const descriptionInputId = useId();

  const onClickChiliLevel = (level: number) => {
    const currentSpiceLevel = values?.spiceLevel ?? 0;
    const nextSpiceLevel =
      currentSpiceLevel === 0
        ? level
        : currentSpiceLevel === level
          ? level - 1
          : level;

    onChange?.({ spiceLevel: Math.max(0, nextSpiceLevel) });
  };

  return (
    <S.Container>
      <ImageSection
        menu={menu}
        isBest={values?.isBest}
        isNew={values?.isNew}
        onAddFiles={onAddFiles}
      />

      <S.ContentsSection>
        <S.HorizontalLayout>
          <S.VerticalLayout>
            <S.Title>
              메뉴명 <span>*</span>
            </S.Title>
            <Input
              placeholder="메뉴명을 입력해 주세요."
              customStyle={S.inputCss}
              value={values?.menuName ?? ''}
              onChange={(value) => onChange?.({ menuName: value })}
            />
          </S.VerticalLayout>

          <S.VerticalLayout>
            <S.Title>뱃지 선택</S.Title>
            <S.BadgeContainer gap={10}>
              <S.BadgeButton
                type="button"
                onClick={() =>
                  onChange?.({ isBest: !(values?.isBest ?? false) })
                }
              >
                <img
                  src={values?.isBest ? bestOnIcon : bestOffIcon}
                  alt="베스트"
                />
              </S.BadgeButton>
              <S.BadgeButton
                type="button"
                onClick={() => onChange?.({ isNew: !(values?.isNew ?? false) })}
              >
                <img src={values?.isNew ? newOnIcon : newOffIcon} alt="신규" />
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
                checked={values?.isTaxFree ?? false}
                onChange={(checked) => onChange?.({ isTaxFree: checked })}
                customStyle={S.TaxFreeCss}
              >
                <span>면세</span>
              </CheckButton>
            </S.PriceTitleContainer>
            <Input
              placeholder="가격을 입력해 주세요."
              customStyle={S.inputCss}
              value={
                values?.menuPrice !== undefined
                  ? values.menuPrice.toString()
                  : ''
              }
              onChange={(value) => {
                const numericString = value.replace(/[^0-9]/g, '');
                onChange?.({
                  menuPrice:
                    numericString.length > 0
                      ? Number(numericString)
                      : undefined,
                });
              }}
            />
          </S.VerticalLayout>

          <S.VerticalLayout>
            <S.Title>매운맛정도</S.Title>
            <S.BadgeContainer>
              <S.ChiliLevelButton
                type="button"
                onClick={() => onClickChiliLevel(1)}
              >
                <img
                  src={
                    (values?.spiceLevel ?? 0) > 0 ? chiliOnIcon : chiliOffIcon
                  }
                  alt="매운맛 1단계"
                />
              </S.ChiliLevelButton>
              <S.ChiliLevelButton
                type="button"
                onClick={() => onClickChiliLevel(2)}
              >
                <img
                  src={
                    (values?.spiceLevel ?? 0) > 1 ? chiliOnIcon : chiliOffIcon
                  }
                  alt="매운맛 2단계"
                />
              </S.ChiliLevelButton>
              <S.ChiliLevelButton
                type="button"
                onClick={() => onClickChiliLevel(3)}
              >
                <img
                  src={
                    (values?.spiceLevel ?? 0) > 2 ? chiliOnIcon : chiliOffIcon
                  }
                  alt="매운맛 3단계"
                />
              </S.ChiliLevelButton>
            </S.BadgeContainer>
          </S.VerticalLayout>
        </S.HorizontalLayout>

        <S.VerticalLayout flex>
          <S.Title>메뉴 설명</S.Title>
          <S.Textarea
            id={`menu-description-${descriptionInputId}`}
            value={values?.menuDescription ?? ''}
            placeholder="메뉴 설명을 입력해 주세요."
            onChange={(event) =>
              onChange?.({ menuDescription: event.target.value })
            }
          />
        </S.VerticalLayout>
      </S.ContentsSection>
    </S.Container>
  );
};
