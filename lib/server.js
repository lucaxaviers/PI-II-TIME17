"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dados_1 = require("./dados");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use("/app", express_1.default.static(path_1.default.join(__dirname, "../frontend")));
app.get("/", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "funcionando",
    });
});
app.get("/demandas", (req, res) => {
    res.redirect("/app/pages/lista_demandas.html");
});
app.get("/dashboard", (req, res) => {
    const status = [
        "Aberta",
        "Em andamento",
        "Em revisão",
        "Concluída",
        "Cancelada",
    ];
    const prioridades = ["Crítica", "Alta", "Média", "Baixa"];
    const tipos = ["Tarefa", "Defeito", "Melhoria", "Documentação"];
    const porStatus = {};
    const porPrioridade = {};
    const porTipo = {};
    status.forEach((item) => {
        porStatus[item] = dados_1.demandas.filter((demanda) => demanda.status === item).length;
    });
    prioridades.forEach((item) => {
        porPrioridade[item] = dados_1.demandas.filter((demanda) => demanda.prioridade === item).length;
    });
    tipos.forEach((item) => {
        porTipo[item] = dados_1.demandas.filter((demanda) => demanda.tipo === item).length;
    });
    const statusEmAberto = ["Aberta", "Em andamento", "Em revisão"];
    const demandasCriticasEmAberto = dados_1.demandas.filter((demanda) => demanda.prioridade === "Crítica" &&
        statusEmAberto.includes(demanda.status));
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const limite = new Date(hoje);
    limite.setDate(limite.getDate() + 3);
    const demandasProximasDoPrazo = dados_1.demandas.filter((demanda) => {
        const prazo = new Date(demanda.prazoFinalizacao + "T00:00:00");
        return (statusEmAberto.includes(demanda.status) &&
            prazo >= hoje &&
            prazo <= limite);
    });
    res.status(200).json({
        total: dados_1.demandas.length,
        porStatus,
        porPrioridade,
        porTipo,
        demandasCriticasEmAberto,
        demandasProximasDoPrazo,
    });
});
app.listen(PORT, () => {
    console.log(`Servidor executando em http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map