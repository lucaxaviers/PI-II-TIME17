// Gabriel Santucci de Novaes | Cadastro de demandas e consulta de projetos.
import { Router } from "express";
import { usuarios } from "../data";

const projetos = [
  { id: 1, nome: "Portal do Aluno" },
  { id: 2, nome: "App Mobile DevTrack" },
  { id: 3, nome: "API DevTrack" },
];

const tipos = ["Tarefa", "Defeito", "Melhoria", "Documentação"] as const;
const prioridades = ["Crítica", "Alta", "Média", "Baixa"] as const;

interface NovaDemanda {
  titulo: string;
  descricao: string;
  tipo: typeof tipos[number];
  prioridade: typeof prioridades[number];
  idProjetoAssociado: number;
  idUsuario: number | null;
  dataFinalizacao: Date | null;
}

// O servidor injeta a gravação para compartilhar os registros com a listagem.
export function cadastroDemandas(gravar: (dados: NovaDemanda) => unknown) {
  const router = Router();
  router.get("/projetos", (_req, res) => res.json(projetos));
  router.post("/demandas", (req, res) => {
    const { titulo, descricao, tipo, prioridade, idProjetoAssociado,
      idUsuario, dataFinalizacao } = req.body ?? {};
    if (typeof titulo !== "string" || !titulo.trim() ||
        typeof descricao !== "string" || !descricao.trim()) {
      return res.status(400).json({ erro: "Informe o título e a descrição." });
    }
    if (!tipos.includes(tipo) || !prioridades.includes(prioridade)) {
      return res.status(400).json({ erro: "Tipo ou prioridade inválidos." });
    }
    if (!projetos.some(p => p.id === idProjetoAssociado)) {
      return res.status(400).json({ erro: "Projeto inexistente." });
    }
    const responsavel = idUsuario === "" ? null : idUsuario ?? null;
    if (responsavel !== null && !usuarios.some(u => u.id === responsavel)) {
      return res.status(400).json({ erro: "Responsável inexistente." });
    }
    let prazo = null;
    if (dataFinalizacao != null && dataFinalizacao !== "") {
      if (typeof dataFinalizacao !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dataFinalizacao)) {
        return res.status(400).json({ erro: "Informe o prazo no formato AAAA-MM-DD." });
      }
      prazo = new Date(dataFinalizacao);
      if (Number.isNaN(prazo.getTime()) || prazo.toISOString().slice(0, 10) !== dataFinalizacao) {
        return res.status(400).json({ erro: "O prazo informado não é uma data válida." });
      }
    }
    return res.status(201).json(gravar({ titulo: titulo.trim(), descricao: descricao.trim(),
      tipo, prioridade, idProjetoAssociado, idUsuario: responsavel, dataFinalizacao: prazo }));
  });
  return router;
}
