"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cadastroDemandas = cadastroDemandas;
// Gabriel Santucci de Novaes | Cadastro de demandas e consulta de projetos.
const express_1 = require("express");
const data_1 = require("../data");
const projetos = [
    { id: 1, nome: "Portal do Aluno" },
    { id: 2, nome: "App Mobile DevTrack" },
    { id: 3, nome: "API DevTrack" },
];
const tipos = ["Tarefa", "Defeito", "Melhoria", "Documentação"];
const prioridades = ["Crítica", "Alta", "Média", "Baixa"];
// O servidor injeta a gravação para compartilhar os registros com a listagem.
function cadastroDemandas(gravar) {
    const router = (0, express_1.Router)();
    router.get("/projetos", (_req, res) => res.json(projetos));
    router.post("/demandas", (req, res) => {
        var _a;
        const { titulo, descricao, tipo, prioridade, idProjetoAssociado, idUsuario, dataFinalizacao } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
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
        const responsavel = idUsuario === "" ? null : idUsuario !== null && idUsuario !== void 0 ? idUsuario : null;
        if (responsavel !== null && !data_1.usuarios.some(u => u.id === responsavel)) {
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
//# sourceMappingURL=cadastroDemandas.js.map