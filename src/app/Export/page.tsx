import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import { ExportRangeClient } from "@/components/ToolClients";
import { SITE_URL } from "@/lib/site";

const description =
  "از یک بازه تاریخ، خروجی اکسل یا CSV بگیرید؛ هر روز در هفت تقویم به‌صورت هم‌زمان محاسبه می‌شود.";

export const metadata: Metadata = {
  title: "خروجی اکسل و CSV بازه تاریخ",
  description,
  ...(SITE_URL ? { alternates: { canonical: "/Export/" } } : {}),
};

export default function ExportPage() {
  return (
    <>
      <PageIntro title="خروجی بازه تاریخ" description={description} />
      <ExportRangeClient />
    </>
  );
}
