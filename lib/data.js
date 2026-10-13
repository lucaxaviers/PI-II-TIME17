"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comentarios = exports.demandas = exports.usuarios = void 0;
exports.usuarios = [
    { id: 1, nome: "Enrico Locateli Costa" },
    { id: 2, nome: "Gabriela Amanda Pereira" },
];
exports.demandas = [
    {
        id: "DEM-042",
        titulo: "Corrigir erro de paginação na listagem de demandas",
        descricao: "Ao aplicar um filtro, a paginação deve continuar respeitando o filtro selecionado.",
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
exports.comentarios = [
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
//# sourceMappingURL=data.js.map