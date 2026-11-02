// Gabriel Santucci de Novaes | Sessão do usuário autenticado pelo Oracle.
import { randomUUID } from "node:crypto";
import { Request, Response } from "express";

const sessoes = new Map<string, { id: number; expira: number }>();
const duracao = 8 * 60 * 60 * 1000;
function chave(req: Request) {
  return req.headers.cookie?.match(/(?:^|;\s*)pi_sessao=([\w-]+)/)?.[1] ?? "";
}
export function encerrarSessao(req: Request, res: Response) {
  sessoes.delete(chave(req));
  res.clearCookie("pi_sessao", { path: "/" });
}
export function iniciarSessao(res: Response, id: number) {
  for (const [token, sessao] of sessoes) {
    if (sessao.expira <= Date.now()) sessoes.delete(token);
  }
  const token = randomUUID();
  sessoes.set(token, { id, expira: Date.now() + duracao });
  res.cookie("pi_sessao", token, { httpOnly: true, sameSite: "strict", maxAge: duracao });
}
export function usuarioDaSessao(req: Request) {
  const sessao = sessoes.get(chave(req));
  return sessao && sessao.expira > Date.now() ? sessao.id : undefined;
}
