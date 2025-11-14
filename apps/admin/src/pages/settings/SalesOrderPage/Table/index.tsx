import { BasicButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';

export const Table = () => {
  const LIST = [1, 2, 3, 4, 5];

  return (
    <div>
      <UIStyles.tableStyles.Table>
        <UIStyles.tableStyles.Thead>
          <tr>
            <th>주문번호</th>
            <th>거래일자</th>
            <th>테이블 번호</th>
            <th>거래금액</th>
            <th>결제수단</th>
            <th>객수</th>
            <th>상세 내역</th>
          </tr>
        </UIStyles.tableStyles.Thead>
        <UIStyles.tableStyles.Tbody>
          {LIST.map((item) => (
            <tr key={item}>
              <td>111533431</td>
              <td>2025-01-01 12:00:00</td>
              <td>2</td>
              <td>100000</td>
              <td>카드</td>
              <td>2</td>
              <td>
                <BasicButton variant="Outline_Navy_S">보기</BasicButton>
              </td>
            </tr>
          ))}
        </UIStyles.tableStyles.Tbody>
      </UIStyles.tableStyles.Table>
    </div>
  );
};
