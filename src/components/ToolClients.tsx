"use client";

import dynamic from "next/dynamic";
import { Box, Skeleton } from "@mui/material";

const loading = (
  <Box sx={{ width: "100%", maxWidth: 1000, padding: { xs: 2, sm: 4 } }}>
    <Skeleton variant="rounded" height={180} />
  </Box>
);

export const ConvertDateClient = dynamic(() => import("@/tools/ConvertDate"), {
  ssr: false,
  loading: () => loading,
});

export const DateDiffClient = dynamic(() => import("@/tools/DateDiffCalculator"), {
  ssr: false,
  loading: () => loading,
});

export const ExportRangeClient = dynamic(() => import("@/tools/ExportRange"), {
  ssr: false,
  loading: () => loading,
});

export const TestClient = dynamic(() => import("@/tools/Test"), {
  ssr: false,
  loading: () => loading,
});
