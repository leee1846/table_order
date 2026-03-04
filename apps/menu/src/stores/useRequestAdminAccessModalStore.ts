import { create } from '@repo/feature/zustand';

interface IRequestAdminAccessModalStore {
  /** 관리자 비밀번호 모달 노출 여부 */
  show: boolean;
  setShow: (show: boolean) => void;
}

export const useRequestAdminAccessModalStore =
  create<IRequestAdminAccessModalStore>((set) => ({
    show: false,
    setShow: (show) => set({ show }),
  }));
