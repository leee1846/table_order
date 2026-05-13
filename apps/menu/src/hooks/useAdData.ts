import { useEffect } from 'react';
import type { IGetMenuAdFile } from '@repo/api/types';
import { useGetMenuAdFiles } from '@repo/api/queries';
import { useShopStore } from '@/stores/useShopStore';
import { useAdStore } from '@/stores/useAdStore';
import { AdStorage } from '@repo/util/app';

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
    console.log('!!! 기존에 저장된 파일 목록 (stale 정리 전)', before);

    const stale = before.filter((f) => !wantedNames.has(f.fileName));
    console.log(
      '!!! 삭제 대상 (API에 없는 저장된 파일)',
      stale.map((f) => f.fileName)
    );

    for (const f of stale) {
      try {
        const del = await AdStorage.deleteAd({ fileName: f.fileName });
        console.log('!!! 삭제 결과', f.fileName, del);
      } catch {
        // noop
      }
    }

    const { files: after } = await AdStorage.listAds();
    console.log('!!! stale 정리 직후 저장된 파일 목록', after);
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
  const { url } = await AdStorage.getAdUrl({ fileName: storageName });
  if (url) {
    setLocalVideoUrl(filePath, url);
  }
};

/**
 * 광고 파일 데이터를 로드하고 영상을 AdStorage에 두고 로컬 URL을 등록한다.
 */
export const useAdData = () => {
  const { data: shopData } = useShopStore();
  const shopCode = shopData?.shopCode ?? '';

  const { setAdFiles, setLocalVideoUrl, setAdDataLoading } = useAdStore();

  const { data: apiData } = useGetMenuAdFiles(shopCode, {
    enabled: !!shopCode,
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
      await setAdFiles(files);

      const videoFiles = files.filter(isVideoAdFile);
      console.log('!!! api response 비디오 목록!!!!!!!', videoFiles);

      const wantedStorageNames = currentVideoStorageNames(files);
      console.log('!!! 저장할 파일명들', [...wantedStorageNames]);

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
            console.log('!!! list에 이미 있음 — downloadAd 생략', storageName);
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

          console.log('!!! list에 없음 — downloadAd 진행', {
            storageName,
            url: file.filePath,
          });

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

      try {
        const { files } = await AdStorage.listAds();
        console.log('!!! AdStorage 최종 파일 목록', files);
      } catch {
        // noop
      }

      if (!cancelled && hasAdFiles) {
        setAdDataLoading(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [apiData, setAdFiles, setLocalVideoUrl, setAdDataLoading]);
};
