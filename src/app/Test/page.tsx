import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import { TestClient } from "@/components/ToolClients";

export const metadata: Metadata = {
  title: "تست",
  robots: { index: false, follow: false },
};

export default function TestPage() {
  return (
    <>
      <PageIntro title="تست" description="ابزار داخلی برای بررسی محاسبات نجومی." />
      <TestClient />
    </>
  );
}
