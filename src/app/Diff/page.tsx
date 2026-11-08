import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import { DateDiffClient } from "@/components/ToolClients";
import { SITE_URL } from "@/lib/site";

const description =
  "فاصله بین دو تاریخ را بر اساس تقویم‌های شمسی، میلادی، هجری قمری، بدیع، چینی، ساکا و عبری محاسبه کنید.";

export const metadata: Metadata = {
  title: "محاسبه فاصله دو تاریخ",
  description,
  ...(SITE_URL ? { alternates: { canonical: "/Diff/" } } : {}),
};

export default function DiffPage() {
  return (
    <>
      <PageIntro title="محاسبه فاصله دو تاریخ" description={description} />
      <DateDiffClient />
    </>
  );
}
