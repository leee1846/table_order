import { useState } from 'react';
import { ModalBackground, Pagination } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './orderListDialog.styles';

const { colors } = theme;

export type OrderItem = {
  id: string;
  orderNumber: string;
  orderDateTime: string;
  tableNumber: string;
  orderChannel: string;
  paymentMethod: string;
  orderStatus: string;
};

export type OrderListDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  orders?: OrderItem[];
  itemsPerPage?: number;
};

export const OrderListDialog = ({
  isOpen,
  onClose,
  orders = [],
  itemsPerPage = 10,
}: OrderListDialogProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!isOpen) {
    return null;
  }

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <ModalBackground position="center" onClick={onClose}>
      <S.DialogContainer onClick={() => console.log('click')}>
        <S.CloseButton onClick={onClose} aria-label="닫기">
          <CloseIcon width={32} height={32} color={colors.grey[700]} />
        </S.CloseButton>

        <S.Header>
          <S.Title>주문 목록</S.Title>
        </S.Header>

        <S.TableContainer>
          <S.Table>
            <S.Thead>
              <tr>
                <th>주문번호</th>
                <th>주문일시</th>
                <th>테이블 번호</th>
                <th>주문채널</th>
                <th>결재수단</th>
                <th>주문상태</th>
              </tr>
            </S.Thead>
            <S.Tbody>
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.orderDateTime}</td>
                    <td>{order.tableNumber}</td>
                    <td>{order.orderChannel}</td>
                    <td>{order.paymentMethod}</td>
                    <td>{order.orderStatus}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: 'center', padding: '40px' }}
                  >
                    주문 내역이 없습니다.
                  </td>
                </tr>
              )}
            </S.Tbody>
          </S.Table>
        </S.TableContainer>

        {orders.length > 0 && (
          <S.PaginationWrapper>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              customStyle={S.Pagenation}
            />
          </S.PaginationWrapper>
        )}
      </S.DialogContainer>
    </ModalBackground>
  );
};
