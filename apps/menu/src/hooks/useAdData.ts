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

    const processAdFiles = async () => {
      const files = apiData.data ?? [];
      const hasAdFiles = files.length > 0;

      // 광고 항목이 있을 때만 영상 준비 로딩 오버레이 표시
      setAdDataLoading(hasAdFiles);

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
      console.log(
        'prevVideoStorageKeys!!!!!!!이전에 저장된 영상 식별자!!!!!!',
        prevVideoStorageKeys
      );

      const staleStorageKeys = prevVideoStorageKeys.filter(
        (k) => !currentVideoStorageKeys.includes(k)
      );

      console.log(
        'staleStorageKeys!!!!!!!stale 영상 식별자!!!!!!',
        staleStorageKeys
      );
      for (const staleKey of staleStorageKeys) {
        try {
          console.log(
            'removeData!!!!!!!stale 영상 식별자 삭제!!!!!!',
            staleKey
          );
          await AppStorage.removeAdMedia({ fileName: staleKey, type: 'video' });
        } catch {
          // 삭제 실패 시 무시 (다음 세션에서 재시도)
        }
      }

      // 3. 현재 영상 식별자 목록을 저장하여 재부팅 후에도 stale 영상 추적 유지
      await AppStorage.saveData({
        key: STORAGE_KEYS.AD_VIDEO_PATHS,
        value: currentVideoStorageKeys,
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
          console.log('storageFileName이름!!!!!!!', storageFileName);
          const { exists } = await AppStorage.exists({
            fileName: storageFileName,
            type: 'video',
          });
          console.log('exists!!!!!!!존재함??/', exists);
          if (!exists) {
            console.log('downloadFromUrl!!!!!!!다운로드 진행해', file.filePath);
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
          console.log('url!!!!!!!저장한거!!!!!!', url);
          // localVideoUrls key는 filePath 유지 — AdMediaSlider가 file.filePath로 조회
          setLocalVideoUrl(file.filePath, url);
        } catch {
          // 개별 영상 실패 시 해당 슬라이드는 null 렌더, 나머지 파일 처리 계속
        }
      }

      if (!cancelled && hasAdFiles) {
        setAdDataLoading(false);
      }
    };

    processAdFiles();

    return () => {
      cancelled = true;
    };
  }, [apiData, setAdFiles, setLocalVideoUrl, setAdDataLoading]);
};
