"use client";

import { useActionState } from "react";
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
import { createClinic } from "./actions";

export function ClinicForm() {
  const [state, formAction, isPending] = useActionState(createClinic, {} as { error?: string });

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
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nome da clínica</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Ex: Clínica Saúde Plena"
                required
                disabled={isPending}
              />
              {state?.error && (
                <p className="text-sm text-destructive">{state.error}</p>
              )}
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && (
                <Loader2Icon
                  className="-ms-1 animate-spin"
                  data-slot="icon"
                />
              )}
              {isPending ? "Cadastrando..." : "Cadastrar clínica"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
