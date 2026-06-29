"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClinic } from "./actions/actions";

const clinicFormSchema = z.object({
  name: z.string().trim().min(1, "O nome da clínica é obrigatório."),
});

type ClinicFormData = z.infer<typeof clinicFormSchema>;

export function ClinicForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ClinicFormData>({
    resolver: zodResolver(clinicFormSchema),
  });

  const onSubmit = async (data: ClinicFormData) => {
    const result = await createClinic(data);

    if (result?.error) {
      setError("name", { message: result.error });
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cadastrar Clínica</CardTitle>
          <CardDescription>
            Antes de acessar o painel, cadastre sua clínica.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nome da clínica</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ex: Clínica Saúde Plena"
                disabled={isSubmitting}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-destructive text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && (
                <Loader2Icon className="-ms-1 animate-spin" data-slot="icon" />
              )}
              {isSubmitting ? "Cadastrando..." : "Cadastrar clínica"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
