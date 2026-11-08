import type { Metadata } from "next";
import RootRedirect from "@/components/RootRedirect";

export const metadata: Metadata = {
  title: "تبدیل تاریخ",
  robots: { index: false, follow: true },
};

export default function Home() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/Conv/" />
      <RootRedirect />
    </>
  );
}
