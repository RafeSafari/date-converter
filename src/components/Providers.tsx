"use client";

import type { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Toaster } from "react-hot-toast";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import Header from "@/components/Header";
import InstallPrompt from "@/components/InstallPrompt";
import { ThemeModeProvider, useThemeMode } from "@/theme/themeMode";
import { dark, light } from "@/theme/theme";

function ThemedShell({ children }: { children: ReactNode }) {
  const { isDark } = useThemeMode();

  return (
    <ThemeProvider theme={isDark ? dark : light}>
      <CssBaseline />
      <Header />
      <InstallPrompt />
      <main className="content">{children}</main>
      <Toaster
        position="bottom-right"
        containerStyle={{ direction: "rtl" }}
        reverseOrder={false}
      />
    </ThemeProvider>
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider
      options={{ key: "muirtl", stylisPlugins: [prefixer, rtlPlugin] }}
    >
      <ThemeModeProvider>
        <ThemedShell>{children}</ThemedShell>
      </ThemeModeProvider>
    </AppRouterCacheProvider>
  );
}
