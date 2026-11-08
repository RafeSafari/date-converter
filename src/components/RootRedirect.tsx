"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/Conv/");
  }, [router]);

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <p>در حال انتقال به صفحه تبدیل تاریخ…</p>
      <a href="/Conv/">تبدیل تاریخ</a>
    </div>
  );
}
