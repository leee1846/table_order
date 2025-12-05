import { useTableStore } from '@/stores/data/useTableStore';
import { ROUTES } from '@/constants/routes';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  /**
   * useEffect 실행을 건너뛸지 여부
   * 초기 api요청 건너뛰기 여부
   * @default false
   */
  skipInitialRequest?: boolean;
}
export const useTableData = (options?: Props) => {
  // TODO: 추후 선택한 table get api 적용예정
  const { skipInitialRequest = false } = options || {};

  const navigate = useNavigate();
  const { data, setDataAsync, clearData } = useTableStore();

  //TODO: table이 null일경우 선택한 테이블 조회 api 호출 추후 적용 예정
  useEffect(() => {
    if (skipInitialRequest) {
      return;
    }

    if (!!data && data?.tableNumber === 0) {
      navigate(ROUTES.TABLES.generate(), { replace: true });
    }
  }, [data, navigate, skipInitialRequest]);

  return { data, setDataAsync, clearData };
};
