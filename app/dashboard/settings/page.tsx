import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import SettingsContent from "./settings-content";

export default async function SettingsPage() {
  const session = await auth();

  if (!session || session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  return <SettingsContent />;
}
