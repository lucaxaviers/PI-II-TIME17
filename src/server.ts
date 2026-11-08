
import express, { Request, Response } from "express";
import path from "path";
import usuariosRoutes from "./routes/usuarios";
import cadastroDemandas from "./routes/cadastroDemandas";
import cors from "cors";
import { usuarioDaSessao } from "./sessao";
import { executarConsulta } from "./database";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/app", express.static(path.join(__dirname, "../frontend")));

// Rotas de login e usuários
app.use(usuariosRoutes);

// Tipos de dados das demandas
type tipoDemanda =
  | "Tarefa"
  | "Defeito"
  | "Melhoria"
  | "Documentação";

type statusDemanda =
  | "Aberta"
  | "Em andamento"
  | "Em revisão"
  | "Concluída"
  | "Cancelada";

type prioridadeDemanda =
  | "Crítica"
  | "Alta"
  | "Média"
  | "Baixa";

// Interface da demanda
interface Demanda {
  id: number;
  titulo: string;
  descricao: string;
  idProjetoAssociado: number;
  idUsuario: number | null;
  nomeProjeto: string;
  tipo: tipoDemanda;
  prioridade: prioridadeDemanda;
  status: statusDemanda;
  responsavel: string | null;
  dataCriacao: Date;
  dataFinalizacao: Date | null;
  dataAtualizacao: Date;
}

// Rotas de cadastro de demandas
app.use(cadastroDemandas);

// Rota inicial
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "funcionando",
  });
});

// Redirecionamentos
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
 * Descrição: GET, filtros e ordenação da lista de demandas.
 */

// Campos permitidos para ordenação
type campoOrdenacao =
  | "id"
  | "titulo"
  | "tipo"
  | "prioridade"
  | "idUsuario"
  | "idProjetoAssociado"
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
  "idProjetoAssociado",
  "status",
  "dataCriacao",
  "dataFinalizacao",
];

// Pesos para ordenação de prioridade
const pesoPrioridade: Record<prioridadeDemanda, number> = {
  "Crítica": 1,
  "Alta": 2,
  "Média": 3,
  "Baixa": 4,
};

// Pesos para ordenação de status
const pesoStatus: Record<statusDemanda, number> = {
  "Aberta": 1,
  "Em andamento": 2,
  "Em revisão": 3,
  "Concluída": 4,
  "Cancelada": 5,
};

// Função responsável pela ordenação
function ordenarDemandas(
  lista: Demanda[],
  campo: campoOrdenacao,
  direcao: direcaoOrdenacao
): Demanda[] {
  const fator = direcao === "desc" ? -1 : 1;

  return [...lista].sort((a, b) => {

    // Campos que aceitam valores nulos
    if (campo === "dataFinalizacao" || campo === "idUsuario") {
      const valA = a[campo];
      const valB = b[campo];

      // Valores nulos permanecem no final
      if (valA === null && valB === null) return 0;
      if (valA === null) return 1;
      if (valB === null) return -1;

      const numA =
        valA instanceof Date ? valA.getTime() : valA;

      const numB =
        valB instanceof Date ? valB.getTime() : valB;

      return (numA - numB) * fator;
    }

    switch (campo) {
      case "id":
      case "idProjetoAssociado":
        return (a[campo] - b[campo]) * fator;

      case "titulo":
      case "tipo":
        return a[campo].localeCompare(
          b[campo],
          "pt-BR",
          { sensitivity: "base" }
        ) * fator;

      case "prioridade":
        return (
          pesoPrioridade[a.prioridade] -
          pesoPrioridade[b.prioridade]
        ) * fator;

      case "status":
        return (
          pesoStatus[a.status] -
          pesoStatus[b.status]
        ) * fator;

      case "dataCriacao":
        return (
          a.dataCriacao.getTime() -
          b.dataCriacao.getTime()
        ) * fator;

      default:
        return 0;
    }
  });
}

// GET - Listagem, filtros e ordenação das demandas
app.get("/demandas", async (req: Request, res: Response) => {

  const {
    titulo,
    descricao,
    prioridade,
    tipo,
    idUsuario,
    idProjetoAssociado,
    ordenarPor,
    direcao
  } = req.query;

  // Verifica o usuário autenticado
  const ator = usuarioDaSessao(req);

  if (!ator) {
    return res.status(401).json({
      erro: "Entre novamente com o Oracle disponível."
    });
  }

  let resultado: Demanda[];

  try {

    resultado = await executarConsulta<Demanda>(`
      SELECT
          d.id_demanda AS "id",
          d.titulo AS "titulo",
          d.descricao AS "descricao",
          d.id_projeto AS "idProjetoAssociado",
          d.id_responsavel AS "idUsuario",
          d.tipo AS "tipo",
          d.prioridade AS "prioridade",
          d.status AS "status",
          usuario.nome AS "responsavel",
          p.nome AS "nomeProjeto",
          d.data_criacao AS "dataCriacao",
          d.prazo_finalizacao AS "dataFinalizacao",
          d.data_atualizacao AS "dataAtualizacao"

      FROM demandas d

      LEFT JOIN usuarios usuario
          ON d.id_responsavel = usuario.id_usuario

      INNER JOIN projetos p
          ON d.id_projeto = p.id_projeto

      WHERE EXISTS (
          SELECT 1
          FROM usuarios sessao
          WHERE sessao.id_usuario = :ator
          AND (
              sessao.perfil = 'Administrador'

              OR d.id_responsavel = sessao.id_usuario

              OR EXISTS (
                  SELECT 1
                  FROM usuarios_projetos vinculo
                  WHERE vinculo.id_usuario = sessao.id_usuario
                  AND vinculo.id_projeto = d.id_projeto
              )
          )
      )
    `, { ator });

  } catch (erro) {
    console.error("Erro ao consultar demandas:", erro);

    return res.status(503).json({
      erro: "Não foi possível consultar as demandas no Oracle."
    });
  }

  // Filtro por título
  if (titulo) {
    resultado = resultado.filter((item) =>
      item.titulo.toLowerCase().includes(
        String(titulo).toLowerCase()
      )
    );
  }

  // Filtro por descrição
  if (descricao) {
    resultado = resultado.filter((item) =>
      item.descricao.toLowerCase().includes(
        String(descricao).toLowerCase()
      )
    );
  }

  // Filtro por prioridade
  if (prioridade) {
    resultado = resultado.filter(
      (item) =>
        item.prioridade.toLowerCase() ===
        String(prioridade).toLowerCase()
    );
  }

  // Filtro por tipo
  if (tipo) {
    resultado = resultado.filter(
      (item) =>
        item.tipo.toLowerCase() ===
        String(tipo).toLowerCase()
    );
  }

  // Filtro por responsável
  if (idUsuario !== undefined && idUsuario !== "") {
    resultado = resultado.filter(
      (item) => item.idUsuario === Number(idUsuario)
    );
  }

  // Filtro por projeto associado
  if (idProjetoAssociado !== undefined && idProjetoAssociado !== "") {
    resultado = resultado.filter(
      (item) =>
        item.idProjetoAssociado === Number(idProjetoAssociado)
    );
  }

  // Ordenação
  if (ordenarPor) {
    const campo = String(ordenarPor) as campoOrdenacao;

    if (!camposPermitidos.includes(campo)) {
      return res.status(400).json({
        erro: `Campo de ordenação inválido. Use: ${camposPermitidos.join(", ")}`
      });
    }

    const dir: direcaoOrdenacao =
      String(direcao).toLowerCase() === "desc"
        ? "desc"
        : "asc";

    resultado = ordenarDemandas(resultado, campo, dir);
  }

  return res.status(200).json(resultado);
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor executando em http://localhost:${PORT}`);
});
