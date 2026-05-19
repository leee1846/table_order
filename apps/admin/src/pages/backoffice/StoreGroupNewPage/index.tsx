import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Table,
  Typography,
  App,
  Space,
  Tooltip,
  Upload,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CloseOutlined,
  UploadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import PageTitle from '@/feature/backoffice/components/PageTitle';
import { ROUTES } from '@/constants/routes';
import * as XLSX from 'xlsx';
import {
  useGetStoreGroupDetail,
  usePostStoreSearch,
  useGetStoreGroupMembers,
  usePostCreateStoreGroup,
  usePutUpdateStoreGroup,
  useGetStoreGroupExcelTemplate,
} from '@repo/api/queries';
import type { IStore } from '@repo/api/types';

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

// interface StoreType {
//   shopSeq?: string | number;
//   shopCode?: string;
//   shopName?: string;
//   address1?: string;
// }

interface ExcelRowData {
  '매장 ID'?: string | number;
  [key: string]: string | number | boolean | undefined;
}

const StyledTable = styled(Table<IStore>)`
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
  const [form] = Form.useForm<StoreGroupFormValues>();
  //const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<IStore[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchShopCodes, setSearchShopCodes] = useState<string[]>([]);

  const isEditMode = !!id; // id가 파라미터로 있으면 수정 모드

  // API 연동: 매장 그룹 상세 정보 조회
  const { data: detailResponse } = useGetStoreGroupDetail(id ?? '', {
    enabled: isEditMode,
  });

  // const storeIds = detailResponse?.data?.stores || [];

  // API 연동: 매장 그룹 멤버(매장) 목록 조회 (수정 모드 시)
  const { data: membersResponse, isFetching: isMembersLoading } =
    useGetStoreGroupMembers(id ?? '', {
      enabled: isEditMode,
    });

  // API 연동: 엑셀 등에서 추가된 매장 목록 검색 조회
  const { data: searchResponse, isFetching: isSearchLoading } =
    usePostStoreSearch(
      { shopCodes: searchShopCodes, size: 100000 },
      { enabled: searchShopCodes.length > 0 }
    );

  const createMutation = usePostCreateStoreGroup();
  const updateMutation = usePutUpdateStoreGroup();
  const { mutateAsync: downloadExcelTemplate } =
    useGetStoreGroupExcelTemplate();

  useEffect(() => {
    if (isEditMode && detailResponse?.data) {
      form.setFieldsValue({
        groupName: detailResponse.data.groupName,
        description: detailResponse.data.groupDescription,
      });
    }
  }, [isEditMode, detailResponse, form]);

  useEffect(() => {
    if (isEditMode && membersResponse?.data) {
      const content = membersResponse.data.content || [];
      const mappedStores: IStore[] = content.map((store: IStore) => ({
        shopSeq: store.shopSeq,
        shopCode: store.shopCode || String(store.shopSeq || '-'),
        shopName: store.shopName || '-',
        address1: store.address1 || '-',
      }));
      setDataSource(mappedStores);
    }
  }, [isEditMode, membersResponse]);

  // 새로 검색된 매장 데이터를 테이블(dataSource)에 병합
  useEffect(() => {
    if (searchResponse?.data && searchShopCodes.length > 0) {
      const content = searchResponse.data.content || [];
      const mappedStores: IStore[] = content.map((store: IStore) => ({
        shopSeq: store.shopSeq,
        shopCode: store.shopCode || String(store.shopSeq || '-'),
        shopName: store.shopName || '-',
        address1: store.address1 || '-',
      }));

      const existingCodes = new Set(dataSource.map((p) => p.shopCode));
      const newStores = mappedStores.filter(
        (s) => !existingCodes.has(s.shopCode)
      );

      if (newStores.length > 0) {
        message.success(`${newStores.length}개의 매장을 추가했습니다.`);
      } else {
        message.warning('추가할 새로운 매장이 없습니다.');
      }

      setDataSource((prev) => [...prev, ...newStores]);
      setSearchShopCodes([]); // 처리 후 검색 코드 초기화
    }
  }, [searchResponse, searchShopCodes, dataSource, message]);

  const handleFinish = async (values: StoreGroupFormValues) => {
    if (!values.groupName) {
      message.warning('매장 그룹명을 입력해 주세요.');
      return;
    }

    if (dataSource.length === 0) {
      message.warning('최소 1개 이상의 매장이 필요합니다.');
      return;
    }

    try {
      if (isEditMode && id) {
        const updatePayload = {
          storeGroupSeq: Number(id),
          groupName: values.groupName,
          groupDescription: values.description,
          stores: dataSource.map((item) => Number(item.shopSeq)),
        };
        await updateMutation.mutateAsync(updatePayload);
      } else {
        const createPayload = {
          groupName: values.groupName,
          groupDescription: values.description,
          stores: dataSource.map((item) => String(item.shopSeq)),
        };
        await createMutation.mutateAsync(createPayload);
      }

      message.success(`매장 그룹이 ${isEditMode ? '수정' : '등록'}되었습니다.`);
      navigate(ROUTES.BACKOFFICE.STORE_GROUP.generate());
    } catch (error) {
      message.error(
        `매장 그룹 ${isEditMode ? '수정' : '등록'} 중 오류가 발생했습니다.`
      );
    }
  };

  const handleExcelUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0] || ''];
        const jsonData = XLSX.utils.sheet_to_json<ExcelRowData>(
          worksheet || []
        );

        if (jsonData.length === 0) {
          message.warning('엑셀 파일에 데이터가 없습니다.');
          return;
        }

        // 엑셀에서 추출한 매장 ID 목록의 중복을 제거
        const newShopCodes = Array.from(
          new Set(
            jsonData
              .map((row) => {
                const values = Object.values(row);
                return String(row['매장 ID'] || values[0] || '');
              })
              .filter(Boolean)
          )
        );

        if (newShopCodes.length > 0) {
          setSearchShopCodes(newShopCodes);
          //message.info(`${file.name} 파일의 매장 정보를 불러오는 중입니다...`);
        } else {
          message.warning('유효한 매장 ID가 없습니다.');
        }
      } catch (error) {
        message.error('엑셀 파일을 읽는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsArrayBuffer(file);

    return false; // antd의 자동 업로드(API 호출) 동작 방지
  };

  const handleExcelDownload = async () => {
    try {
      message.loading({
        content: '엑셀 양식 다운로드 중...',
        key: 'downloadExcelTemplate',
      });

      const blob = await downloadExcelTemplate();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `매장그룹_엑셀양식_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success({
        content: '엑셀 양식 다운로드가 완료되었습니다.',
        key: 'downloadExcelTemplate',
      });
    } catch (error) {
      message.error({
        content: '엑셀 양식 다운로드에 실패했습니다.',
        key: 'downloadExcelTemplate',
      });
    }
  };

  const columns: ColumnsType<IStore> = [
    {
      title: 'No.',
      key: 'no',
      width: 60,
      align: 'center',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: '매장 ID',
      dataIndex: 'shopCode',
      key: 'shopCode',
      width: 150,
    },
    { title: '매장명', dataIndex: 'shopName', key: 'shopName', width: 250 },
    { title: '주소', dataIndex: 'address1', key: 'address1' },
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
                  prev.filter((item) => item.shopSeq !== record.shopSeq)
                );
                message.warning(`'${record.shopName}' 삭제되었습니다.`);
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
            label={<Text strong>매장 그룹명</Text>}
            name="groupName"
            required
            //rules={[{ required: true, message: '그룹명을 입력해주세요.' }]}
          >
            <Input
              placeholder="매장 그룹명을 입력하세요"
              //size="large"
              style={{ maxWidth: 400 }}
            />
          </Form.Item>

          <Form.Item
            label={<Text strong>매장 그룹 설명</Text>}
            name="description"
          >
            <TextArea
              placeholder="매장 그룹에 대한 간략한 설명을 입력하세요 (선택사항)"
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
                  <span style={{ color: '#ff4d4f', marginLeft: 4 }}>*</span>{' '}
                  매장 선택
                </SectionTitle>
                <Text type="secondary" style={{ display: 'block' }}>
                  매장을 1개 이상 추가해 주세요.
                </Text>
              </div>
              <Space>
                <Upload
                  accept=".xlsx"
                  showUploadList={false}
                  beforeUpload={handleExcelUpload}
                >
                  <Button icon={<UploadOutlined />} variant="outlined">
                    엑셀 업로드
                  </Button>
                </Upload>
                <Button
                  icon={<DownloadOutlined />}
                  variant="outlined"
                  onClick={handleExcelDownload}
                >
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
              rowKey="shopSeq"
              loading={isMembersLoading || isSearchLoading}
              pagination={{
                current: currentPage,
                pageSize,
                total: dataSource.length,
                showTotal: (total) => `총 ${total}건`,
                placement: ['bottomEnd'],
                showSizeChanger: true,
                onChange: (page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                },
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
