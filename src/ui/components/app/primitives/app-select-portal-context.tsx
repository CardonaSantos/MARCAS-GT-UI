import * as React from "react";

const AppSelectPortalContext = React.createContext<
  HTMLElement | null | undefined
>(undefined);

export function AppSelectPortalProvider({
  target,
  children,
}: {
  target: HTMLElement | null;
  children: React.ReactNode;
}) {
  return (
    <AppSelectPortalContext.Provider value={target}>
      {children}
    </AppSelectPortalContext.Provider>
  );
}

export function useAppSelectPortalTarget() {
  return React.useContext(AppSelectPortalContext);
}
