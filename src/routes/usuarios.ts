/*
  Autor: Lucas Rodrigues Xavier | 25000508
  Descricao: Rotas de autenticacao e gestao de usuarios (Reuniao 4 e 5 / PI-II)
*/

import { Router, Request, Response } from "express";
import { Usuario, usuarios } from "../data";

const router = Router();

// POST /login - autenticacao de usuario
router.post("/login", (req: Request, res: Response) => {
  const { email, senha } = req.body;

  // Verifica campos obrigatorios ausentes
  if (!email || !senha) {
    return res.status(400).json({
      mensagem: "E-mail e senha são obrigatórios.",
    });
  }

  // Busca o usuario cadastrado
  const usuario = usuarios.find(
    (u) =>
      u.email.toLowerCase() === String(email).toLowerCase().trim() &&
      u.senha === String(senha)
  );

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
router.get("/usuarios", (_req: Request, res: Response) => {
  const listaUsuarios = usuarios.map(({ id, nome, email, perfil }) => ({
    id,
    nome,
    email,
    perfil,
  }));

  return res.status(200).json(listaUsuarios);
});

// POST /usuarios - cadastro de novo usuario
router.post("/usuarios", (req: Request, res: Response) => {
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
  const usuarioExistente = usuarios.find((u) => u.email.toLowerCase() === emailLimpo);
  if (usuarioExistente) {
    return res.status(400).json({
      mensagem: "Já existe um usuário cadastrado com este e-mail.",
    });
  }

  const novoId = usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1;
  const novoUsuario: Usuario = {
    id: novoId,
    nome: String(nome).trim(),
    email: emailLimpo,
    senha: String(senha),
    perfil: perfil as "Administrador" | "Líder de Projeto" | "Membro da Equipe",
  };

  usuarios.push(novoUsuario);

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

export default router;
