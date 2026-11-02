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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const usuarios_1 = __importDefault(require("./routes/usuarios"));
const cadastroDemandas_1 = __importDefault(require("./routes/cadastroDemandas"));
const sessao_1 = require("./sessao");
const database_1 = require("./database");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use("/app", express_1.default.static(path_1.default.join(__dirname, "../frontend")));
// Rotas de login e usuarios (Reuniao 4)
app.use(usuarios_1.default);
app.use(cadastroDemandas_1.default);
app.get("/", (_req, res) => {
    res.status(200).json({
        status: "ok",
        message: "funcionando",
    });
});
app.get("/login", (_req, res) => {
    res.redirect("/app/pages/login.html");
});
app.get("/cadastro", (_req, res) => {
    res.redirect("/app/pages/cadastro_usuario.html");
});
app.get("/dashboard", (_req, res) => {
    res.redirect("/app/pages/dashboard.html");
});
const camposPermitidos = [
    "id",
    "titulo",
    "tipo",
    "prioridade",
    "idUsuario",
    "status",
    "dataCriacao",
    "dataFinalizacao",
];
// "Peso" usado para ordenar prioridade e status
const pesoPrioridade = {
    "Crítica": 1,
    "Alta": 2,
    "Média": 3,
    "Baixa": 4,
};
const pesoStatus = {
    "Aberta": 1,
    "Em andamento": 2,
    "Em revisão": 3,
    "Concluída": 4,
    "Cancelada": 5,
};
function ordenarDemandas(lista, campo, direcao) {
    const fator = direcao === "desc" ? -1 : 1;
    return [...lista].sort((a, b) => {
        // Campos que podem ser nulos: nulos sempre no final, independente da direção
        if (campo === "dataFinalizacao" || campo === "idUsuario") {
            const valA = a[campo];
            const valB = b[campo];
            if (valA === null && valB === null)
                return 0;
            if (valA === null)
                return 1;
            if (valB === null)
                return -1;
            const numA = valA instanceof Date ? valA.getTime() : valA;
            const numB = valB instanceof Date ? valB.getTime() : valB;
            return (numA - numB) * fator;
        }
        switch (campo) {
            case "id":
                return (a.id - b.id) * fator;
            case "titulo":
            case "tipo":
                return a[campo].localeCompare(b[campo], "pt-BR", { sensitivity: "base" }) * fator;
            case "prioridade":
                return (pesoPrioridade[a.prioridade] - pesoPrioridade[b.prioridade]) * fator;
            case "status":
                return (pesoStatus[a.status] - pesoStatus[b.status]) * fator;
            case "dataCriacao":
                return (a.dataCriacao.getTime() - b.dataCriacao.getTime()) * fator;
            default:
                return 0;
        }
    });
}
app.get("/demandas", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { titulo, descricao, prioridade, tipo, idUsuario, idProjetoAssociado, ordenarPor, direcao } = req.query;
    const ator = (0, sessao_1.usuarioDaSessao)(req);
    if (!ator)
        return res.status(401).json({ erro: "Entre novamente com o Oracle disponível." });
    let resultado;
    try {
        resultado = yield (0, database_1.executarConsulta)(`SELECT id_demanda "id", titulo "titulo",
      descricao "descricao", tipo "tipo", prioridade "prioridade", status "status",
      id_projeto "idProjetoAssociado", id_responsavel "idUsuario", data_criacao "dataCriacao",
      prazo_finalizacao "dataFinalizacao", data_atualizacao "dataAtualizacao" FROM demandas d
      WHERE EXISTS (SELECT 1 FROM usuarios u WHERE u.id_usuario=:ator AND
        (u.perfil='Administrador' OR d.id_responsavel=u.id_usuario OR EXISTS
        (SELECT 1 FROM usuarios_projetos v WHERE v.id_usuario=u.id_usuario AND v.id_projeto=d.id_projeto)))`, { ator });
    }
    catch (_a) {
        return res.status(503).json({ erro: "Não foi possível consultar as demandas no Oracle." });
    }
    if (titulo) {
        resultado = resultado.filter((item) => item.titulo.toLowerCase().includes(String(titulo).toLowerCase()));
    }
    if (descricao) {
        resultado = resultado.filter((item) => item.descricao.toLowerCase().includes(String(descricao).toLowerCase()));
    }
    if (prioridade) {
        resultado = resultado.filter((item) => item.prioridade.toLowerCase() === String(prioridade).toLowerCase());
    }
    if (tipo) {
        resultado = resultado.filter((item) => item.tipo.toLowerCase() === String(tipo).toLowerCase());
    }
    if (idUsuario) {
        resultado = resultado.filter((item) => item.idUsuario === Number(idUsuario));
    }
    if (idProjetoAssociado) {
        resultado = resultado.filter((item) => item.idProjetoAssociado === Number(idProjetoAssociado));
    }
    if (ordenarPor) {
        const campo = String(ordenarPor);
        if (!camposPermitidos.includes(campo)) {
            return res.status(400).json({
                erro: `Campo de ordenação inválido. Use: ${camposPermitidos.join(", ")}`,
            });
        }
        const dir = String(direcao).toLowerCase() === "desc" ? "desc" : "asc";
        resultado = ordenarDemandas(resultado, campo, dir);
    }
    return res.status(200).json(resultado);
}));
app.listen(PORT, () => {
    console.log(`Servidor executando em http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map