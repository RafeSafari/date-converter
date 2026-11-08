"use client";

import dynamic from "next/dynamic";
import ToolSkeleton from "@/components/ToolSkeleton";

export const ConvertDateClient = dynamic(() => import("@/tools/ConvertDate"), {
  ssr: false,
  loading: () => <ToolSkeleton layout="convert" />,
});

export const DateDiffClient = dynamic(() => import("@/tools/DateDiffCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton layout="diff" />,
});

export const ExportRangeClient = dynamic(() => import("@/tools/ExportRange"), {
  ssr: false,
  loading: () => <ToolSkeleton layout="export" />,
});

export const TestClient = dynamic(() => import("@/tools/Test"), {
  ssr: false,
  loading: () => <ToolSkeleton layout="test" />,
});
