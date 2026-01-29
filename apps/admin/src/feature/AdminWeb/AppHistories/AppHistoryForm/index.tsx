import { useState, useRef, useEffect } from 'react';
import { Calender } from '@repo/ui/components';
import { CalendarMonthIcon, CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { toast } from '@repo/feature/utils';
import { formatDateTime } from '@repo/util/date';
import type { TAppType } from '@repo/api/types';
import * as S from './appHistoryForm.style';
import type { AppHistoriesFormData } from '../constants';
import { Input, Dropdown, Button } from '@/feature/AdminWeb/components';

type Mode = 'create' | 'edit' | 'detail';

interface Props {
  mode: Mode;
  formData: AppHistoriesFormData;
  updateFormData: (updates: Partial<AppHistoriesFormData>) => void;
  apkFile?: File | null;
  onSelectApkClick?: () => void;
  onRemoveApk?: () => void;
}

const TYPE_OPTIONS: Array<{ value: TAppType; label: string }> = [
  { value: 'MENU', label: 'MENU' },
  { value: 'POS_APP', label: 'POS_APP' },
  { value: 'AGENT', label: 'AGENT' },
];

// 0-23시 옵션 생성
const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => ({
  value: String(i).padStart(2, '0'),
  label: `${String(i).padStart(2, '0')}시`,
}));

// 10분 단위 분 옵션 생성 (00, 10, 20, 30, 40, 50)
const MINUTE_OPTIONS = Array.from({ length: 6 }, (_, i) => {
  const minute = i * 10;
  return {
    value: String(minute).padStart(2, '0'),
    label: `${String(minute).padStart(2, '0')}분`,
  };
});

export const AppHistoryForm = ({
  mode,
  formData,
  updateFormData,
  apkFile,
  onSelectApkClick,
  onRemoveApk,
}: Props) => {
  const [showCalender, setShowCalender] = useState<boolean>(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // deployDateTime에서 날짜 부분만 추출 (YYYY-MM-DD 형식)
  const getDateOnly = (dateTime: string) => {
    if (!dateTime) {
      return '';
    }
    // formatDateTime을 사용하여 날짜 부분만 추출
    return formatDateTime(dateTime, 'YYYY-MM-DD');
  };

  // deployDateTime에서 시간 부분만 추출 (HH 형식, 없으면 null)
  const getHourOnly = (dateTime: string): string | null => {
    if (!dateTime) {
      return null;
    }
    // "YYYY-MM-DD" 형식인지 확인 (시간 부분이 없으면 null 반환)
    // 시간 부분이 있으면 "YYYY-MM-DD HH:mm:ss" 형식이어야 함
    const parts = dateTime.split(' ');
    if (parts.length < 2) {
      return null; // 시간 부분이 없음
    }
    // formatDateTime을 사용하여 시간 부분만 추출
    const hour = formatDateTime(dateTime, 'HH');
    return hour || null;
  };

  // deployDateTime에서 분 부분만 추출 (mm 형식, 없으면 null)
  const getMinuteOnly = (dateTime: string): string | null => {
    if (!dateTime) {
      return null;
    }
    // "YYYY-MM-DD" 형식인지 확인 (시간 부분이 없으면 null 반환)
    const parts = dateTime.split(' ');
    if (parts.length < 2) {
      return null; // 시간 부분이 없음
    }
    // formatDateTime을 사용하여 분 부분만 추출
    const minute = formatDateTime(dateTime, 'mm');
    return minute || null;
  };

  // 날짜, 시간, 분을 조합하여 deployDateTime 생성
  const combineDateTime = (
    date: string,
    hour: string | null,
    minute: string | null = null
  ) => {
    if (!date) {
      return '';
    }
    if (!hour) {
      return date; // 시간이 없으면 날짜만 반환
    }
    const hourValue = hour.padStart(2, '0');
    const minuteValue = minute ? minute.padStart(2, '0') : '00';
    return `${date} ${hourValue}:${minuteValue}:00`;
  };

  const handleDateSelect = (startDate: string, _endDate: string) => {
    // 날짜 선택 시 기존에 선택된 시간과 분을 유지
    const currentHour = getHourOnly(formData.deployDateTime);
    const currentMinute = getMinuteOnly(formData.deployDateTime);
    if (currentHour) {
      const dateTime = combineDateTime(startDate, currentHour, currentMinute);
      updateFormData({ deployDateTime: dateTime });
    } else {
      // 시간이 없으면 날짜만 설정 (시간은 미선택)
      updateFormData({ deployDateTime: startDate });
    }
    setShowCalender(false);
  };

  const handleHourDropdownClick = (e: React.MouseEvent) => {
    const currentDate = getDateOnly(formData.deployDateTime);
    if (!currentDate) {
      e.preventDefault();
      e.stopPropagation();
      toast('날짜 먼저 선택하세요.');
    }
  };

  const handleHourChange = (hour: string | number) => {
    // 기존 날짜와 분 유지하면서 시간만 업데이트
    const currentDate = getDateOnly(formData.deployDateTime);
    if (!currentDate) {
      return;
    }
    const currentMinute = getMinuteOnly(formData.deployDateTime);
    const dateTime = combineDateTime(currentDate, String(hour), currentMinute);
    updateFormData({ deployDateTime: dateTime });
  };

  const handleMinuteDropdownClick = (e: React.MouseEvent) => {
    const currentDate = getDateOnly(formData.deployDateTime);
    const currentHour = getHourOnly(formData.deployDateTime);
    if (!currentDate || !currentHour) {
      e.preventDefault();
      e.stopPropagation();
      toast('날짜와 시간을 먼저 선택하세요.');
    }
  };

  const handleMinuteChange = (minute: string | number) => {
    // 기존 날짜와 시간 유지하면서 분만 업데이트
    const currentDate = getDateOnly(formData.deployDateTime);
    const currentHour = getHourOnly(formData.deployDateTime);
    if (!currentDate || !currentHour) {
      return;
    }
    const dateTime = combineDateTime(currentDate, currentHour, String(minute));
    updateFormData({ deployDateTime: dateTime });
  };

  const displayDate = getDateOnly(formData.deployDateTime);
  const isDateSelected = !!displayDate;

  const selectedHour = getHourOnly(formData.deployDateTime);
  const selectedMinute = getMinuteOnly(formData.deployDateTime);
  const isHourSelected = !!selectedHour;
  const calendarStartDate = displayDate || '';
  const isReadOnly = mode === 'detail';

  // detail 모드일 때 textarea 높이를 내용에 맞게 자동 조절
  useEffect(() => {
    if (isReadOnly && textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [formData.content, isReadOnly]);

  return (
    <>
      <S.Container>
        <S.Section>
          <S.FormContent>
            <S.FieldGroup>
              <S.Label>
                구분 <span>*</span>
              </S.Label>
              <Dropdown
                options={TYPE_OPTIONS}
                value={formData.type}
                onChange={(value) =>
                  updateFormData({ type: value as TAppType })
                }
                disabled={isReadOnly}
              />
            </S.FieldGroup>

            <S.FieldGroup>
              <S.Label>
                제목 <span>*</span>
              </S.Label>
              <Input
                placeholder="제목을 입력하세요"
                value={formData.title}
                onChange={(value) => updateFormData({ title: value })}
                disabled={isReadOnly}
              />
            </S.FieldGroup>

            <S.FieldGroup>
              <S.Label>
                배포일시 <span>*</span>
              </S.Label>
              {isReadOnly ? (
                <Input
                  placeholder="배포일시"
                  value={formData.deployDateTime}
                  onChange={() => {
                    // readOnly
                  }}
                  disabled
                />
              ) : (
                <S.DateTimeContainer>
                  <S.CalendarButton
                    type="button"
                    onClick={() => setShowCalender(true)}
                  >
                    <CalendarMonthIcon
                      width={16}
                      height={16}
                      color={theme.colors.grey[700]}
                    />
                    <S.CalendarText>
                      {displayDate || '날짜 선택'}
                    </S.CalendarText>
                  </S.CalendarButton>
                  <S.HourDropdownWrapper onClick={handleHourDropdownClick}>
                    <Dropdown
                      options={HOUR_OPTIONS}
                      value={selectedHour}
                      onChange={handleHourChange}
                      disabled={isReadOnly || !isDateSelected}
                      placeholder="시간 선택"
                    />
                  </S.HourDropdownWrapper>
                  <S.MinuteDropdownWrapper onClick={handleMinuteDropdownClick}>
                    <Dropdown
                      options={MINUTE_OPTIONS}
                      value={selectedMinute}
                      onChange={handleMinuteChange}
                      disabled={
                        isReadOnly || !isDateSelected || !isHourSelected
                      }
                      placeholder="분 선택"
                    />
                  </S.MinuteDropdownWrapper>
                </S.DateTimeContainer>
              )}
            </S.FieldGroup>

            <S.FieldGroup>
              <S.Label>
                버전 <span>*</span>
              </S.Label>
              <Input
                placeholder="버전을 입력하세요 (예: 1.2.3)"
                value={formData.version}
                onChange={(value) => updateFormData({ version: value })}
                disabled={isReadOnly}
              />
            </S.FieldGroup>

            <S.FieldGroup>
              <S.Label>
                내용 <span>*</span>
              </S.Label>
              <S.TextArea
                ref={textAreaRef}
                placeholder="내용을 입력하세요"
                value={formData.content}
                onChange={(e) => updateFormData({ content: e.target.value })}
                disabled={isReadOnly}
                isDetail={isReadOnly}
              />
            </S.FieldGroup>

            {mode === 'detail' && (
              <S.FieldGroup>
                <S.Label>
                  APP 파일명 <span>*</span>
                </S.Label>
                <Input
                  placeholder="업로드된 파일 없음"
                  value={
                    formData.downloadPath?.replace(/^.*\//, '') ||
                    '업로드된 파일 없음'
                  }
                  disabled
                />
              </S.FieldGroup>
            )}

            {(mode === 'create' || mode === 'edit') && (
              <S.FieldGroup>
                <S.Label>
                  APP 업로드 <span>*</span>
                </S.Label>
                <S.ApkUploadRow>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onSelectApkClick}
                    disabled={!!apkFile}
                  >
                    파일 선택
                  </Button>
                  <S.ApkFileNameGroup>
                    <S.ApkFileName>
                      {apkFile
                        ? apkFile.name
                        : mode === 'edit' && formData.downloadPath
                          ? formData.downloadPath.replace(/^.*\//, '')
                          : '선택된 파일 없음'}
                    </S.ApkFileName>
                    {apkFile && (
                      <S.ApkRemoveButton
                        type="button"
                        onClick={onRemoveApk}
                        aria-label="선택한 파일 제거"
                      >
                        <CloseIcon
                          width={18}
                          height={18}
                          color={theme.colors.grey[600]}
                        />
                      </S.ApkRemoveButton>
                    )}
                  </S.ApkFileNameGroup>
                </S.ApkUploadRow>
                <S.ApkHint>APK 파일을 업로드 해주세요.</S.ApkHint>
              </S.FieldGroup>
            )}

            {(mode === 'edit' || mode === 'detail') && (
              <S.HorizontalLayout>
                <S.FieldGroup>
                  <S.Label>최초 등록일시</S.Label>
                  <Input
                    placeholder="최초 등록일시"
                    value={formData.createdAt || ''}
                    onChange={() => {
                      // readOnly
                    }}
                    disabled
                  />
                </S.FieldGroup>
                <S.FieldGroup>
                  <S.Label>마지막 수정일시</S.Label>
                  <Input
                    placeholder="마지막 수정일시"
                    value={formData.updatedAt || ''}
                    onChange={() => {
                      // readOnly
                    }}
                    disabled
                  />
                </S.FieldGroup>
              </S.HorizontalLayout>
            )}
          </S.FormContent>
        </S.Section>
      </S.Container>

      {showCalender && !isReadOnly && (
        <Calender
          type="single"
          onClose={() => setShowCalender(false)}
          startDate={calendarStartDate}
          endDate={calendarStartDate}
          onSelectDate={handleDateSelect}
          beforeYears={1}
          afterYears={1}
        />
      )}
    </>
  );
};
