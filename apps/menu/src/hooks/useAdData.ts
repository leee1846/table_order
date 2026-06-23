import { useEffect, useState } from 'react';
import type { IGetMenuAdFile } from '@repo/api/types';
import { useGetMenuAdFiles } from '@repo/api/queries';
import { useShopStore } from '@/stores/useShopStore';
import { useAdStore } from '@/stores/useAdStore';
// TODO: 제거 예정 (영상 재생 실패 추적 로그) — 제거 시 saveAppLog import 삭제
import { AdStorage, getAdObjectUrl, saveAppLog } from '@repo/util/app';

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

    // TODO: 제거 예정 (영상 재생 실패 추적 로그)
    if (stale.length > 0) {
      saveAppLog('[광고 영상 stale 삭제]', {
        deleted: stale.map((f) => f.fileName),
      });
    }

    for (const f of stale) {
      try {
        await AdStorage.deleteAd({ fileName: f.fileName });
      } catch {
        // noop
      }
    }

    const { files: after } = await AdStorage.listAds();
    return fileNamesFromList(after);
    // TODO: 제거 예정 (영상 재생 실패 추적 로그) — 제거 시 `} catch {` 로 되돌릴 것
  } catch (error) {
    saveAppLog('[광고 영상 stale 삭제 실패]', {
      message: error instanceof Error ? error.message : String(error),
    });
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
    // TODO: 제거 예정 (영상 재생 실패 추적 로그)
    saveAppLog('[광고 영상 URL 등록]', {
      fileName: storageName,
      source: 'blob-cached',
    });
    return;
  }
  // 1순위: 파일을 직접 읽어 Blob URL 사용 (HTTP 스트리밍의 data source 오류 우회)
  const objectUrl = await getAdObjectUrl(storageName);
  if (objectUrl) {
    setLocalVideoUrl(filePath, objectUrl);
    // TODO: 제거 예정 (영상 재생 실패 추적 로그)
    saveAppLog('[광고 영상 URL 등록]', {
      fileName: storageName,
      source: 'blob',
    });
    return;
  }
  // 폴백: Blob 생성 실패 시 기존 로컬 URL(_capacitor_file_) 사용
  const { url } = await AdStorage.getAdUrl({ fileName: storageName });
  if (url) {
    setLocalVideoUrl(filePath, url);
    // TODO: 제거 예정 (영상 재생 실패 추적 로그) — 제거 시 아래 saveAppLog와 return 삭제
    // (Blob 실패로 _capacitor_file_ 스트리밍 폴백 → Range 재생 끊김 위험 구간)
    saveAppLog('[광고 영상 URL 등록]', {
      fileName: storageName,
      source: 'fallback-capacitor-file',
    });
    return;
  }
  // TODO: 제거 예정 (영상 재생 실패 추적 로그) — 제거 시 아래 블록 전체 삭제
  // (Blob·폴백 모두 실패 → 영상이 슬라이드에서 제외됨)
  saveAppLog('[광고 영상 URL 등록]', {
    fileName: storageName,
    source: 'none',
  });
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

      // TODO: 제거 예정 (영상 재생 실패 추적 로그) — 제거 시 아래 saveAppLog 블록 전체 삭제
      // 응답에 어떤 영상이 내려왔는지·확장자/용량까지 추적 (재생 실패 원인 1차 단서)
      saveAppLog('[광고 데이터 응답]', {
        total: files.length,
        byType: files.reduce<Record<string, number>>((acc, f) => {
          acc[f.adType] = (acc[f.adType] ?? 0) + 1;
          return acc;
        }, {}),
        videos: videoFiles.map((f) => ({
          adType: f.adType,
          fileName: f.fileName,
          ext: f.filePath.split('.').pop()?.toLowerCase() ?? '',
          fileSizeKb: f.fileSizeKb,
          durationSec: f.durationSec,
          filePath: f.filePath,
        })),
      });

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
            // TODO: 제거 예정 (영상 재생 실패 추적 로그)
            saveAppLog('[광고 영상 다운로드]', {
              fileName: storageName,
              result: 'disk-cache',
            });
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
            // TODO: 제거 예정 (영상 재생 실패 추적 로그)
            saveAppLog('[광고 영상 다운로드 실패]', {
              fileName: storageName,
              filePath: file.filePath,
            });
            continue;
          }

          // TODO: 제거 예정 (영상 재생 실패 추적 로그)
          saveAppLog('[광고 영상 다운로드]', {
            fileName: storageName,
            result: dl.skipped ? 'skipped' : 'downloaded',
            path: dl.path,
          });

          namesOnDisk.add(storageName);

          if (cancelled) {
            return;
          }

          await registerLocalVideoUrl(
            file.filePath,
            storageName,
            setLocalVideoUrl
          );
          // TODO: 제거 예정 (영상 재생 실패 추적 로그) — 제거 시 `} catch { // noop }` 로 되돌릴 것
        } catch (error) {
          saveAppLog('[광고 영상 다운로드 예외]', {
            fileName: storageName,
            filePath: file.filePath,
            message: error instanceof Error ? error.message : String(error),
          });
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

      // TODO: 제거 예정 (영상 재생 실패 추적 로그) — 제거 시 excludedVideos 계산부터 아래 saveAppLog 블록까지 삭제
      // 슬라이드에서 제외된 영상(로컬 URL 미등록)을 명확히 추적
      const excludedVideos = videoFiles
        .filter((f) => !localVideoUrls[f.filePath])
        .map((f) => f.fileName);
      saveAppLog('[광고 유효 파일 집계]', {
        total: files.length,
        valid: validFiles.length,
        videoTotal: videoFiles.length,
        videoRegistered: videoFiles.length - excludedVideos.length,
        excludedVideos,
        registeredSources: videoFiles
          .filter((f) => !!localVideoUrls[f.filePath])
          .map((f) => ({
            fileName: f.fileName,
            kind: localVideoUrls[f.filePath]?.startsWith('blob:')
              ? 'blob'
              : 'capacitor-file',
          })),
      });

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
