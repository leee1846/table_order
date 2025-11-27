type ToastFunction = (
  message: string,
  options?: { position?: string; duration?: number }
) => void;
type RemoveToastFunction = (id: string) => void;

let toastInstance: ToastFunction | null = null;
let _removeToastInstance: RemoveToastFunction | null = null;

export const setToastInstance = (
  toast: ToastFunction,
  removeToast: RemoveToastFunction
) => {
  toastInstance = toast;
  _removeToastInstance = removeToast;
};

export const toast: ToastFunction = (message, options) => {
  if (!toastInstance) {
    console.warn(
      'Toast is not initialized. Make sure ToastMessage component is mounted.'
    );
    return;
  }
  toastInstance(message, options);
};
