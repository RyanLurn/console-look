import { App } from "@/app";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles.css";
import { TanstackQueryProvider } from "@/components/providers/tanstack-query";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TanstackQueryProvider>
      <App />
    </TanstackQueryProvider>
  </StrictMode>
);
