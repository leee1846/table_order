import { createPortal } from 'react-dom';
import {
  BasicButton,
  CheckButton,
  ModalBackground,
  NumberInput,
  RadioButton,
} from '@repo/ui/components';
import {
  bestOnIcon,
  chiliOffIcon,
  chiliOnIcon,
  CloseIcon,
} from '@repo/ui/icons';
import { useState } from 'react';
import { css } from '@emotion/react';
import * as S from './menuDetailWithOptionsModal.style';
import { useTranslation } from 'react-i18next';

const options = Array.from({ length: 4 }, (_, index) => `option-${index + 1}`);
const optionGroups = Array.from(
  { length: 10 },
  (_, index) => `option-group-${index + 1}`
);
const chosenOptions = Array.from(
  { length: 20 },
  (_, index) => `chosen-option-${index + 1}`
);

interface Props {
  onClose: () => void;
}

export const MenuDetailWithOptionsModal = ({ onClose }: Props) => {
  const { t } = useTranslation();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isSelected, setIsSelected] = useState<string | null>(null);

  const imageUrl = 'https://picsum.photos/400/300';
  const hasImage = Boolean(imageLoaded && !imageError && imageUrl);

  return createPortal(
    <ModalBackground onClick={onClose}>
      <S.Container>
        <S.CloseButton type="button" onClick={onClose}>
          <CloseIcon width={32} height={32} color="black" />
        </S.CloseButton>

        <S.MenuInfoContainer>
          <S.ImageWrapper hasImage={hasImage}>
            {!imageError && imageUrl && (
              <S.Image
                src={imageUrl}
                alt="메뉴 이미지"
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true);
                  setImageLoaded(false);
                }}
              />
            )}
            <S.BestIcon src={bestOnIcon} alt="" />
            <S.ChiliIcons>
              <img src={chiliOnIcon} width={36} height={36} alt="" />
              <img src={chiliOffIcon} width={36} height={36} alt="" />
              <img src={chiliOnIcon} width={36} height={36} alt="" />
            </S.ChiliIcons>
          </S.ImageWrapper>

          <S.MenuName>메뉴 이름???</S.MenuName>
          <S.Price>10000????</S.Price>
          <S.Description>메뉴 설명??????????????</S.Description>
        </S.MenuInfoContainer>

        <S.OptionsContainer>
          <S.OptionsList>
            {optionGroups.map((optionGroup) => (
              <li key={optionGroup}>
                <S.OptionGroupName>
                  옵션그룹명??(필수??) <span>필수/수량제한??</span>
                </S.OptionGroupName>
                <S.Options>
                  {options.map((option) => (
                    <li key={option}>
                      <RadioButton
                        id={`option-${1}`}
                        value={option}
                        onChange={() => setIsSelected(option)}
                        checked={isSelected === option}
                      >
                        <S.OptionText>옵션옵션</S.OptionText>
                      </RadioButton>
                    </li>
                  ))}
                  {options.map((option) => (
                    <li key={option}>
                      <CheckButton
                        id={`option-${1}`}
                        checked={isSelected === option}
                        onChange={() => setIsSelected(option)}
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
                  {options.map((option) => (
                    <S.NumberInputContainer key={option}>
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
