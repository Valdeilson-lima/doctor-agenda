"use server";

import db from "@/db";
import { clinicTable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const clinicSchema = z.object({
  name: z.string().trim().min(1, "O nome da clínica é obrigatório."),
});

export async function createClinic(payload: { name: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return { error: "Usuário não autenticado." };
  }

  const parsed = clinicSchema.safeParse(payload);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name } = parsed.data;

  const [clinic] = await db
    .insert(clinicTable)
    .values({ name })
    .returning({ id: clinicTable.id });

  await db.insert(usersToClinicsTable).values({
    id: crypto.randomUUID(),
    clinicId: clinic.id,
    userId: session.user.id,
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
