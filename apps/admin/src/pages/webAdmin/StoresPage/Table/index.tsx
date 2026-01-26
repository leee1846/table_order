import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/useAuthStore';
import type { IGetAdminShopItem } from '@repo/api/types';
import { useNavigate } from 'react-router-dom';
import { theme } from '@repo/ui';
import { EditIcon, SettingsIcon } from '@repo/ui/icons';
import { Button } from '@/feature/AdminWeb/components';
import * as S from './table.style';

interface Props {
  stores: IGetAdminShopItem[];
}

export const Table = ({ stores }: Props) => {
  const navigate = useNavigate();

  const redirectToStoreDetail = (shopCode: string, shopSeq: number) => {
    useAuthStore.getState().setShopDataForAdminWeb(shopCode, shopSeq);
    const url = `${window.location.origin}${ROUTES.SETTINGS.NOTICES.generate()}`;
    window.open(url, '_blank');
  };

  const renderRows = () => {
    if (!stores || stores.length === 0) {
      return (
        <S.EmptyRow>
          <S.EmptyCell colSpan={5}>매장 목록이 없습니다.</S.EmptyCell>
        </S.EmptyRow>
      );
    }

    return stores.map((store) => (
      <S.Tr key={store.memberId}>
        <S.Td>{store.shopCode}</S.Td>
        <S.Td>{store.shopName}</S.Td>
        <S.Td>{store.businessNumber || '-'}</S.Td>
        <S.Td>{store.address1 || '-'}</S.Td>
        <S.ActionCell>
          <S.ActionWrapper>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                navigate(
                  `${ROUTES.ADMIN_WEB.STORES_EDIT.generate(store.shopCode)}?memberId=${store.memberId}`
                )
              }
            >
              <EditIcon width={16} height={16} color={theme.colors.grey[700]} />
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                redirectToStoreDetail(store.shopCode, store.shopSeq)
              }
            >
              매장 설정
            </Button>
          </S.ActionWrapper>
        </S.ActionCell>
      </S.Tr>
    ));
  };

  return (
    <S.TableContainer>
      <S.TableElement>
        <S.Thead>
          <S.Tr>
            <S.Th>SID</S.Th>
            <S.Th>매장명</S.Th>
            <S.Th>사업자등록번호</S.Th>
            <S.Th>기본 주소</S.Th>
            <S.Th>작업</S.Th>
          </S.Tr>
        </S.Thead>
        <S.Tbody>{renderRows()}</S.Tbody>
      </S.TableElement>
    </S.TableContainer>
  );
};
