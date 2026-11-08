import { type ComponentType } from "react";
import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import StraightenIcon from "@mui/icons-material/Straighten";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

export type ToolId = "conv" | "diff" | "export";

export const TOOLS: { id: ToolId; to: string; label: string; Icon: ComponentType<SvgIconProps> }[] = [
  { id: "conv", to: "/Conv", label: "تبدیل تاریخ", Icon: SwapHorizIcon },
  { id: "diff", to: "/Diff", label: "محاسبه فاصله دو تاریخ", Icon: StraightenIcon },
  { id: "export", to: "/Export", label: "خروجی بازه تاریخ", Icon: FileDownloadIcon },
];

const ToolLinks = ({ current }: { current: ToolId }) => (
  <Box
    sx={{
      backgroundColor: "background.paper",
      borderRadius: 2,
      padding: { xs: 2, sm: 4 },
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 1,
      maxWidth: 1000,
    }}
  >
    <Typography variant="h6" component="h6">
      دیگر ابزار ها
    </Typography>
    {TOOLS.filter(tool => tool.id !== current).map(tool => (
      <Button
        key={tool.id}
        variant="text"
        color="primary"
        component={Link}
        href={tool.to}
        startIcon={<tool.Icon fontSize="small" />}
        sx={(theme) => ({
          justifyContent: "flex-start",
          paddingInlineEnd: 1,
          color: theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.main,
        })}
      >
        {tool.label}
      </Button>
    ))}
  </Box>
);

export default ToolLinks;
