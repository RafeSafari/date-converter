import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

export type ToolId = "conv" | "diff" | "export";

const TOOLS: { id: ToolId; to: string; label: string; emoji: string }[] = [
  { id: "conv", to: "/Conv", label: "تبدیل تاریخ", emoji: "🔄" },
  { id: "diff", to: "/Diff", label: "محاسبه فاصله دو تاریخ", emoji: "📏" },
  { id: "export", to: "/Export", label: "خروجی بازه تاریخ", emoji: "📤" },
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
        to={tool.to}
        sx={{ gap: 0.5, justifyContent: "flex-start", paddingInlineEnd: 1 }}
      >
        <span aria-hidden="true">{tool.emoji}</span>
        {tool.label}
      </Button>
    ))}
  </Box>
);

export default ToolLinks;
