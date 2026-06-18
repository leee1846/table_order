import styled from '@emotion/styled';
import { Table } from 'antd';
import { createStyles } from 'antd-style';

// --- Types ---
export interface ShopDataType {
  shopSeq: number;
  shopCode: string;
  shopName: string;
  address1?: string;
  memberId?: string | number;
  businessNumber?: string;
  firstLinkedDate?: string;
  lastOrderDate?: string;
}

// --- Emotion Styles ---
export const Container = styled.div`
  background-color: #f4f7fa;
  height: 100%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ContentCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-shrink: 0;
`;

export const StyledTable = styled(Table<ShopDataType>)`
  .ant-table-thead > tr > th {
    background-color: #1d2a6d !important;
    color: white !important;
    border-bottom: none;
  }
`;

export const useStyle = createStyles(({ css, prefixCls }) => {
  return {
    customTable: css`
      .${prefixCls}-table {
        .${prefixCls}-table-container {
          .${prefixCls}-table-body, .${prefixCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
          }
        }
      }
    `,
  };
});
