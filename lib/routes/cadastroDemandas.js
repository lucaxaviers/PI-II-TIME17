"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Gabriel Santucci de Novaes | Cadastro, edição e histórico de demandas no Oracle.
const express_1 = require("express");
const oracledb_1 = __importDefault(require("oracledb"));
const database_1 = require("../database");
const sessao_1 = require("../sessao");
const feriados_1 = require("../feriados");
const router = (0, express_1.Router)();
const colunas = `id_demanda "id", titulo "titulo", descricao "descricao", tipo "tipo",
  prioridade "prioridade", status "status", id_projeto "idProjetoAssociado",
  id_responsavel "idUsuario", data_criacao "dataCriacao", data_atualizacao "dataAtualizacao",
  TO_CHAR(prazo_finalizacao,'YYYY-MM-DD') "dataFinalizacao"`;
// O perfil e os vínculos são consultados no banco, nunca recebidos do formulário.
const projetosPermitidos = `SELECT p.id_projeto "id", p.nome "nome" FROM projetos p
  JOIN usuarios u ON u.id_usuario=:ator WHERE u.perfil='Administrador' OR
  (u.perfil='Líder de Projeto' AND EXISTS (SELECT 1 FROM usuarios_projetos v
   WHERE v.id_usuario=u.id_usuario AND v.id_projeto=p.id_projeto))`;
function idValido(valor) {
    return Number.isSafeInteger(valor) && Number(valor) > 0;
}
function dadosFormulario(body) {
    const { titulo, descricao, tipo, prioridade, idProjetoAssociado, idUsuario, dataFinalizacao } = body !== null && body !== void 0 ? body : {};
    if (typeof titulo !== "string" || titulo.trim().length < 5 || titulo.trim().length > 100)
        throw new feriados_1.ErroDemanda(400, "O título deve ter entre 5 e 100 caracteres.");
    if (typeof descricao !== "string" || descricao.trim().length < 10 || descricao.trim().length > 500)
        throw new feriados_1.ErroDemanda(400, "A descrição deve ter entre 10 e 500 caracteres.");
    if (!["Tarefa", "Defeito", "Melhoria", "Documentação"].includes(tipo) ||
        !["Crítica", "Alta", "Média", "Baixa"].includes(prioridade))
        throw new feriados_1.ErroDemanda(400, "Tipo ou prioridade inválidos.");
    if (!idValido(idProjetoAssociado))
        throw new feriados_1.ErroDemanda(400, "Informe um projeto válido.");
    if (idUsuario != null && idUsuario !== "" && !idValido(idUsuario))
        throw new feriados_1.ErroDemanda(400, "Informe um responsável válido.");
    if (dataFinalizacao != null && typeof dataFinalizacao !== "string")
        throw new feriados_1.ErroDemanda(400, "Informe um prazo válido.");
    return { titulo: titulo.trim(), descricao: descricao.trim(), tipo, prioridade,
        projeto: idProjetoAssociado, responsavel: idUsuario || null, prazo: dataFinalizacao || null };
}
function atender(req, res, status, operacao) {
    return __awaiter(this, void 0, void 0, function* () {
        const ator = (0, sessao_1.usuarioDaSessao)(req);
        if (!ator)
            return res.status(401).json({ erro: "Entre novamente com o Oracle disponível." });
        try {
            const resultado = yield (0, database_1.comConexao)(c => operacao(c, ator));
            return res.status(status).json(resultado);
        }
        catch (erro) {
            if (erro instanceof feriados_1.ErroDemanda)
                return res.status(erro.status).json({ erro: erro.message });
            console.error("Falha na operação de demanda:", erro);
            return res.status(503).json({ erro: "Não foi possível concluir a operação no Oracle." });
        }
    });
}
router.get("/projetos", (req, res) => atender(req, res, 200, (c, ator) => __awaiter(void 0, void 0, void 0, function* () { return (yield c.execute(projetosPermitidos + " ORDER BY p.nome", { ator })).rows; })));
router.get("/demandas/editaveis", (req, res) => atender(req, res, 200, (c, ator) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield c.execute(`SELECT id_demanda "id", titulo "titulo" FROM demandas
    WHERE id_projeto IN (SELECT "id" FROM (${projetosPermitidos})) ORDER BY id_demanda DESC`, { ator })).rows;
})));
function ler(c_1, id_1) {
    return __awaiter(this, arguments, void 0, function* (c, id, bloquear = false) {
        var _a;
        const r = yield c.execute(`SELECT ${colunas} FROM demandas WHERE id_demanda=:id` +
            (bloquear ? " FOR UPDATE" : ""), { id });
        if (!((_a = r.rows) === null || _a === void 0 ? void 0 : _a.length))
            throw new feriados_1.ErroDemanda(404, "Demanda não encontrada.");
        return r.rows[0];
    });
}
function conferirProjeto(projetos, id) {
    if (!projetos.some(p => p.id === id))
        throw new feriados_1.ErroDemanda(403, "Sem permissão para editar neste projeto.");
}
router.get("/demandas/:id/edicao", (req, res) => atender(req, res, 200, (c, ator) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = Number(req.params.id);
    if (!idValido(id))
        throw new feriados_1.ErroDemanda(400, "Identificador inválido.");
    const d = yield ler(c, id);
    conferirProjeto((_a = (yield c.execute(projetosPermitidos, { ator })).rows) !== null && _a !== void 0 ? _a : [], d.idProjetoAssociado);
    return d;
})));
function salvar(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const editar = req.method === "PUT";
        return atender(req, res, editar ? 200 : 201, (c, ator) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            var _c;
            const dados = dadosFormulario(req.body);
            const projetos = (_c = (yield c.execute(projetosPermitidos, { ator })).rows) !== null && _c !== void 0 ? _c : [];
            if (!((_a = (yield c.execute("SELECT 1 FROM projetos WHERE id_projeto=:id", { id: dados.projeto })).rows) === null || _a === void 0 ? void 0 : _a.length))
                throw new feriados_1.ErroDemanda(400, "Projeto inexistente.");
            conferirProjeto(projetos, dados.projeto);
            if (dados.responsavel && !((_b = (yield c.execute("SELECT 1 FROM usuarios WHERE id_usuario=:id", { id: dados.responsavel })).rows) === null || _b === void 0 ? void 0 : _b.length))
                throw new feriados_1.ErroDemanda(400, "Responsável inexistente.");
            const opcoes = { autoCommit: false };
            let id = Number(req.params.id);
            if (editar && !idValido(id))
                throw new feriados_1.ErroDemanda(400, "Identificador inválido.");
            const anterior = editar ? yield ler(c, id, true) : null;
            if (anterior)
                conferirProjeto(projetos, anterior.idProjetoAssociado);
            if (dados.prazo && dados.prazo !== (anterior === null || anterior === void 0 ? void 0 : anterior.dataFinalizacao))
                yield (0, feriados_1.validarPrazo)(dados.prazo);
            if (anterior) {
                yield c.execute(`UPDATE demandas SET titulo=:titulo, descricao=:descricao, tipo=:tipo,
        prioridade=:prioridade, id_projeto=:projeto, id_responsavel=:responsavel,
        prazo_finalizacao=TO_DATE(:prazo,'YYYY-MM-DD'), data_atualizacao=SYSDATE WHERE id_demanda=:id`, Object.assign(Object.assign({}, dados), { id }), opcoes);
                // Um registro por campo auditado. A remoção de um valor também fica registrada.
                for (const [campo, antes, depois] of [
                    ["Responsável", anterior.idUsuario, dados.responsavel],
                    ["Prioridade", anterior.prioridade, dados.prioridade],
                    ["Prazo", anterior.dataFinalizacao, dados.prazo]
                ]) {
                    if (antes !== depois)
                        yield c.execute(`INSERT INTO historico_demandas
          (id_demanda,id_usuario,tipo_alteracao,valor_anterior,valor_novo)
          VALUES (:id,:ator,:campo,:antes,:depois)`, { id, ator, campo, antes: String(antes !== null && antes !== void 0 ? antes : "Sem valor"), depois: String(depois !== null && depois !== void 0 ? depois : "Sem valor") }, opcoes);
                }
            }
            else {
                const r = yield c.execute(`INSERT INTO demandas
        (titulo,descricao,tipo,prioridade,id_projeto,id_responsavel,prazo_finalizacao)
        VALUES (:titulo,:descricao,:tipo,:prioridade,:projeto,:responsavel,TO_DATE(:prazo,'YYYY-MM-DD'))
        RETURNING id_demanda INTO :novoId`, Object.assign(Object.assign({}, dados), { novoId: { dir: oracledb_1.default.BIND_OUT, type: oracledb_1.default.NUMBER } }), opcoes);
                id = r.outBinds.novoId[0];
            }
            return ler(c, id);
        }));
    });
}
router.post("/demandas", salvar);
router.put("/demandas/:id", salvar);
exports.default = router;
//# sourceMappingURL=cadastroDemandas.js.map