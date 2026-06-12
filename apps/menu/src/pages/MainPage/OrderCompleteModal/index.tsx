import { useMemo } from 'react';
import { BasicButton, ModalBackground } from '@repo/ui/components';
import { apronIcon } from '@repo/ui/icons';
import { getTodayDateString } from '@repo/util/date';
import * as S from '@/pages/MainPage/OrderCompleteModal/OrderCompleteModal.style';
import type { IOrder } from '@repo/api/types';
import { formatCurrency } from '@repo/util/string';
import customerI18n from '@/config/i18n/customer.i18n';
import { useModalStore } from '@/stores/useModalStore';
import { useShopDetailStore } from '@/stores/useShopDetailStore';
import { Trans } from 'react-i18next';
import { AdMediaSlider } from '@/feature/AdMediaSlider';
import { OrderCompleteFullAd } from '@/pages/MainPage/OrderCompleteModal/OrderCompleteFullAd';
import {
  shouldShowOrderCompleteFullscreenAd,
  shouldShowOrderCompleteHalfAd,
} from '@/pages/MainPage/OrderCompleteModal/orderCompleteAdVisibility';
import { useAdStore } from '@/stores/useAdStore';

interface Props {
  orderData: IOrder[];
  totalPrice: number;
  onClose: () => void;
  countdown: number;
  /** 전면 광고가 아닐 때(반쪽 광고·기본 완료 화면) 20초 표시·자동 닫기 */
  countdownActive: boolean;
}

export const OrderCompleteModal = ({
  orderData,
  totalPrice,
  onClose,
  countdown,
  countdownActive,
}: Props) => {
  // 모달이 열린 시점에 store에 캡처된 언어로 고정 — 리마운트·언어 변경에 무관
  const language = useModalStore.getState().data.orderCompleteLanguage;
  const t = useMemo(
    () => customerI18n.getFixedT(language, 'customer'),
    [language]
  );
  const shopDetailData = useShopDetailStore((s) => s.data);
  const { data: adData } = useAdStore();

  const { orderCompleteFullFiles, orderCompleteSideFiles, localVideoUrls } =
    adData;

  // sortOrder 기준으로 FULL/SIDE 중 먼저 오는 타입만 표시
  const showFullscreenAd = shouldShowOrderCompleteFullscreenAd(
    orderCompleteFullFiles,
    orderCompleteSideFiles
  );
  const showHalfAd = shouldShowOrderCompleteHalfAd(
    orderCompleteFullFiles,
    orderCompleteSideFiles
  );

  if (showFullscreenAd) {
    return (
      <OrderCompleteFullAd
        files={orderCompleteFullFiles}
        localVideoUrls={localVideoUrls}
        onClose={onClose}
        t={t}
      />
    );
  }

  return (
    <ModalBackground position="center" onClick={onClose}>
      <S.Container
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-complete-title"
      >
        {countdownActive && (
          <S.CountdownBadge>
            <Trans
              i18n={customerI18n}
              i18nKey="<0>{{seconds}}</0>초 후 닫힘"
              values={{ seconds: countdown }}
              lng={language}
              components={[
                <S.CountdownHighlight key="countdown-highlight">
                  {countdown}
                </S.CountdownHighlight>,
              ]}
            />
          </S.CountdownBadge>
        )}
        {showHalfAd ? (
          <S.LeftContainerAd>
            <AdMediaSlider files={orderCompleteSideFiles} />
          </S.LeftContainerAd>
        ) : (
          <S.LeftContainer>
            <img src={apronIcon} alt={t('주문 완료!')} />
            <h2 id="order-complete-title">{t('주문 완료!')}</h2>
            <p>{t('조리가 완료되면 저희가 알려드릴게요.')}</p>
            <p>{t('조금만 기다려주세요.')}</p>
          </S.LeftContainer>
        )}

        <S.RightContainer>
          <S.Title>{t('주문내역')}</S.Title>
          <S.Date>{getTodayDateString()}</S.Date>
          <S.OrderList role="list" aria-label={t('주문내역')}>
            {orderData.map((order, index) => (
              <li key={`order-${order.menuSeq}-${index + 1}`} role="listitem">
                <S.MenuInfo>
                  <h3>{order.menuName}</h3>
                  <p>{formatCurrency(order.quantity)}</p>
                  <p>₩{formatCurrency(order.menuPrice * order.quantity)}</p>
                </S.MenuInfo>

                <S.OptionList role="list">
                  {order.selectedOptions.map((option) => {
                    // 주문 시점에 스냅샷된 isMenuQuantityIndependent 기준:
                    // independent=true → 옵션 수량 고정 (메뉴 수량 미곱셈)
                    // independent=false/undefined → 옵션 수량 × 메뉴 수량
                    const displayQty = option.isMenuQuantityIndependent
                      ? option.quantity
                      : option.quantity * order.quantity;

                    return (
                      <li key={option.optionSeq} role="listitem">
                        <div>
                          <span />
                          <p>{option.optionName}</p>
                        </div>

                        <div>
                          <p>{formatCurrency(displayQty)}</p>
                          <p>
                            ₩{formatCurrency(option.optionPrice * displayQty)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </S.OptionList>
              </li>
            ))}
          </S.OrderList>

          <S.TotalContainer>
            {shopDetailData?.shopSetting?.isOrderCompleteTotalVisible && (
              <div>
                <h3>{t('합계')}</h3>
                <p>₩{formatCurrency(totalPrice)}</p>
              </div>
            )}
            <BasicButton
              variant="Solid_Blue_2XL"
              onClick={onClose}
              aria-label={t('메뉴판 보러가기')}
            >
              {t('메뉴판 보러가기')}
            </BasicButton>
          </S.TotalContainer>
        </S.RightContainer>
      </S.Container>
    </ModalBackground>
  );
};
