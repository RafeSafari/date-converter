"use client";

import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import DarkMode from "@mui/icons-material/DarkMode";
import LightMode from "@mui/icons-material/LightMode";
import { usePathname } from "next/navigation";
import { TOOLS } from "@/components/ToolLinks";
import { useThemeMode } from "@/theme/themeMode";

const PAGE_TITLES: Record<string, string> = {
  "/test": "تست",
};

export default function Header() {
  const pathname = usePathname();
  const path = (pathname.replace(/\/$/, "") || "/").toLowerCase();
  const tool = TOOLS.find(item => item.to.toLowerCase() === path);
  const pageTitle = tool?.label ?? PAGE_TITLES[path] ?? "تبدیل تاریخ";
  const { toggle } = useThemeMode();

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1 }}>
          {tool ? <tool.Icon /> : null}
          <Typography variant="h6" component="div">
            {pageTitle}
          </Typography>
        </Box>
        <IconButton color="inherit" onClick={toggle} aria-label="Toggle dark mode">
          <LightMode className="theme-icon-light" titleAccess="روشن" />
          <DarkMode className="theme-icon-dark" titleAccess="تیره" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
