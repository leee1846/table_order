import { useId, useState } from 'react';
import { theme } from '@repo/ui';
import { CheckButton, Input } from '@repo/ui/components';
import {
  AddIcon,
  bestOnIcon,
  chiliOffIcon,
  chiliOnIcon,
  CloseIcon,
  newOnIcon,
  PhotoIcon,
  bestOffIcon,
  newOffIcon,
} from '@repo/ui/icons';
import * as S from '@/pages/settings/CategoryMenusPage/MenuManageModal/BasicSetting/basicSetting.style';

export const BasicSetting = () => {
  const TAX_FREE_ID = `tax-free-${useId()}`;

  const [isBest, setIsBest] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [chiliLevel, setChiliLevel] = useState(0);

  const onClickChiliLevel = (level: number) => {
    setChiliLevel((prev) => {
      if (prev === 0) {
        return level;
      }
      if (prev === level) {
        return prev - 1;
      }
      return level;
    });
  };

  const IMAGES: { id: number; url: string }[] = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    },
  ];

  return (
    <S.Container>
      <S.ImageSection>
        <S.Thumbnail>
          <S.BadgesContainer>
            {isBest && <img src={bestOnIcon} alt="베스트" />}
            {isNew && <img src={newOnIcon} alt="신규" />}
          </S.BadgesContainer>

          {IMAGES.length > 0 ? (
            <img src={IMAGES[0]?.url ?? ''} alt="메인 사진" />
          ) : (
            <>
              <PhotoIcon
                width={36}
                height={36}
                color={theme.colors.primary[400]}
              />
              <p>메인 사진 (1장) 을 선택해 주세요</p>
              <span>(700*500 px 권장)</span>
            </>
          )}
        </S.Thumbnail>
        {IMAGES.length > 0 ? (
          <S.ImagesContainer>
            <S.Gradient />
            <S.ScrollableContent>
              <S.ImageAddButton>
                <AddIcon
                  width={20}
                  height={20}
                  color={theme.colors.grey[600]}
                />
              </S.ImageAddButton>
              <ul>
                {IMAGES.map((image) => (
                  <li key={image.id}>
                    <button type="button">
                      <CloseIcon
                        width={14}
                        height={14}
                        color={theme.colors.grey[200]}
                      />
                    </button>
                    <img src={image.url} alt="메인 사진" />
                  </li>
                ))}
              </ul>
            </S.ScrollableContent>
          </S.ImagesContainer>
        ) : (
          <S.ImageAddButton>
            <AddIcon width={20} height={20} color={theme.colors.grey[600]} />
            <span>추가할 이미지가 있다면 선택해 주세요 </span>
          </S.ImageAddButton>
        )}
      </S.ImageSection>

      <S.ContentsSection>
        <S.HorizontalLayout>
          <S.VerticalLayout>
            <S.Title>
              메뉴명 <span>*</span>
            </S.Title>
            <Input
              placeholder="메뉴명을 입력해 주세요."
              customStyle={S.inputCss}
            />
          </S.VerticalLayout>

          <S.VerticalLayout>
            <S.Title>뱃지 선택</S.Title>
            <S.BadgeContainer gap={10}>
              <S.BadgeButton type="button" onClick={() => setIsBest(!isBest)}>
                <img src={isBest ? bestOnIcon : bestOffIcon} alt="베스트" />
              </S.BadgeButton>
              <S.BadgeButton type="button" onClick={() => setIsNew(!isNew)}>
                <img src={isNew ? newOnIcon : newOffIcon} alt="신규" />
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
                id={TAX_FREE_ID}
                checked={false}
                onChange={() => {
                  // noop
                }}
                customStyle={S.TaxFreeCss}
              >
                <span>면세</span>
              </CheckButton>
            </S.PriceTitleContainer>
            <Input
              placeholder="가격을 입력해 주세요."
              customStyle={S.inputCss}
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
                  src={chiliLevel > 0 ? chiliOnIcon : chiliOffIcon}
                  alt="매운맛 1단계"
                />
              </S.ChiliLevelButton>
              <S.ChiliLevelButton
                type="button"
                onClick={() => onClickChiliLevel(2)}
              >
                <img
                  src={chiliLevel > 1 ? chiliOnIcon : chiliOffIcon}
                  alt="매운맛 2단계"
                />
              </S.ChiliLevelButton>
              <S.ChiliLevelButton
                type="button"
                onClick={() => onClickChiliLevel(3)}
              >
                <img
                  src={chiliLevel > 2 ? chiliOnIcon : chiliOffIcon}
                  alt="매운맛 3단계"
                />
              </S.ChiliLevelButton>
            </S.BadgeContainer>
          </S.VerticalLayout>
        </S.HorizontalLayout>

        <S.VerticalLayout flex>
          <S.Title>메뉴 설명</S.Title>
          <S.Textarea
            id={`menu-description-${useId()}`}
            placeholder="메뉴 설명을 입력해 주세요."
          />
        </S.VerticalLayout>
      </S.ContentsSection>
    </S.Container>
  );
};
