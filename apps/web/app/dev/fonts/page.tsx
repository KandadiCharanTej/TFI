import type { Metadata } from "next";
import ClientFontLab from "./client-lab";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
  title: "Font Lab · TFI & Pitch",
};

export default function FontLabPage() {
  return <ClientFontLab />;
}
