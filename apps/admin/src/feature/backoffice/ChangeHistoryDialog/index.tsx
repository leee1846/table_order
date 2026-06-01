import { useState } from 'react';
import { Modal, Table, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styled from '@emotion/styled';
import { useGetAdminHistoryList } from '@repo/api/queries';
import { formatDateTime } from '@repo/util/date';
import type { THistoryCode } from '@repo/api/types';

const StyledTable = styled(Table<HistoryItem>)`
  .ant-table-thead > tr > th {
    background-color: #1d2a6d !important;
    color: white !important;
    border-bottom: none;
  }
`;

export interface HistoryItem {
  key: string;
  id: number;
  userId: number;
  updateDateTime: string; // 업데이트 일시
  user: string; // 사용자
  action: string; // 액션
}

export interface HistoryConfig {
  code: THistoryCode;
  id: number | string;
  label: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  histories: HistoryConfig[];
}

export const ChangeHistoryDialog = ({ isOpen, onClose, histories }: Props) => {
  const [activeTabKey, setActiveTabKey] = useState('0');

  const activeTabIndex = parseInt(activeTabKey, 10);
  const currentHistory = histories[activeTabIndex] as HistoryConfig;

  const { data, isFetching } = useGetAdminHistoryList(
    currentHistory.code,
    currentHistory.id.toString(),
    {
      enabled: isOpen && !!currentHistory.id && !!currentHistory.code,
    }
  );

  const historyData: HistoryItem[] =
    data?.data?.map((item, index) => ({
      key: `${item.updateDate}-${index}`,
      id: item.updateDate,
      userId: item.updateMemberId,
      user: item.updateMemberName || '-',
      updateDateTime: formatDateTime(item.updateDate, 'YYYY-MM-DD HH:mm:ss'),
      action: item.updateLog || '-',
    })) || [];

  // 100개의 목업 데이터 생성
  // const historyData: HistoryItem[] = Array.from({ length: 100 }, (_, i) => {
  //   const timestamp = new Date().getTime() - i * 1000 * 60 * 60 * 3; // 3시간 간격
  //   const date = new Date(timestamp);
  //   return {
  //     key: `mock-key-${i}`,
  //     id: timestamp,
  //     userId: 1000 + i,
  //     user: `테스터${i + 1}`,
  //     updateDateTime: formatDateTime(date.toISOString(), 'YYYY-MM-DD HH:mm:ss'),
  //     action: `캠페인 정보를 수정했습니다. (항목 ${i + 1})`,
  //   };
  // });

  const columns: ColumnsType<HistoryItem> = [
    { title: '계정', dataIndex: 'userId', key: 'userId', width: 120 },
    { title: '이름', dataIndex: 'user', key: 'user', width: 120 },
    {
      title: '업데이트 일시',
      dataIndex: 'updateDateTime',
      key: 'updateDateTime',
      width: 180,
    },
    { title: '액션', dataIndex: 'action', key: 'action', ellipsis: true },
  ];

  return (
    <Modal
      title="변경 이력"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1200}
      destroyOnHidden
    >
      {histories.length > 1 ? (
        <Tabs
          activeKey={activeTabKey}
          onChange={setActiveTabKey}
          items={histories.map((history, index) => ({
            key: index.toString(),
            label: history.label,
            children: (
              <StyledTable
                loading={isFetching}
                columns={columns}
                dataSource={historyData}
                pagination={{
                  pageSize: 10,
                  placement: ['bottomEnd'],
                  showSizeChanger: false,
                }}
              />
            ),
          }))}
        />
      ) : (
        <StyledTable
          loading={isFetching}
          columns={columns}
          dataSource={historyData}
          pagination={{
            pageSize: 10,
            placement: ['bottomEnd'],
            showSizeChanger: false,
          }}
          style={{ marginTop: '16px' }}
        />
      )}
    </Modal>
  );
};
