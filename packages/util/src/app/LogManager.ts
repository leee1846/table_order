import { Capacitor, registerPlugin, type Plugin } from '@capacitor/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';

export interface LogFile {
  /** 파일명 */
  name: string;
  /** 파일 크기 */
  size: number;
  /** 네이티브 원본 경로 */
  originalPath: string;
  /** 웹뷰용 URL */
  src: string;
  /** 로그 텍스트 */
  content: string;
}

/** 로그 파일 메타데이터 */
export interface LogFileEntry {
  // sks_app_log_2026-05-26.txt
  // sks_app_log_2026-05-26.txt.1
  name: string;
  // /storage/emulated/0/Android/data/com.sks.table_order/files/logs/{name}
  path: string;
  size: number;
}

interface INativeLogManager {
  getLogFiles(): Promise<{ files: LogFileEntry[] }>;
}

export interface ILogManager {
  /** 로그 파일 메타데이터 목록 조회 */
  listLogFileEntries(): Promise<LogFileEntry[]>;

  /** 로그 파일 목록에서 존재하는 날짜(YYYY-MM-DD)만 추출 */
  listAvailableLogDates(entries: LogFileEntry[]): string[];

  /**
   * 지정 날짜의 로그 파일 내용 조회
   * @param options.date - 조회 날짜 (YYYY-MM-DD)
   * @param options.entries - listLogFileEntries로 조회한 로그 파일 목록
   */
  fetchLogFilesForDate(options: {
    date: string;
    entries: LogFileEntry[];
  }): Promise<LogFile[]>;
}

const NativeLogManager = registerPlugin<INativeLogManager & Plugin>(
  'LogManager'
);

/**
 * 앱 로그 파일명 형식
 * - {prefix}_{YYYY-MM-DD}.txt
 * - {prefix}_{YYYY-MM-DD}.txt.{N}
 */
const APP_LOG_FILE_NAME_PATTERN = /^.+_(\d{4}-\d{2}-\d{2})\.txt(?:\.(\d+))?$/;

/** 파일명에서 로그 날짜(YYYY-MM-DD)를 추출 */
const parseLogDateFromFileName = (fileName: string): string | null => {
  const match = fileName.match(APP_LOG_FILE_NAME_PATTERN);
  return match?.[1] ?? null;
};

/** 지정 날짜 로그 파일의 로테이션 순서(.txt, .txt.1 …)를 반환 */
const parseAppLogRotationOrder = (
  fileName: string,
  date: string
): number | null => {
  const escapedDate = date.replace(/-/g, '\\-');
  const datePattern = new RegExp(`^.+_${escapedDate}\\.txt(?:\\.(\\d+))?$`);
  const match = fileName.match(datePattern);

  if (!match) {
    return null;
  }

  return match[1] ? Number(match[1]) : 0;
};

/** 지정 날짜에 해당하는 로그 파일을 로테이션 순서대로 필터링 */
const selectLogEntriesForDate = (
  entries: LogFileEntry[],
  date: string
): LogFileEntry[] => {
  const matched: { entry: LogFileEntry; rotationOrder: number }[] = [];

  for (const entry of entries) {
    const rotationOrder = parseAppLogRotationOrder(entry.name, date);
    if (rotationOrder !== null) {
      matched.push({ entry, rotationOrder });
    }
  }

  matched.sort((a, b) => a.rotationOrder - b.rotationOrder);
  return matched.map(({ entry }) => entry);
};

export const LogManager: ILogManager = {
  listLogFileEntries: async (): Promise<LogFileEntry[]> => {
    const result = await NativeLogManager.getLogFiles();
    return result.files ?? [];
  },

  listAvailableLogDates: (entries: LogFileEntry[]): string[] => {
    const dates = new Set<string>();

    for (const entry of entries) {
      const date = parseLogDateFromFileName(entry.name);
      if (date) {
        dates.add(date);
      }
    }

    return [...dates].sort();
  },

  /** 로그 목록에서 지정 날짜 로그 파일 내용을 조회 */
  fetchLogFilesForDate: async ({ date, entries }) => {
    const targetEntries = selectLogEntriesForDate(entries, date);

    if (targetEntries.length === 0) {
      return [];
    }

    return Promise.all(
      targetEntries.map(async (entry) => {
        const src = Capacitor.convertFileSrc(entry.path);
        const { data } = await Filesystem.readFile({
          path: `logs/${entry.name}`,
          directory: Directory.External,
          encoding: Encoding.UTF8,
        });
        if (typeof data !== 'string') {
          throw new Error(`Failed to read log file: ${entry.name}`);
        }

        return {
          name: entry.name,
          size: entry.size,
          originalPath: entry.path,
          src,
          content: data,
        };
      })
    );
  },
};
