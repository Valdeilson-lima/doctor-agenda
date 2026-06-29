"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { authClient } from "@/lib/auth-client";

const registerFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome deve ter no mínimo 2 caracteres." }),
  email: z.email({ message: "E-mail inválido." }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
});

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.output<typeof registerFormSchema>) => {
    setIsLoading(true);
    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      callbackURL: "/dashboard",
    });
    if (error) {
      if (error.code === "USER_ALREADY_EXISTS") {
        toast.error("Este e-mail já está cadastrado.");
      } else if (error.code === "PASSWORD_TOO_SHORT") {
        toast.error("A senha deve ter no mínimo 6 caracteres.");
      } else {
        toast.error(error.message ?? "Erro ao criar conta.");
      }
    } else {
      toast.success("Conta criada com sucesso!");
      await new Promise((r) => setTimeout(r, 1500));
      router.push("/dashboard");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-sm font-medium">
          Nome
        </Label>
        <div className="relative mt-1.5">
          <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            {...register("name")}
            className="h-10 pl-9 md:h-8"
            type="text"
            placeholder="Seu nome completo"
          />
        </div>
        {errors.name && (
          <p className="text-destructive mt-1 text-xs">{errors.name.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="email" className="text-sm font-medium">
          E-mail
        </Label>
        <div className="relative mt-1.5">
          <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            {...register("email")}
            className="h-10 pl-9 md:h-8"
            type="email"
            placeholder="seu@email.com"
          />
        </div>
        {errors.email && (
          <p className="text-destructive mt-1 text-xs">
            {errors.email.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="password" className="text-sm font-medium">
          Senha
        </Label>
        <div className="relative mt-1.5">
          <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            className="h-10 pr-9 pl-9 md:h-8"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-destructive mt-1 text-xs">
            {errors.password.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Criando...
          </>
        ) : (
          "Criar Conta"
        )}
      </Button>
    </form>
  );
};

export default RegisterForm;
