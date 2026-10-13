"use strict";
/*
  Autor: Lucas Rodrigues Xavier | 25000508
  Descricao: Dados em memoria compartilhados para testes da aplicacao (Reuniao 4)
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.comentarios = exports.demandas = exports.usuarios = void 0;
// Usuarios de teste contemplando os tres perfis exigidos
exports.usuarios = [
    {
        id: 1,
        nome: "Lucas Rodrigues Xavier",
        email: "lucas@devtrack.com",
        senha: "senha123",
        perfil: "Administrador",
    },
    {
        id: 2,
        nome: "Enrico Locateli Costa",
        email: "enrico@devtrack.com",
        senha: "senha123",
        perfil: "Líder de Projeto",
    },
    {
        id: 3,
        nome: "Gabriela Amanda Pereira",
        email: "gabriela@devtrack.com",
        senha: "senha123",
        perfil: "Membro da Equipe",
    },
];
// Demandas de teste em memoria para a equipe
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
// Comentarios de teste em memoria para a equipe
exports.comentarios = [
    {
        id: 1,
        demandaId: "DEM-042",
        usuarioId: 3,
        texto: "Consegui reproduzir o problema nos filtros da listagem.",
        criadoEm: "2026-10-02T09:14:00-03:00",
    },
    {
        id: 2,
        demandaId: "DEM-042",
        usuarioId: 2,
        texto: "Encontrei a causa no componente de paginação.",
        criadoEm: "2026-10-06T14:30:00-03:00",
    },
];
//# sourceMappingURL=data.js.map