import { BasicButton, FullscreenLoadingSpinner } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { useMerchantRegistration } from '@/hooks/useMerchantRegistration';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { openConfirmDialog, toast } from '@repo/feature/utils';
import { useState } from 'react';

export const Payment = () => {
  const { t } = useAdminTranslation();
  const [isDownloading, setIsDownloading] = useState(false);
  const { registerMerchant } = useMerchantRegistration({
    enabled: false,
  });

  const { refresh: refreshShopDetailData, data: shopDetailData } =
    useShopDetailData();
  const handleCheckAndRegisterMerchant = async () => {
    if (!shopDetailData?.shopSetting?.usePrepayment) {
      toast(t('선불 결제 방식이 아닙니다.'), {
        position: 'center-center',
        duration: 1500,
      });
      return;
    }

    const result = await refreshShopDetailData();
    if (!result?.businessNumber) {
      toast(t('사업자번호가 없습니다. 관리자에게 문의해주세요.'), {
        position: 'center-center',
        duration: 1500,
      });
      return;
    }

    if (!result?.shopSetting?.vanId) {
      toast(t('가맹점 코드가 없습니다. 관리자에게 문의해주세요.'), {
        position: 'center-center',
        duration: 1500,
      });
      return;
    }

    if (!result?.areaCode) {
      toast(t('지역 코드가 없습니다. 관리자에게 문의해주세요.'), {
        position: 'center-center',
        duration: 1500,
      });
      return;
    }

    if (!result?.shopPhoneNumber) {
      toast(t('전화번호가 없습니다. 관리자에게 문의해주세요.'), {
        position: 'center-center',
        duration: 1500,
      });
      return;
    }

    setIsDownloading(true);
    try {
      await registerMerchant(result);
      toast(t('가맹점 다운로드가 완료되었습니다.'), {
        position: 'center-center',
        duration: 1500,
      });
    } catch (error) {
      // 에러 데이터 안전하게 추출
      const errorData = (
        error as {
          data?: {
            RESULT_CODE?: string;
            RESULT_MSG?: string;
            EVENT_MSG?: string;
          };
        }
      )?.data;

      let errorMessage = '가맹점 다운로드 중 오류가 발생했습니다.';
      let errorCode = '';

      if (errorData) {
        errorMessage =
          errorData.RESULT_MSG || errorData.EVENT_MSG || errorMessage;
        errorCode = errorData.RESULT_CODE || '';
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }

      openConfirmDialog({
        title: t('오류'),
        content: errorCode
          ? `${errorMessage}\n오류 코드: ${errorCode}`
          : errorMessage,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <UIStyles.setting.Container>
        <UIStyles.setting.Header>
          <UIStyles.setting.Title>
            {t('결제 단말기 관리')}
          </UIStyles.setting.Title>
        </UIStyles.setting.Header>

        <UIStyles.setting.ContentsLayout>
          <UIStyles.setting.ContentLayout>
            <p>{t('가맹점 등록 확인 및 다운로드')}</p>
            <BasicButton
              variant="Outline_Grey_M"
              onClick={handleCheckAndRegisterMerchant}
            >
              {t('다운로드')}
            </BasicButton>
          </UIStyles.setting.ContentLayout>
        </UIStyles.setting.ContentsLayout>
      </UIStyles.setting.Container>

      {isDownloading && <FullscreenLoadingSpinner />}
    </>
  );
};
