"use client";

import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { AuthHydrator } from "@/components/AuthHydrator";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <AuthHydrator />
          {children}
        </Provider>
      </body>
    </html>
  );
}
