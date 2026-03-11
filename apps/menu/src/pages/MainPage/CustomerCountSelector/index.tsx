import * as S from '@/pages/MainPage/CustomerCountSelector/customerCountSelector.style';
import { AddIcon, RemoveIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import { useState } from 'react';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { usePostOrderGroup } from '@repo/api/queries';
import { useDeviceData } from '@/hooks/useDeviceData';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';
import { useShopStore } from '@/stores/useShopStore';

export const CustomerCountSelector = () => {
  const navigate = useNavigate();
  const { theme } = useThemeMode();
  const { t } = useCustomerTranslation();

  const { data: shopDetailData } = useShopDetailData();
  const { setData: setCustomerCountData } = useCustomerCountStore();
  const { data: deviceData } = useDeviceData();
  const { data: shopData } = useShopStore();

  const useOnlyAdult =
    !!shopDetailData?.shopSetting?.useCustomerCount &&
    !shopDetailData?.shopSetting?.useKidsCustomerCount;

  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);

  const buttonDisabled = useOnlyAdult
    ? adultCount === 0
    : adultCount === 0 && childCount === 0;

  const handleAdultCountChange = (value: number) => {
    const num = Number.isNaN(value) ? 0 : value;
    setAdultCount(Math.max(0, Math.min(999, num)));
  };

  const handleChildCountChange = (value: number) => {
    const num = Number.isNaN(value) ? 0 : value;
    setChildCount(Math.max(0, Math.min(999, num)));
  };

  const { mutateAsync: createOrderGroup } = usePostOrderGroup({
    ignoreGlobalErrors: [400],
  });
  const handleSubmit = () => {
    setCustomerCountData({
      adultCount,
      childCount,
    });

    createOrderGroup({
      shopCode: shopData?.shopCode ?? '',
      tableNumber: deviceData?.tableNumber ?? '',
      customerCount: adultCount + childCount,
      kidsCustomerCount: childCount,
    }).catch((error) => {
      if (error.response?.status === 400) {
        // 삭제된 테이블일경우
        navigate(ROUTES.TABLES.generate());
        return;
      }
    });
  };

  return (
    <S.Container role="main">
      <S.ContentWrapper>
        <S.TitleContainer>
          <h1>{t('인원 수 입력')}</h1>
          <p>{t('테이블 당 인원수를 입력해 주세요')}</p>
        </S.TitleContainer>

        {useOnlyAdult && (
          <div>
            <S.CountContainer>
              <S.Count role="group" aria-label={t('인원수')}>
                <button
                  type="button"
                  onClick={() => handleAdultCountChange(adultCount - 1)}
                  aria-label={t('인원 감소')}
                >
                  <RemoveIcon
                    width={48}
                    height={48}
                    color={theme.mode.grey[400]}
                  />
                </button>
                <input
                  type="tel"
                  value={adultCount}
                  onChange={(e) =>
                    handleAdultCountChange(Number(e.target.value))
                  }
                  aria-label={t('인원수')}
                />
                <button
                  type="button"
                  onClick={() => handleAdultCountChange(adultCount + 1)}
                  aria-label={t('인원 추가')}
                >
                  <AddIcon
                    width={48}
                    height={48}
                    color={theme.mode.grey[400]}
                  />
                </button>
              </S.Count>

              <S.ButtonGroup role="group" aria-label={t('인원수')}>
                <button
                  type="button"
                  onClick={() => handleAdultCountChange(4)}
                  aria-label={t('{{count}}명 선택', { count: 4 })}
                >
                  {t('{{count}}명', { count: 4 })}
                </button>
                <button
                  type="button"
                  onClick={() => handleAdultCountChange(6)}
                  aria-label={t('{{count}}명 선택', { count: 6 })}
                >
                  {t('{{count}}명', { count: 6 })}
                </button>
                <button
                  type="button"
                  onClick={() => handleAdultCountChange(8)}
                  aria-label={t('{{count}}명 선택', { count: 8 })}
                >
                  {t('{{count}}명', { count: 8 })}
                </button>
              </S.ButtonGroup>
            </S.CountContainer>
          </div>
        )}

        {!useOnlyAdult && (
          <S.CountsContainer>
            <div>
              <h2>{t('성인')}</h2>
              <div role="group" aria-label={t('성인')}>
                <button
                  type="button"
                  onClick={() => handleAdultCountChange(adultCount - 1)}
                  aria-label={`${t('성인')} ${t('인원 감소')}`}
                >
                  <RemoveIcon
                    width={48}
                    height={48}
                    color={theme.mode.grey[400]}
                  />
                </button>
                <input
                  type="number"
                  value={adultCount}
                  onChange={(e) =>
                    handleAdultCountChange(Number(e.target.value))
                  }
                  aria-label={t('성인')}
                />
                <button
                  type="button"
                  onClick={() => handleAdultCountChange(adultCount + 1)}
                  aria-label={`${t('성인')} ${t('인원 추가')}`}
                >
                  <AddIcon
                    width={48}
                    height={48}
                    color={theme.mode.grey[400]}
                  />
                </button>
              </div>
            </div>
            <div>
              <h2>{t('아동')}</h2>
              <div role="group" aria-label={t('아동')}>
                <button
                  type="button"
                  onClick={() => handleChildCountChange(childCount - 1)}
                  aria-label={`${t('아동')} ${t('인원 감소')}`}
                >
                  <RemoveIcon
                    width={48}
                    height={48}
                    color={theme.mode.grey[400]}
                  />
                </button>
                <input
                  type="number"
                  value={childCount}
                  onChange={(e) =>
                    handleChildCountChange(Number(e.target.value))
                  }
                  aria-label={t('아동')}
                />
                <button
                  type="button"
                  onClick={() => handleChildCountChange(childCount + 1)}
                  aria-label={`${t('아동')} ${t('인원 추가')}`}
                >
                  <AddIcon
                    width={48}
                    height={48}
                    color={theme.mode.grey[400]}
                  />
                </button>
              </div>
            </div>
          </S.CountsContainer>
        )}

        <S.ButtonContainer>
          <BasicButton
            variant="Solid_Blue_2XL"
            onClick={handleSubmit}
            disabled={buttonDisabled}
            aria-label={t('주문 시작하기')}
          >
            {t('주문 시작하기')}
          </BasicButton>
        </S.ButtonContainer>
      </S.ContentWrapper>
    </S.Container>
  );
};
