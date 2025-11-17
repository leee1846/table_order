import { BasicButton } from '@repo/ui/components';
import { formatCurrency } from '@repo/util';
import * as UIStyles from '@repo/ui/styles';
import * as S from './paymentSection.style';

export const PaymentSection = () => {
  return (
    <div>
      <S.TitleContainer>
        <p>결제 내역</p>
        <div>
          <BasicButton variant="Outline_Navy_M" onClick={() => {}}>
            재결제
          </BasicButton>
          <BasicButton variant="Outline_Navy_M" onClick={() => {}}>
            재판매
          </BasicButton>
        </div>
      </S.TitleContainer>

      <S.Tables>
        <UIStyles.tableStyles.Table>
          <UIStyles.tableStyles.Thead>
            <tr>
              <th>총금액</th>
              <th>취소금액</th>
              <th>결제금액</th>
              <th>결제수단</th>
            </tr>
          </UIStyles.tableStyles.Thead>

          <UIStyles.tableStyles.Tbody>
            <tr>
              <td>{formatCurrency(100000)}</td>
              <td>{formatCurrency(10000)}</td>
              <td>{formatCurrency(90000)}</td>
              <td>카드</td>
            </tr>
          </UIStyles.tableStyles.Tbody>
        </UIStyles.tableStyles.Table>

        {/* 현금일경우 */}
        <UIStyles.tableStyles.Table>
          <UIStyles.tableStyles.Thead>
            <tr>
              <th>주문번호</th>
              <th>거래일자</th>
              <th>거래금액</th>
              <th>현금영수증</th>
              <th>현금영수증 발행</th>
              <th>거래취소</th>
            </tr>
          </UIStyles.tableStyles.Thead>

          <UIStyles.tableStyles.Tbody>
            <tr>
              <td>111533431</td>
              <td>2025-01-01 12:00:00</td>
              <td>{formatCurrency(100000)}</td>
              <td>-</td>
              <td>-</td>
              <td>
                <BasicButton
                  variant="Outline_Navy_M"
                  onClick={() => {}}
                  customStyle={S.cancelButtonCss}
                >
                  취소
                </BasicButton>
              </td>
            </tr>
          </UIStyles.tableStyles.Tbody>
        </UIStyles.tableStyles.Table>

        {/* 카드일경우 */}
        <UIStyles.tableStyles.Table>
          <UIStyles.tableStyles.Thead>
            <tr>
              <th>승인구분</th>
              <th>
                카드번호
                <br />
                [승인번호]
              </th>
              <th>총거래금액</th>
              <th>
                거래승인(취소)일시
                <br />
                [거래고유번호]
              </th>
              <th>
                매입사
                <br />
                [발급사]
              </th>
              <th>
                공급가
                <br />
                부가세
              </th>
              <th>거래취소</th>
            </tr>
          </UIStyles.tableStyles.Thead>

          <UIStyles.tableStyles.Tbody>
            <tr>
              <td>승인</td>
              <td>
                12345678901
                <br />
                [1234567890]
              </td>
              <td>{formatCurrency(100000)}</td>
              <td>
                2025-01-01 12:00:00
                <br />
                [1234567890123456]
              </td>
              <td>
                기타카드
                <br />
                [임의결제]
              </td>
              <td>
                {formatCurrency(100000)}원
                <br />
                {formatCurrency(10000)}원
              </td>
              <td>
                <BasicButton
                  variant="Outline_Navy_M"
                  onClick={() => {}}
                  customStyle={S.cancelButtonCss}
                >
                  취소
                </BasicButton>
              </td>
            </tr>
          </UIStyles.tableStyles.Tbody>
        </UIStyles.tableStyles.Table>
      </S.Tables>
    </div>
  );
};
