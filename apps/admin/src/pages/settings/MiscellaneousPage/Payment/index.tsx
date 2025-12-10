import { useEffect, useState } from 'react';
import type { IShopSetting, TShopCardTerminalCode } from '@repo/api/types';
import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import * as UIStyles from '@repo/ui/styles';
import { Dropdown, ToggleButton } from '@repo/ui/components';
import { PaymentsIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';

type PaymentTypeOption = 'prepayment' | 'postpayment';

interface PaymentProps {
  shopSetting?: IShopSetting;
}

const paymentTypeOptions = [
  { value: 'prepayment' as PaymentTypeOption, label: '선불' },
  { value: 'postpayment' as PaymentTypeOption, label: '후불' },
];

const cardTerminalOptions = [
  { value: 'VIRTUAL' as TShopCardTerminalCode, label: '가상결제' },
  { value: 'EASY' as TShopCardTerminalCode, label: '이지카드' },
  { value: 'NO_BUTTON' as TShopCardTerminalCode, label: '결제버튼 미사용' },
];

const currencyOptions = [
  { value: 'KRW', label: 'KRW' },
  { value: 'USD', label: 'USD' },
];

export const Payment = ({ shopSetting }: PaymentProps) => {
  const [paymentType, setPaymentType] =
    useState<PaymentTypeOption>('postpayment');
  const [vanCode, setVanCode] = useState('');
  const [shopCardTerminal, setShopCardTerminal] = useState<
    TShopCardTerminalCode | ''
  >('');
  const [currencySetting, setCurrencySetting] = useState('');
  const [serviceChargeRate, setServiceChargeRate] = useState('');
  const [isSalesTotalVisible, setIsSalesTotalVisible] = useState(false);
  const [salesPassword, setSalesPassword] = useState('');

  const [useDutchPay, setUseDutchPay] = useState(false);
  const [usePostpaidAfterPrepay, setUsePostpaidAfterPrepay] = useState(false);
  const [useAutoReset, setUseAutoReset] = useState(false);
  const [useCashPopup, setUseCashPopup] = useState(false);
  const [useCashPayment, setUseCashPayment] = useState(false);

  useEffect(() => {
    if (!shopSetting) {
      return;
    }

    setPaymentType(shopSetting.usePrepayment ? 'prepayment' : 'postpayment');
    setVanCode(shopSetting.vanCode ?? '');
    setShopCardTerminal(shopSetting.shopCardTerminalCode ?? '');
    setCurrencySetting(shopSetting.currencySetting ?? '');
    setServiceChargeRate(
      shopSetting.serviceChargeRate !== undefined
        ? String(shopSetting.serviceChargeRate)
        : ''
    );
    setIsSalesTotalVisible(Boolean(shopSetting.isSalesTotalVisible));
    setSalesPassword(shopSetting.salesPassword ?? '');
    setUseDutchPay(Boolean(shopSetting.useDutchPay));
    setUsePostpaidAfterPrepay(Boolean(shopSetting.usePostpaidAfterPrepay));
    setUseAutoReset(Boolean(shopSetting.useAutoReset));
    setUseCashPopup(Boolean(shopSetting.useCashPopup));
    setUseCashPayment(Boolean(shopSetting.useCashPayment));
  }, [shopSetting]);

  const vanOptions = vanCode
    ? [{ value: vanCode, label: vanCode }]
    : [{ value: '', label: '미지정' }];

  return (
    <SectionWrapper
      title="결제 및 매출 설정"
      icon={
        <PaymentsIcon
          width={32}
          height={32}
          color={theme.colors.primary[500]}
        />
      }
    >
      <UIStyles.setting.ContentLayout>
        <p>매장 결제 방식</p>
        <Dropdown
          options={paymentTypeOptions}
          value={paymentType}
          onChange={(value) => setPaymentType(value as PaymentTypeOption)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>선불 VAN</p>
        <Dropdown
          options={vanOptions}
          value={vanCode}
          onChange={(value) => setVanCode(value as string)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>선불 VAN ID</p>
        <input
          type="text"
          value={vanCode}
          onChange={(event) => setVanCode(event.target.value)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>선결제 더치페이 사용</p>
        <ToggleButton
          size="M"
          isOn={useDutchPay}
          onChange={() => setUseDutchPay(!useDutchPay)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>선불형 후불결제 사용</p>
        <ToggleButton
          size="M"
          isOn={usePostpaidAfterPrepay}
          onChange={() => setUsePostpaidAfterPrepay(!usePostpaidAfterPrepay)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>선불형 자동초기화 사용</p>
        <ToggleButton
          size="M"
          isOn={useAutoReset}
          onChange={() => setUseAutoReset(!useAutoReset)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>현금결제 유도 팝업 사용</p>
        <ToggleButton
          size="M"
          isOn={useCashPopup}
          onChange={() => setUseCashPopup(!useCashPopup)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>선불형 현금결제 사용</p>
        <ToggleButton
          size="M"
          isOn={useCashPayment}
          onChange={() => setUseCashPayment(!useCashPayment)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>카드 단말기</p>
        <Dropdown
          options={cardTerminalOptions}
          value={shopCardTerminal}
          onChange={(value) =>
            setShopCardTerminal(value as TShopCardTerminalCode | '')
          }
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>통화설정</p>
        <Dropdown
          options={currencyOptions}
          value={currencySetting}
          onChange={(value) => setCurrencySetting(value as string)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>봉사료율</p>
        <input
          type="text"
          value={serviceChargeRate}
          onChange={(event) => setServiceChargeRate(event.target.value)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>매출 총 금액 노출 여부</p>
        <ToggleButton
          size="M"
          isOn={isSalesTotalVisible}
          onChange={() => setIsSalesTotalVisible(!isSalesTotalVisible)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>매출 비밀번호</p>
        <input
          type="text"
          value={salesPassword}
          onChange={(event) => setSalesPassword(event.target.value)}
        />
      </UIStyles.setting.ContentLayout>
    </SectionWrapper>
  );
};
