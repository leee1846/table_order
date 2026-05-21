import { useState } from 'react';
import { BasicButton, Calender } from '@repo/ui/components';
import { CalendarMonthIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import adminI18n, { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { SettingsLauncher } from '@repo/util/app';
import { openDualActionDialog, toast } from '@repo/feature/utils';
import {
  formatLocalizedDate,
  formatDateString,
  isSameOrAfter,
  isSameOrBefore,
  getTodayDateString,
} from '@repo/util/date';
import * as S from './deviceManagement.style';

export const DeviceManagement = () => {
  const { t, i18n } = useAdminTranslation();

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const handleOpenDeviceSettings = async () => {
    try {
      await SettingsLauncher.open('root');
    } catch {
      toast(t('설정 화면을 열 수 없습니다.'), {
        position: 'center-center',
        duration: 1500,
      });
    }
  };

  const sendLog = async () => {
    if (!selectedDate) {
      toast(t('날짜를 선택해주세요.'), {
        position: 'center-center',
        duration: 1500,
      });
      return;
    }

    // TODO
    // 동일 로직 admin에도 추가 (app일떄만 노출)
    // 날짜별 로그 조회 브릿지 추가 및 호출
    // 로그가 존재하지 않습니다.
    // 로그를 가져오지 못했습니다.

    openDualActionDialog({
      title: t('앱 로그 전송'),
      content: t('앱 로그를 전송하시겠습니까?'),
      primaryText: t('확인'),
      secondaryText: t('취소'),
      onConfirm: () => {
        toast(t('로그 전송을 성공하였습니다.'), {
          position: 'center-center',
          duration: 1500,
        });
      },
    });
  };

  return (
    <>
      <UIStyles.setting.Container>
        <UIStyles.setting.Header>
          <UIStyles.setting.Title>{t('디바이스 관리')}</UIStyles.setting.Title>
        </UIStyles.setting.Header>

        <UIStyles.setting.ContentsLayout>
          <UIStyles.setting.ContentLayout>
            <p>{t('시스템 설정')}</p>
            <BasicButton
              variant="Outline_Grey_M"
              onClick={handleOpenDeviceSettings}
            >
              {t('설정')}
            </BasicButton>
          </UIStyles.setting.ContentLayout>

          <UIStyles.setting.ContentLayout>
            <p>{t('앱 로그 전송')}</p>
            <S.Actions>
              <S.DateButton type="button" onClick={() => setShowCalendar(true)}>
                <CalendarMonthIcon
                  width={20}
                  height={20}
                  color={theme.colors.grey[700]}
                />
                <S.DateText $isPlaceholder={!selectedDate}>
                  {selectedDate
                    ? formatLocalizedDate(selectedDate, i18n.language)
                    : t('날짜 선택')}
                </S.DateText>
              </S.DateButton>
              <BasicButton variant="Outline_Grey_M" onClick={sendLog}>
                {t('로그 전송')}
              </BasicButton>
            </S.Actions>
          </UIStyles.setting.ContentLayout>
        </UIStyles.setting.ContentsLayout>
      </UIStyles.setting.Container>

      {showCalendar && (
        <Calender
          type="single"
          onClose={() => setShowCalendar(false)}
          startDate={selectedDate}
          endDate={selectedDate}
          onSelectDate={(date) => {
            setSelectedDate(date);
            setShowCalendar(false);
          }}
          isDateDisabled={(date, dateType) =>
            dateType === 'prev' ||
            dateType === 'next' ||
            !isSameOrBefore(date, getTodayDateString())
          }
          canNavigatePrev={(y, m) =>
            isSameOrAfter(
              formatDateString(y, m, 1),
              formatDateString(2026, 1, 1)
            )
          }
          canNavigateNext={(y, m) =>
            isSameOrBefore(formatDateString(y, m, 1), getTodayDateString())
          }
          i18nInstance={adminI18n}
        />
      )}
    </>
  );
};
