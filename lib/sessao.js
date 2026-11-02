"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encerrarSessao = encerrarSessao;
exports.iniciarSessao = iniciarSessao;
exports.usuarioDaSessao = usuarioDaSessao;
// Gabriel Santucci de Novaes | Sessão do usuário autenticado pelo Oracle.
const node_crypto_1 = require("node:crypto");
const sessoes = new Map();
const duracao = 8 * 60 * 60 * 1000;
function chave(req) {
    var _a, _b;
    var _c;
    return (_c = (_b = (_a = req.headers.cookie) === null || _a === void 0 ? void 0 : _a.match(/(?:^|;\s*)pi_sessao=([\w-]+)/)) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : "";
}
function encerrarSessao(req, res) {
    sessoes.delete(chave(req));
    res.clearCookie("pi_sessao", { path: "/" });
}
function iniciarSessao(res, id) {
    for (const [token, sessao] of sessoes) {
        if (sessao.expira <= Date.now())
            sessoes.delete(token);
    }
    const token = (0, node_crypto_1.randomUUID)();
    sessoes.set(token, { id, expira: Date.now() + duracao });
    res.cookie("pi_sessao", token, { httpOnly: true, sameSite: "strict", maxAge: duracao });
}
function usuarioDaSessao(req) {
    const sessao = sessoes.get(chave(req));
    return sessao && sessao.expira > Date.now() ? sessao.id : undefined;
}
//# sourceMappingURL=sessao.js.map