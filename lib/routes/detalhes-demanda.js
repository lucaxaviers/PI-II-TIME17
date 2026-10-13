"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_1 = require("../data");
const router = (0, express_1.Router)();
function idDaDemanda(req) {
    const id = req.params.id;
    return Array.isArray(id) ? id[0] : id;
}
router.get("/demandas/:id", (req, res) => {
    const id = idDaDemanda(req);
    const demanda = data_1.demandas.find((item) => item.id === id);
    if (!demanda) {
        res.status(404).json({
            erro: "Demanda não encontrada.",
        });
        return;
    }
    res.status(200).json(demanda);
});
router.get("/demandas/:id/comentarios", (req, res) => {
    const id = idDaDemanda(req);
    const demandaExiste = data_1.demandas.some((item) => item.id === id);
    if (!demandaExiste) {
        res.status(404).json({
            erro: "Demanda não encontrada.",
        });
        return;
    }
    res.status(200).json(data_1.comentarios.filter((comentario) => comentario.demandaId === id));
});
router.post("/demandas/:id/comentarios", (req, res) => {
    var _a, _b;
    const id = idDaDemanda(req);
    const demandaExiste = data_1.demandas.some((item) => item.id === id);
    if (!demandaExiste) {
        res.status(404).json({
            erro: "Demanda não encontrada.",
        });
        return;
    }
    const texto = typeof ((_a = req.body) === null || _a === void 0 ? void 0 : _a.texto) === "string" ? req.body.texto.trim() : "";
    const usuarioId = (_b = req.body) === null || _b === void 0 ? void 0 : _b.usuarioId;
    if (!texto) {
        res.status(400).json({
            erro: "O texto do comentário é obrigatório.",
        });
        return;
    }
    if (typeof usuarioId !== "number" ||
        !data_1.usuarios.some((usuario) => usuario.id === usuarioId)) {
        res.status(400).json({
            erro: "O usuário informado não existe.",
        });
        return;
    }
    const novoComentario = {
        id: data_1.comentarios.length + 1,
        demandaId: id,
        usuarioId,
        texto,
        criadoEm: new Date().toISOString(),
    };
    data_1.comentarios.push(novoComentario);
    res.status(201).json(novoComentario);
});
exports.default = router;
//# sourceMappingURL=detalhes-demanda.js.map