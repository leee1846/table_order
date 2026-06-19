import { useCallback, useMemo, useState } from 'react';
import adminI18n, { useAdminTranslation } from '@/config/i18n';
import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import * as UIStyles from '@repo/ui/styles';
import { BasicButton, Calender, FullscreenLoadingSpinner } from '@repo/ui/components';
import { CalendarMonthIcon, SettingsIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { usePostShopLog } from '@repo/api/queries';
import {
  LogManager,
  SettingsLauncher,
  type LogFileEntry,
} from '@repo/util/app';
import { openDualActionDialog, toast } from '@repo/feature/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  formatLocalizedDate,
  formatDateString,
  isSameOrAfter,
  isSameOrBefore,
  getYearMonthFromDate,
} from '@repo/util/date';
import * as S from './deviceManagement.style';

const TOAST_OPTIONS = {
  position: 'center-center' as const,
  duration: 1500,
};

export const DeviceManagement = () => {
  const { t, i18n } = useAdminTranslation();
  const { shopCode } = useAuth();
  const { mutateAsync: postShopLog } = usePostShopLog();

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [logFileEntries, setLogFileEntries] = useState<LogFileEntry[]>([]);
  const [datesWithLogFiles, setDatesWithLogFiles] = useState<string[]>([]);

  const logCalendarConfig = useMemo(() => {
    if (datesWithLogFiles.length === 0) {
      return null;
    }

    const sortedDates = [...datesWithLogFiles].sort();
    const earliestDate = sortedDates[0];
    const latestDate = sortedDates[sortedDates.length - 1];

    if (!earliestDate || !latestDate) {
      return null;
    }

    const { year: earliestYear, month: earliestMonth } =
      getYearMonthFromDate(earliestDate);
    const { year: latestYear, month: latestMonth } =
      getYearMonthFromDate(latestDate);

    return {
      isDateDisabled: (date: string, dateType: 'prev' | 'current' | 'next') => {
        if (dateType !== 'current') {
          return true;
        }

        return !datesWithLogFiles.includes(date);
      },
      canNavigatePrev: (year: number, month: number) =>
        isSameOrAfter(
          formatDateString(year, month, 1),
          formatDateString(earliestYear, earliestMonth, 1)
        ),
      canNavigateNext: (year: number, month: number) =>
        isSameOrBefore(
          formatDateString(year, month, 1),
          formatDateString(latestYear, latestMonth, 1)
        ),
    };
  }, [datesWithLogFiles]);

  /** 로그 목록을 조회 */
  const loadLogFileEntries = useCallback(async () => {
    const entries = await LogManager.listLogFileEntries();
    const dates = LogManager.listAvailableLogDates(entries);

    setLogFileEntries(entries);
    setDatesWithLogFiles(dates);

    return { entries, dates };
  }, []);

  const handleOpenLogCalendar = async () => {
    try {
      const { dates } = await loadLogFileEntries();

      if (dates.length === 0) {
        toast(t('전송 가능한 로그가 존재하지 않습니다.'), TOAST_OPTIONS);
        return;
      }

      setSelectedDate((currentDate) =>
        currentDate && dates.includes(currentDate)
          ? currentDate
          : (dates[dates.length - 1] ?? '')
      );
      setShowCalendar(true);
    } catch {
      toast(t('전송 가능한 로그를 불러오지 못했습니다.'), TOAST_OPTIONS);
    }
  };

  const handleSelectLogDate = (date: string) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const handleOpenDeviceSettings = async () => {
    try {
      await SettingsLauncher.open('root');
    } catch {
      toast(t('설정 화면을 열 수 없습니다.'), TOAST_OPTIONS);
    }
  };

  const [isFetchingLogFiles, setIsFetchingLogFiles] = useState(false);
  const sendLog = async () => {
    if (!selectedDate || logFileEntries.length === 0) {
      toast(t('날짜를 선택해주세요.'), TOAST_OPTIONS);
      return;
    }

    openDualActionDialog({
      title: t('앱 로그 전송'),
      content: t('앱 로그를 전송하시겠습니까?'),
      primaryText: t('확인'),
      secondaryText: t('취소'),
      onConfirm: () => {
        void (async () => {
          try {
            setIsFetchingLogFiles(true);
            let logFiles;

            try {
              logFiles = await LogManager.fetchLogFilesForDate({
                date: selectedDate,
                entries: logFileEntries,
              });
            } catch {
              toast(t('로그를 가져오는데 실패하였습니다.'), TOAST_OPTIONS);
              return;
            }

            if (logFiles.length === 0) {
              toast(t('로그가 존재하지 않습니다.'), TOAST_OPTIONS);
              return;
            }

            if (!shopCode) {
              toast(t('로그 전송에 실패하였습니다.'), TOAST_OPTIONS);
              return;
            }

            for (const file of logFiles) {
              await postShopLog({
                shopCode,
                type: 'POS_APP',
                logText: file.content,
                fileName: file.name,
              });
            }
            toast(t('로그 전송을 성공하였습니다.'), TOAST_OPTIONS);
          } catch {
            toast(t('로그 전송에 실패하였습니다.'), TOAST_OPTIONS);
          } finally {
            setIsFetchingLogFiles(false);
          }
        })();
      },
    });
  };

  return (
    <>
      {isFetchingLogFiles && <FullscreenLoadingSpinner />}

      <SectionWrapper
        title={t('디바이스 관리')}
        icon={
          <SettingsIcon
            width={32}
            height={32}
            color={theme.colors.primary[500]}
          />
        }
      >
        <UIStyles.setting.ContentLayout>
          <p>{t('시스템 설정')}</p>
          <BasicButton
            variant="Outline_Grey_M"
            onClick={handleOpenDeviceSettings}
          >
            {t('환경 설정')}
          </BasicButton>
        </UIStyles.setting.ContentLayout>

        <UIStyles.setting.ContentLayout>
          <p>{t('앱 로그 전송')}</p>
          <S.Actions>
            <S.DateButton type="button" onClick={handleOpenLogCalendar}>
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
            <BasicButton
              variant="Outline_Grey_M"
              onClick={sendLog}
              disabled={isFetchingLogFiles}
            >
              {t('로그 전송')}
            </BasicButton>
          </S.Actions>
        </UIStyles.setting.ContentLayout>
      </SectionWrapper>

      {showCalendar && logCalendarConfig && (
        <Calender
          type="single"
          onClose={() => setShowCalendar(false)}
          startDate={selectedDate}
          endDate={selectedDate}
          onSelectDate={handleSelectLogDate}
          isDateDisabled={logCalendarConfig.isDateDisabled}
          canNavigatePrev={logCalendarConfig.canNavigatePrev}
          canNavigateNext={logCalendarConfig.canNavigateNext}
          i18nInstance={adminI18n}
        />
      )}
    </>
  );
};
