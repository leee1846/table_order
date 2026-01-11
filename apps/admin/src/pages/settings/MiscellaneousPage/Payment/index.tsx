import { useAdminTranslation } from '@/config/i18n';
import { useEffect, useMemo, useState } from 'react';
import type { IShopSetting, TShopCardTerminalCode } from '@repo/api/types';
import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import * as UIStyles from '@repo/ui/styles';
import { Dropdown, ToggleButton } from '@repo/ui/components';
import { PaymentsIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import type { MiscellaneousChange } from '../types';
import { CapacitorApp } from '@repo/util/app';
import { toast } from '@repo/feature/utils';

type PaymentTypeOption = 'prepayment' | 'postpayment';

interface PaymentProps {
  shopSetting?: IShopSetting;
  onChange?: (value: MiscellaneousChange) => void;
}

const currencyOptions = [
  { value: 'KRW', label: '₩' },
  { value: 'USD', label: '$' },
];

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

  const cardTerminalOptions = useMemo(
    () => [
      {
        value: 'VIRTUAL' as TShopCardTerminalCode,
        label: t('결제'),
      },
      // {
      //   value: 'EASY' as TShopCardTerminalCode,
      //   label: t('이지카드'),
      // },
      {
        value: 'NO_BUTTON' as TShopCardTerminalCode,
        label: t('미사용'), //결제버튼 미사용
      },
    ],
    [t]
  );

  const [paymentType, setPaymentType] =
    useState<PaymentTypeOption>('postpayment');
  const [vanCode, setVanCode] = useState('');
  const [vanId, setVanId] = useState('');
  const [shopCardTerminal, setShopCardTerminal] = useState<
    TShopCardTerminalCode | ''
  >('');
  const [currencySetting, setCurrencySetting] = useState('');
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
    setVanCode(shopSetting.vanCode);
    setVanId(shopSetting.vanId);
    setShopCardTerminal(shopSetting.shopCardTerminalCode ?? '');
    setCurrencySetting(shopSetting.currencySetting ?? '');
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
      salesPassword: salesPassword || undefined,
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

    if (currencySetting) {
      shopSettingChanges.currencySetting =
        currencySetting as IShopSetting['currencySetting'];
    }

    onChange({
      shopSetting: shopSettingChanges,
    });
  }, [
    currencySetting,
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

  const vanOptions = vanCode
    ? [{ value: vanCode, label: vanCode }]
    : [{ value: '', label: t('미지정') }];

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
          <UIStyles.setting.ContentLayout>
            {/* TODO 선불 van 옵션 뭐뭐 있는 지 아직 모름 */}
            <p>{t('선불 VAN')}</p>
            <Dropdown
              options={vanOptions}
              value={vanCode}
              onChange={(value) => setVanCode(value as string)}
            />
          </UIStyles.setting.ContentLayout>
          <UIStyles.setting.ContentLayout>
            {/* TODO: 선불 VAN ID 추가해주시기로 함  */}
            <p>{t('선불 VAN ID')}</p>
            <input
              type="text"
              value={vanId}
              onChange={(event) => setVanId(event.target.value)}
            />
          </UIStyles.setting.ContentLayout>

          <UIStyles.setting.ContentLayout>
            <p>{t('선결제 더치페이 사용')}</p>
            <ToggleButton
              size="M"
              isOn={usePrepaymentDutch}
              onChange={(value) => setUsePrepaymentDutch(value)}
            />
          </UIStyles.setting.ContentLayout>
          <UIStyles.setting.ContentLayout>
            <p>{t('선불형 후불결제 사용')}</p>
            <ToggleButton
              size="M"
              isOn={usePrepaymentDeferredPayment}
              onChange={(value) => setUsePrepaymentDeferredPayment(value)}
            />
          </UIStyles.setting.ContentLayout>
          <UIStyles.setting.ContentLayout>
            <p>{t('선불형 자동초기화 사용')}</p>
            <ToggleButton
              size="M"
              isOn={usePrepaymentAutoReset}
              onChange={(value) => setUsePrepaymentAutoReset(value)}
            />
          </UIStyles.setting.ContentLayout>
          <UIStyles.setting.ContentLayout>
            <p>{t('현금결제 유도 팝업 사용')}</p>
            <ToggleButton
              size="M"
              isOn={usePrepaymentCashPaymentInducement}
              onChange={(value) => setUsePrepaymentCashPaymentInducement(value)}
            />
          </UIStyles.setting.ContentLayout>
          <UIStyles.setting.ContentLayout>
            <p>{t('선불형 현금결제 사용')}</p>
            <ToggleButton
              size="M"
              isOn={usePrepaymentCashPayment}
              onChange={(value) => setUsePrepaymentCashPayment(value)}
            />
          </UIStyles.setting.ContentLayout>
        </>
      )}
      <UIStyles.setting.ContentLayout>
        <p>{t('카드 단말기')}</p>
        <Dropdown
          options={cardTerminalOptions}
          value={shopCardTerminal}
          onChange={(value) =>
            setShopCardTerminal(value as TShopCardTerminalCode | '')
          }
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>{t('통화설정')}</p>
        <Dropdown
          options={currencyOptions}
          value={currencySetting}
          onChange={(value) => setCurrencySetting(value as string)}
        />
      </UIStyles.setting.ContentLayout>
      {/* <UIStyles.setting.ContentLayout>
         <p>봉사료율</p>
         <S.ServiceChargeInputWrapper>
           <input
             type="number"
             value={serviceChargeRate || '0.0'}
             onChange={(event) => setServiceChargeRate(event.target.value)}
           />
           <span>%</span>
         </S.ServiceChargeInputWrapper>
        </UIStyles.setting.ContentLayout> */}
      <UIStyles.setting.ContentLayout>
        <p>{t('매출 총 금액 노출 여부')}</p>
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
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>{t('매출 비밀번호')}</p>
        <input
          type="password"
          maxLength={4}
          value={salesPassword}
          placeholder="****"
          onChange={(event) => {
            if (CapacitorApp.isNative()) {
              toast(t('관리자 웹에서 변경해주세요.'));
              return;
            }
            setSalesPassword(event.target.value);
          }}
        />
      </UIStyles.setting.ContentLayout>
      {!isSalesTotalVisible && (
        <UIStyles.setting.ContentLayout>
          <p>{t('매출 세부 내역 잠금 여부')}</p>
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
          />
        </UIStyles.setting.ContentLayout>
      )}
    </SectionWrapper>
  );
};
