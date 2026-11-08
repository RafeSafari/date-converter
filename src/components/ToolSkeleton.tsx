import type { ReactNode } from "react";
import { Box, Skeleton, type SxProps, type Theme } from "@mui/material";

export type ToolSkeletonLayout = "convert" | "diff" | "export" | "test";

const shellSx: SxProps<Theme> = {
  width: "100%",
  padding: { xs: 2, sm: 4 },
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: { xs: 2, sm: 4 },
};

const cardSx: SxProps<Theme> = {
  width: "100%",
  maxWidth: 1000,
  borderRadius: 2,
  backgroundColor: "var(--skeleton-card)",
  padding: { xs: 2, sm: 4 },
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 2,
};

const FieldSkeleton = () => (
  <Box
    sx={{
      width: "100%",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: 1,
    }}
  >
    <Skeleton
      variant="rounded"
      sx={{ flex: { xs: "1 1 100%", sm: "0 0 180px" }, height: 56 }}
    />
    <Box
      sx={{
        flex: { xs: "1 1 100%", sm: "1 1 0" },
        minWidth: 0,
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      <Skeleton
        variant="rounded"
        sx={{
          flex: "1 1 70px",
          height: 56,
          "@media (max-width: 319.98px)": { flexBasis: "100%" },
        }}
      />
      <Skeleton
        variant="rounded"
        sx={{
          flex: "2 1 100px",
          height: 56,
          "@media (max-width: 319.98px)": { flexBasis: "100%" },
        }}
      />
      <Skeleton
        variant="rounded"
        sx={{
          flex: "1 1 70px",
          height: 56,
          "@media (max-width: 319.98px)": { flexBasis: "100%" },
        }}
      />
    </Box>
  </Box>
);

const RESULT_ROWS = [
  [56, 16, 32, 16, 24, 16],
  [56, 16, 32, 16, 24, 16],
  [72, 24, 40, 24, 24, 16],
  [72, 24, 40, 24, 24, 16],
  [96, 32, 52, 32, 32, 16],
  [120, 40, 64, 40, 40, 16],
];

const ResultRowSkeleton = ({ widths = [56, 16, 32, 16, 24, 16] }: { widths?: number[] }) => (
  <Box
    sx={{
      width: "100%",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 1,
    }}
  >
    {widths.map((width, index) => (
      <Skeleton key={index} variant="rounded" width={width} height={32} />
    ))}
  </Box>
);

const Card = ({ children, align = "center" }: { children: ReactNode; align?: "center" | "flex-start" }) => (
  <Box sx={{ ...cardSx, alignItems: align }}>{children}</Box>
);

const LinksSkeleton = () => (
  <Box sx={{ ...cardSx, alignItems: "flex-start", gap: 1 }}>
    <Skeleton variant="rounded" width={120} height={32} />
    <Skeleton variant="rounded" width={220} height={36} />
    <Skeleton variant="rounded" width={190} height={36} />
  </Box>
);

const LAYOUTS: Record<ToolSkeletonLayout, ReactNode> = {
  convert: (
    <>
      <Card>
        <FieldSkeleton />
      </Card>
      <Card>
        {RESULT_ROWS.map((widths, index) => (
          <ResultRowSkeleton key={index} widths={widths} />
        ))}
      </Card>
      <LinksSkeleton />
    </>
  ),
  diff: (
    <>
      <Card>
        <FieldSkeleton />
        <FieldSkeleton />
      </Card>
      <Box sx={{ ...cardSx, minHeight: 163, justifyContent: "center" }}>
        <ResultRowSkeleton widths={[96, 32, 52, 16, 64, 32]} />
      </Box>
      <LinksSkeleton />
    </>
  ),
  export: (
    <>
      <Card>
        <FieldSkeleton />
        <FieldSkeleton />
        <Skeleton variant="rounded" width={240} height={36} />
      </Card>
      <LinksSkeleton />
    </>
  ),
  test: (
    <Card>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Skeleton variant="rounded" width={80} height={32} sx={{ mb: "0.35em" }} />
        <Skeleton variant="rounded" width={120} height={36} />
      </Box>
    </Card>
  ),
};

export default function ToolSkeleton({ layout }: { layout: ToolSkeletonLayout }) {
  return (
    <Box
      role="status"
      aria-label="در حال بارگذاری…"
      aria-busy="true"
      sx={{ ...shellSx, "& .MuiSkeleton-root": { backgroundColor: "var(--skeleton-text)" } }}
    >
      <Box aria-hidden="true" sx={{ display: "contents" }}>
        {LAYOUTS[layout]}
      </Box>
    </Box>
  );
}
