import { create } from 'zustand';

export type ModalType = 'confirm' | 'dualAction' | 'longContent';

export type ModalSize =
  | 'tiny'
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | '2xlarge';

export interface ModalConfig {
  id: string;
  type: ModalType;
  title?: string;
  content: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  primaryText?: string;
  secondaryText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onPrimary?: () => void;
  onSecondary?: () => void;
  position?: 'center' | 'top';
  size?: ModalSize;
}

interface ModalStore {
  modals: ModalConfig[];
  openModal: (config: Omit<ModalConfig, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  modals: [],
  openModal: (config) => {
    const id = `modal-${Date.now()}-${Math.random()}`;

    set((state) => ({
      modals: [...state.modals, { ...config, id }],
    }));
    return id;
  },
  closeModal: (id) => {
    set((state) => ({
      modals: state.modals.filter((modal) => modal.id !== id),
    }));
  },
  closeAllModals: () => {
    set({ modals: [] });
  },
}));
