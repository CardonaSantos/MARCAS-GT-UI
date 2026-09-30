import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";

import App from "./App.tsx";
import "./index.css";
import "@/ui/components/app/theme/app-theme.css";

import { queryClient } from "@/API/queryClient";
import { AppThemeProvider } from "@/ui/components/app/config/app-theme-provider";
import { SocketProvider } from "./Context/SocketProvider .tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <AppThemeProvider defaultAppearance="dark">
          <App />
        </AppThemeProvider>
      </SocketProvider>
    </QueryClientProvider>
  </StrictMode>,
);
