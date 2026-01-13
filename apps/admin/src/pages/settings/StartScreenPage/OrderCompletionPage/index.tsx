import { t } from '@/config/i18n';
import React, { useRef } from 'react';
import { BasicButton, RadioButton } from '@repo/ui/components';
import { PhotoIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import type { TOrderCompletePageLayout } from '@repo/api/types';
import * as S from './orderCompletionPage.style';

interface OrderCompletionPageProps {
  layout: TOrderCompletePageLayout;
  message: string;
  imageUrl: string | null;
  onChangeImage: (file: File | null) => void;
  onChangeLayout: (layout: TOrderCompletePageLayout) => void;
  onChangeMessage: (message: string) => void;
}

export const OrderCompletionPage = ({
  layout,
  message,
  imageUrl,
  onChangeImage,
  onChangeLayout,
  onChangeMessage,
}: OrderCompletionPageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onChangeImage(file);
    e.target.value = '';
  };

  // const handleDeleteImage = () => {
  //   onChangeImage(null);
  // };

  return (
    <S.Container>
      <S.Header>
        <p>{t('주문 완료 페이지')}</p>
      </S.Header>
      <S.TypeSection>
        <S.RadioGroup>
          <S.RadioItem>
            <RadioButton
              value="DEFAULT"
              onChange={() => onChangeLayout('DEFAULT')}
              checked={layout === 'DEFAULT'}
              customStyle={S.RadioButtonStyle}
            >
              <span>{t('기본')}</span>
            </RadioButton>
          </S.RadioItem>
          <S.RadioItem>
            <RadioButton
              value="RECEIPT"
              onChange={() => onChangeLayout('RECEIPT')}
              checked={layout === 'RECEIPT'}
              customStyle={S.RadioButtonStyle}
            >
              <span>{t('주문서')}</span>
            </RadioButton>
          </S.RadioItem>
        </S.RadioGroup>
      </S.TypeSection>
      <S.ContentContainer>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <S.ImageSection onClick={() => fileInputRef.current?.click()}>
          {imageUrl ? (
            <>
              <S.ButtonContainer
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <BasicButton
                  variant="Outline_Grey_L"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {t('변경')}
                </BasicButton>
                {/* <BasicButton
                  variant="Solid_Sky_Blue_L"
                  onClick={handleDeleteImage}
                >
                  {t('삭제')}
                </BasicButton> */}
              </S.ButtonContainer>
              <S.ImagePreview src={imageUrl} alt={t('주문 완료 이미지')} />
            </>
          ) : (
            <>
              <PhotoIcon
                width={36}
                height={36}
                color={theme.colors.grey[400]}
              />
              <p>{t('메뉴판 사용 종료후 노출될 사진을 설정할 수 있어요.')}</p>
              <S.SizeInfo>
                <span>{t('(권장사이즈 930 * 800px)')}</span>
              </S.SizeInfo>
            </>
          )}
        </S.ImageSection>
        <S.MessageSection>
          <S.TextArea
            placeholder={t('주문 후 마지막 화면에 표시될 문구를 적어주세요.')}
            value={message}
            onChange={(e) => onChangeMessage(e.target.value)}
          />
        </S.MessageSection>
      </S.ContentContainer>
    </S.Container>
  );
};
