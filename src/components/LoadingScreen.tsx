"use client";

import { Box, CircularProgress, Typography } from "@mui/material";

type LoadingScreenProps = {
  message?: string;
};

export default function LoadingScreen({ message = "در حال بارگذاری…" }: LoadingScreenProps) {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        width: "100%",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        padding: { xs: 2, sm: 4 },
      }}
    >
      <CircularProgress aria-label={message} />
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );
}
