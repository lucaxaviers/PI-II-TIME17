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
const cors_1 = __importDefault(require("cors"));
const sessao_1 = require("./sessao");
const database_1 = require("./database");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/app", express_1.default.static(path_1.default.join(__dirname, "../frontend")));
// Rotas de login e usuários
app.use(usuarios_1.default);
// Rotas de cadastro de demandas
app.use(cadastroDemandas_1.default);
// Rota inicial
app.get("/", (_req, res) => {
    res.status(200).json({
        status: "ok",
        message: "funcionando",
    });
});
// Redirecionamentos
app.get("/login", (_req, res) => {
    res.redirect("/app/pages/login.html");
});
app.get("/cadastro", (_req, res) => {
    res.redirect("/app/pages/cadastro_usuario.html");
});
app.get("/dashboard", (_req, res) => {
    res.redirect("/app/pages/dashboard.html");
});
app.get("/app/pages/demandas.html", (_req, res) => {
    res.redirect("/app/pages/lista_demandas.html");
});
app.get("/demandas.html", (_req, res) => {
    res.redirect("/app/pages/lista_demandas.html");
});
const camposPermitidos = [
    "id",
    "titulo",
    "tipo",
    "prioridade",
    "idUsuario",
    "idProjetoAssociado",
    "status",
    "dataCriacao",
    "dataFinalizacao",
];
// Pesos para ordenação de prioridade
const pesoPrioridade = {
    "Crítica": 1,
    "Alta": 2,
    "Média": 3,
    "Baixa": 4,
};
// Pesos para ordenação de status
const pesoStatus = {
    "Aberta": 1,
    "Em andamento": 2,
    "Em revisão": 3,
    "Concluída": 4,
    "Cancelada": 5,
};
// Função responsável pela ordenação
function ordenarDemandas(lista, campo, direcao) {
    const fator = direcao === "desc" ? -1 : 1;
    return [...lista].sort((a, b) => {
        // Campos que aceitam valores nulos
        if (campo === "dataFinalizacao" || campo === "idUsuario") {
            const valA = a[campo];
            const valB = b[campo];
            // Valores nulos permanecem no final
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
            case "idProjetoAssociado":
                return (a[campo] - b[campo]) * fator;
            case "titulo":
            case "tipo":
                return a[campo].localeCompare(b[campo], "pt-BR", { sensitivity: "base" }) * fator;
            case "prioridade":
                return (pesoPrioridade[a.prioridade] -
                    pesoPrioridade[b.prioridade]) * fator;
            case "status":
                return (pesoStatus[a.status] -
                    pesoStatus[b.status]) * fator;
            case "dataCriacao":
                return (a.dataCriacao.getTime() -
                    b.dataCriacao.getTime()) * fator;
            default:
                return 0;
        }
    });
}
// GET - Listagem, filtros e ordenação das demandas
app.get("/demandas", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { titulo, descricao, prioridade, tipo, idUsuario, idProjetoAssociado, ordenarPor, direcao } = req.query;
    // Verifica o usuário autenticado
    const ator = (0, sessao_1.usuarioDaSessao)(req);
    if (!ator) {
        return res.status(401).json({
            erro: "Entre novamente com o Oracle disponível."
        });
    }
    let resultado;
    try {
        resultado = yield (0, database_1.executarConsulta)(`
      SELECT
          d.id_demanda AS "id",
          d.titulo AS "titulo",
          d.descricao AS "descricao",
          d.id_projeto AS "idProjetoAssociado",
          d.id_responsavel AS "idUsuario",
          d.tipo AS "tipo",
          d.prioridade AS "prioridade",
          d.status AS "status",
          usuario.nome AS "responsavel",
          p.nome AS "nomeProjeto",
          d.data_criacao AS "dataCriacao",
          d.prazo_finalizacao AS "dataFinalizacao",
          d.data_atualizacao AS "dataAtualizacao"

      FROM demandas d

      LEFT JOIN usuarios usuario
          ON d.id_responsavel = usuario.id_usuario

      INNER JOIN projetos p
          ON d.id_projeto = p.id_projeto

      WHERE EXISTS (
          SELECT 1
          FROM usuarios sessao
          WHERE sessao.id_usuario = :ator
          AND (
              sessao.perfil = 'Administrador'

              OR d.id_responsavel = sessao.id_usuario

              OR EXISTS (
                  SELECT 1
                  FROM usuarios_projetos vinculo
                  WHERE vinculo.id_usuario = sessao.id_usuario
                  AND vinculo.id_projeto = d.id_projeto
              )
          )
      )
    `, { ator });
    }
    catch (erro) {
        console.error("Erro ao consultar demandas:", erro);
        return res.status(503).json({
            erro: "Não foi possível consultar as demandas no Oracle."
        });
    }
    // Filtro por título
    if (titulo) {
        resultado = resultado.filter((item) => item.titulo.toLowerCase().includes(String(titulo).toLowerCase()));
    }
    // Filtro por descrição
    if (descricao) {
        resultado = resultado.filter((item) => item.descricao.toLowerCase().includes(String(descricao).toLowerCase()));
    }
    // Filtro por prioridade
    if (prioridade) {
        resultado = resultado.filter((item) => item.prioridade.toLowerCase() ===
            String(prioridade).toLowerCase());
    }
    // Filtro por tipo
    if (tipo) {
        resultado = resultado.filter((item) => item.tipo.toLowerCase() ===
            String(tipo).toLowerCase());
    }
    // Filtro por responsável
    if (idUsuario !== undefined && idUsuario !== "") {
        resultado = resultado.filter((item) => item.idUsuario === Number(idUsuario));
    }
    // Filtro por projeto associado
    if (idProjetoAssociado !== undefined && idProjetoAssociado !== "") {
        resultado = resultado.filter((item) => item.idProjetoAssociado === Number(idProjetoAssociado));
    }
    // Ordenação
    if (ordenarPor) {
        const campo = String(ordenarPor);
        if (!camposPermitidos.includes(campo)) {
            return res.status(400).json({
                erro: `Campo de ordenação inválido. Use: ${camposPermitidos.join(", ")}`
            });
        }
        const dir = String(direcao).toLowerCase() === "desc"
            ? "desc"
            : "asc";
        resultado = ordenarDemandas(resultado, campo, dir);
    }
    return res.status(200).json(resultado);
}));
// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor executando em http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map