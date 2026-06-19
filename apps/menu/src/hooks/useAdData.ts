import { useEffect, useState } from 'react';
import type { IGetMenuAdFile } from '@repo/api/types';
import { useGetMenuAdFiles } from '@repo/api/queries';
import { useShopStore } from '@/stores/useShopStore';
import { useAdStore } from '@/stores/useAdStore';
import { AdStorage, getAdObjectUrl } from '@repo/util/app';

/** 태블릿 첫 부팅 시 Capacitor 엔진 준비 대기 후 광고 API 요청 */
const NATIVE_AD_FETCH_DELAY_MS = 5000;

/** 앱 세션(프로세스) 내 최초 1회만 부팅 지연 적용 — 이후 페이지 재진입 시 즉시 fetch */
let isInitialAdFetchDelayDone = false;

/** AdStorage에 내려받아 재생하는 광고 adType */
const VIDEO_AD_TYPES = new Set<string>([
  'STANDBY_VIDEO',
  'ORDER_COMP_FULL_VIDEO',
]);

const isVideoAdFile = (file: IGetMenuAdFile): boolean =>
  VIDEO_AD_TYPES.has(file.adType);

/** 네이티브 저장 파일명 — filePath URL의 마지막 세그먼트 (전체 URL을 키로 쓰면 ENOENT) */
const storageFileNameFromFilePath = (filePath: string): string | null => {
  const name = filePath.split('/').pop();
  return name && name.length > 0 ? name : null;
};

const currentVideoStorageNames = (files: IGetMenuAdFile[]): Set<string> => {
  const names = new Set<string>();
  for (const file of files) {
    if (!isVideoAdFile(file)) {
      continue;
    }
    const name = storageFileNameFromFilePath(file.filePath);
    if (name) {
      names.add(name);
    }
  }
  return names;
};

const fileNamesFromList = (files: { fileName: string }[]): Set<string> =>
  new Set(files.map((f) => f.fileName));

/**
 * stale 삭제 후, 디스크에 남아 있는 광고 파일명 집합을 반환한다.
 */
const removeStaleAdVideos = async (
  wantedNames: Set<string>
): Promise<Set<string>> => {
  try {
    const { files: before } = await AdStorage.listAds();

    const stale = before.filter((f) => !wantedNames.has(f.fileName));

    for (const f of stale) {
      try {
        await AdStorage.deleteAd({ fileName: f.fileName });
      } catch {
        // noop
      }
    }

    const { files: after } = await AdStorage.listAds();
    return fileNamesFromList(after);
  } catch {
    return new Set();
  }
};

const registerLocalVideoUrl = async (
  filePath: string,
  storageName: string,
  setLocalVideoUrl: (filePathKey: string, url: string) => void
): Promise<void> => {
  // 이미 유효한 Blob URL을 가진 영상은 재생성하지 않음 (재조회 때 불필요한 영상 리로드 방지)
  const existing = useAdStore.getState().data.localVideoUrls[filePath];
  if (existing?.startsWith('blob:')) {
    return;
  }
  // 1순위: 파일을 직접 읽어 Blob URL 사용 (HTTP 스트리밍의 data source 오류 우회)
  const objectUrl = await getAdObjectUrl(storageName);
  if (objectUrl) {
    setLocalVideoUrl(filePath, objectUrl);
    return;
  }
  // 폴백: Blob 생성 실패 시 기존 로컬 URL(_capacitor_file_) 사용
  const { url } = await AdStorage.getAdUrl({ fileName: storageName });
  if (url) {
    setLocalVideoUrl(filePath, url);
  }
};

/**
 * 광고 파일 데이터를 로드하고 영상을 AdStorage에 두고 로컬 URL을 등록한다.
 */
export const useAdData = () => {
  // 태블릿 첫 실행 시 광고 파일 다운로드 로딩 상태
  const [isMenuAdFilesLoading, setIsMenuAdFilesLoading] = useState(true);
  const [canFetchAdFiles, setCanFetchAdFiles] = useState(
    () => isInitialAdFetchDelayDone
  );

  useEffect(() => {
    if (isInitialAdFetchDelayDone) {
      return;
    }

    const timerId = setTimeout(() => {
      isInitialAdFetchDelayDone = true;
      setCanFetchAdFiles(true);
    }, NATIVE_AD_FETCH_DELAY_MS);

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  const { data: shopData } = useShopStore();
  const shopCode = shopData?.shopCode ?? '';

  const { setAdFiles, setLocalVideoUrl, setAdDataLoading } = useAdStore();

  const { data: apiData } = useGetMenuAdFiles(shopCode, {
    enabled: !!shopCode && canFetchAdFiles,
  });

  useEffect(() => {
    if (apiData === undefined) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      const files = apiData.data ?? [];
      const hasAdFiles = files.length > 0;

      setAdDataLoading(hasAdFiles);

      const videoFiles = files.filter(isVideoAdFile);

      const wantedStorageNames = currentVideoStorageNames(files);

      const namesOnDisk = await removeStaleAdVideos(wantedStorageNames);

      for (const file of videoFiles) {
        if (cancelled) {
          return;
        }

        const storageName = storageFileNameFromFilePath(file.filePath);
        if (!storageName) {
          continue;
        }

        try {
          if (namesOnDisk.has(storageName)) {
            if (cancelled) {
              return;
            }
            await registerLocalVideoUrl(
              file.filePath,
              storageName,
              setLocalVideoUrl
            );
            continue;
          }

          const dl = await AdStorage.downloadAd({
            url: file.filePath,
            fileName: storageName,
            overwrite: false,
          });

          if (!dl.success && !dl.skipped) {
            continue;
          }

          namesOnDisk.add(storageName);

          if (cancelled) {
            return;
          }

          await registerLocalVideoUrl(
            file.filePath,
            storageName,
            setLocalVideoUrl
          );
        } catch {
          // noop
        }
      }

      if (cancelled) {
        return;
      }

      // 다운로드·검증 완료 후 유효 항목만 store에 반영
      // 영상: localVideoUrl 등록 성공한 것만 / 이미지: filePath가 있는 것만
      const { localVideoUrls } = useAdStore.getState().data;
      const validFiles = files.filter((f) =>
        isVideoAdFile(f) ? !!localVideoUrls[f.filePath] : !!f.filePath?.trim()
      );
      await setAdFiles(validFiles);

      if (hasAdFiles) {
        setAdDataLoading(false);
      }
    };

    void (async () => {
      await run();
      setIsMenuAdFilesLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [apiData, setAdFiles, setLocalVideoUrl, setAdDataLoading]);

  return { isMenuAdFilesLoading };
};
