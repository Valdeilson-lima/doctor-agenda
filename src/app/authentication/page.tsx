import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { CalendarCheck, Clock, HeartPulse, ShieldCheck } from "lucide-react";

import RegisterForm from "@/app/authentication/components/authentication/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/app/authentication/components/authentication/login-form";

const features = [
  { icon: CalendarCheck, text: "Agende consultas em segundos" },
  { icon: Clock, text: "Acompanhe seu histórico médico" },
  { icon: ShieldCheck, text: "Dados seguros e protegidos" },
];

const AuthenticationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="from-background via-background to-primary/5 relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-linear-to-br p-4 md:p-8">
      {/* Background decoration */}
      <div className="bg-primary/5 absolute -top-40 -right-40 size-125 animate-[float_8s_ease-in-out_infinite] rounded-full blur-3xl" />
      <div className="bg-primary/10 absolute -bottom-40 -left-40 size-125 animate-[float_10s_ease-in-out_infinite_reverse] rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 hidden h-px w-3/4 -translate-x-1/2 -translate-y-1/2 -rotate-6 opacity-[0.03] md:block" />

      <div className="relative z-10 flex w-full flex-col items-center justify-center gap-6 md:flex-row md:gap-16">
        {/* Welcome panel */}
        <div className="from-primary to-primary/80 text-primary-foreground hidden w-full max-w-md flex-col items-center gap-6 rounded-2xl bg-linear-to-br p-6 shadow-2xl sm:p-8 md:flex">
          <div className="animate-[pulse-ring_3s_ease-in-out_infinite] rounded-full bg-white/15 p-3 backdrop-blur-sm sm:p-4">
            <HeartPulse className="size-10 sm:size-12" />
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Doctor Agenda
            </h1>
            <p className="text-primary-foreground/80 text-sm text-balance sm:text-base">
              Gerencie suas consultas médicas de forma eficiente e prática.
            </p>
          </div>
          <ul className="flex w-full flex-col gap-3">
            {features.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="group border-primary-foreground/20 hover:border-primary-foreground/60 flex items-center gap-3 border-l-2 px-4 py-2.5 transition-all hover:pl-5 sm:py-3"
              >
                <Icon className="size-5 shrink-0 transition-transform group-hover:scale-110" />
                <span className="text-sm font-medium">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Auth panel */}
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" className="w-full">
            <TabsList variant="line" className="mb-8 grid w-full grid-cols-2">
              <TabsTrigger
                value="login"
                className="cursor-pointer py-2.5 text-sm font-medium transition-all"
              >
                Fazer Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="cursor-pointer py-2.5 text-sm font-medium transition-all"
              >
                Criar Conta
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card className="ring-border/50 shadow-xl ring-1">
                <CardHeader className="space-y-1.5">
                  <CardTitle className="text-xl">Fazer Login</CardTitle>
                  <CardDescription>
                    Acesse sua conta para gerenciar sua clínica e acompanhar
                    seus pacientes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LoginForm />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="register">
              <Card className="ring-border/50 shadow-xl ring-1">
                <CardHeader className="space-y-1.5">
                  <CardTitle className="text-xl">Criar Conta</CardTitle>
                  <CardDescription>
                    Crie sua conta para começar a gerenciar sua clínica e
                    acompanhar seus pacientes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RegisterForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;
