/*
  Autor: Lucas Rodrigues Xavier | 25000508
  Descricao: Rotas de autenticacao e usuarios (Reuniao 4)
*/

import { Router, Request, Response } from "express";
import { usuarios } from "../data";

const router = Router();

// POST /login - autenticacao simples com dados de teste
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

export default router;
