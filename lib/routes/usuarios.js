"use strict";
/*
  Autor: Lucas Rodrigues Xavier | 25000508
  Descricao: Rotas de autenticacao e gestao de usuarios (Reuniao 4 e 5 / PI-II)
*/
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_1 = require("../data");
const router = (0, express_1.Router)();
// POST /login - autenticacao de usuario
router.post("/login", (req, res) => {
    const { email, senha } = req.body;
    // Verifica campos obrigatorios ausentes
    if (!email || !senha) {
        return res.status(400).json({
            mensagem: "E-mail e senha são obrigatórios.",
        });
    }
    // Busca o usuario cadastrado
    const usuario = data_1.usuarios.find((u) => u.email.toLowerCase() === String(email).toLowerCase().trim() &&
        u.senha === String(senha));
    // Se nao encontrar ou a senha estiver incorreta
    if (!usuario) {
        return res.status(401).json({
            mensagem: "E-mail ou senha inválidos.",
        });
    }
    // Sucesso: retorna dados e perfil do usuario sem a senha
    return res.status(200).json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
    });
});
// GET /usuarios - listagem de usuarios sem expor senhas
router.get("/usuarios", (_req, res) => {
    const listaUsuarios = data_1.usuarios.map(({ id, nome, email, perfil }) => ({
        id,
        nome,
        email,
        perfil,
    }));
    return res.status(200).json(listaUsuarios);
});
// POST /usuarios - cadastro de novo usuario
router.post("/usuarios", (req, res) => {
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
    const usuarioExistente = data_1.usuarios.find((u) => u.email.toLowerCase() === emailLimpo);
    if (usuarioExistente) {
        return res.status(400).json({
            mensagem: "Já existe um usuário cadastrado com este e-mail.",
        });
    }
    const novoId = data_1.usuarios.length > 0 ? Math.max(...data_1.usuarios.map((u) => u.id)) + 1 : 1;
    const novoUsuario = {
        id: novoId,
        nome: String(nome).trim(),
        email: emailLimpo,
        senha: String(senha),
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
});
exports.default = router;
//# sourceMappingURL=usuarios.js.map