import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const role = (session.user as any)?.role;

  if (!role) {
    redirect("/login");
  }

  // B2B: All roles (admin, manager, adjuster) go to the central dashboard
  redirect("/insurer/dashboard");
}
