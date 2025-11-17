import type { DialogSize } from '@repo/ui/components';
import { create } from 'zustand';

export type DialogType = 'confirm' | 'dualAction' | 'longContent';

export type { DialogSize };

export interface DialogConfig {
  id: string;
  type: DialogType;
  title?: string;
  content?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  primaryText?: string;
  secondaryText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  position?: 'center' | 'top';
  size?: DialogSize;
}

interface DialogStore {
  dialogs: DialogConfig[];
  openDialog: (config: Omit<DialogConfig, 'id'>) => string;
  closeDialog: (id: string) => void;
  closeAllDialogs: () => void;
}

export const useDialogStore = create<DialogStore>((set) => ({
  dialogs: [],
  openDialog: (config) => {
    const id = `dialog-${Date.now()}-${Math.random()}`;

    set((state) => ({
      dialogs: [...state.dialogs, { ...config, id }],
    }));
    return id;
  },
  closeDialog: (id) => {
    set((state) => ({
      dialogs: state.dialogs.filter((dialog) => dialog.id !== id),
    }));
  },
  closeAllDialogs: () => {
    set({ dialogs: [] });
  },
}));
