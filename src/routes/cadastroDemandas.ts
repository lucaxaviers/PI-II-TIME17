// Gabriel Santucci de Novaes | Cadastro, edição e histórico de demandas no Oracle.
import { Router, Request, Response } from "express";
import oracle from "oracledb";
import { comConexao } from "../database";
import { usuarioDaSessao } from "../sessao";
import { ErroDemanda, validarPrazo } from "../feriados";

const router = Router();
const colunas = `id_demanda "id", titulo "titulo", descricao "descricao", tipo "tipo",
  prioridade "prioridade", status "status", id_projeto "idProjetoAssociado",
  id_responsavel "idUsuario", data_criacao "dataCriacao", data_atualizacao "dataAtualizacao",
  TO_CHAR(prazo_finalizacao,'YYYY-MM-DD') "dataFinalizacao"`;

// O perfil e os vínculos são consultados no banco, nunca recebidos do formulário.
const projetosPermitidos = `SELECT p.id_projeto "id", p.nome "nome" FROM projetos p
  JOIN usuarios u ON u.id_usuario=:ator WHERE u.perfil='Administrador' OR
  (u.perfil='Líder de Projeto' AND EXISTS (SELECT 1 FROM usuarios_projetos v
   WHERE v.id_usuario=u.id_usuario AND v.id_projeto=p.id_projeto))`;

type Registro = { id: number; idProjetoAssociado: number; idUsuario: number | null;
  prioridade: string; dataFinalizacao: string | null };

function idValido(valor: unknown) {
  return Number.isSafeInteger(valor) && Number(valor) > 0;
}

function dadosFormulario(body: Request["body"]) {
  const { titulo, descricao, tipo, prioridade, idProjetoAssociado, idUsuario, dataFinalizacao } = body ?? {};
  if (typeof titulo !== "string" || titulo.trim().length < 5 || titulo.trim().length > 100)
    throw new ErroDemanda(400, "O título deve ter entre 5 e 100 caracteres.");
  if (typeof descricao !== "string" || descricao.trim().length < 10 || descricao.trim().length > 500)
    throw new ErroDemanda(400, "A descrição deve ter entre 10 e 500 caracteres.");
  if (!["Tarefa", "Defeito", "Melhoria", "Documentação"].includes(tipo) ||
      !["Crítica", "Alta", "Média", "Baixa"].includes(prioridade))
    throw new ErroDemanda(400, "Tipo ou prioridade inválidos.");
  if (!idValido(idProjetoAssociado)) throw new ErroDemanda(400, "Informe um projeto válido.");
  if (idUsuario != null && idUsuario !== "" && !idValido(idUsuario))
    throw new ErroDemanda(400, "Informe um responsável válido.");
  if (dataFinalizacao != null && typeof dataFinalizacao !== "string")
    throw new ErroDemanda(400, "Informe um prazo válido.");
  return { titulo: titulo.trim(), descricao: descricao.trim(), tipo, prioridade,
    projeto: idProjetoAssociado, responsavel: idUsuario || null, prazo: dataFinalizacao || null };
}

async function atender(req: Request, res: Response, status: number,
    operacao: (c: oracle.Connection, ator: number) => Promise<unknown>) {
  const ator = usuarioDaSessao(req);
  if (!ator) return res.status(401).json({ erro: "Entre novamente com o Oracle disponível." });
  try {
    const resultado = await comConexao(c => operacao(c, ator));
    return res.status(status).json(resultado);
  } catch (erro) {
    if (erro instanceof ErroDemanda) return res.status(erro.status).json({ erro: erro.message });
    console.error("Falha na operação de demanda:", erro);
    return res.status(503).json({ erro: "Não foi possível concluir a operação no Oracle." });
  }
}

router.get("/projetos", (req, res) => atender(req, res, 200, async (c, ator) =>
  (await c.execute(projetosPermitidos + " ORDER BY p.nome", { ator })).rows));

router.get("/demandas/editaveis", (req, res) => atender(req, res, 200, async (c, ator) =>
  (await c.execute(`SELECT id_demanda "id", titulo "titulo" FROM demandas
    WHERE id_projeto IN (SELECT "id" FROM (${projetosPermitidos})) ORDER BY id_demanda DESC`, { ator })).rows));

async function ler(c: oracle.Connection, id: number, bloquear = false) {
  const r = await c.execute<Registro>(`SELECT ${colunas} FROM demandas WHERE id_demanda=:id` +
    (bloquear ? " FOR UPDATE" : ""), { id });
  if (!r.rows?.length) throw new ErroDemanda(404, "Demanda não encontrada.");
  return r.rows[0];
}

function conferirProjeto(projetos: {id: number}[], id: number) {
  if (!projetos.some(p => p.id === id)) throw new ErroDemanda(403, "Sem permissão para editar neste projeto.");
}

router.get("/demandas/:id/edicao", (req, res) => atender(req, res, 200, async (c, ator) => {
  const id = Number(req.params.id);
  if (!idValido(id)) throw new ErroDemanda(400, "Identificador inválido.");
  const d = await ler(c, id);
  conferirProjeto((await c.execute<{id:number}>(projetosPermitidos, { ator })).rows ?? [], d.idProjetoAssociado);
  return d;
}));

async function salvar(req: Request, res: Response) {
  const editar = req.method === "PUT";
  return atender(req, res, editar ? 200 : 201, async (c, ator) => {
    const dados = dadosFormulario(req.body);
    const projetos = (await c.execute<{id:number}>(projetosPermitidos, { ator })).rows ?? [];
    if (!(await c.execute("SELECT 1 FROM projetos WHERE id_projeto=:id", { id: dados.projeto })).rows?.length)
      throw new ErroDemanda(400, "Projeto inexistente.");
    conferirProjeto(projetos, dados.projeto);
    if (dados.responsavel && !(await c.execute("SELECT 1 FROM usuarios WHERE id_usuario=:id",
      { id: dados.responsavel })).rows?.length) throw new ErroDemanda(400, "Responsável inexistente.");
    const opcoes = { autoCommit: false };
    let id = Number(req.params.id);
    if (editar && !idValido(id)) throw new ErroDemanda(400, "Identificador inválido.");
    const anterior = editar ? await ler(c, id, true) : null;
    if (anterior) conferirProjeto(projetos, anterior.idProjetoAssociado);
    if (dados.prazo && dados.prazo !== anterior?.dataFinalizacao) await validarPrazo(dados.prazo);

    if (anterior) {
      await c.execute(`UPDATE demandas SET titulo=:titulo, descricao=:descricao, tipo=:tipo,
        prioridade=:prioridade, id_projeto=:projeto, id_responsavel=:responsavel,
        prazo_finalizacao=TO_DATE(:prazo,'YYYY-MM-DD'), data_atualizacao=SYSDATE WHERE id_demanda=:id`,
        { ...dados, id }, opcoes);
      // Um registro por campo auditado. A remoção de um valor também fica registrada.
      for (const [campo, antes, depois] of [
        ["Responsável", anterior.idUsuario, dados.responsavel],
        ["Prioridade", anterior.prioridade, dados.prioridade],
        ["Prazo", anterior.dataFinalizacao, dados.prazo]
      ]) {
        if (antes !== depois) await c.execute(`INSERT INTO historico_demandas
          (id_demanda,id_usuario,tipo_alteracao,valor_anterior,valor_novo)
          VALUES (:id,:ator,:campo,:antes,:depois)`,
          { id, ator, campo, antes: String(antes ?? "Sem valor"), depois: String(depois ?? "Sem valor") }, opcoes);
      }
    } else {
      const r = await c.execute<{ novoId: number[] }>(`INSERT INTO demandas
        (titulo,descricao,tipo,prioridade,id_projeto,id_responsavel,prazo_finalizacao)
        VALUES (:titulo,:descricao,:tipo,:prioridade,:projeto,:responsavel,TO_DATE(:prazo,'YYYY-MM-DD'))
        RETURNING id_demanda INTO :novoId`, { ...dados, novoId: { dir: oracle.BIND_OUT, type: oracle.NUMBER } }, opcoes);
      id = r.outBinds!.novoId[0];
    }
    return ler(c, id);
  });
}

router.post("/demandas", salvar);
router.put("/demandas/:id", salvar);
export default router;
