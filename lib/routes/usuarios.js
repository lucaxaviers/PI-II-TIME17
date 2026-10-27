"use strict";
/*
  Autor: Lucas Rodrigues Xavier | 25000508
  Descricao: Rotas de autenticacao e gestao de usuarios integradas ao Oracle (Reuniao 5 / PI-II)
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_1 = require("../data");
const database_1 = require("../database");
const router = (0, express_1.Router)();
// POST /login - autenticacao de usuario contra o banco Oracle
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, senha } = req.body;
    // Verifica campos obrigatorios ausentes
    if (!email || !senha) {
        return res.status(400).json({
            mensagem: "E-mail e senha são obrigatórios.",
        });
    }
    const emailLimpo = String(email).trim().toLowerCase();
    const senhaStr = String(senha);
    // 1. Tenta autenticar diretamente no Banco de Dados Oracle
    try {
        const resultado = yield (0, database_1.executarConsulta)(`SELECT id_usuario AS ID_USUARIO, nome AS NOME, email AS EMAIL, perfil AS PERFIL 
       FROM usuarios 
       WHERE LOWER(email) = LOWER(:email) AND senha = :senha`, { email: emailLimpo, senha: senhaStr });
        if (resultado && resultado.length > 0) {
            const usuarioBanco = resultado[0];
            return res.status(200).json({
                id: usuarioBanco.ID_USUARIO,
                nome: usuarioBanco.NOME,
                email: usuarioBanco.EMAIL,
                perfil: usuarioBanco.PERFIL,
            });
        }
        return res.status(401).json({
            mensagem: "E-mail ou senha inválidos.",
        });
    }
    catch (erroBanco) {
        // 2. Fallback caso o banco Oracle ainda nao esteja rodando na maquina local
        const usuarioMemoria = data_1.usuarios.find((u) => u.email.toLowerCase() === emailLimpo && u.senha === senhaStr);
        if (!usuarioMemoria) {
            return res.status(401).json({
                mensagem: "E-mail ou senha inválidos.",
            });
        }
        return res.status(200).json({
            id: usuarioMemoria.id,
            nome: usuarioMemoria.nome,
            email: usuarioMemoria.email,
            perfil: usuarioMemoria.perfil,
        });
    }
}));
// GET /usuarios - listagem de usuarios sem expor senhas
router.get("/usuarios", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Tenta buscar do Banco de Dados Oracle
    try {
        const resultado = yield (0, database_1.executarConsulta)(`SELECT id_usuario AS ID_USUARIO, nome AS NOME, email AS EMAIL, perfil AS PERFIL 
       FROM usuarios 
       ORDER BY nome ASC`);
        if (resultado && resultado.length > 0) {
            const listaFormatada = resultado.map((u) => ({
                id: u.ID_USUARIO,
                nome: u.NOME,
                email: u.EMAIL,
                perfil: u.PERFIL,
            }));
            return res.status(200).json(listaFormatada);
        }
    }
    catch (erroBanco) {
        // Fallback para dados em memoria
    }
    // 2. Fallback em memoria
    const listaUsuarios = data_1.usuarios.map(({ id, nome, email, perfil }) => ({
        id,
        nome,
        email,
        perfil,
    }));
    return res.status(200).json(listaUsuarios);
}));
// POST /usuarios - cadastro de novo usuario no Oracle
router.post("/usuarios", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome, email, senha, perfil } = req.body;
    if (!nome || !email || !senha || !perfil) {
        return res.status(400).json({
            mensagem: "Todos os campos (nome, e-mail, senha e perfil) são obrigatórios.",
        });
    }
    const perfisValidos = ["Administrador", "Líder de Projeto", "Membro da Equipe"];
    if (!perfisValidos.includes(String(perfil))) {
        return res.status(400).json({
            mensagem: "Perfil inválido. Use: Administrador, Líder de Projeto ou Membro da Equipe.",
        });
    }
    if (String(senha).length < 6) {
        return res.status(400).json({
            mensagem: "A senha deve ter no mínimo 6 caracteres.",
        });
    }
    const emailLimpo = String(email).trim().toLowerCase();
    const nomeLimpo = String(nome).trim();
    const senhaStr = String(senha);
    // 1. Tenta inserir no Banco de Dados Oracle
    try {
        yield (0, database_1.executarConsulta)(`INSERT INTO usuarios (nome, email, senha, perfil) 
       VALUES (:nome, :email, :senha, :perfil)`, {
            nome: nomeLimpo,
            email: emailLimpo,
            senha: senhaStr,
            perfil: String(perfil),
        });
        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso no banco de dados!",
            usuario: {
                nome: nomeLimpo,
                email: emailLimpo,
                perfil: perfil,
            },
        });
    }
    catch (erroBanco) {
        // Trata violacao de e-mail unico no Oracle (ORA-00001)
        if (erroBanco && erroBanco.message && erroBanco.message.includes("ORA-00001")) {
            return res.status(400).json({
                mensagem: "Já existe um usuário cadastrado com este e-mail.",
            });
        }
        // 2. Fallback em memoria
        const usuarioExistente = data_1.usuarios.find((u) => u.email.toLowerCase() === emailLimpo);
        if (usuarioExistente) {
            return res.status(400).json({
                mensagem: "Já existe um usuário cadastrado com este e-mail.",
            });
        }
        const novoId = data_1.usuarios.length > 0 ? Math.max(...data_1.usuarios.map((u) => u.id)) + 1 : 1;
        const novoUsuario = {
            id: novoId,
            nome: nomeLimpo,
            email: emailLimpo,
            senha: senhaStr,
            perfil: perfil,
        };
        data_1.usuarios.push(novoUsuario);
        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
            usuario: {
                id: novoUsuario.id,
                nome: novoUsuario.nome,
                email: novoUsuario.email,
                perfil: novoUsuario.perfil,
            },
        });
    }
}));
exports.default = router;
//# sourceMappingURL=usuarios.js.map