import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Form, Typography, Button, message, DatePicker, Card, App } from 'antd';
import dayjs from 'dayjs';
import ContentTypes, { initialFiles } from './ContentTypes';
import StoreGroupSelection from './StoreGroupSelection';
import PageTitle from '@/feature/Backoffice/components/PageTitle';
import ConfirmAndSave from './ConfirmAndSave';
import BasicInfoForm from './BasicInfoForm';
import {
  initialMenuItems,
  type MenuItem,
} from './ContentTypes/TopMenuAdExposure';
import type { UploadedFile } from './UploadContent';
import CampaignSchedule from './CampaignSchedule';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Text } = Typography;

// BasicInfoForm에서 전달될 값들의 타입 정의 (예시)
interface BasicInfoFormValues {
  campaignName: string;
  campaignType: string;
  overallStartDate?: dayjs.Dayjs | null;
  overallEndDate?: dayjs.Dayjs | null;
  [key: string]: unknown; // BasicInfoForm에 추가될 수 있는 다른 필드들을 위해 유연하게 정의
}

// --- Emotion Styles ---
const Container = styled.div`
  padding: 40px;
  background-color: #f4f7fa;
  min-height: 100%;
`;

// 커스텀 스텝 네비게이션 스타일
const StepContainer = styled.div`
  display: flex;
  gap: 4px; /* 스텝 사이 간격 */
  margin-bottom: 24px;
  flex-shrink: 0;
`;

const StepBlock = styled.div<{ active?: boolean }>`
  flex: 1;
  text-align: center;
  padding: 16px 0;
  font-size: 15px;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  color: ${(props) => (props.active ? '#ffffff' : '#8c8c8c')};
  background-color: ${(props) =>
    props.active ? '#003399' : '#e2e8f0'}; /* 활성 시 캡스 컬러 */
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.active ? '#003399' : '#cbd5e1')};
  }
`;

// 폼 영역 스타일
const FormWrapper = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border-top: 2px solid #e2e8f0;
`;

const DescriptionText = styled(Text)`
  display: block;
  font-size: 16px;
  color: #595959;
  margin-bottom: 40px;
`;

// --- Constants ---
const STEPS = [
  '① 기본 정보',
  '② 유형별 콘텐츠',
  '③ 매장/그룹',
  '④ 스케줄',
  '⑤ 확인 및 저장',
];

const CampaignNewPagePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  // --- 각 하위 컴포넌트들의 상태를 부모로 끌어올림 ---
  const [filesByTab, setFilesByTab] = useState<Record<string, UploadedFile[]>>({
    '0': initialFiles, // 전면 대기 화면
    '1': [], // 상단 배너
    '2': [], // 메뉴 상단 노출
    '3': [], // 주문 완료 화면
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [exposureType, setExposureType] = useState<'full' | 'half'>('full');
  const [orderFiles, setOrderFiles] = useState<UploadedFile[]>([]);

  // --- 매장/그룹 선택 상태 ---
  const [selectedGroups, setSelectedGroups] = useState<string[]>(['g1', 'g2']);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([
    '1',
    '2',
    '3',
    '4',
  ]);

  const mode = id ? 'edit' : 'new';

  const onFinish = async (values: BasicInfoFormValues) => {
    // "다음" 버튼 클릭 시: 유효성 검사 없이 다음 스텝으로 이동
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // "저장" 버튼 클릭 시 (마지막 스텝): 필수 항목 유효성 검사 및 데이터 제출
    try {
      // `validateFields`는 Form.Item에 정의된 rules를 기반으로 검사합니다.
      //await form.validateFields(['campaignName', 'overallStartDate']);

      message.loading({
        content: '캠페인을 저장하는 중입니다...',
        key: 'save',
      });

      const formData = new FormData();

      // 1. 기본 정보 (Form 데이터) 추가
      Object.entries(values || {}).forEach(([key, value]) => {
        if (key === 'overallStartDate' || key === 'campaignName') {
          if (!value) {
            message.error({
              content: '캠페인명과 시작일은 필수 항목입니다.',
              key: 'save',
            });
            throw '캠페인명과 시작일은 필수 항목입니다.';
          }
        }

        if (dayjs.isDayjs(value)) {
          // dayjs 객체는 'YYYY-MM-DD' 형식으로 변환
          formData.append(key, (value as dayjs.Dayjs).format('YYYY-MM-DD'));
        } else if (
          value === null &&
          (key === 'overallStartDate' || key === 'overallEndDate')
        ) {
          // 날짜가 null(선택 안됨)인 경우 빈 문자열로 추가
          formData.append(key, '');
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // 2. 캠페인 콘텐츠 (State 데이터) 추가
      formData.append('exposureType', exposureType);
      formData.append('menuItems', JSON.stringify(menuItems));
      formData.append('selectedGroups', JSON.stringify(selectedGroups));
      formData.append('selectedRowKeys', JSON.stringify(selectedRowKeys));

      // 3. 탭별 파일 데이터 추가
      Object.entries(filesByTab).forEach(([tabKey, files]) => {
        files.forEach((fileItem) => {
          if (fileItem.originFileObj) {
            formData.append(`files_${tabKey}`, fileItem.originFileObj);
          }
          formData.append(`filesMeta_${tabKey}`, JSON.stringify(fileItem));
        });
      });

      // 4. 주문 완료 화면 파일 데이터 추가
      orderFiles.forEach((fileItem) => {
        if (fileItem.originFileObj) {
          formData.append(`orderFiles`, fileItem.originFileObj);
        }
        formData.append(`orderFilesMeta`, JSON.stringify(fileItem));
      });

      console.log('🚀 API로 전송할 FormData 엔트리 확인:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // TODO: 실제 API 호출 로직으로 교체
      // await axios.post('/api/campaigns', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      // });
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (mode === 'new') {
        // TODO: 등록 API 호출
        message.success('캠페인이 등록되었습니다.');
      } else {
        // TODO: 수정 API 호출
        message.success('캠페인이 수정되었습니다.');
      }
      navigate(-1); // 이전 목록 페이지로 이동
    } catch (error) {
      // antd의 validateFields는 유효성 검사 실패 시 에러를 발생시킵니다.
      console.error('Final Validation or API Error:', error);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    console.log(mode, '>>>>>>>>>>>>>>', id);
    if (mode === 'edit') {
      // TODO: id를 이용해 API 호출 후 폼 데이터 초기화
      // 예시:
      // fetchCampaignDetail(id).then(data => {
      //   form.setFieldsValue(data);
      // });
    }
  }, [id, mode, form]);

  return (
    <Container>
      <PageTitle
        title="캠페인 관리"
        subtitle={mode === 'edit' ? '수정' : '등록'}
      />
      {/* 1. 상단 스텝 네비게이션 */}
      <StepContainer>
        {STEPS.map((step, index) => (
          <StepBlock
            key={step}
            active={currentStep === index}
            onClick={() => setCurrentStep(index)} // 필요시 클릭으로 스텝 이동 막을 수 있음
          >
            {step}
          </StepBlock>
        ))}
      </StepContainer>

      {/* 2. 메인 폼 영역 */}
      <FormWrapper>
        <Form
          form={form}
          layout="horizontal"
          onFinish={onFinish}
          // 라벨을 왼쪽, 입력창을 오른쪽에 배치하기 위한 비율 설정
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          labelAlign="left"
          colon={false} // 라벨 뒤에 콜론(:) 숨기기
        >
          {/* 현재 스텝이 '기본 정보'일 때만 렌더링 */}
          <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
            <BasicInfoForm form={form} mode={mode} />
          </div>
          {/* 현재 스텝이 '유형별 콘텐츠'일 때만 렌더링 */}
          <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
            <ContentTypes
              filesByTab={filesByTab}
              setFilesByTab={setFilesByTab}
              menuItems={menuItems}
              setMenuItems={setMenuItems}
              exposureType={exposureType}
              setExposureType={setExposureType}
              orderFiles={orderFiles}
              setOrderFiles={setOrderFiles}
            />
          </div>
          <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
            <StoreGroupSelection
              selectedGroups={selectedGroups}
              setSelectedGroups={setSelectedGroups}
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
            />
          </div>

          {currentStep === 3 && (
            <>
              {/* 1. 캠페인 전체 집행 기간 카드 */}
              <StyledCard title="① 캠페인 전체 집행 기간 (상위 — 필수)">
                <FormRow>
                  <FormLabel>
                    시작일 <span className="required">*</span>
                  </FormLabel>
                  <Form.Item
                    name="overallStartDate"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: '캠페인 시작일을 입력해주세요!',
                    //   },
                    // ]}
                    style={{ marginBottom: 0 }}
                  >
                    <DatePicker
                      format="YYYY-MM-DD"
                      style={{ width: '400px' }}
                      placeholder="2026-06-01"
                      size="large"
                    />
                  </Form.Item>
                </FormRow>

                <FormRow>
                  <FormLabel>종료일</FormLabel>
                  <Form.Item name="overallEndDate" style={{ marginBottom: 0 }}>
                    <DatePicker
                      format="YYYY-MM-DD"
                      style={{ width: '400px' }}
                      placeholder="2026-08-31"
                      size="large"
                    />
                  </Form.Item>
                </FormRow>
              </StyledCard>
              <CampaignSchedule />
            </>
          )}
          {currentStep === 4 && <ConfirmAndSave />}
          {/* 하단 버튼 영역 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              marginTop: '40px',
            }}
          >
            {currentStep > 0 && currentStep !== 4 && (
              <Button
                onClick={handlePrev}
                size="large"
                style={{ width: '120px' }}
              >
                이전
              </Button>
            )}
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ backgroundColor: '#003399', width: '120px' }}
            >
              {currentStep !== 4 ? '다음' : '저장'}
            </Button>
          </div>
        </Form>
      </FormWrapper>
    </Container>
  );
};

export default CampaignNewPagePage;

// --- Emotion Styles for FormRow and FormLabel (moved from CampaignSchedule.tsx) ---
const FormRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FormLabel = styled.div`
  width: 120px;
  font-size: 14px;
  color: #262626;
  font-weight: 500;

  .required {
    color: #ff4d4f;
    margin-left: 4px;
  }
`;

// Card 컴포넌트 헤더 커스텀 (짙은 파란색 배경 + 흰 글씨) (moved from CampaignSchedule.tsx)
const StyledCard = styled(Card)`
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  overflow: hidden;
  margin-bottom: 24px; // Add margin between overall period card and store specific card

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
