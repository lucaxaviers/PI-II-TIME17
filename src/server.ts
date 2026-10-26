import express, { Request, Response } from "express";
import path from "path";
import { demandas } from "./dados";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/app", express.static(path.join(__dirname, "../frontend")));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "funcionando",
  });
});

app.get("/demandas", (req: Request, res: Response) => {
  res.redirect("/app/pages/lista_demandas.html");
});

app.get("/dashboard", (req: Request, res: Response) => {
  const status = [
    "Aberta",
    "Em andamento",
    "Em revisão",
    "Concluída",
    "Cancelada",
  ];

  const prioridades = ["Crítica", "Alta", "Média", "Baixa"];

  const tipos = ["Tarefa", "Defeito", "Melhoria", "Documentação"];

  const porStatus: Record<string, number> = {};
  const porPrioridade: Record<string, number> = {};
  const porTipo: Record<string, number> = {};

  status.forEach((item) => {
    porStatus[item] = demandas.filter(
      (demanda) => demanda.status === item
    ).length;
  });

  prioridades.forEach((item) => {
    porPrioridade[item] = demandas.filter(
      (demanda) => demanda.prioridade === item
    ).length;
  });

  tipos.forEach((item) => {
    porTipo[item] = demandas.filter(
      (demanda) => demanda.tipo === item
    ).length;
  });

  const statusEmAberto = ["Aberta", "Em andamento", "Em revisão"];

  const demandasCriticasEmAberto = demandas.filter(
    (demanda) =>
      demanda.prioridade === "Crítica" &&
      statusEmAberto.includes(demanda.status)
  );

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const limite = new Date(hoje);
  limite.setDate(limite.getDate() + 3);

  const demandasProximasDoPrazo = demandas.filter((demanda) => {
    const prazo = new Date(demanda.prazoFinalizacao + "T00:00:00");

    return (
      statusEmAberto.includes(demanda.status) &&
      prazo >= hoje &&
      prazo <= limite
    );
  });

  res.status(200).json({
    total: demandas.length,
    porStatus,
    porPrioridade,
    porTipo,
    demandasCriticasEmAberto,
    demandasProximasDoPrazo,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor executando em http://localhost:${PORT}`);
});
