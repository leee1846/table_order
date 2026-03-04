import { registerAxiosInstances } from '@repo/api/cores';
import { privateApi } from '@/config/api/privateApi';
import { publicApi } from '@/config/api/publicApi';
import { rawApi } from '@/config/api/rawApi';

/**
 * Axios Instance Registry 등록
 * privateApi와 publicApi를 packages/api의 fetcher에서 사용할 수 있도록 등록
 */
registerAxiosInstances({
  private: privateApi,
  public: publicApi,
  raw: rawApi,
});
