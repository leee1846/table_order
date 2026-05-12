import { useEffect } from 'react';
import { useGetMenuAdFiles } from '@repo/api/queries';
import { useShopStore } from '@/stores/useShopStore';
import { useAdStore } from '@/stores/useAdStore';
import { AppStorage } from '@repo/util/app';
import { STORAGE_KEYS } from '@/constants/keys';

/** AppStorage에 영상으로 저장·조회할 adType 목록 */
const VIDEO_AD_TYPES = ['STANDBY_VIDEO', 'ORDER_COMP_FULL_VIDEO'] as const;

/**
 * 광고 파일 데이터를 로드하고 영상을 다운로드하는 커스텀 훅
 */
export const useAdData = () => {
  const { data: shopData } = useShopStore();
  const shopCode = shopData?.shopCode ?? '';

  const { setAdFiles, setLocalVideoUrl, setAdDataLoading } = useAdStore();

  const { data: apiData } = useGetMenuAdFiles(shopCode, {
    enabled: !!shopCode,
  });

  useEffect(() => {
    // API 미응답 시 아무것도 하지 않음
    if (apiData === undefined) {
      return;
    }

    let cancelled = false;

    // API 응답이 도착했으므로 로딩 시작
    setAdDataLoading(true);

    const processAdFiles = async () => {
      const files = apiData.data ?? [];

      // 1. 전체 메타데이터 store 저장 — 이미지 광고는 이 시점부터 렌더 가능
      await setAdFiles(files);

      const videoFiles = files.filter((f) =>
        (VIDEO_AD_TYPES as readonly string[]).includes(f.adType)
      );

      const currentVideoStorageKeys = videoFiles
        .map((f) => (f.filePath as string).split('/').pop())
        .filter(Boolean) as string[];

      // 2. 이전에 저장된 영상 식별자 로드 후 stale 영상 제거
      const prevResult = await AppStorage.loadData<string[]>({
        key: STORAGE_KEYS.AD_VIDEO_PATHS,
      });
      const prevVideoStorageKeys = prevResult?.value ?? [];

      const staleStorageKeys = prevVideoStorageKeys.filter(
        (k) => !currentVideoStorageKeys.includes(k)
      );
      for (const staleKey of staleStorageKeys) {
        try {
          await AppStorage.removeData({ key: staleKey });
        } catch {
          // 삭제 실패 시 무시 (다음 세션에서 재시도)
        }
      }

      // 3. 현재 영상 식별자 목록을 세션 저장 (앱 종료 시 자동 삭제)
      await AppStorage.saveData({
        key: STORAGE_KEYS.AD_VIDEO_PATHS,
        value: currentVideoStorageKeys,
        isTemporary: true,
      });

      // 4. 영상 파일 순차 다운로드 후 로컬 URL 등록
      for (const file of videoFiles) {
        if (cancelled) {
          return;
        }

        try {
          // filePath URL의 마지막 세그먼트를 파일명으로 사용
          // (filePath 전체는 슬래시를 포함하므로 네이티브에서 ENOENT 발생)
          const storageFileName = file.filePath.split('/').pop();

          // 파일명을 추출할 수 없으면 해당 영상은 없는 광고로 간주하고 스킵
          if (!storageFileName) {
            continue;
          }

          const { exists } = await AppStorage.exists({
            fileName: storageFileName,
            type: 'video',
          });

          if (!exists) {
            await AppStorage.downloadFromUrl({
              url: file.filePath,
              fileName: storageFileName,
              type: 'video',
            });
          }

          if (cancelled) {
            return;
          }

          const { url } = await AppStorage.getLocalUrl({
            fileName: storageFileName,
            type: 'video',
          });

          // localVideoUrls key는 filePath 유지 — AdMediaSlider가 file.filePath로 조회
          setLocalVideoUrl(file.filePath, url);
        } catch {
          // 개별 영상 실패 시 해당 슬라이드는 null 렌더, 나머지 파일 처리 계속
        }
      }

      // 모든 영상 다운로드 완료 — AppStorage 전체 저장 상태 확인 후 컴포넌트 렌더 허용
      if (!cancelled) {
        console.warn('[useAdData] 광고 처리 완료 — AppStorage 저장 값 확인');
        await AppStorage.getAllData();
        setAdDataLoading(false);
      }
    };

    processAdFiles();

    return () => {
      cancelled = true;
    };
  }, [apiData, setAdFiles, setLocalVideoUrl, setAdDataLoading]);
};
