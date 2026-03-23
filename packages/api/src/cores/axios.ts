import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';

export const createAxiosInstance = (
  config?: CreateAxiosDefaults
): AxiosInstance => {
  const instance = axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
    timeout: config?.timeout ?? 10_000,
  });

  return instance;
};

const axiosInstanceRegistry = new Map<string, AxiosInstance>();

/**
 * API 클라이언트들을 등록합니다.
 * 각 app에서 시작 시 호출하여 private, public 등의 axios instance를 등록합니다.
 */
export const registerAxiosInstances = (
  instances: Record<string, AxiosInstance>
): void => {
  Object.entries(instances).forEach(([name, instance]) => {
    axiosInstanceRegistry.set(name, instance);
  });
};

/**
 * 등록된 API 클라이언트를 가져옵니다.
 * fetcher 함수들이 내부적으로 사용합니다.
 *
 * @param clientName - 'private', 'public', 'raw' 등
 * @returns AxiosInstance
 */
export const getAxiosInstance = (instanceName: string): AxiosInstance => {
  const instance = axiosInstanceRegistry.get(instanceName);

  if (!instance) {
    throw new Error(`Axios instance "${instanceName}" is not registered. `);
  }

  return instance;
};
