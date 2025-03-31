import { redirect } from "next/navigation";

import { getSession } from "@/modules/auth/actions/get-session";

import { AuthForm } from "@/modules/auth/ui/components/auth-form";

const Page = async () => {
  const session = await getSession();
  if (session) {
    redirect("/");
  }

  return <AuthForm />;
};

export default Page;
