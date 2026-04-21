import { getUser, getAvatarUrl } from "@/lib/auth";
import { redirect } from "next/navigation";
import PanelShell from "./PanelShell";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect("/login");

  return (
    <PanelShell username={user.username} avatarUrl={getAvatarUrl(user)}>
      {children}
    </PanelShell>
  );
}
