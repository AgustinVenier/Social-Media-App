import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as ChakraProvider } from "@/components/ui/provider";
import { router } from "./pages";
import store from "./redux/store";
import { setupAuthInterceptor } from "./interceptors/auth.interceptor";
const queryClient = new QueryClient();

// Configurar interceptor de autenticación
setupAuthInterceptor();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <ChakraProvider>
          <RouterProvider router={router} />
        </ChakraProvider>
      </ReduxProvider>
    </QueryClientProvider>
  </StrictMode>,
);
