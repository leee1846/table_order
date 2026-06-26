import React, { useState, useEffect } from 'react';
import {
  Card,
  DatePicker,
  Typography,
  Table,
  Space,
  Button,
  Tooltip,
  Form,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styled from '@emotion/styled';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { CampaignShopData } from './StoreGroupSelection';

const { Text } = Typography;

// --- Emotion Styles ---
const Container = styled.div`
  display: flex;
  flex-direction: column;
  /* gap and padding moved to parent */
  /* padding-top: 24px; */ /* Parent handles top margin */
`;

// Card 컴포넌트 헤더 커스텀 (짙은 파란색 배경 + 흰 글씨)
const StyledCard = styled(Card)`
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  overflow: hidden;

  .ant-card-head {
    background-color: #1d2a6d; /* 캡스/브랜드 컬러 */
    color: #ffffff;
    min-height: 48px;
    border-bottom: none;
    padding: 0 24px;
  }

  .ant-card-head-title {
    font-size: 15px;
    font-weight: 600;
  }

  .ant-card-body {
    padding: 32px 24px;
  }
`;

// 이전 단계와 동일한 다크 블루 헤더 테이블
const StyledTable = styled(Table<CampaignShopData>)`
  .ant-table-thead > tr > th {
    background-color: #f8f9fa; /* 밝은 회색 배경 */
    color: #595959; /* 어두운 회색 텍스트 */
    font-weight: 600;
    border-bottom: 1px solid #e8e8e8;
    padding: 12px 16px;
  }

  .ant-table-tbody > tr > td {
    padding: 14px 16px;
    border-bottom: 1px solid #f0f0f0;
    color: #262626;
    vertical-align: middle;
  }

  /* 마지막 row의 하단 보더 제거 */
  .ant-table-tbody > tr:last-child > td {
    border-bottom: none;
  }

  /* row에 hover 효과 추가 */
  .ant-table-tbody > tr:hover > td {
    background-color: #f7f9fc;
  }
`;

// 하단 안내 알림창 커스텀 (연한 파란색 배경)
const InfoAlertBox = styled.div`
  background-color: #e6f4ff;
  border: 1px solid #91caff;
  border-radius: 8px;
  padding: 16px 20px;
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #0958d9;
  font-size: 13px;
`;

// --- Mock Data ---
export interface CampaignScheduleProps {
  schedules: CampaignShopData[];
  onChange: (schedules: CampaignShopData[]) => void;
  overallStartDate?: dayjs.Dayjs | null;
  overallEndDate?: dayjs.Dayjs | null;
  onEditingChange?: (isEditing: boolean) => void;
}

interface EditableFormValues {
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
}

const CampaignSchedule: React.FC<CampaignScheduleProps> = ({
  schedules,
  onChange,
  overallStartDate,
  overallEndDate,
  onEditingChange,
}) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<number | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (onEditingChange) {
      onEditingChange(editingKey !== '');
    }
  }, [editingKey, onEditingChange]);

  const isEditing = (record: CampaignShopData) => record.shopSeq === editingKey;

  const edit = (record: CampaignShopData) => {
    form.setFieldsValue({
      ...record,
      startDate: record.startDate
        ? dayjs(record.startDate, 'YYYY-MM-DD')
        : null,
      endDate: record.endDate ? dayjs(record.endDate, 'YYYY-MM-DD') : null,
    });
    setEditingKey(record.shopSeq);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (shopSeq: number) => {
    try {
      const values = (await form.validateFields()) as EditableFormValues;
      const newData = [...schedules];
      const index = newData.findIndex((item) => item.shopSeq === shopSeq);

      if (index > -1) {
        const item = newData[index];
        if (item) {
          newData.splice(index, 1, {
            ...item,
            startDate: values.startDate
              ? values.startDate.format('YYYY-MM-DD')
              : '',
            endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : '',
          });
          onChange(newData);
          setEditingKey('');
        }
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  // 전체 집행 기간 외의 날짜 비활성화
  const disabledDate = (current: dayjs.Dayjs) => {
    if (!current) {
      return false;
    }

    // 전체 시작일 이전 날짜 비활성화
    if (overallStartDate && current.isBefore(overallStartDate, 'day')) {
      return true;
    }

    // 전체 종료일 이후 날짜 비활성화
    if (overallEndDate && current.isAfter(overallEndDate, 'day')) {
      return true;
    }

    return false;
  };

  const disabledEndDate = (current: dayjs.Dayjs) => {
    // 전체 집행 기간 제약 조건을 먼저 확인합니다.
    if (disabledDate(current)) {
      return true;
    }

    // 현재 폼의 시작일 값을 가져옵니다.
    const startDate = form.getFieldValue('startDate') as dayjs.Dayjs | null;

    // 시작일이 선택되었고, 현재 날짜가 시작일보다 이전이면 비활성화합니다.
    if (startDate && current.isBefore(startDate, 'day')) {
      return true;
    }

    return false;
  };

  // 테이블 컬럼 정의
  // 테이블 컬럼 정의
  const columns: ColumnsType<CampaignShopData> = [
    {
      title: '매장명',
      dataIndex: 'shopName',
      key: 'shopName',
      width: '25%',
      align: 'left', // 매장명은 좌측 정렬이 읽기 편합니다
    },
    {
      title: '시작일',
      dataIndex: 'startDate',
      key: 'startDate',
      width: '25%',
      render: (text: string, record: CampaignShopData) => {
        return isEditing(record) ? (
          <Form.Item
            name="startDate"
            style={{ margin: 0 }}
            rules={[{ required: false, message: '시작일을 입력하세요!' }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
              disabledDate={disabledDate}
              onChange={(date) => {
                const endDate = form.getFieldValue('endDate');
                if (date && endDate && date.isAfter(endDate, 'day')) {
                  form.setFieldsValue({ endDate: null });
                }
              }}
            />
          </Form.Item>
        ) : (
          text
        );
      },
    },
    {
      title: '종료일',
      dataIndex: 'endDate',
      key: 'endDate',
      width: '25%',
      render: (text: string, record: CampaignShopData) => {
        return isEditing(record) ? (
          <Form.Item
            name="endDate"
            style={{ margin: 0 }}
            rules={[{ required: false, message: '종료일을 입력하세요!' }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
              disabledDate={disabledEndDate}
            />
          </Form.Item>
        ) : (
          text
        );
      },
    },
    {
      title: '관리', // Action을 한국어로 변경
      key: 'action',
      width: '10%',
      align: 'center',
      render: (_: unknown, record: CampaignShopData) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Tooltip title="저장">
              <Button
                type="text"
                onClick={() => save(record.shopSeq)}
                icon={<SaveOutlined />}
              />
            </Tooltip>
            <Tooltip title="취소">
              <Button type="text" onClick={cancel} icon={<CloseOutlined />} />
            </Tooltip>
          </Space>
        ) : (
          <Tooltip title="수정">
            <Button
              type="text"
              disabled={editingKey !== ''}
              icon={<EditOutlined />}
              onClick={() => edit(record)}
            />
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Container>
      {/* 2. 매장별 집행 기간 카드 */}
      <StyledCard title="② 매장별 집행 기간">
        <Form form={form} component={false}>
          {/* 이전 단계와 통일된 다크 블루 헤더 테이블 적용 */}
          <StyledTable
            columns={columns}
            dataSource={schedules}
            pagination={{
              current: currentPage,
              pageSize,
              total: schedules.length,
              showTotal: (total) => `총 ${total}건`,
              placement: ['bottomEnd'],
              showSizeChanger: true,
              onChange: (page, size) => {
                setCurrentPage(page);
                if (size) {
                  setPageSize(size);
                }
              },
            }}
            rowKey="shopSeq"
            size="middle"
          />
        </Form>

        <InfoAlertBox>
          <Text style={{ color: '#0958d9', fontSize: '13px' }}>
            매장 집행 기간이 설정된 경우 캠페인 전체 집행 기간 보다 우선
            적용됩니다.
          </Text>
        </InfoAlertBox>
      </StyledCard>
    </Container>
  );
};

export default CampaignSchedule;
