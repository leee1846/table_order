'use client';

import type { i18n as I18nInstance } from 'i18next';
import { useState, useMemo, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './tableDetailContainer.styles';
import { OrderPanel } from './orderSection/OrderPanel';
import { ActionGrid } from './actionSection/ActionGrid';
import {
  AddMenuDialog,
  type SelectedMenuWithOptions,
} from './actionSection/dialogs/AddMenuDialog';
import { SelectCancelDialog } from './actionSection/dialogs/SelectCancelDialog';
import { AmountChangeDialog } from './actionSection/dialogs/AmountChangeDialog';
import { AllDiscountDialog } from './actionSection/dialogs/AllDiscountDialog';
import { ServiceAmountDialog } from './orderSection/dialogs/ServiceAmountDialog';
import { CardPaymentDialog } from './orderSection/dialogs/CardPaymentDialog';
import { ArbitraryPaymentConfirmDialog } from './orderSection/dialogs/ArbitraryPaymentConfirmDialog';
import { CashPaymentDialog } from './orderSection/dialogs/CashPaymentDialog';
import { CashReceiptDialog } from './orderSection/dialogs/CashReceiptDialog';
import {
  SplitPaymentDialog,
  type SplitPayment,
} from './orderSection/dialogs/SplitPaymentDialog';
import {
  isOrderFullyPaid,
  openDualActionDialog,
  toast,
} from '@repo/feature/utils';
import {
  useGetTableOrderHistories,
  usePutCancelOrderAll,
  usePutClearOrder,
  useGetCategoriesWithMenus,
  useGetShopDetail,
  useGetTableGroupList,
} from '@repo/api/queries';
import type {
  ICancelOrderMenuRequest,
  ICurrentTable,
  TOrderType,
} from '@repo/api/types';
import type { Order, OrderItem } from './orderSection/types';
import { useTranslation } from 'react-i18next';

export type { SelectedMenuWithOptions };

export interface TableDetailContainerProps {
  shopCode: string;
  tableNumber: string;
  orderType: TOrderType;
  i18nInstance?: I18nInstance;
  onOrderCreated?: (
    orderUuid: string,
    cancelOrderMenuRequest?: ICancelOrderMenuRequest
  ) => void;
}

export const TableDetailContainer = ({
  shopCode,
  tableNumber,
  orderType,
  i18nInstance,
  onOrderCreated,
}: TableDetailContainerProps) => {
  const { t } = useTranslation('admin', { i18n: i18nInstance as I18nInstance });

  const navigate = useNavigate();

  // 렌더링 완료 상태 관리
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    // 다음 프레임에 렌더링 완료 후 표시
    requestAnimationFrame(() => {
      setIsReady(true);
    });
  }, []);
  //메뉴 추가 모달
  const [isAddMenuDialogOpen, setIsAddMenuDialogOpen] = useState(false);
  //선택 취소 모달
  const [isSelectCancelDialogOpen, setIsSelectCancelDialogOpen] =
    useState(false);
  //금액 변경 모달
  const [isAmountChangeDialogOpen, setIsAmountChangeDialogOpen] =
    useState(false);
  // 전체 할인 모달
  const [isAllDiscountDialogOpen, setIsAllDiscountDialogOpen] = useState(false);
  //서비스 금액 변경 모달
  const [isServiceAmountDialogOpen, setIsServiceAmountDialogOpen] =
    useState(false);
  //서비스 금액 변경 모달 선택 메뉴
  const [selectedItemForService, setSelectedItemForService] =
    useState<OrderItem | null>(null);
  //카드 결제 모달
  const [isCardPaymentDialogOpen, setIsCardPaymentDialogOpen] = useState(false);
  //임의 결제 확인 모달
  const [
    isArbitraryPaymentConfirmDialogOpen,
    setIsArbitraryPaymentConfirmDialogOpen,
  ] = useState(false);
  //현금 결제 모달
  const [isCashPaymentDialogOpen, setIsCashPaymentDialogOpen] = useState(false);
  //현금영수증 모달
  const [isCashReceiptDialogOpen, setIsCashReceiptDialogOpen] = useState(false);
  const [_cashReceivedAmount, setCashReceivedAmount] = useState<number>(0);
  //분할 결제 모달
  const [isSplitPaymentDialogOpen, setIsSplitPaymentDialogOpen] =
    useState(false);
  //분할 결제에서 열린 결제 모달인지 여부
  const [isPaymentFromSplit, setIsPaymentFromSplit] = useState(false);
  //분할 결제 금액(선택한 메뉴)
  const [splitPaymentAmount, setSplitPaymentAmount] = useState<number>(0);
  //분할 결제 내역
  const [splitPayments, setSplitPayments] = useState<SplitPayment[]>([]);

  const [orderTime, setOrderTime] = useState<string>('');

  // 테이블 비우기 완료 후 언마운트 전까지 버튼 비활성화
  const [isNavigatingAway, setIsNavigatingAway] = useState(false);

  // API 데이터 가져오기
  const { data: orderHistoriesResponse, refetch: refetchOrderHistories } =
    useGetTableOrderHistories(
      {
        shopCode,
        tableNumber,
      },
      {
        enabled: !!shopCode && !!tableNumber,
      }
    );

  // 테이블이 비워졌을 때 자동으로 나가기
  useEffect(() => {
    if (orderHistoriesResponse === null) {
      toast(t('테이블을 정리했어요.'));
      navigate('/tables');
    }
  }, [orderHistoriesResponse, navigate, t]);

  useEffect(() => {
    if (orderHistoriesResponse?.data?.createDate) {
      setOrderTime(
        new Date(orderHistoriesResponse.data.createDate).toLocaleTimeString(
          'ko-KR',
          {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }
        ) as string
      );
    }
  }, [orderHistoriesResponse?.data]);

  const { data: menuboardResponse } = useGetCategoriesWithMenus(
    {
      shopCode,
      tableNumber,
    },
    {
      enabled: !!shopCode && !!tableNumber,
    }
  );
  const menuboardCategories = menuboardResponse?.data ?? [];

  // 매장 상세 정보 조회
  const { data: shopDetailResponse } = useGetShopDetail(shopCode, {
    enabled: !!shopCode,
  });

  // 고객 수 사용 여부 계산
  const useCustomerCount = useMemo(() => {
    return !!shopDetailResponse?.data?.shopSetting?.useCustomerCount;
  }, [shopDetailResponse]);

  // 픽업 알림 사용 여부 계산
  const usePickupAlert = useMemo(() => {
    return !!shopDetailResponse?.data?.shopSetting?.usePickupAlert;
  }, [shopDetailResponse]);

  // 픽업 알림 메시지 가져오기
  const pickupAlertMessage = useMemo(() => {
    return shopDetailResponse?.data?.shopSetting?.pickupAlertMessage;
  }, [shopDetailResponse]);

  // 테이블 점유시간 표기 사용 여부 계산
  const useTableOccupancyTime = useMemo(() => {
    return !!shopDetailResponse?.data?.shopSetting?.useTableOccupancyTime;
  }, [shopDetailResponse]);

  const { mutateAsync: cancelOrderAll, isPending: isCancelAllPending } =
    usePutCancelOrderAll();

  const { mutateAsync: clearOrder, isPending: isClearOrderPending } =
    usePutClearOrder();

  const { data: tableGroupListResponse } = useGetTableGroupList(
    { shopCode },
    {
      enabled: !!shopCode,
    }
  );

  const currentTableName = useMemo(() => {
    if (!tableGroupListResponse?.data || !tableNumber) {
      return orderHistoriesResponse?.data?.tableName ?? '';
    }

    // flatMap으로 모든 테이블을 평탄화하여 검색
    const foundTable = tableGroupListResponse.data
      .flatMap((group) => group.tableList || [])
      .find((table) => table.tableNumber === tableNumber);

    // 찾은 경우 현재 테이블 이름, 못 찾은 경우 히스토리의 tableName 또는 tableNumber 사용
    return foundTable?.tableName || orderHistoriesResponse?.data?.tableName;
  }, [orderHistoriesResponse, tableGroupListResponse, tableNumber]);

  const order: Order | null = useMemo(() => {
    if (!orderHistoriesResponse?.data) {
      return {
        tableName: currentTableName ?? '',
        discountRate: 0,
        numberOfPeople: orderHistoriesResponse?.data?.customerCount ?? 0,
        items: [],
        paymentList: [],
        totalCount: 0,
        totalPrice: 0,
      };
    }
    const data: ICurrentTable = orderHistoriesResponse.data;

    // orderDetailMenuList를 OrderItem[]로 변환
    const items =
      data.orderDetailMenuList?.map((menu) => {
        const options =
          menu.optionList && menu.optionList.length > 0
            ? menu.optionList.map((option) => ({
                id: `${menu.orderDetailMenuSeq}-${option.orderDetailOptionSeq}`,
                name: option.optionName,
                qty: option.optionQuantity,
                unitPrice: option.optionPrice,
                localeOptionName: option.localeOptionName,
              }))
            : undefined;

        return {
          id: String(menu.orderDetailMenuSeq),
          menuSeq: menu.menuSeq,
          name: menu.menuName,
          qty: menu.menuQuantity,
          unitPrice: menu.menuPrice,
          options,
          localeMenuName: menu.localeMenuName,
        };
      }) || [];

    return {
      tableName: currentTableName ?? '',
      discountRate: data.discountRate || 0,
      numberOfPeople: orderHistoriesResponse?.data?.customerCount ?? 0,
      items,
      totalCount: items
        .filter((item) => item.menuSeq !== 0)
        .reduce((sum, item) => sum + item.qty, 0),
      totalPrice: data.totalAmount || 0,
      paymentList: data.paymentList ?? [],
    };
  }, [orderHistoriesResponse, currentTableName]);

  const handleAllCancel = () => {
    if (order.items.length === 0) {
      toast(t('삭제할 메뉴가 없어요.'));
      return;
    }

    openDualActionDialog({
      title: t('전체 메뉴를 삭제하시겠어요?'),
      primaryText: t('예'),
      secondaryText: t('아니오'),
      onConfirm: async () => {
        //중복 요청 방지
        if (isCancelAllPending) {
          return;
        }

        await cancelOrderAll({ shopCode, tableNumber });
        toast(t('전체 메뉴를 삭제했어요.'));
        await refetchOrderHistories();
        navigate('/tables');
      },
    });
  };

  const handleActionPress = (id: string) => {
    const actionHandlers: Record<string, () => void> = {
      'add-menu': () => setIsAddMenuDialogOpen(true),
      'select-cancel': () => setIsSelectCancelDialogOpen(true),
      'amount-change': () => setIsAmountChangeDialogOpen(true),
      'all-discount': () => setIsAllDiscountDialogOpen(true),
      'all-cancel': handleAllCancel,
    };

    actionHandlers[id]?.();
  };

  const handleItemClick = (item: OrderItem) => {
    setSelectedItemForService(item);
    setIsServiceAmountDialogOpen(true);
  };

  const shouldShowClearButton = useMemo(() => {
    const remainingAmount = isOrderFullyPaid(
      order.paymentList,
      order.totalPrice
    );
    return remainingAmount === 0;
  }, [order.paymentList, order.totalPrice]);

  const handleSelectCancelSuccess = async () => {
    const { data: updatedData } = await refetchOrderHistories();
    if (
      !updatedData?.data?.orderDetailMenuList ||
      updatedData.data.orderDetailMenuList.length === 0
    ) {
      toast(t('테이블을 정리했어요.'));
      setIsNavigatingAway(true);
      navigate('/tables');
    }
  };

  const handleClearTable = async () => {
    await refetchOrderHistories();

    const remainingAmount = isOrderFullyPaid(
      order.paymentList,
      order.totalPrice
    );

    if (remainingAmount !== 0) {
      toast(t('결제가 완료되지 않았어요.'));
      return;
    }

    await clearOrder({ shopCode, tableNumber });
    toast(t('테이블을 정리했어요.'));
    setIsNavigatingAway(true); // 페이지 이동 시작 - 버튼 비활성화 유지
    navigate('/tables');
  };

  // 데이터가 없을 때
  if (!order) {
    return null;
  }

  return (
    <S.TableDetailContainer isReady={isReady}>
      <S.Layout>
        <S.Left>
          <OrderPanel
            order={order}
            // onPayCard={() => setIsCardPaymentDialogOpen(true)}
            // onPayCash={() => setIsCashPaymentDialogOpen(true)}
            // onSplitPay={() => setIsSplitPaymentDialogOpen(true)}
            shouldShowClearButton={shouldShowClearButton}
            isClearingTable={isClearOrderPending || isNavigatingAway}
            onClearTable={handleClearTable}
            onItemClick={handleItemClick}
            useCustomerCount={useCustomerCount}
            useTableOccupancyTime={useTableOccupancyTime}
            usePickupAlert={usePickupAlert}
            shopCode={shopCode}
            tableNumber={tableNumber}
            pickupAlertMessage={pickupAlertMessage}
            i18nInstance={i18nInstance}
            orderTime={orderTime}
            refetchOrderHistories={refetchOrderHistories}
            onPress={handleActionPress}
            shopPosCode={shopDetailResponse?.data?.shopSetting?.shopPosCode}
          />
        </S.Left>
        <S.Right>
          <ActionGrid
            onPress={handleActionPress}
            i18nInstance={i18nInstance}
            paymentList={order.paymentList}
            refetchOrderHistories={refetchOrderHistories}
            usePickupAlert={usePickupAlert}
            shopCode={shopCode}
            tableNumber={tableNumber}
            pickupAlertMessage={pickupAlertMessage}
            shopPosCode={shopDetailResponse?.data?.shopSetting?.shopPosCode}
          />
        </S.Right>
      </S.Layout>
      {/* 메뉴 추가 모달 */}
      <AddMenuDialog
        isOpen={isAddMenuDialogOpen}
        onClose={() => setIsAddMenuDialogOpen(false)}
        tableName={order.tableName}
        categories={menuboardCategories}
        shopCode={shopCode}
        tableNumber={tableNumber}
        numberOfPeople={order.numberOfPeople}
        adultCount={orderHistoriesResponse?.data?.customerCount ?? 0}
        childCount={orderHistoriesResponse?.data?.kidsCustomerCount ?? 0}
        orderType={orderType}
        i18nInstance={i18nInstance}
        currentOrder={order}
        shopPosCode={shopDetailResponse?.data?.shopSetting?.shopPosCode}
        onOrderCreated={(orderUuid, cancelOrderMenuRequest) => {
          onOrderCreated?.(orderUuid, cancelOrderMenuRequest);
        }}
      />
      {/* 선택 취소 모달 */}
      <SelectCancelDialog
        isOpen={isSelectCancelDialogOpen}
        onClose={() => setIsSelectCancelDialogOpen(false)}
        items={order.items}
        onCancelSuccess={handleSelectCancelSuccess}
        i18nInstance={i18nInstance}
      />
      {/* 금액 변경 모달 */}
      <AmountChangeDialog
        isOpen={isAmountChangeDialogOpen}
        onClose={() => setIsAmountChangeDialogOpen(false)}
        orderGroupUuid={
          orderHistoriesResponse?.data?.orderDetailMenuList?.[0]
            ?.orderGroupUuid as string
        }
        onApplySuccess={() => refetchOrderHistories()}
        i18nInstance={i18nInstance}
      />
      {/* 전체 할인 모달 */}
      <AllDiscountDialog
        isOpen={isAllDiscountDialogOpen}
        onClose={() => setIsAllDiscountDialogOpen(false)}
        orderGroupUuid={
          orderHistoriesResponse?.data?.orderDetailMenuList?.[0]
            ?.orderGroupUuid as string
        }
        onApplySuccess={() => refetchOrderHistories()}
        i18nInstance={i18nInstance}
      />
      {/* 서비스 금액 변경 모달 */}
      <ServiceAmountDialog
        isOpen={isServiceAmountDialogOpen}
        onClose={() => {
          setIsServiceAmountDialogOpen(false);
          setSelectedItemForService(null);
        }}
        orderGroupUuid={
          orderHistoriesResponse?.data?.orderDetailMenuList?.[0]
            ?.orderGroupUuid as string
        }
        orderDetailMenuSeq={
          selectedItemForService ? Number(selectedItemForService.id) : 0
        }
        onApplySuccess={() => refetchOrderHistories()}
        i18nInstance={i18nInstance}
      />
      {/* 카드 결제 모달 */}
      <CardPaymentDialog
        isOpen={isCardPaymentDialogOpen}
        onClose={() => {
          setIsCardPaymentDialogOpen(false);
          if (isPaymentFromSplit) {
            setIsPaymentFromSplit(false);
            setIsSplitPaymentDialogOpen(true);
          }
        }}
        paymentAmount={
          isPaymentFromSplit ? splitPaymentAmount : order.totalPrice
        }
        billingAmount={
          isPaymentFromSplit ? splitPaymentAmount : order.totalPrice
        }
        onArbitraryPayment={() => {
          setIsArbitraryPaymentConfirmDialogOpen(true);
        }}
        onConfirmPayment={() => {
          if (isPaymentFromSplit) {
            // 분할 결제 내역 추가
            setSplitPayments((prev) => [
              ...prev,
              {
                id: `payment-${Date.now()}`,
                method: 'card',
                amount: splitPaymentAmount,
                timestamp: Date.now(),
              },
            ]);
            // 분할 결제에서 온 경우 결제 완료 후 분할 결제 다이얼로그로 돌아감
            setIsCardPaymentDialogOpen(false);
            setIsPaymentFromSplit(false);
            setIsSplitPaymentDialogOpen(true);
          }
        }}
      />
      {/* 임의 결제 확인 모달 */}
      <ArbitraryPaymentConfirmDialog
        isOpen={isArbitraryPaymentConfirmDialogOpen}
        onClose={() => setIsArbitraryPaymentConfirmDialogOpen(false)}
        onBack={() => {
          setIsArbitraryPaymentConfirmDialogOpen(false);
        }}
        onContinue={() => {
          setIsArbitraryPaymentConfirmDialogOpen(false);
          setIsCardPaymentDialogOpen(false);
        }}
      />
      {/* 현금 결제 모달 */}
      <CashPaymentDialog
        isOpen={isCashPaymentDialogOpen}
        onClose={() => {
          setIsCashPaymentDialogOpen(false);
          if (isPaymentFromSplit) {
            setIsPaymentFromSplit(false);
            setIsSplitPaymentDialogOpen(true);
          }
        }}
        paymentAmount={
          isPaymentFromSplit ? splitPaymentAmount : order.totalPrice
        }
        onNext={(receivedAmount) => {
          setCashReceivedAmount(receivedAmount);
          setIsCashPaymentDialogOpen(false);
          setIsCashReceiptDialogOpen(true);
        }}
      />
      {/* 현금영수증 모달 */}
      <CashReceiptDialog
        isOpen={isCashReceiptDialogOpen}
        onClose={() => setIsCashReceiptDialogOpen(false)}
        onComplete={() => {
          setIsCashReceiptDialogOpen(false);
          if (isPaymentFromSplit) {
            // 분할 결제 내역 추가
            setSplitPayments((prev) => [
              ...prev,
              {
                id: `payment-${Date.now()}`,
                method: 'cash',
                amount: splitPaymentAmount,
                timestamp: Date.now(),
              },
            ]);
            // 분할 결제에서 온 경우 분할 결제 다이얼로그로 돌아감
            setIsPaymentFromSplit(false);
            setIsSplitPaymentDialogOpen(true);
          }
        }}
      />
      {/* 분할 결제 모달 */}
      <SplitPaymentDialog
        isOpen={isSplitPaymentDialogOpen}
        onClose={() => {
          setIsSplitPaymentDialogOpen(false);
          // 분할 결제 다이얼로그가 닫힐 때 결제 내역 초기화 (선택사항)
          // setSplitPayments([]);
        }}
        items={order.items}
        payments={splitPayments}
        onPayCash={(amount) => {
          setSplitPaymentAmount(amount);
          setIsPaymentFromSplit(true);
          setIsSplitPaymentDialogOpen(false);
          setIsCashPaymentDialogOpen(true);
        }}
        onPayCard={(amount) => {
          setSplitPaymentAmount(amount);
          setIsPaymentFromSplit(true);
          setIsSplitPaymentDialogOpen(false);
          setIsCardPaymentDialogOpen(true);
        }}
      />
    </S.TableDetailContainer>
  );
};

export default TableDetailContainer;
