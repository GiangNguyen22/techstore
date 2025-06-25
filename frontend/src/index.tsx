import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { store } from './stores/store'; 
import { Provider } from 'react-redux';

import { NotificationProvider } from "./pages/Detail/NotificationProvider"; // Đường dẫn đúng tới file NotificationProvider
import { AdminChatProvider } from "./components/Admin/AdminChatProvider";

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AdminChatProvider>
        <BrowserRouter>
          <NotificationProvider>
            {/* <ReactQueryDevtools initialIsOpen /> */}
            <App />
          </NotificationProvider>
        </BrowserRouter>
        </AdminChatProvider>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);

reportWebVitals();
