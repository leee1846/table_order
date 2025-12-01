import { createPortal } from 'react-dom';
import {
  BasicButton,
  CheckButton,
  ModalBackground,
  NumberInput,
  RadioButton,
} from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { css } from '@emotion/react';
import * as S from './menuDetailWithOptionsModal.style';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '@repo/ui';
import type { IMenu } from '@repo/api/types';
import { Thumbnail } from '@/feature/Thumbnail';
import { Swiper, SwiperSlide } from 'swiper/react';
import { formatCurrency } from '@repo/util/string';
import 'swiper/css';
import { NoContent } from '@/feature/NoContent';

const chosenOptions = Array.from(
  { length: 20 },
  (_, index) => `chosen-option-${index + 1}`
);

interface Props {
  onClose: () => void;
  menu: IMenu;
}

export const MenuDetailWithOptionsModal = ({ onClose, menu }: Props) => {
  const { t } = useTranslation();
  const { theme } = useThemeMode();

  const images = menu.menuImageList?.filter((img) => img.imagePath) || [];

  return createPortal(
    <ModalBackground onClick={onClose}>
      <S.Container>
        <S.CloseButton type="button" onClick={onClose}>
          <CloseIcon width={32} height={32} color={theme.mode.grey[700]} />
        </S.CloseButton>

        <S.MenuInfoContainer>
          {images.length > 0 ? (
            <S.SwiperContainer>
              <Swiper spaceBetween={0} slidesPerView={1} loop>
                {images.map((image) => (
                  <SwiperSlide key={image.imageSeq}>
                    <Thumbnail menu={menu} image={image} width="100%" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </S.SwiperContainer>
          ) : (
            <Thumbnail menu={menu} image={undefined} width="100%" />
          )}

          <S.MenuName>{menu.menuName}</S.MenuName>
          <S.Price>{formatCurrency(menu.menuPrice)}</S.Price>
          <S.Description>{menu.menuDescription}</S.Description>
        </S.MenuInfoContainer>

        <S.OptionsContainer>
          {menu.optionGroupList.length < 1 && (
            <NoContent paddingTop="10%">옵션이 존재하지 않습니다.</NoContent>
          )}

          <S.OptionsList>
            {menu.optionGroupList.map((optionGroup) => (
              <li key={optionGroup.optionGroupSeq}>
                <S.OptionGroupName>
                  {optionGroup.optionGroupName}{' '}
                  {optionGroup.requiredQuantity &&
                    `(${optionGroup.requiredQuantity}개 필수 선택)`}
                  {optionGroup.requiredQuantity && <span>필수/수량제한</span>}
                </S.OptionGroupName>

                <S.Options>
                  {optionGroup.optionList.map((option) => (
                    <li key={option.optionSeq}>
                      <RadioButton
                        value={''}
                        onChange={() => {}}
                        checked={false}
                      >
                        <S.OptionText>옵션옵션</S.OptionText>
                      </RadioButton>
                    </li>
                  ))}
                  {optionGroup.optionList.map((option) => (
                    <li key={option.optionSeq}>
                      <CheckButton
                        checked={false}
                        onChange={() => {}}
                        customStyle={css`
                          & > div {
                            width: 24px;
                            height: 24px;
                          }
                        `}
                      >
                        <S.OptionText>옵션옵션</S.OptionText>
                      </CheckButton>
                    </li>
                  ))}
                  {optionGroup.optionList.map((option) => (
                    <S.NumberInputContainer key={option.optionSeq}>
                      <S.OptionText>옵션 이름이름</S.OptionText>
                      <NumberInput
                        variant="rounded"
                        value={1}
                        onChange={() => {}}
                        size="M"
                        min={1}
                      />
                    </S.NumberInputContainer>
                  ))}
                </S.Options>
              </li>
            ))}
          </S.OptionsList>
        </S.OptionsContainer>

        <S.SelectedOptionsContainer>
          <S.Title>선택한 옵션</S.Title>
          <S.SelectedOptionsList>
            {chosenOptions.map((chosenOption) => (
              <li key={chosenOption}>
                <span />
                <p>옵션그룹명?? : 옵션이름 (+0000?)</p>
              </li>
            ))}
          </S.SelectedOptionsList>

          <S.TotalContainer>
            <NumberInput
              variant="square"
              value={1}
              onChange={() => {}}
              size="L"
              min={1}
              customStyle={css`
                width: 100%;
              `}
            />
            <S.TotalInfo>
              <p>합계</p>
              <p>10000????</p>
            </S.TotalInfo>
            <BasicButton
              variant="Solid_Blue_2XL"
              onClick={() => {}}
              customStyle={css`
                width: 100%;
              `}
            >
              {t('추가하기')}
            </BasicButton>
          </S.TotalContainer>
        </S.SelectedOptionsContainer>
      </S.Container>
    </ModalBackground>,
    document.body
  );
};
