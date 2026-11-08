import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import { ConvertDateClient } from "@/components/ToolClients";
import { SITE_URL } from "@/lib/site";

const description =
  "تاریخ شمسی، میلادی، هجری قمری، بدیع، چینی، ساکا یا عبری را وارد کنید و همان لحظه معادل آن را در شش تقویم دیگر ببینید.";

export const metadata: Metadata = {
  title: "تبدیل تاریخ شمسی، میلادی، قمری و بدیع",
  description,
  ...(SITE_URL ? { alternates: { canonical: "/Conv/" } } : {}),
};

export default function ConvertPage() {
  return (
    <>
      <PageIntro title="تبدیل تاریخ" description={description} />
      <ConvertDateClient />
    </>
  );
}
