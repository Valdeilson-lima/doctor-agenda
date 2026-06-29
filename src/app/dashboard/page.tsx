import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({
  headers: await headers(),
});

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard {session?.user.name}</h1>
      <p>Bem-vindo ao seu painel de controle!</p>
    </div>
  );
};

export default Dashboard;
