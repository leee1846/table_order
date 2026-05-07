import { SystemControl, CapacitorApp } from '@repo/util/app';
import { useCallback, useEffect, useState } from 'react';
import { openConfirmDialog } from '../utils/dialog';

const REMOTE_SUPPORT_PACKAGE_NAME = 'net.koino.anysupportMobileCustomize';
const REMOTE_SUPPORT_MIN_BUILD = 26;

const getErrorMessage = (error: unknown) => {
  return error instanceof Error && error.message.length > 0
    ? error.message
    : null;
};

export const useRemoteSupport = (t: (key: string) => string) => {
  const [isRemoteSupportVisible, setIsRemoteSupportVisible] = useState(false);

  // TODO: POC 매장 테스트 중 플러그인 추가로 버전 확인 로직을 임시 적용함. 테스트 종료 후 제거 예정.
  useEffect(() => {
    const loadAppInfo = async () => {
      const appInfo = await CapacitorApp.getInfo();
      const build = Number(appInfo?.build);
      setIsRemoteSupportVisible(
        Number.isFinite(build) && build > REMOTE_SUPPORT_MIN_BUILD
      );
    };

    void loadAppInfo();
  }, []);

  const openRemoteSupport = useCallback(async () => {
    try {
      await SystemControl.openPackage({
        packageName: REMOTE_SUPPORT_PACKAGE_NAME,
      });
    } catch (error) {
      openConfirmDialog({
        title: t('오류'),
        content: getErrorMessage(error) ?? t('원격지원을 실행할 수 없습니다.'),
      });
    }
  }, [t]);

  return { isRemoteSupportVisible, openRemoteSupport };
};
