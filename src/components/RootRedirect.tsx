"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/Conv/");
  }, [router]);

  return <LoadingScreen message="در حال انتقال به صفحه تبدیل تاریخ…" />;
}
