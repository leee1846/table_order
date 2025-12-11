import { useState } from 'react';
import { AddIcon, RemoveIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import { useTranslation } from '@repo/feature/components';
import * as S from '@/pages/TablesPage/CustomerCountSelector/customerCountSelector.style';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';

interface Props {
  tableNumber: number;
  onComplete?: () => void;
}

export const CustomerCountSelector = ({ tableNumber, onComplete }: Props) => {
  const { theme } = useThemeMode();
  const { t } = useTranslation();

  const { data: shopDetailData } = useShopDetailData();
  const { setData: setCustomerCountData } = useCustomerCountStore();

  const useOnlyAdult =
    !!shopDetailData?.shopSetting?.useCustomerCount &&
    !shopDetailData?.shopSetting?.useKidsCustomerCount;

  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);

  const buttonDisabled = useOnlyAdult
    ? adultCount === 0
    : adultCount === 0 && childCount === 0;

  const handleAdultCountChange = (value: number) => {
    if (value < 0) {
      setAdultCount(0);
      return;
    }

    setAdultCount(value);
  };

  const handleChildCountChange = (value: number) => {
    if (value < 0) {
      setChildCount(0);
      return;
    }

    setChildCount(value);
  };

  const handleSubmit = () => {
    setCustomerCountData(tableNumber, {
      adultCount,
      childCount,
    });
    onComplete?.();
  };

  return (
    <S.Container>
      <S.ContentWrapper>
        <S.TitleContainer>
          <h1>{t('인원 수 입력')}</h1>
          <p>{t('테이블 당 인원수를 입력해 주세요')}</p>
        </S.TitleContainer>

        {useOnlyAdult && (
          <div>
            <S.CountContainer>
              <S.Count>
                <button
                  type="button"
                  onClick={() => handleAdultCountChange(adultCount - 1)}
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
                />
                <button
                  type="button"
                  onClick={() => handleAdultCountChange(adultCount + 1)}
                >
                  <AddIcon
                    width={48}
                    height={48}
                    color={theme.mode.grey[400]}
                  />
                </button>
              </S.Count>

              <S.ButtonGroup>
                <button type="button" onClick={() => handleAdultCountChange(4)}>
                  {t('{{count}}명', { count: 4 })}
                </button>
                <button type="button" onClick={() => handleAdultCountChange(6)}>
                  {t('{{count}}명', { count: 6 })}
                </button>
                <button type="button" onClick={() => handleAdultCountChange(8)}>
                  {t('{{count}}명', { count: 8 })}
                </button>
              </S.ButtonGroup>
            </S.CountContainer>
          </div>
        )}

        {!useOnlyAdult && (
          <S.CountsContainer>
            <div>
              <p>{t('성인')}</p>
              <div>
                <button
                  type="button"
                  onClick={() => handleAdultCountChange(adultCount - 1)}
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
                />
                <button
                  type="button"
                  onClick={() => handleAdultCountChange(adultCount + 1)}
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
              <p>{t('아동')}</p>
              <div>
                <button
                  type="button"
                  onClick={() => handleChildCountChange(childCount - 1)}
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
                />
                <button
                  type="button"
                  onClick={() => handleChildCountChange(childCount + 1)}
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
          >
            {t('주문 시작하기')}
          </BasicButton>
        </S.ButtonContainer>
      </S.ContentWrapper>
    </S.Container>
  );
};
