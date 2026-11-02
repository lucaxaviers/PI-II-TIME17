import express, { Request, Response } from "express";
import path from "path";
import usuariosRoutes from "./routes/usuarios";
import cadastroDemandas from "./routes/cadastroDemandas";

import { usuarioDaSessao } from "./sessao";
import { executarConsulta } from "./database";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/app", express.static(path.join(__dirname, "../frontend")));

// Rotas de login e usuarios (Reuniao 4)
app.use(usuariosRoutes);

type tipoDemanda = "Tarefa" | "Defeito" | "Melhoria" | "Documentação";
type statusDemanda = "Aberta" | "Em andamento" | "Em revisão" | "Concluída" | "Cancelada";
type prioridadeDemanda = "Crítica" | "Alta" | "Média" | "Baixa";

interface Demanda {
  id: number;
  titulo: string;
  descricao: string;
  idProjetoAssociado: number;
  tipo: tipoDemanda;
  prioridade: prioridadeDemanda;
  status: statusDemanda;
  idUsuario: number | null;
  dataCriacao: Date;
  dataFinalizacao: Date | null;
  dataAtualizacao: Date;
}

app.use(cadastroDemandas);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "funcionando",
  });
});

app.get("/login", (_req: Request, res: Response) => {
  res.redirect("/app/pages/login.html");
});

app.get("/cadastro", (_req: Request, res: Response) => {
  res.redirect("/app/pages/cadastro_usuario.html");
});

app.get("/dashboard", (_req: Request, res: Response) => {
  res.redirect("/app/pages/dashboard.html");
});

/*
 * Autor: Felipe D. dos Passos | 26002875
   Descricao: get, filtros e ordenação da lista de demandas
 */
type campoOrdenacao =
  | "id"
  | "titulo"
  | "tipo"
  | "prioridade"
  | "idUsuario"
  | "status"
  | "dataCriacao"
  | "dataFinalizacao";

type direcaoOrdenacao = "asc" | "desc";

const camposPermitidos: campoOrdenacao[] = [
  "id",
  "titulo",
  "tipo",
  "prioridade",
  "idUsuario",
  "status",
  "dataCriacao",
  "dataFinalizacao",
];

// "Peso" usado para ordenar prioridade e status
const pesoPrioridade: Record<prioridadeDemanda, number> = {
  "Crítica": 1,
  "Alta": 2,
  "Média": 3,
  "Baixa": 4,
};

const pesoStatus: Record<statusDemanda, number> = {
  "Aberta": 1,
  "Em andamento": 2,
  "Em revisão": 3,
  "Concluída": 4,
  "Cancelada": 5,
};

function ordenarDemandas(
  lista: Demanda[],
  campo: campoOrdenacao,
  direcao: direcaoOrdenacao
): Demanda[] {
  const fator = direcao === "desc" ? -1 : 1;

  return [...lista].sort((a, b) => {
    // Campos que podem ser nulos: nulos sempre no final, independente da direção
    if (campo === "dataFinalizacao" || campo === "idUsuario") {
      const valA = a[campo];
      const valB = b[campo];

      if (valA === null && valB === null) return 0;
      if (valA === null) return 1;
      if (valB === null) return -1;

      const numA = valA instanceof Date ? valA.getTime() : valA;
      const numB = valB instanceof Date ? valB.getTime() : valB;
      return (numA - numB) * fator;
    }

    switch (campo) {
      case "id":
        return (a.id - b.id) * fator;

      case "titulo":
      case "tipo":
        return a[campo].localeCompare(b[campo], "pt-BR", { sensitivity: "base" }) * fator;

      case "prioridade":
        return (pesoPrioridade[a.prioridade] - pesoPrioridade[b.prioridade]) * fator;

      case "status":
        return (pesoStatus[a.status] - pesoStatus[b.status]) * fator;

      case "dataCriacao":
        return (a.dataCriacao.getTime() - b.dataCriacao.getTime()) * fator;

      default:
        return 0;
    }
  });
}

app.get("/demandas", async (req: Request, res: Response) => {
  const { titulo, descricao, prioridade, tipo, idUsuario, idProjetoAssociado, ordenarPor, direcao } = req.query;
  const ator = usuarioDaSessao(req);
  if (!ator) return res.status(401).json({ erro: "Entre novamente com o Oracle disponível." });
  let resultado: Demanda[];
  try {
    resultado = await executarConsulta<Demanda>(`SELECT id_demanda "id", titulo "titulo",
      descricao "descricao", tipo "tipo", prioridade "prioridade", status "status",
      id_projeto "idProjetoAssociado", id_responsavel "idUsuario", data_criacao "dataCriacao",
      prazo_finalizacao "dataFinalizacao", data_atualizacao "dataAtualizacao" FROM demandas d
      WHERE EXISTS (SELECT 1 FROM usuarios u WHERE u.id_usuario=:ator AND
        (u.perfil='Administrador' OR d.id_responsavel=u.id_usuario OR EXISTS
        (SELECT 1 FROM usuarios_projetos v WHERE v.id_usuario=u.id_usuario AND v.id_projeto=d.id_projeto)))`, { ator });
  } catch {
    return res.status(503).json({ erro: "Não foi possível consultar as demandas no Oracle." });
  }

  if (titulo) {
    resultado = resultado.filter((item) =>
      item.titulo.toLowerCase().includes(String(titulo).toLowerCase())
    );
  }
  if (descricao) {
    resultado = resultado.filter((item) =>
      item.descricao.toLowerCase().includes(String(descricao).toLowerCase())
    );
  }
  if (prioridade) {
    resultado = resultado.filter(
      (item) => item.prioridade.toLowerCase() === String(prioridade).toLowerCase()
    );
  }
  if (tipo) {
    resultado = resultado.filter(
      (item) => item.tipo.toLowerCase() === String(tipo).toLowerCase()
    );
  }
  if (idUsuario) {
    resultado = resultado.filter((item) => item.idUsuario === Number(idUsuario));
  }
  if (idProjetoAssociado) {
    resultado = resultado.filter(
      (item) => item.idProjetoAssociado === Number(idProjetoAssociado)
    );
  }

  if (ordenarPor) {
    const campo = String(ordenarPor) as campoOrdenacao;

    if (!camposPermitidos.includes(campo)) {
      return res.status(400).json({
        erro: `Campo de ordenação inválido. Use: ${camposPermitidos.join(", ")}`,
      });
    }

    const dir: direcaoOrdenacao = String(direcao).toLowerCase() === "desc" ? "desc" : "asc";
    resultado = ordenarDemandas(resultado, campo, dir);
  }

  return res.status(200).json(resultado);
});

app.listen(PORT, () => {
  console.log(`Servidor executando em http://localhost:${PORT}`);
});
