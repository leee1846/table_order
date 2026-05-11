import { useEffect, useMemo, useState } from 'react';
import { ModalBackground, Pagination } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { useGetOrderLogList } from '@repo/api/queries';
import { useStablePaginatedTotalPages } from '@repo/feature/hooks';
import { keepPreviousData } from '@repo/api/tanstack-query';
import type {
  IOrderDetailMenu,
  TOrderPaymentStatus,
  TOrderStatusCode,
  TOrderType,
} from '@repo/api/types';
import { formatDateTime } from '@repo/util/date';
import type { OrderItem as MenuItem } from '@repo/feature/components';
import { useAdminTranslation } from '@/config/i18n';
import { PAZE_SIZE } from '@/constants/keys';
import * as S from './orderListDialog.styles';
import DetailOrderDialog from './DetailOrderDialog';
import * as UIStyles from '@repo/ui/styles';

const { colors } = theme;

const formatOrderDate = (value: string | number) => {
  const formatted = formatDateTime(value);
  return formatted || '-';
};

const mapMenuItems = (orderDetailMenuList: IOrderDetailMenu[]): MenuItem[] => {
  if (!Array.isArray(orderDetailMenuList)) {
    return [];
  }

  return orderDetailMenuList.map((menu, index) => {
    const options =
      menu.orderDetailOptionList && menu.orderDetailOptionList.length > 0
        ? menu.orderDetailOptionList.map((option) => ({
            id: `${menu.orderDetailMenuSeq}-${option.orderDetailOptionSeq}`,
            name: option.optionName,
            qty: option.optionQuantity,
            unitPrice: option.optionPrice,
            localeOptionName: option.localeOptionName ?? undefined,
          }))
        : undefined;

    return {
      id:
        menu.orderDetailMenuSeq !== null &&
        menu.orderDetailMenuSeq !== undefined
          ? String(menu.orderDetailMenuSeq)
          : `order-menu-${index}`,
      menuSeq: menu.menuSeq,
      name: menu.menuName,
      qty: menu.menuQuantity,
      unitPrice: menu.menuPrice,
      options,
      localeMenuName: menu.localeMenuName ?? undefined,
    };
  });
};

export type OrderItem = {
  id: string;
  orderUuid: string;
  orderNumber: string;
  tableName: string;
  orderDateTime: string;
  tableNumber: string;
  orderChannel: string;
  paymentStatus: string;
  orderStatus: string;
  customerCount?: number | null;
  kidsCustomerCount?: number | null;
  menuItems: MenuItem[];
};

export type OrderListDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  shopCode?: string;
};

export const OrderListDialog = ({
  isOpen,
  onClose,
  shopCode,
}: OrderListDialogProps) => {
  const { t } = useAdminTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [openDetailOrderDialog, setOpenDetailOrderDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const ORDER_CHANNEL_LABELS = useMemo(
    () => ({
      MENU: t('메뉴판'),
      ORDER_POS: t('오더포스'),
      POS_APP: t('관리자'),
      POS: t('연동포스'),
      PREPAYMENT: t('메뉴판'),
      ADMIN: t('관리자'),
    }),
    [t]
  );

  const PAYMENT_STATUS_LABELS = useMemo(
    () => ({
      UNPAID: t('후결제'),
      PAID: t('선결제'),
      REFUND: t('환불'),
    }),
    [t]
  );

  const ORDER_STATUS_LABELS = useMemo(
    () => ({
      RECEIVED: t('접수'),
      COMPLETE: t('조리완료'),
      CANCEL: t('취소'),
      POS_CANCEL: t('포스 취소'),
    }),
    [t]
  );

  useEffect(() => {
    if (!isOpen) {
      setCurrentPage(1);
      setSelectedOrder(null);
      setOpenDetailOrderDialog(false);
    }
  }, [isOpen, shopCode]);

  const {
    data: orderLogResponse,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useGetOrderLogList(
    {
      shopCode: shopCode ?? '',
      pageNumber: currentPage - 1,
      pageSize: PAZE_SIZE,
    },
    {
      placeholderData: keepPreviousData,
    }
  );

  useEffect(() => {
    if (!isOpen || !shopCode) {
      return;
    }

    refetch();
  }, [isOpen, shopCode, currentPage, refetch]);

  const orderLogData = useMemo(() => {
    const data = orderLogResponse?.data;
    if (!data) {
      return undefined;
    }

    return Array.isArray(data) ? data[0] : data;
  }, [orderLogResponse]);

  const orderItems = useMemo<OrderItem[]>(() => {
    const orderLogList = orderLogData?.orderLog;

    if (!orderLogList || !Array.isArray(orderLogList)) {
      return [];
    }

    return orderLogList.map((order, index) => {
      const menuItems = mapMenuItems(order.orderDetailMenuList);

      return {
        id: order.orderUuid || order.orderCode || `order-${index}`,
        orderUuid: order.orderUuid,
        orderNumber: order.orderCode ?? '-',
        orderDateTime: formatOrderDate(order.createDate),
        tableNumber: order.tableNumber ?? '-',
        tableName: order.tableName ?? '-',
        orderChannel:
          ORDER_CHANNEL_LABELS[order.orderType as TOrderType] ??
          order.orderType,
        paymentStatus:
          PAYMENT_STATUS_LABELS[order.paymentStatus as TOrderPaymentStatus] ??
          order.paymentStatus,
        orderStatus:
          ORDER_STATUS_LABELS[order.status as TOrderStatusCode] ?? order.status,
        customerCount: order.customerCount ?? null,
        kidsCustomerCount: order.kidsCustomerCount ?? null,
        menuItems,
      };
    });
  }, [
    orderLogData,
    ORDER_CHANNEL_LABELS,
    ORDER_STATUS_LABELS,
    PAYMENT_STATUS_LABELS,
  ]);

  const displayedOrderItems = useMemo(
    () => orderItems.filter((order) => order.menuItems.length > 0),
    [orderItems]
  );

  const totalPages = useStablePaginatedTotalPages(
    isPlaceholderData,
    orderLogData?.totalPageNumber,
    displayedOrderItems.length
  );
  const isInitialLoading = isFetching && !orderLogResponse;
  const hasShopCode = !!shopCode;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowClick = (order: OrderItem) => {
    setOpenDetailOrderDialog(true);
    setSelectedOrder(order);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <ModalBackground
        position="center"
        onClick={onClose}
        scrollableBackdrop={false}
      >
        <S.DialogContainer>
          <S.CloseButton onClick={onClose} aria-label={t('닫기')}>
            <CloseIcon width={32} height={32} color={colors.grey[700]} />
          </S.CloseButton>

          <S.Container>
            <S.Header>
              <S.Title>{t('주문 목록')}</S.Title>
            </S.Header>

            <S.TableContainer>
              <UIStyles.setting.Table>
                <UIStyles.setting.Thead>
                  <tr>
                    <th>{t('주문번호')}</th>
                    <th>{t('주문일시')}</th>
                    <th>{t('테이블')}</th>
                    <th>{t('주문채널')}</th>
                    <th>{t('결제상태')}</th>
                    <th>{t('주문상태')}</th>
                  </tr>
                </UIStyles.setting.Thead>
                <S.Tbody
                  pageSize={PAZE_SIZE}
                  ordersLength={
                    hasShopCode && !isInitialLoading
                      ? displayedOrderItems.length
                      : undefined
                  }
                >
                  {!hasShopCode ? (
                    <tr style={{ height: '100%' }}>
                      <td
                        colSpan={6}
                        style={{
                          textAlign: 'center',
                          padding: '40px',
                          color: colors.grey[600],
                        }}
                      >
                        {t('매장 코드를 확인해주세요.')}
                      </td>
                    </tr>
                  ) : isInitialLoading ? (
                    <tr style={{ height: '100%' }}>
                      <td
                        colSpan={6}
                        style={{
                          textAlign: 'center',
                          padding: '40px',
                          color: colors.grey[600],
                        }}
                      >
                        {t('주문 목록을 불러오는 중입니다.')}
                      </td>
                    </tr>
                  ) : displayedOrderItems.length > 0 ? (
                    displayedOrderItems.map((order) => (
                      <tr key={order.id} onClick={() => handleRowClick(order)}>
                        <td>{order.orderNumber}</td>
                        <td>{order.orderDateTime}</td>
                        <td>{order.tableName}</td>
                        <td>{order.orderChannel}</td>
                        <td>{order.paymentStatus}</td>
                        <td>{order.orderStatus}</td>
                      </tr>
                    ))
                  ) : (
                    <tr style={{ height: '100%' }}>
                      <td
                        colSpan={6}
                        style={{
                          textAlign: 'center',
                          padding: '40px',
                          color: colors.grey[600],
                        }}
                      >
                        {t('주문 내역이 없습니다.')}
                      </td>
                    </tr>
                  )}
                </S.Tbody>
              </UIStyles.setting.Table>
            </S.TableContainer>
          </S.Container>

          <S.StyledFooter>
            <div />
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </S.StyledFooter>
        </S.DialogContainer>
      </ModalBackground>
      {openDetailOrderDialog && (
        <ModalBackground
          position="center"
          onClick={() => setOpenDetailOrderDialog(false)}
          scrollableBackdrop={false}
        >
          <DetailOrderDialog
            isOpen={openDetailOrderDialog}
            onClose={() => setOpenDetailOrderDialog(false)}
            order={selectedOrder ?? undefined}
            menuItems={selectedOrder?.menuItems ?? []}
            numberOfPeople={selectedOrder?.customerCount ?? 0}
          />
        </ModalBackground>
      )}
    </>
  );
};
