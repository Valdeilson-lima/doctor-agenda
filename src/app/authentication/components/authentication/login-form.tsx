"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { authClient } from "@/lib/auth-client";

const loginFormSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres."),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.output<typeof loginFormSchema>) => {
    setIsLoading(true);
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: "/dashboard",
    });

    if (error) {
      if (error.code === "INVALID_EMAIL_OR_PASSWORD") {
        toast.error("E-mail ou senha incorretos.");
      } else {
        toast.error(error.message ?? "E-mail ou senha incorretos.");
      }
    } else {
      toast.success("Login realizado com sucesso!");
      await new Promise((r) => setTimeout(r, 1500));
      router.push("/dashboard");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            className="h-10 pl-9 pr-9 md:h-8"
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
      <div className="flex items-center justify-end">
        <a
          href="#"
          tabIndex={-1}
          className="text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline"
          onClick={(e) => e.preventDefault()}
        >
          Esqueceu a senha?
        </a>
      </div>
      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
