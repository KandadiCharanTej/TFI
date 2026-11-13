import { redirect } from "next/navigation";

export default async function InviteRedirectPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  redirect(`/room/${code.toUpperCase()}`);
}
