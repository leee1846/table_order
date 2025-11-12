import { useId } from 'react';
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
} from '@repo/ui/icons';
import * as S from '@/pages/settings/CategoryMenusPage/MenuManageModal/BasicSetting/basicSetting.style';

export const BasicSetting = () => {
  const TAX_FREE_ID = `tax-free-${useId()}`;
  const CHILI_LEVEL = 1;
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
          <PhotoIcon width={36} height={36} color={theme.colors.primary[400]} />
          <p>메인 사진 (1장) 을 선택해 주세요</p>
          <span>(700*500 px 권장)</span>
        </S.Thumbnail>
        {IMAGES.length > 0 ? (
          <S.ImagesContainer>
            <S.ImageAddButton>
              <AddIcon width={20} height={20} color={theme.colors.grey[600]} />
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
          </S.ImagesContainer>
        ) : (
          <S.ImageAddButton>
            <AddIcon width={20} height={20} color={theme.colors.grey[600]} />
            <span>추가할 이미지가 있다면 선택해 주세요 </span>
          </S.ImageAddButton>
        )}
      </S.ImageSection>

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
    </S.Container>
  );
};
