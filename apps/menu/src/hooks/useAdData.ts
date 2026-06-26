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
 * stale(응답에 없는) 파일과 손상된(0바이트) 파일을 삭제한 뒤,
 * 디스크에 남아 있는 광고 파일명 집합을 반환한다.
 *
 * 0바이트 파일은 이전 다운로드가 중단돼 남은 손상 파일이다. 파일명만으로 캐시
 * 적중을 판단하면 재생 불가 상태로 영구히 재사용되므로, 여기서 제거해 호출부가
 * 정상적으로 재다운로드하도록 한다.
 */
const removeStaleAdVideos = async (
  wantedNames: Set<string>
): Promise<Set<string>> => {
  try {
    const { files: before } = await AdStorage.listAds();

    // 응답에 없는 파일(stale) + 응답엔 있으나 0바이트인 손상 파일(broken)을 삭제 대상으로
    const stale = before.filter((f) => !wantedNames.has(f.fileName));
    const broken = before.filter(
      (f) => wantedNames.has(f.fileName) && f.size === 0
    );

    // TODO: 제거 예정 (영상 재생 실패 추적 로그)
    if (stale.length > 0) {
      saveAppLog('[광고 영상 stale 삭제]', {
        deleted: stale.map((f) => f.fileName),
      });
    }
    // TODO: 제거 예정 (영상 재생 실패 추적 로그)
    if (broken.length > 0) {
      saveAppLog('[광고 영상 손상 파일 삭제]', {
        deleted: broken.map((f) => f.fileName),
      });
    }

    for (const f of [...stale, ...broken]) {
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

      // STANDBY_VIDEO와 주문완료 영상을 분리해 단계별로 처리한다.
      // Phase 1(STANDBY) 완료 시 로딩을 즉시 해제하고,
      // Phase 2(ORDER_COMP)는 백그라운드에서 계속 처리한다.
      const standbyVideoFiles = videoFiles.filter(
        (f) => f.adType === 'STANDBY_VIDEO'
      );
      const orderCompVideoFiles = videoFiles.filter(
        (f) => f.adType !== 'STANDBY_VIDEO'
      );

      const wantedStorageNames = currentVideoStorageNames(files);

      const namesOnDisk = await removeStaleAdVideos(wantedStorageNames);

      // 영상 파일 1개를 다운로드하고 로컬 URL을 등록하는 공통 처리
      const processVideoFile = async (file: IGetMenuAdFile): Promise<void> => {
        const storageName = storageFileNameFromFilePath(file.filePath);
        if (!storageName) {
          return;
        }
        try {
          if (namesOnDisk.has(storageName)) {
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
            return;
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
            return;
          }

          // TODO: 제거 예정 (영상 재생 실패 추적 로그)
          saveAppLog('[광고 영상 다운로드]', {
            fileName: storageName,
            result: dl.skipped ? 'skipped' : 'downloaded',
            path: dl.path,
          });

          namesOnDisk.add(storageName);
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
      };

      // 현재 localVideoUrls 기준으로 유효 파일 목록을 생성하는 공통 처리
      const buildValidFiles = (): IGetMenuAdFile[] => {
        const { localVideoUrls } = useAdStore.getState().data;
        return files.filter((f) =>
          isVideoAdFile(f) ? !!localVideoUrls[f.filePath] : !!f.filePath?.trim()
        );
      };

      // ── Phase 1: STANDBY 영상 (병렬) ────────────────────────────────────
      if (cancelled) {
        return;
      }
      await Promise.all(standbyVideoFiles.map(processVideoFile));

      if (cancelled) {
        return;
      }

      // STANDBY 영상(+이미지) 처리 완료 → store 반영 및 로딩 즉시 해제
      // ORDER_COMP 영상은 아직 미완이지만, 전면대기 광고 표시에는 불필요하므로
      // 이 시점에 로딩 오버레이를 제거해 전면대기 광고를 즉시 노출한다.
      await setAdFiles(buildValidFiles());
      if (hasAdFiles) {
        setAdDataLoading(false);
      }
      setIsMenuAdFilesLoading(false);

      // ── Phase 2: 주문완료 영상 (병렬, 백그라운드) ───────────────────────
      await Promise.all(orderCompVideoFiles.map(processVideoFile));

      if (cancelled) {
        return;
      }

      // 모든 영상 처리 완료 후 유효 항목만 store에 최종 반영 (orderCompleteFullFiles 업데이트)
      // 영상: localVideoUrl 등록 성공한 것만 / 이미지: filePath가 있는 것만
      const validFiles = buildValidFiles();

      // TODO: 제거 예정 (영상 재생 실패 추적 로그) — 제거 시 excludedVideos 계산부터 아래 saveAppLog 블록까지 삭제
      // 슬라이드에서 제외된 영상(로컬 URL 미등록)을 명확히 추적
      const { localVideoUrls } = useAdStore.getState().data;
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
    };

    void (async () => {
      await run();
      // run()이 cancelled로 조기 종료된 경우에 대한 안전망
      setIsMenuAdFilesLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [apiData, setAdFiles, setLocalVideoUrl, setAdDataLoading]);

  return { isMenuAdFilesLoading };
};
