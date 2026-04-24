import { create } from 'zustand';

interface AddMenuDialogStore {
  closeSignal: number;
  requestClose: () => void;
}

export const useAddMenuDialogStore = create<AddMenuDialogStore>((set) => ({
  closeSignal: 0,
  requestClose: () =>
    set((state) => ({ closeSignal: state.closeSignal + 1 })),
}));
