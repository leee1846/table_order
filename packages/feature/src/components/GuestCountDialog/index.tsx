'use client';

import { useState, useEffect } from 'react';
import type { i18n as I18nInstance } from 'i18next';
import { useTranslation } from 'react-i18next';
import { ModalBackground, BasicButton, NumberInput } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import type { IShopSetting } from '@repo/api/types';
import * as S from './guestCountDialog.styles';
import { toast } from '../../utils';

const { colors } = theme;

export type GuestCountDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    customerCount: number;
    kidsCustomerCount?: number;
  }) => void;
  shopSetting?: IShopSetting;
  initialCustomerCount?: number;
  initialKidsCustomerCount?: number;
};

/**
 * 고객 인원 수 입력 모달 컴포넌트
 * - shopSetting.useKidsCustomerCount가 true면 성인/아동 입력 필드 모두 표시
 * - shopSetting.useKidsCustomerCount가 false면 인원 수 입력 필드만 표시
 */
export const GuestCountDialog = ({
  isOpen,
  onClose,
  onConfirm,
  shopSetting,
  initialCustomerCount = 0,
  initialKidsCustomerCount = 0,
}: GuestCountDialogProps) => {
  const [customerCount, setCustomerCount] = useState(initialCustomerCount);
  const [kidsCustomerCount, setKidsCustomerCount] = useState(
    initialKidsCustomerCount
  );

  const useKidsCustomerCount = shopSetting?.useKidsCustomerCount ?? false;
  const { t } = useTranslation();

  // 모달이 열릴 때마다 초기값으로 리셋
  useEffect(() => {
    if (isOpen) {
      setCustomerCount(initialCustomerCount);
      setKidsCustomerCount(initialKidsCustomerCount);
    }
  }, [isOpen, initialCustomerCount, initialKidsCustomerCount]);

  if (!isOpen) {
    return null;
  }

  // 성인과 이동 둘 다  0 이면 버튼 활성화
  const isButtonDisabled = customerCount === 0 && kidsCustomerCount === 0;

  /** 확인 버튼 핸들러 - 입력값 전달 */
  const handleConfirm = () => {
    if (isButtonDisabled) {
      toast(t('성인 인원 수를 입력해주세요.'));
      return;
    }
    onConfirm(
      useKidsCustomerCount
        ? { customerCount, kidsCustomerCount }
        : { customerCount }
    );
    onClose();
  };

  /** 닫기 버튼 핸들러 - 초기값으로 리셋 */
  const handleClose = () => {
    setCustomerCount(initialCustomerCount);
    setKidsCustomerCount(initialKidsCustomerCount);
    onClose();
  };

  return (
    <ModalBackground position="center" onClick={handleClose}>
      <S.DialogContainer onClick={(e) => e.stopPropagation()}>
        <S.CloseButton onClick={handleClose} aria-label={t('닫기')}>
          <CloseIcon width={32} height={32} color={colors.grey[700]} />
        </S.CloseButton>

        <S.ContentWrapper>
          <S.Header>
            <S.Title>{t('입장하는 인원 수를 알려주세요')}</S.Title>
          </S.Header>

          {useKidsCustomerCount && (
            <>
              <S.CounterSection>
                <S.Label>
                  <S.LabelText>{t('성인')}</S.LabelText>
                </S.Label>
                <S.NumberInputWrapper>
                  <NumberInput
                    variant="square"
                    size="L"
                    value={customerCount}
                    onChange={setCustomerCount}
                    min={0}
                  />
                </S.NumberInputWrapper>
              </S.CounterSection>

              <S.CounterSection>
                <S.Label>
                  <S.LabelText>{t('아동')}</S.LabelText>
                </S.Label>
                <S.NumberInputWrapper>
                  <NumberInput
                    variant="square"
                    size="L"
                    value={kidsCustomerCount}
                    onChange={setKidsCustomerCount}
                    min={0}
                  />
                </S.NumberInputWrapper>
              </S.CounterSection>
            </>
          )}

          {!useKidsCustomerCount && (
            <S.CounterSection>
              <S.Label>
                <S.LabelText>{t('인원 수')}</S.LabelText>
              </S.Label>
              <S.NumberInputWrapper>
                <NumberInput
                  variant="square"
                  size="L"
                  value={customerCount}
                  onChange={setCustomerCount}
                  min={0}
                />
              </S.NumberInputWrapper>
            </S.CounterSection>
          )}

          <S.Footer>
            <BasicButton
              variant="Solid_Navy_2XL"
              onClick={handleConfirm}
              fullWidth
              disabled={isButtonDisabled}
            >
              {t('완료')}
            </BasicButton>
          </S.Footer>
        </S.ContentWrapper>
      </S.DialogContainer>
    </ModalBackground>
  );
};
