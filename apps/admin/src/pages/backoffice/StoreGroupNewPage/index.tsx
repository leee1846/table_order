import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Table,
  Typography,
  message,
  App,
  Space,
  Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CloseOutlined,
  UploadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import PageTitle from '@/feature/Backoffice/components/PageTitle';
import { useConfirmDialog } from '@/feature/Backoffice/hooks/useConfirmDialog';
import { ROUTES } from '@/constants/routes';

const { Title, Text } = Typography;
const { TextArea } = Input;

// --- Form Data Type ---
interface StoreGroupFormValues {
  groupName: string;
  description?: string;
}

// --- Emotion Styles ---
const Container = styled.div`
  padding: 40px;
  background-color: #f4f7fa;
  min-height: 100%;
`;

const FormWrapper = styled.div`
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border-top: 2px solid #e2e8f0;
`;

const SectionTitle = styled(Title)`
  && {
    margin-top: 0;
    margin-bottom: 24px;
    color: #1d2a6d;
    font-size: 16px;
  }
`;

// --- Mock Data ---
interface StoreType {
  key: string;
  sid: string;
  name: string;
  address: string;
}

const MOCK_STORES: StoreType[] = Array.from({ length: 15 }).map((_, i) => ({
  key: String(i + 1),
  sid: `S${String(i + 1).padStart(4, '0')}`,
  name: `테스트 매장 ${i + 1}호점`,
  address: `서울시 강남구 테스트로 ${i + 1}`,
}));

const StyledTable = styled(Table<StoreType>)`
  .ant-table-thead > tr > th {
    background-color: #1d2a6d !important;
    color: white !important;
    border-bottom: none;
  }
`;

export const StoreGroupNewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { showConfirm } = useConfirmDialog();
  const [form] = Form.useForm<StoreGroupFormValues>();
  //const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<StoreType[]>(MOCK_STORES);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const isEditMode = !!id; // id가 파라미터로 있으면 수정 모드

  console.log('isEditMode:', isEditMode);

  useEffect(() => {
    if (isEditMode) {
      // TODO: API 연동 시 id로 그룹 상세 정보 조회 후 폼 데이터 세팅
      form.setFieldsValue({
        groupName: '수정할 매장그룹 이름',
        description: '수정할 매장그룹 설명입니다.',
      });
      // 임시로 일부 매장 선택된 상태로 설정
      //setSelectedRowKeys(['1', '3', '5']);
    }
  }, [id, isEditMode, form]);

  const handleFinish = async (values: StoreGroupFormValues) => {
    if (dataSource.length === 0) {
      message.warning('최소 1개 이상의 매장이 필요합니다.');
      return;
    }

    if (!values.groupName) {
      message.warning('그룹명을 입력해주세요.');
      return;
    }

    const payload = {
      ...values,
      storeIds: dataSource.map((item) => item.key),
    };

    console.log('Submit payload:', payload);

    // TODO: 등록/수정 API 호출 로직 연결
    message.success(`매장 그룹이 ${isEditMode ? '수정' : '등록'}되었습니다.`);
    navigate(ROUTES.BACKOFFICE.STORE_GROUP.generate());
  };

  const columns: ColumnsType<StoreType> = [
    { title: '매장 코드 (SID)', dataIndex: 'sid', key: 'sid', width: 150 },
    { title: '매장명', dataIndex: 'name', key: 'name', width: 250 },
    { title: '주소', dataIndex: 'address', key: 'address' },
    {
      title: '관리',
      key: 'management',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space size={0}>
          <Tooltip title="삭제">
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => {
                setDataSource((prev) =>
                  prev.filter((item) => item.key !== record.key)
                );
                message.warning(`'${record.name}' 삭제되었습니다.`);
                // showConfirm({
                //   title: '매장 삭제',
                //   targetName: '매장',
                //   itemName: record.name,
                //   onConfirm: () => {
                //     setDataSource((prev) =>
                //       prev.filter((item) => item.key !== record.key)
                //     );
                //     setSelectedRowKeys((prev) =>
                //       prev.filter((key) => key !== record.key)
                //     );
                //     message.warning(`'${record.name}' 삭제되었습니다.`);
                //   },
                // });
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Container>
      <PageTitle
        title="매장 그룹 관리"
        subtitle={isEditMode ? '수정' : '등록'}
      />

      <FormWrapper>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          //onValuesChange={(changedValues) => console.log(changedValues)}
          //requiredMark={true}
        >
          <SectionTitle level={5}>기본 정보</SectionTitle>

          <Form.Item
            label={<Text strong>그룹명</Text>}
            name="groupName"
            required
            //rules={[{ required: true, message: '그룹명을 입력해주세요.' }]}
          >
            <Input
              placeholder="그룹명을 입력하세요"
              //size="large"
              style={{ maxWidth: 400 }}
            />
          </Form.Item>

          <Form.Item label={<Text strong>그룹 설명</Text>} name="description">
            <TextArea
              placeholder="그룹에 대한 간략한 설명을 입력하세요 (선택사항)"
              rows={4}
              style={{ maxWidth: 600, resize: 'none' }}
            />
          </Form.Item>

          <div style={{ marginTop: 40, marginBottom: 24 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: 16,
              }}
            >
              <div>
                <SectionTitle level={5} style={{ marginBottom: 8 }}>
                  매장 선택
                </SectionTitle>
                <Text type="secondary" style={{ display: 'block' }}>
                  이 그룹에 포함될 매장입니다.
                </Text>
              </div>
              <Space>
                <Button icon={<UploadOutlined />} variant="outlined">
                  엑셀 업로드
                </Button>
                <Button icon={<DownloadOutlined />} variant="outlined">
                  엑셀 다운로드
                </Button>
              </Space>
            </div>

            <StyledTable
              // rowSelection={{
              //   selectedRowKeys,
              //   onChange: (newSelectedRowKeys) =>
              //     setSelectedRowKeys(newSelectedRowKeys),
              // }}
              columns={columns}
              dataSource={dataSource}
              pagination={{
                current: currentPage,
                pageSize,
                total: MOCK_STORES.length,
                showTotal: (total) => `총 ${total}건`,
                onChange: (page, pageSize) => {
                  setCurrentPage(page);
                  setPageSize(pageSize);
                },
                placement: ['bottomEnd'],
                showSizeChanger: true,
              }}
              size="middle"
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
              marginTop: 40,
            }}
          >
            <Button
              size="large"
              onClick={() => navigate(-1)}
              style={{ width: '100px' }}
            >
              취소
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ /* backgroundColor: '#003594',  */ width: '100px' }}
            >
              {isEditMode ? '수정' : '저장'}
            </Button>
          </div>
        </Form>
      </FormWrapper>
    </Container>
  );
};
