import React from 'react';
import * as UIStyles from '@repo/ui/styles';
import { formatCurrency } from '@repo/util';
import * as S from './table.style';
const LIST = [
  {
    id: 1,
  },
  {
    id: 2,
    options: [
      {
        id: 1,
      },
      {
        id: 2,
      },
    ],
  },
  {
    id: 3,
  },
  {
    id: 4,
    options: [
      {
        id: 1,
      },
      {
        id: 2,
      },
    ],
  },
];

export const Table = () => {
  return (
    <UIStyles.tableStyles.Table>
      <UIStyles.tableStyles.Thead>
        <tr>
          <th>메뉴이름</th>
          <th>단위가격</th>
          <th>수량</th>
          <th>총가격</th>
        </tr>
      </UIStyles.tableStyles.Thead>
      <UIStyles.tableStyles.Tbody>
        {LIST.map((item) => {
          const hasOptions = item.options && item.options.length > 0;

          return (
            <React.Fragment key={item.id}>
              <S.MenuRow hasOptions={hasOptions}>
                <td>메뉴명명명명명명명</td>
                <td>{formatCurrency(10000)}</td>
                <td>{formatCurrency(999)}</td>
                <td>{formatCurrency(9909090999)}</td>
              </S.MenuRow>
              {hasOptions &&
                item.options.map((option, index) => (
                  <S.OptionRow
                    key={option.id}
                    isLast={index === item.options.length - 1}
                  >
                    <td>- 옵션명명</td>
                    <td>{formatCurrency(1000)}</td>
                    <td>{formatCurrency(999)}</td>
                    <td>{formatCurrency(9909090999)}</td>
                  </S.OptionRow>
                ))}
            </React.Fragment>
          );
        })}
      </UIStyles.tableStyles.Tbody>
    </UIStyles.tableStyles.Table>
  );
};
