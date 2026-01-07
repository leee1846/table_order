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
  onEdit?: (store: StoreItem) => void;
  onDetail?: (store: StoreItem) => void;
}

export const Table = ({ stores, onEdit, onDetail }: Props) => {
  const renderRows = () => {
    if (!stores || stores.length === 0) {
      return (
        <tr>
          <td colSpan={9}>매장 목록이 없습니다.</td>
        </tr>
      );
    }

    return stores.map((store) => (
      <tr key={store.sid}>
        <td>{store.sid}</td>
        <td>{store.id}</td>
        <td>{store.name}</td>
        <td>{store.businessNumber}</td>
        <td>{store.address}</td>
        <td>{store.contact}</td>
        <td>{store.version}</td>
        <td>{store.isActive ? 'Y' : 'N'}</td>
        <td>
          <div
            style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}
          >
            <BasicButton
              variant="Outline_Navy_S"
              onClick={() => onEdit?.(store)}
            >
              수정
            </BasicButton>
            <BasicButton
              variant="Outline_Navy_S"
              onClick={() => onDetail?.(store)}
            >
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
            <th>버전</th>
            <th>활성화</th>
            <th>작업</th>
          </tr>
        </UIStyles.setting.Thead>
        <UIStyles.setting.Tbody>{renderRows()}</UIStyles.setting.Tbody>
      </UIStyles.setting.Table>
    </div>
  );
};
