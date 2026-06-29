"use server";

import db from "@/db";
import { clinicTable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createClinic(_prevState: unknown, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return { error: "Usuário não autenticado." };
  }

  const name = formData.get("name") as string;

  if (!name || name.trim().length === 0) {
    return { error: "O nome da clínica é obrigatório." };
  }

  const [clinic] = await db
    .insert(clinicTable)
    .values({ name: name.trim() })
    .returning({ id: clinicTable.id });

  await db.insert(usersToClinicsTable).values({
    id: crypto.randomUUID(),
    clinicId: clinic.id,
    userId: session.user.id,
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
