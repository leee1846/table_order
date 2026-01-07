import { BasicButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';

interface StoreItem {
  sid: string;
  id: string;
  name: string;
  businessNumber: string;
  address: string;
  contact: string;
  version: string;
  isActive: boolean;
}

interface Props {
  stores: StoreItem[];
  onStoreClick?: (store: StoreItem) => void;
}

export const Table = ({ stores, onStoreClick }: Props) => {
  const handleStoreClick = (store: StoreItem) => {
    if (onStoreClick) {
      onStoreClick(store);
    }
  };

  const renderRows = () => {
    if (!stores || stores.length === 0) {
      return (
        <tr>
          <td colSpan={8}>매장 목록이 없습니다.</td>
        </tr>
      );
    }

    return stores.map((store) => (
      <tr key={store.sid}>
        <td>{store.sid}</td>
        <td>{store.id}</td>
        <td>
          <BasicButton
            variant="Outline_Navy_S"
            onClick={() => handleStoreClick(store)}
          >
            {store.name}
          </BasicButton>
        </td>
        <td>{store.businessNumber}</td>
        <td>{store.address}</td>
        <td>{store.contact}</td>
        <td>{store.version}</td>
        <td>{store.isActive ? 'Y' : 'N'}</td>
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
            <th>버전</th>
            <th>활성화</th>
          </tr>
        </UIStyles.setting.Thead>
        <UIStyles.setting.Tbody>{renderRows()}</UIStyles.setting.Tbody>
      </UIStyles.setting.Table>
    </div>
  );
};
