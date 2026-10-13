export interface Usuario {
  id: number;
  nome: string;
}

export interface Demanda {
  id: string;
  titulo: string;
  descricao: string;
  tipo: "Tarefa" | "Defeito" | "Melhoria" | "Documentação";
  prioridade: "Crítica" | "Alta" | "Média" | "Baixa";
  status: "Aberta" | "Em andamento" | "Em revisão" | "Concluída" | "Cancelada";
  projeto: string;
  responsavel: string | null;
  criadaEm: string;
  atualizadaEm: string;
  prazoFinalizacao: string;
}

export interface Comentario {
  id: number;
  demandaId: string;
  usuarioId: number;
  texto: string;
  criadoEm: string;
}

export const usuarios: Usuario[] = [
  { id: 1, nome: "Enrico Locateli Costa" },
  { id: 2, nome: "Gabriela Amanda Pereira" },
];

export const demandas: Demanda[] = [
  {
    id: "DEM-042",
    titulo: "Corrigir erro de paginação na listagem de demandas",
    descricao:
      "Ao aplicar um filtro, a paginação deve continuar respeitando o filtro selecionado.",
    tipo: "Defeito",
    prioridade: "Alta",
    status: "Em revisão",
    projeto: "Portal do Aluno",
    responsavel: "Enrico Locateli Costa",
    criadaEm: "2026-10-01T09:00:00-03:00",
    atualizadaEm: "2026-10-06T14:30:00-03:00",
    prazoFinalizacao: "2026-10-15",
  },
];

export const comentarios: Comentario[] = [
  {
    id: 1,
    demandaId: "DEM-042",
    usuarioId: 2,
    texto: "Consegui reproduzir o problema nos filtros da listagem.",
    criadoEm: "2026-10-02T09:14:00-03:00",
  },
  {
    id: 2,
    demandaId: "DEM-042",
    usuarioId: 1,
    texto: "Encontrei a causa no componente de paginação.",
    criadoEm: "2026-10-06T14:30:00-03:00",
  },
];
