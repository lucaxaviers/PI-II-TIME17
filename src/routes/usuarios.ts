/*
  Autor: Lucas Rodrigues Xavier | 25000508
  Descricao: Rotas de autenticacao e gestao de usuarios integradas ao Oracle (Reuniao 5 / PI-II)
*/

import { Router, Request, Response } from "express";
import { Usuario, usuarios } from "../data";
import { executarConsulta } from "../database";
import { iniciarSessao, encerrarSessao } from "../sessao";

const router = Router();
router.post("/logout", (req, res) => {
  encerrarSessao(req, res);
  return res.sendStatus(204);
});

// POST /login - autenticacao de usuario contra o banco Oracle
router.post("/login", async (req: Request, res: Response) => {
  encerrarSessao(req, res);
  const { email, senha } = req.body;

  // Verifica campos obrigatorios ausentes
  if (!email || !senha) {
    return res.status(400).json({
      mensagem: "E-mail e senha são obrigatórios.",
    });
  }

  const emailLimpo = String(email).trim().toLowerCase();
  const senhaStr = String(senha);

  // 1. Autentica EXCLUSIVAMENTE diretamente no Banco de Dados Oracle (sem fallback)
  try {
    const resultado = await executarConsulta<{
      ID_USUARIO: number;
      NOME: string;
      EMAIL: string;
      PERFIL: string;
    }>(
      `SELECT id_usuario AS ID_USUARIO, nome AS NOME, email AS EMAIL, perfil AS PERFIL 
       FROM usuarios 
       WHERE LOWER(TRIM(email)) = LOWER(TRIM(:email)) 
         AND (TRIM(senha) = TRIM(:senha) OR REPLACE(REPLACE(senha, CHR(13), ''), CHR(10), '') = TRIM(:senha))`,
      { email: emailLimpo, senha: senhaStr }
    );

    if (resultado && resultado.length > 0) {
      const usuarioBanco = resultado[0];
      iniciarSessao(res, usuarioBanco.ID_USUARIO);
      console.log(`[LOGIN ORACLE] Autenticado com sucesso: ${usuarioBanco.NOME} (${usuarioBanco.PERFIL})`);
      return res.status(200).json({
        id: usuarioBanco.ID_USUARIO,
        nome: usuarioBanco.NOME,
        email: usuarioBanco.EMAIL,
        perfil: usuarioBanco.PERFIL,
      });
    }

    console.warn(`[LOGIN ORACLE] Credenciais não encontradas no Oracle para email: "${emailLimpo}".`);
    return res.status(401).json({
      mensagem: "E-mail ou senha inválidos.",
    });
  } catch (erroBanco: any) {
    console.error("[LOGIN ERRO ORACLE] Falha na conexão com o banco:", erroBanco?.message || erroBanco);
    return res.status(503).json({
      mensagem: "Erro ao conectar com o Banco de Dados Oracle. Certifique-se de que o Docker está rodando.",
      erro: erroBanco?.message || String(erroBanco),
    });
  }
});

// GET /usuarios - listagem de usuarios sem expor senhas
router.get("/usuarios", async (_req: Request, res: Response) => {
  // 1. Tenta buscar do Banco de Dados Oracle
  try {
    const resultado = await executarConsulta<{
      ID_USUARIO: number;
      NOME: string;
      EMAIL: string;
      PERFIL: string;
    }>(
      `SELECT id_usuario AS ID_USUARIO, nome AS NOME, email AS EMAIL, perfil AS PERFIL 
       FROM usuarios 
       ORDER BY nome ASC`
    );

    if (_req.query.origem === "oracle" || resultado.length > 0) {
      const listaFormatada = resultado.map((u) => ({
        id: u.ID_USUARIO,
        nome: u.NOME,
        email: u.EMAIL,
        perfil: u.PERFIL,
      }));
      return res.status(200).json(listaFormatada);
    }
  } catch (erroBanco) {
    if (_req.query.origem === "oracle") return res.status(503).json({ erro: "Não foi possível carregar os responsáveis no Oracle." });
    // Fallback para dados em memoria
  }

  // 2. Fallback em memoria
  const listaUsuarios = usuarios.map(({ id, nome, email, perfil }) => ({
    id,
    nome,
    email,
    perfil,
  }));

  return res.status(200).json(listaUsuarios);
});

// POST /usuarios - cadastro de novo usuario no Oracle
router.post("/usuarios", async (req: Request, res: Response) => {
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
    await executarConsulta(
      `INSERT INTO usuarios (nome, email, senha, perfil) 
       VALUES (:nome, :email, :senha, :perfil)`,
      {
        nome: nomeLimpo,
        email: emailLimpo,
        senha: senhaStr,
        perfil: String(perfil),
      }
    );

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso no banco de dados!",
      usuario: {
        nome: nomeLimpo,
        email: emailLimpo,
        perfil: perfil,
      },
    });
  } catch (erroBanco: any) {
    // Trata violacao de e-mail unico no Oracle (ORA-00001)
    if (erroBanco && erroBanco.message && erroBanco.message.includes("ORA-00001")) {
      return res.status(400).json({
        mensagem: "Já existe um usuário cadastrado com este e-mail.",
      });
    }

    // 2. Fallback em memoria
    const usuarioExistente = usuarios.find((u) => u.email.toLowerCase() === emailLimpo);
    if (usuarioExistente) {
      return res.status(400).json({
        mensagem: "Já existe um usuário cadastrado com este e-mail.",
      });
    }

    const novoId = usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1;
    const novoUsuario: Usuario = {
      id: novoId,
      nome: nomeLimpo,
      email: emailLimpo,
      senha: senhaStr,
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
  }
});

export default router;
