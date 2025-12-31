import { useEffect, useMemo, useState } from 'react';
import { ModalBackground, Pagination } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { useGetOrderLogList } from '@repo/api/queries';
import type {
  IOrderDetailMenu,
  TOrderPaymentStatus,
  TOrderStatusCode,
  TOrderType,
} from '@repo/api/types';
import { formatDateTime } from '@repo/util/date';
import type { OrderItem as MenuItem } from 'src/components/TableDetailContainer/orderSection/types';
import * as S from './orderListDialog.styles';
import DetailOrderDialog from './DetailOrderDialog';
import * as UIStyles from '@repo/ui/styles';

const { colors } = theme;

const ORDER_CHANNEL_LABELS: Record<TOrderType, string> = {
  MENU: '메뉴판',
  ORDER_POS: '오더포스',
  POS_APP: '포스앱',
};

const PAYMENT_STATUS_LABELS: Record<TOrderPaymentStatus, string> = {
  UNPAID: '미결제',
  PAID: '결제완료',
  REFUND: '환불',
};

const ORDER_STATUS_LABELS: Record<TOrderStatusCode, string> = {
  RECEIVED: '접수',
  COMPLETE: '조리완료',
  CANCEL: '취소',
  POS_CANCEL: '포스 취소',
};

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
    };
  });
};

export type OrderItem = {
  id: string;
  orderUuid: string;
  orderNumber: string;
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
  itemsPerPage?: number;
};

export const OrderListDialog = ({
  isOpen,
  onClose,
  shopCode,
  itemsPerPage = 7,
}: OrderListDialogProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openDetailOrderDialog, setOpenDetailOrderDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

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
    refetch,
  } = useGetOrderLogList({
    shopCode: shopCode ?? '',
    pageNumber: currentPage - 1,
    pageSize: itemsPerPage,
  });

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

  const currentPageFromApi = orderLogData?.currentPageNumber;

  useEffect(() => {
    if (
      typeof currentPageFromApi === 'number' &&
      currentPageFromApi + 1 !== currentPage
    ) {
      setCurrentPage(currentPageFromApi + 1);
    }
  }, [currentPageFromApi, currentPage]);

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
  }, [orderLogData]);

  const totalPages =
    orderLogData?.totalPageNumber && orderLogData.totalPageNumber > 0
      ? orderLogData.totalPageNumber
      : 1;
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
      <ModalBackground position="center" onClick={onClose}>
        <S.DialogContainer>
          <S.CloseButton onClick={onClose} aria-label="닫기">
            <CloseIcon width={32} height={32} color={colors.grey[700]} />
          </S.CloseButton>

          <S.Container>
            <S.Header>
              <S.Title>주문 목록</S.Title>
            </S.Header>

            <S.TableContainer>
              <UIStyles.setting.Table>
                <UIStyles.setting.Thead>
                  <tr>
                    <th>주문번호</th>
                    <th>주문일시</th>
                    <th>테이블 번호</th>
                    <th>주문채널</th>
                    <th>결제상태</th>
                    <th>주문상태</th>
                  </tr>
                </UIStyles.setting.Thead>
                <S.Tbody>
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
                        매장 코드를 확인해주세요.
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
                        주문 목록을 불러오는 중입니다.
                      </td>
                    </tr>
                  ) : orderItems.flatMap((order) => order.menuItems).length >
                    0 ? (
                    orderItems
                      .filter((order) => order.menuItems.length > 0)
                      .map((order) => (
                        <tr
                          key={order.id}
                          onClick={() => handleRowClick(order)}
                        >
                          <td>{order.orderNumber}</td>
                          <td>{order.orderDateTime}</td>
                          <td>{order.tableNumber}</td>
                          <td>{order.orderChannel}</td>
                          {/* TODO paymentStatus 아직 백엔드에서 구현 안됨 현재 null로 오는 중 */}
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
                        주문 내역이 없습니다.
                      </td>
                    </tr>
                  )}
                </S.Tbody>
              </UIStyles.setting.Table>
            </S.TableContainer>
          </S.Container>

          <S.Footer>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </S.Footer>
        </S.DialogContainer>
      </ModalBackground>
      {openDetailOrderDialog && (
        <ModalBackground
          position="center"
          onClick={() => setOpenDetailOrderDialog(false)}
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
