import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Activity, Clock, HeartPulse, Check, CalendarDays } from "lucide-react";

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

const agendaItems = [
  {
    time: "09:00",
    doctor: "Dr. Carlos Mendes",
    status: "active",
    statusText: "Em consulta",
  },
  {
    time: "10:30",
    doctor: "Dra. Beatriz Sousa",
    status: "scheduled",
    statusText: "Agendado",
  },
  {
    time: "14:00",
    doctor: "Dr. André Antunes",
    status: "scheduled",
    statusText: "Agendado",
  },
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
      {/* Background decoration with soft lighting effect */}
      <div className="bg-primary/5 absolute -top-40 -right-40 size-150 animate-float rounded-full blur-3xl" />
      <div className="bg-primary/10 absolute -bottom-40 -left-40 size-150 animate-float-reverse rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 hidden h-px w-3/4 -translate-x-1/2 -translate-y-1/2 -rotate-6 opacity-[0.03] md:block" />

      <div className="relative z-10 flex w-full flex-col items-stretch justify-center gap-8 md:flex-row md:items-center md:gap-16 max-w-4xl">
        {/* Welcome panel (Left side on desktop) */}
        <div className="from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-200 relative hidden w-full max-w-sm flex-col justify-between overflow-hidden rounded-3xl bg-linear-to-br p-8 shadow-2xl md:flex min-h-[460px] border border-white/6">
          {/* Subtle teal glow background overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2">
              <HeartPulse className="size-5 text-teal-400" />
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-zinc-400">
                Doctor Agenda
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-2xl font-extrabold tracking-tight text-white leading-tight">
                Simplifique sua rotina clínica.
              </h2>
            </div>
          </div>

          {/* Minimalist Agenda Widget */}
          <div className="relative z-10 space-y-4">
            <span className="font-heading text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Agenda do Dia
            </span>

            <div className="space-y-4">
              {agendaItems.map((item) => (
                <div
                  key={item.doctor}
                  className="flex items-center justify-between text-xs transition-colors hover:text-white"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-zinc-400">
                      {item.time}
                    </span>
                    <span className="size-1 rounded-full bg-zinc-700" />
                    <span className="font-medium text-zinc-300">
                      {item.doctor}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {item.status === "active" ? (
                      <>
                        <span className="relative flex size-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full size-1.5 bg-teal-500"></span>
                        </span>
                        <span className="text-[10px] font-medium text-teal-400">
                          {item.statusText}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="size-1.5 rounded-full bg-zinc-700"></span>
                        <span className="text-[10px] font-medium text-zinc-500">
                          {item.statusText}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 border-t border-white/6 pt-4">
            <p className="text-[10px] text-zinc-500">
              Gerencie consultas, pacientes e históricos com facilidade.
            </p>
          </div>
        </div>

        {/* Auth panel (Right side) */}
        <div className="w-full max-w-md flex flex-col justify-center mx-auto">
          {/* Logo visible only on mobile/tablet */}
          <div className="flex flex-col items-center gap-2 mb-6 md:hidden">
            <div className="rounded-xl bg-primary/10 p-2.5">
              <HeartPulse className="size-8 text-primary" />
            </div>
            <h1 className="font-heading text-xl font-bold tracking-tight text-foreground">
              Doctor Agenda
            </h1>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList variant="line" className="mb-6 grid w-full grid-cols-2 bg-muted/20 p-1 rounded-lg">
              <TabsTrigger
                value="login"
                className="cursor-pointer py-2.5 font-heading text-sm font-semibold transition-all data-[state=active]:text-primary data-[state=active]:font-bold"
              >
                Fazer Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="cursor-pointer py-2.5 font-heading text-sm font-semibold transition-all data-[state=active]:text-primary data-[state=active]:font-bold"
              >
                Criar Conta
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card className="ring-border/40 shadow-2xl border-none ring-1 bg-card/60 backdrop-blur-md rounded-2xl">
                <CardHeader className="space-y-1.5 pb-4">
                  <CardTitle className="font-heading text-xl font-extrabold">Fazer Login</CardTitle>
                  <CardDescription className="text-xs">
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
              <Card className="ring-border/40 shadow-2xl border-none ring-1 bg-card/60 backdrop-blur-md rounded-2xl">
                <CardHeader className="space-y-1.5 pb-4">
                  <CardTitle className="font-heading text-xl font-extrabold">Criar Conta</CardTitle>
                  <CardDescription className="text-xs">
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
