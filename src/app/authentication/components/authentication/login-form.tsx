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

const googleIcon = (
  <svg
    className="mr-2 size-5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const loginFormSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
    setIsGoogleLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4.5">
      <div>
        <Label
          htmlFor="email"
          className="text-foreground/80 text-xs font-semibold tracking-wider uppercase"
        >
          E-mail
        </Label>
        <div className="relative mt-1.5">
          <Mail className="text-muted-foreground group-focus-within:text-primary pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 transition-colors" />
          <Input
            {...register("email")}
            className="placeholder:text-muted-foreground/60 border-border/80 focus-visible:ring-primary/15 h-11 rounded-xl pl-10 transition-all md:h-11"
            type="email"
            placeholder="seu@email.com"
          />
        </div>
        {errors.email && (
          <p className="text-destructive mt-1.5 text-xs font-medium">
            {errors.email.message}
          </p>
        )}
      </div>
      <div>
        <Label
          htmlFor="password"
          className="text-foreground/80 text-xs font-semibold tracking-wider uppercase"
        >
          Senha
        </Label>
        <div className="relative mt-1.5">
          <Lock className="text-muted-foreground group-focus-within:text-primary pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 transition-colors" />
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            className="placeholder:text-muted-foreground/60 border-border/80 focus-visible:ring-primary/15 h-11 rounded-xl pr-10 pl-10 transition-all md:h-11"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md transition-colors"
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
          <p className="text-destructive mt-1.5 text-xs font-medium">
            {errors.password.message}
          </p>
        )}
      </div>
      <div className="flex items-center justify-end">
        <a
          href="#"
          tabIndex={-1}
          className="text-muted-foreground hover:text-primary text-xs font-medium underline-offset-4 transition-colors hover:underline"
          onClick={(e) => e.preventDefault()}
        >
          Esqueceu a senha?
        </a>
      </div>
      <Button
        type="submit"
        className="font-heading hover:shadow-primary/20 bg-primary text-primary-foreground h-11 w-full cursor-pointer rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar na Conta"
        )}
      </Button>
      <div>
        <p className="text-muted-foreground text-center text-xs">OU</p>
        <Button
          type="button"
          className="font-heading hover:shadow-primary/20 bg-secondary text-secondary-foreground mt-2 h-11 w-full cursor-pointer rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
          disabled={isGoogleLoading}
          onClick={handleGoogleLogin}
        >
          {isGoogleLoading ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            googleIcon
          )}
          {isGoogleLoading ? "Redirecionando..." : "Entrar com o Google"}
        </Button>
      </div>
      <div></div>
    </form>
  );
};

export default LoginForm;
