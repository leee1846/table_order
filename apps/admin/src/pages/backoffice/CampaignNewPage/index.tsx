import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Form, Button, DatePicker, Card, App } from 'antd';
import dayjs from 'dayjs';
import ContentTypes from './ContentTypes';
import StoreGroupSelection, {
  type CampaignShopData,
} from './StoreGroupSelection';
import PageTitle from '@/feature/backoffice/components/PageTitle';
import ConfirmAndSave, { type CampaignSummaryData } from './ConfirmAndSave';
import BasicInfoForm from './BasicInfoForm';
import { type MenuItem } from './ContentTypes/AdMenuContent';
import type { UploadedFile } from './ContentTypes/UploadContent';
import CampaignSchedule from './CampaignSchedule';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetCampaignDetail,
  usePatchUpdateCampaign,
  usePostCreateCampaign,
} from '@repo/api/queries';
import type { CampaignRequestJson } from '@repo/api/types';

// const { Text } = Typography;

// BasicInfoForm에서 전달될 값들의 타입 정의 (예시)
interface BasicInfoFormValues {
  campaignName: string;
  adDescription: string;
  overallStartDate?: dayjs.Dayjs | null;
  overallEndDate?: dayjs.Dayjs | null;
  [key: string]: unknown; // BasicInfoForm에 추가될 수 있는 다른 필드들을 위해 유연하게 정의
}

// KB를 MB 단위 문자열로 변환하는 유틸리티 함수
export const formatFileSizeKbToMb = (sizeInKb: number): string => {
  return `${(sizeInKb / 1024).toFixed(2)}MB`;
};

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

const FormWrapper = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border-top: 2px solid #e2e8f0;
`;

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
    '0': [], // 전면 대기 화면
    '1': [], // 상단 배너
    //'2': [], // 메뉴 상단 노출
    //'3': [], // 주문 완료 화면
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [exposureType, setExposureType] = useState<'full' | 'half'>('full');
  const [orderFiles, setOrderFiles] = useState<UploadedFile[]>([]);

  // --- 매장/그룹 선택 상태 ---
  const [campaignShops, setCampaignShops] = useState<CampaignShopData[]>([]);

  const [campaignSeq, setCampaignSeq] = useState<number | null>(null);
  const { mutateAsync: createCampaign } = usePostCreateCampaign();
  const { mutateAsync: updateCampaign } = usePatchUpdateCampaign();
  const mode = id ? 'edit' : 'new';

  const { data: campaignDetailResponse /* , isLoading: isDetailLoading */ } =
    useGetCampaignDetail(id!, {
      enabled: mode === 'edit' && !!id,
      // onSuccess: (data) => console.log('Campaign Detail:', data), // for debugging
    });

  // --- 요약 데이터 생성 ---
  const formValues = currentStep === 4 ? form.getFieldsValue() : {};

  const getAdTypeSummary = () => {
    const types = new Set<string>();
    if (filesByTab['0'] && filesByTab['0']?.length > 0) {
      types.add('주문 대기');
    }
    if (filesByTab['1'] && filesByTab['1']?.length > 0) {
      types.add('상단 배너');
    }
    if (menuItems.length > 0) {
      types.add('광고 메뉴');
    }
    if (orderFiles.length > 0) {
      types.add('주문 완료');
    }

    const summary = Array.from(types).join(' / ');
    return summary || '없음';
  };

  const getDetailedAdTypeSummary = () => {
    const summaries: string[] = [];
    if (filesByTab['0'] && filesByTab['0'].length > 0) {
      const fileNames = filesByTab['0'].map((f) => f.name).join(', ');
      summaries.push(`주문 대기 : (파일명 : ${fileNames})`);
    }
    if (filesByTab['1'] && filesByTab['1'].length > 0) {
      const fileNames = filesByTab['1'].map((f) => f.name).join(', ');
      summaries.push(`상단 배너 : (파일명 : ${fileNames})`);
    }
    if (menuItems.length > 0) {
      const fileNames = menuItems
        .map((m) => m.fileName)
        .filter(Boolean)
        .join(', ');
      summaries.push(`광고 메뉴 : (파일명 : ${fileNames})`);
    }
    if (orderFiles.length > 0) {
      const fileNames = orderFiles.map((f) => f.name).join(', ');
      summaries.push(`주문 완료 : (파일명 : ${fileNames})`);
    }
    return summaries.join('\n') || '등록된 광고 없음';
  };

  const campaignSummaryData: CampaignSummaryData = {
    name: formValues.campaignName || '-',
    type: getAdTypeSummary(),
    storeCount: `${campaignShops.length}개`,
    period: `${
      formValues.overallStartDate
        ? formValues.overallStartDate.format('YYYY-MM-DD')
        : '미지정'
    } ~ ${
      formValues.overallEndDate
        ? formValues.overallEndDate.format('YYYY-MM-DD')
        : '미지정'
    }`,
  };

  const onFinish = async (values: BasicInfoFormValues) => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    // "저장" 버튼 클릭 시 (마지막 스텝)
    if (!values.campaignName || values.campaignName.trim() === '') {
      message.error('기본 정보 단계에서 캠페인명을 입력해주세요.');
      setCurrentStep(0);
      return;
    }

    if (!values.overallStartDate) {
      message.error('스케줄 단계에서 캠페인 시작일을 지정해주세요.');
      setCurrentStep(3);
      return;
    }

    try {
      message.loading({
        content: '캠페인을 저장하는 중입니다...',
        key: 'save',
      });

      const startDateStr = values.overallStartDate
        ? values.overallStartDate.format('YYYY-MM-DD')
        : '';
      const endDateStr = values.overallEndDate
        ? values.overallEndDate.format('YYYY-MM-DD')
        : undefined;

      // 1. 기본 정보 (Form 데이터) 매핑
      const requestData: CampaignRequestJson = {
        campaignName: values.campaignName,
        campaignAlias: values.adDescription,
        startDate: startDateStr,
        endDate: endDateStr,
        advertiserName: (values.advertiserName as string) || undefined,
        campaignMemo: (values.campaignMemo as string) || undefined,
        contents: [],
        shops: [],
      };

      // 2. 캠페인 콘텐츠 메타데이터 (CampaignContent) 매핑
      const fileArray: (File | null)[] = [];
      let sortOrderAcc = 1;
      Object.entries(filesByTab).forEach(([tabKey, files]) => {
        //let sortOrderAcc = 1;
        files.forEach((fileItem) => {
          const isVideo = fileItem.originFileObj
            ? fileItem.originFileObj.type.startsWith('video/') ||
              //fileItem.originFileObj.name.toLowerCase().endsWith('.mp4') ||
              fileItem.originFileObj.name.toLowerCase().endsWith('.webm')
            : //fileItem.name.toLowerCase().endsWith('.mp4') ||
              fileItem.name.toLowerCase().endsWith('.webm');

          let adType = 'UNKNOWN';
          if (tabKey === '0') {
            adType = isVideo ? 'STANDBY_VIDEO' : 'STANDBY_IMAGE';
          } else if (tabKey === '1') {
            adType = 'TOP_BANNER_IMAGE';
          } else if (tabKey === '2') {
            adType = 'AD_MENU_IMAGE';
          }

          if (fileItem.originFileObj) {
            fileArray.push(fileItem.originFileObj);
          } else {
            fileArray.push(null);
          }

          requestData.contents!.push({
            adType,
            filePath: '', // 서버 등록 전이므로 빈 문자열
            fileName: fileItem.name || '',
            fileSizeKb: fileItem.originFileObj
              ? Math.round(fileItem.originFileObj.size / 1024)
              : Number(fileItem.fileSizeKb) || 0,
            menuGroupSeq: 0,
            contentDescription: '',
            sortOrder: sortOrderAcc++,
          });
        });
      });

      // 광고 메뉴 콘텐츠 추가
      menuItems.forEach((menuItem) => {
        if (menuItem.originFileObj) {
          fileArray.push(menuItem.originFileObj);
        } else {
          fileArray.push(null);
        }
        requestData.contents!.push({
          adType: menuItem.adType,
          filePath: menuItem.filePath,
          fileName: menuItem.fileName,
          fileSizeKb: menuItem.fileSizeKb,
          menuGroupSeq: menuItem.menuGroupSeq,
          contentDescription: menuItem.contentDescription,
          sortOrder: sortOrderAcc++,
        });
      });

      // 3. 주문 완료 화면 파일 데이터 추가
      orderFiles.forEach((fileItem) => {
        //let sortOrderAcc = 1;
        const isVideo = fileItem.originFileObj
          ? fileItem.originFileObj.type.startsWith('video/') ||
            //fileItem.originFileObj.name.toLowerCase().endsWith('.mp4') ||
            fileItem.originFileObj.name.toLowerCase().endsWith('.webm')
          : //fileItem.name.toLowerCase().endsWith('.mp4') ||
            fileItem.name.toLowerCase().endsWith('.webm');

        const orderCompAdType =
          exposureType === 'full'
            ? isVideo
              ? 'ORDER_COMP_FULL_VIDEO'
              : 'ORDER_COMP_FULL_IMAGE'
            : 'ORDER_COMP_SIDE_IMAGE';

        if (fileItem.originFileObj) {
          fileArray.push(fileItem.originFileObj);
        } else {
          fileArray.push(null);
        }
        requestData.contents!.push({
          adType: orderCompAdType,
          filePath: '',
          fileName: fileItem.originFileObj?.name || fileItem.name || '',
          fileSizeKb: fileItem.originFileObj
            ? Math.round(fileItem.originFileObj.size / 1024)
            : Number(fileItem.fileSizeKb) || 0,
          menuGroupSeq: 0,
          contentDescription: '',
          sortOrder: sortOrderAcc++,
        });
      });

      // 4. 매장/그룹 매핑 (CampaignShop)
      requestData.shops = campaignShops.map((shop) => {
        return {
          shopSeq: shop.shopSeq,
          shopGroupSeqs: shop.shopGroup.map((g) => Number(g.shopGroupSeq)),
          startDate: shop.startDate,
          endDate: shop.endDate, // 개별 기간이 없으면 전체 기간 사용
        };
      });

      if (mode === 'new') {
        await createCampaign({
          request: requestData,
          files: fileArray as File[],
        });
        message.success({ content: '캠페인이 등록되었습니다.', key: 'save' });
      } else if (campaignSeq) {
        await updateCampaign({
          campaignSeq,
          request: requestData,
          files: fileArray as File[],
        });
        message.success({
          content: '캠페인이 수정되었습니다.',
          key: 'save',
        });
      }

      // 모든 데이터 초기값으로 세팅
      form.resetFields();
      setFilesByTab({
        '0': [], // 기존 초기값 유지 (또는 필요시 빈 배열 [] 로 변경)
        '1': [],
        //'3': [],
      });
      setMenuItems([]);
      setExposureType('full');
      setOrderFiles([]);
      setCampaignShops([]);
      setCurrentStep(0); // 첫 스텝으로 이동

      // 목록으로 돌아가길 원하신다면 아래 코드를 주석 해제하세요.
      navigate(-1);
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
    if (mode !== 'edit' || !campaignDetailResponse?.data) {
      return;
    }

    const detail = campaignDetailResponse.data;
    setCampaignSeq(detail.campaignSeq);

    // 1. 기본 정보 설정
    setTimeout(() => {
      form.setFieldsValue({
        campaignName: detail.campaignName,
        adDescription: detail.campaignAlias,
        advertiserName: detail.advertiserName,
        campaignMemo: detail.campaignMemo,
        overallStartDate: detail.startDate ? dayjs(detail.startDate) : null,
        overallEndDate: detail.endDate ? dayjs(detail.endDate) : null,
      });
    }, 0);

    // 2. 콘텐츠 및 파일 설정
    const adTypeToTabKey: Record<string, string> = {
      STANDBY_VIDEO: '0',
      STANDBY_IMAGE: '0',
      TOP_BANNER_IMAGE: '1',
    };

    const newFilesByTab: Record<string, UploadedFile[]> = {
      '0': [],
      '1': [],
    };
    const newOrderFiles: UploadedFile[] = [];
    const newMenuItems: MenuItem[] = [];

    // [...detail.contents]
    //   .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    detail.contents?.forEach((content) => {
      if (content.adType === 'AD_MENU_IMAGE') {
        newMenuItems.push({
          id: content.contentSeq,
          adType: content.adType,
          filePath: content.filePath,
          fileName: content.fileName,
          fileSizeKb: content.fileSizeKb,
          menuGroupSeq: content.menuGroupSeq || 0,
          contentDescription: content.contentDescription || '',
          sortOrder: content.sortOrder,
          menuGroupName: content.menuGroupName,
        });
        return;
      }

      const uploadedFile: UploadedFile = {
        id: String(content.contentSeq), // Use contentSeq as a unique ID
        name: content.fileName,
        status: '완료',
        url: content.filePath, // This should be a full URL to the file for preview
        fileSizeKb: content.fileSizeKb, //formatFileSizeKbToMb(content.fileSizeKb),
        duration: content.durationSec ? `${content.durationSec}초` : '-',
        durationSec: content.durationSec || 0,
        sortOrder: content.sortOrder,
      };

      const tabKey = adTypeToTabKey[content.adType];
      if (tabKey) {
        newFilesByTab[tabKey]?.push(uploadedFile);
      } else if (
        [
          'ORDER_COMP_FULL_VIDEO',
          'ORDER_COMP_FULL_IMAGE',
          'ORDER_COMP_SIDE_IMAGE',
        ].includes(content.adType)
      ) {
        newOrderFiles.push(uploadedFile);
        setExposureType(content.adType.includes('FULL') ? 'full' : 'half');
      }
    });

    // 각 배열을 sortOrder에 따라 정렬
    // for (const key in newFilesByTab) {
    //   newFilesByTab[key]?.sort(
    //     (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
    //   );
    // }
    // newOrderFiles.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    setFilesByTab(newFilesByTab);
    setOrderFiles(newOrderFiles);
    setMenuItems(newMenuItems);

    // 3. 매장 및 스케줄 설정
    const shopsData: CampaignShopData[] = (detail.shops || []).map((shop) => ({
      shopSeq: shop.shopSeq,
      shopCode: shop.shopCode || '',
      shopName: shop.shopName || '',
      startDate: shop.startDate || '',
      endDate: shop.endDate || '',
      shopGroup: shop.shopGroup || [],
    }));
    setCampaignShops(shopsData);
  }, [campaignDetailResponse, form, mode]);

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
            <BasicInfoForm
              form={form}
              mode={mode}
              registeredAdTypeText={getDetailedAdTypeSummary()}
            />
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
              stores={campaignShops}
              onChange={(data) => {
                setCampaignShops(data);
              }}
            />
          </div>

          <div style={{ display: currentStep === 3 ? 'block' : 'none' }}>
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
                    placeholder="시작일"
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
                    placeholder="종료일"
                    size="large"
                  />
                </Form.Item>
              </FormRow>
            </StyledCard>
            <CampaignSchedule
              schedules={campaignShops}
              onChange={setCampaignShops}
            />
          </div>
          {currentStep === 4 && (
            <ConfirmAndSave campaignData={campaignSummaryData} />
          )}
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
