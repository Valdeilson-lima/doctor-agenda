import db from "@/db";
import { clinicTable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const [userClinic] = await db
    .select({ clinicName: clinicTable.name })
    .from(usersToClinicsTable)
    .innerJoin(clinicTable, eq(usersToClinicsTable.clinicId, clinicTable.id))
    .where(eq(usersToClinicsTable.userId, session?.user.id ?? ""))
    .limit(1);

  if (!userClinic) {
    redirect("/dashboard/clinic-form");
  }

  return (
    <div>
      <h1 className="text-xl font-semibold">{userClinic.clinicName}</h1>
      <p className="text-sm text-muted-foreground">
        Bem-vindo, {session?.user.name}
      </p>
    </div>
  );
};

export default Dashboard;
