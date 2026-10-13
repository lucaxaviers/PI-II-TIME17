"use strict";
/*
  Autor: Lucas Rodrigues Xavier | 25000508
  Descricao: Rotas de autenticacao e usuarios (Reuniao 4)
*/
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_1 = require("../data");
const router = (0, express_1.Router)();
// POST /login - autenticacao simples com dados de teste
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
exports.default = router;
//# sourceMappingURL=usuarios.js.map