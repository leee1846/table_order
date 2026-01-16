import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/useAuthStore';
import { BasicButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import type { IGetAdminShopItem } from '@repo/api/types';
import { useNavigate } from 'react-router-dom';

interface Props {
  stores: IGetAdminShopItem[];
}

export const Table = ({ stores }: Props) => {
  const navigate = useNavigate();

  const redirectToStoreDetail = (shopCode: string, shopSeq: number) => {
    useAuthStore.getState().setShopDataForAdminWeb(shopCode, shopSeq);
    const url = `${window.location.origin}${ROUTES.SETTINGS.SALES.SUMMARY.generate()}`;
    window.open(url, '_blank');
  };

  const renderRows = () => {
    if (!stores || stores.length === 0) {
      return (
        <tr>
          <td colSpan={9}>매장 목록이 없습니다.</td>
        </tr>
      );
    }

    return stores.map((store) => (
      <tr key={store.memberId}>
        <td>{store.shopName}</td>
        <td>{store.businessNumber}</td>
        <td>{store.address1}</td>
        <td>{store.managerPhoneNumber}</td>
        <td>
          <div
            style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}
          >
            <BasicButton
              variant="Outline_Blue_S"
              onClick={() =>
                navigate(
                  `${ROUTES.ADMIN_WEB.STORES_EDIT.generate(store.shopCode)}?memberId=${store.memberId}`
                )
              }
            >
              수정
            </BasicButton>
            <BasicButton
              variant="Outline_Grey_S"
              onClick={() =>
                redirectToStoreDetail(store.shopCode, store.shopSeq)
              }
            >
              매장 설정
            </BasicButton>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <UIStyles.setting.Table>
        <UIStyles.setting.Thead>
          <tr>
            <th>매장명</th>
            <th>사업자등록번호</th>
            <th>기본 주소</th>
            <th>대표자 연락처</th>
            <th>작업</th>
          </tr>
        </UIStyles.setting.Thead>
        <UIStyles.setting.Tbody>{renderRows()}</UIStyles.setting.Tbody>
      </UIStyles.setting.Table>
    </div>
  );
};
