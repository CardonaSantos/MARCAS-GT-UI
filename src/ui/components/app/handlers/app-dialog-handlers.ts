import * as React from "react";

export function useAppDisclosure(defaultOpen = false) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const open = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
    setOpen: setIsOpen,
  };
}

export function useAppConfirmHandler<TTarget = unknown>() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [target, setTarget] = React.useState<TTarget | null>(null);

  const open = React.useCallback((nextTarget: TTarget) => {
    setTarget(nextTarget);
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const clearTarget = React.useCallback(() => {
    setTarget(null);
  }, []);

  const setOpen = React.useCallback((openValue: boolean) => {
    setIsOpen(openValue);

    if (!openValue) {
      setTarget(null);
    }
  }, []);

  const confirm = React.useCallback(
    async (callback: (target: TTarget) => void | Promise<void>) => {
      if (target === null) return;

      await callback(target);
      setIsOpen(false);
      setTarget(null);
    },
    [target],
  );

  return {
    isOpen,
    target,
    open,
    close,
    setOpen,
    clearTarget,
    confirm,
  };
}
