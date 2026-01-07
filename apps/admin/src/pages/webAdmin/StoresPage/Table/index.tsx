import { ROUTES } from '@/constants/routes';
import { BasicButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import type { IGetAdminShopItem } from 'node_modules/@repo/api/src/types/admin';
import { useNavigate } from 'react-router-dom';

interface Props {
  stores: IGetAdminShopItem[];
}

export const Table = ({ stores }: Props) => {
  const navigate = useNavigate();

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
        <td>{store.memberId}</td>
        <td>{store.shopSeq}</td>
        <td>{store.shopName}</td>
        <td>{store.businessNumber}</td>
        <td>{store.address1}</td>
        <td>{store.managerPhoneNumber}</td>
        <td>
          <div
            style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}
          >
            <BasicButton
              variant="Outline_Navy_S"
              onClick={() =>
                navigate(ROUTES.ADMIN_WEB.STORES_EDIT.generate(store.shopCode))
              }
            >
              수정
            </BasicButton>
            <BasicButton variant="Outline_Navy_S" onClick={() => {}}>
              매장 상세
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
            <th>SID</th>
            <th>아이디</th>
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
