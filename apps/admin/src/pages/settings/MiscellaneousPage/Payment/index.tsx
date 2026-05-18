import { useAdminTranslation } from '@/config/i18n';
import { useEffect, useMemo, useState } from 'react';
import type { IShopSetting, TVanCode } from '@repo/api/types';
import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import * as UIStyles from '@repo/ui/styles';
import { Dropdown, ToggleButton } from '@repo/ui/components';
import { PaymentsIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import type { MiscellaneousChange } from '@/pages/settings/MiscellaneousPage/types';
import { CapacitorApp } from '@repo/util/app';
import { toast } from '@repo/feature/utils';
import * as S from '@/pages/settings/MiscellaneousPage/Payment/payment.style';
import { isShopRole } from '@/utils/common';

type PaymentTypeOption = 'prepayment' | 'postpayment';

interface PaymentProps {
  shopSetting?: IShopSetting;
  onChange?: (value: MiscellaneousChange) => void;
}

export const Payment = ({ shopSetting, onChange }: PaymentProps) => {
  const { t } = useAdminTranslation();
  const paymentTypeOptions = useMemo(
    () => [
      {
        value: 'prepayment' as PaymentTypeOption,
        label: t('선불'),
      },
      {
        value: 'postpayment' as PaymentTypeOption,
        label: t('후불'),
      },
    ],
    [t]
  );

  const [paymentType, setPaymentType] =
    useState<PaymentTypeOption>('postpayment');
  const [vanCode, setVanCode] = useState<TVanCode>('EASY');
  const [vanId, setVanId] = useState('');
  const [shopCardTerminal, setShopCardTerminal] = useState<string>('');
  const [serviceChargeRate, setServiceChargeRate] = useState('');
  const [isSalesTotalVisible, setIsSalesTotalVisible] = useState(false);
  const [salesPassword, setSalesPassword] = useState('');
  const [isSalesDetailLocked, setIsSalesDetailLocked] = useState(false);
  const [usePrepayment, setUsePrepayment] = useState(false);
  const [usePrepaymentDutch, setUsePrepaymentDutch] = useState(false);

  const [usePrepaymentDeferredPayment, setUsePrepaymentDeferredPayment] =
    useState(false);
  const [usePrepaymentAutoReset, setUsePrepaymentAutoReset] = useState(false);
  const [
    usePrepaymentCashPaymentInducement,
    setUsePrepaymentCashPaymentInducement,
  ] = useState(false);
  const [usePrepaymentCashPayment, setUsePrepaymentCashPayment] =
    useState(false);
  const toNumberOrUndefined = (value: string) =>
    value === '' ? undefined : Number(value);

  useEffect(() => {
    if (!shopSetting) {
      return;
    }

    setPaymentType(shopSetting.usePrepayment ? 'prepayment' : 'postpayment');
    setVanCode('EASY');
    setVanId(shopSetting.vanId);
    setShopCardTerminal(shopSetting.shopCardTerminalCode ?? '');
    setServiceChargeRate(
      shopSetting.serviceChargeRate !== undefined
        ? String(shopSetting.serviceChargeRate)
        : ''
    );
    setIsSalesTotalVisible(shopSetting.isSalesTotalVisible);
    setSalesPassword(shopSetting.salesPassword ?? '');
    setUsePrepayment(shopSetting.usePrepayment);
    setUsePrepaymentDutch(shopSetting.usePrepaymentDutch);

    setUsePrepaymentDeferredPayment(shopSetting.usePrepaymentDeferredPayment);
    setUsePrepaymentAutoReset(shopSetting.usePrepaymentAutoReset);
    setUsePrepaymentCashPaymentInducement(
      shopSetting.usePrepaymentCashPaymentInducement
    );
    setUsePrepaymentCashPayment(shopSetting.usePrepaymentCashPayment);
    setIsSalesDetailLocked(shopSetting.isSalesDetailLocked);
  }, [shopSetting]);

  useEffect(() => {
    if (!onChange) {
      return;
    }

    const serviceChargeRateValue = toNumberOrUndefined(serviceChargeRate);
    const shopSettingChanges: Partial<IShopSetting> = {
      shopSeq: shopSetting?.shopSeq,
      usePrepayment,
      vanCode,
      vanId,
      shopCardTerminalCode: shopCardTerminal || undefined,
      isSalesTotalVisible,
      salesPassword: salesPassword !== '' ? salesPassword : undefined,
      // 매출 총 금액 노출 여부가 true이면 매출 세부 내역 잠금 여부를 false로 강제 설정
      isSalesDetailLocked: isSalesTotalVisible ? false : isSalesDetailLocked,
      usePrepaymentDutch,
      usePrepaymentDeferredPayment,
      usePrepaymentAutoReset,
      usePrepaymentCashPaymentInducement,
      usePrepaymentCashPayment,
    };

    if (
      serviceChargeRateValue !== undefined &&
      !Number.isNaN(serviceChargeRateValue)
    ) {
      shopSettingChanges.serviceChargeRate = serviceChargeRateValue;
    }

    onChange({
      shopSetting: shopSettingChanges,
    });
  }, [
    isSalesDetailLocked,
    isSalesTotalVisible,
    onChange,
    salesPassword,
    serviceChargeRate,
    shopCardTerminal,
    shopSetting?.shopSeq,
    usePrepayment,
    usePrepaymentAutoReset,
    usePrepaymentCashPayment,
    usePrepaymentCashPaymentInducement,
    usePrepaymentDeferredPayment,
    usePrepaymentDutch,
    vanCode,
    vanId,
  ]);

  const vanOptions = useMemo(
    () => [
      {
        value: 'EASY' as TVanCode,
        label: t('이지카드'),
      },
      {
        value: 'NO_BUTTON' as TVanCode,
        label: t('결제버튼 미사용'),
      },
    ],
    [t]
  );

  return (
    <SectionWrapper
      title={t('결제 및 매출 설정')}
      icon={
        <PaymentsIcon
          width={32}
          height={32}
          color={theme.colors.primary[500]}
        />
      }
    >
      <UIStyles.setting.ContentLayout>
        <p>{t('매장 결제 방식')}</p>
        <Dropdown
          options={paymentTypeOptions}
          value={paymentType}
          onChange={(value) => {
            const selectedType = value as PaymentTypeOption;
            setPaymentType(selectedType);
            setUsePrepayment(selectedType === 'prepayment');
          }}
        />
      </UIStyles.setting.ContentLayout>
      {paymentType === 'prepayment' && (
        <>
          {!isShopRole() && (
            <>
              <UIStyles.setting.ContentLayout>
                <p>{t('VAN사 선택')}</p>
                <Dropdown
                  options={vanOptions}
                  value={vanCode}
                  onChange={(value) => setVanCode(value as TVanCode)}
                  disabled={true}
                />
              </UIStyles.setting.ContentLayout>
              <UIStyles.setting.ContentLayout>
                <p>{t('VAN TID')}</p>
                <input
                  type="text"
                  value={vanId}
                  onChange={(event) => setVanId(event.target.value)}
                  readOnly={true}
                />
              </UIStyles.setting.ContentLayout>
            </>
          )}

          <UIStyles.setting.ContentLayout>
            <p>{t('더치페이 기능 설정')}</p>
            <ToggleButton
              size="M"
              isOn={usePrepaymentDutch}
              onChange={(value) => setUsePrepaymentDutch(value)}
            />
          </UIStyles.setting.ContentLayout>
          <UIStyles.setting.ContentLayout>
            <p>{t('후불결제 기능 설정')}</p>
            <ToggleButton
              size="M"
              isOn={usePrepaymentDeferredPayment}
              onChange={(value) => setUsePrepaymentDeferredPayment(value)}
            />
          </UIStyles.setting.ContentLayout>
          <UIStyles.setting.ContentLayout>
            <p>{t('결제 후 자동테이블 정리')}</p>
            <ToggleButton
              size="M"
              isOn={usePrepaymentAutoReset}
              onChange={(value) => setUsePrepaymentAutoReset(value)}
            />
          </UIStyles.setting.ContentLayout>
          <UIStyles.setting.ContentLayout>
            <p>{t('현금결제 안내 사용')}</p>
            <ToggleButton
              size="M"
              isOn={usePrepaymentCashPaymentInducement}
              onChange={(value) => setUsePrepaymentCashPaymentInducement(value)}
            />
          </UIStyles.setting.ContentLayout>
          <UIStyles.setting.ContentLayout>
            <p>{t('현금결제 기능 설정')}</p>
            <ToggleButton
              size="M"
              isOn={usePrepaymentCashPayment}
              onChange={(value) => setUsePrepaymentCashPayment(value)}
            />
          </UIStyles.setting.ContentLayout>
        </>
      )}

      <UIStyles.setting.ContentLayout>
        <p>{t('매출 총액 표시 설정')}</p>
        <ToggleButton
          size="M"
          isOn={isSalesTotalVisible}
          onChange={() => {
            if (CapacitorApp.isNative()) {
              toast(t('관리자 웹에서 변경해주세요.'));
              return;
            }
            setIsSalesTotalVisible(!isSalesTotalVisible);
          }}
          customStyle={
            CapacitorApp.isNative()
              ? S.getNativeToggleButtonStyle(isSalesTotalVisible)
              : undefined
          }
        />
      </UIStyles.setting.ContentLayout>

      {!isShopRole() && (
        <>
          <UIStyles.setting.ContentLayout>
            <p>{t('매출 확인 비밀번호 설정')}</p>
            <input
              type="password"
              maxLength={4}
              value={salesPassword}
              placeholder=""
              readOnly={CapacitorApp.isNative()}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, '').slice(0, 4);
                setSalesPassword(value);
              }}
              onClick={() => {
                if (CapacitorApp.isNative()) {
                  toast(t('관리자 웹에서 변경해주세요.'));
                }
              }}
              onFocus={(e) => {
                if (CapacitorApp.isNative()) {
                  e.target.blur();
                  toast(t('관리자 웹에서 변경해주세요.'));
                }
              }}
            />
          </UIStyles.setting.ContentLayout>
          {!isSalesTotalVisible && (
            <UIStyles.setting.ContentLayout>
              <p>{t('매출 상세 내역 잠금 설정')}</p>
              <ToggleButton
                size="M"
                isOn={isSalesDetailLocked}
                onChange={() => {
                  if (CapacitorApp.isNative()) {
                    toast(t('관리자 웹에서 변경해주세요.'));
                    return;
                  }
                  setIsSalesDetailLocked(!isSalesDetailLocked);
                }}
                customStyle={
                  CapacitorApp.isNative()
                    ? S.getNativeToggleButtonStyle(isSalesDetailLocked)
                    : undefined
                }
              />
            </UIStyles.setting.ContentLayout>
          )}
        </>
      )}
    </SectionWrapper>
  );
};
