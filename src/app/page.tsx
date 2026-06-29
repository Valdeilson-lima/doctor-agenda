import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/authentication");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium animate-pulse">
          Redirecionando...
        </p>
      </div>
    </div>
  );
}
