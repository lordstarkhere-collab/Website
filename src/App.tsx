import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/app/routes";
import { AuthProvider } from "@/features/auth";
import { CopilotProvider } from "@/features/ai";
import { ToastProvider } from "@/shared/motion/motion";
import { ErrorBoundary } from "@/shared/system/ErrorBoundary";

/* ============================================================================
   App — application entry.
   ErrorBoundary provides graceful degradation for the whole tree.
   AuthProvider wraps the app so auth state is available everywhere.
   ToastProvider powers global motion-driven notifications.
   All routing lives in the central route tree (src/app/routes),
   and all chrome lives in the domain layouts (src/app/layouts).
   ============================================================================ */
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AuthProvider>
          <ToastProvider>
            <CopilotProvider>
              {/* Skip link — first focusable element for keyboard/screen-reader users */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-cyan-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-void-950"
              >
                Skip to content
              </a>
              <AppRoutes />
            </CopilotProvider>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
