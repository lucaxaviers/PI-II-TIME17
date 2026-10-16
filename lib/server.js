"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use("/app", express_1.default.static(path_1.default.join(__dirname, "../frontend")));
<<<<<<< felipe
=======
let demandas = [
    {
        id: 1,
        titulo: "Implementar tela de login",
        descricao: "Desenvolver a tela de login com validação de e-mail e senha.",
        idProjetoAssociado: 1,
        tipo: "Tarefa",
        prioridade: "Alta",
        status: "Andamento",
        idUsuario: 1,
        dataCriacao: new Date("2026-10-10"),
        dataFinalizacao: null,
        dataAtualizacao: new Date("2026-10-15")
    },
    {
        id: 2,
        titulo: "Corrigir erro no cadastro",
        descricao: "Corrigir falha que impede o usuário de concluir o cadastro no sistema.",
        idProjetoAssociado: 2,
        tipo: "Defeito",
        prioridade: "Crítica",
        status: "Aberta",
        idUsuario: 2,
        dataCriacao: new Date("2026-10-12"),
        dataFinalizacao: null,
        dataAtualizacao: new Date("2026-10-12")
    },
    {
        id: 3,
        titulo: "Melhorar responsividade da página",
        descricao: "Ajustar o layout para garantir uma boa visualização em celulares e tablets.",
        idProjetoAssociado: 3,
        tipo: "Melhoria",
        prioridade: "Média",
        status: "Concluída",
        idUsuario: 1,
        dataCriacao: new Date("2026-10-01"),
        dataFinalizacao: new Date("2026-10-08"),
        dataAtualizacao: new Date("2026-10-08")
    }
];
app.use(usuarios_1.default);
>>>>>>> local
app.get("/", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "funcionando",
    });
});
<<<<<<< felipe
app.get("/demandas", (req, res) => {
    res.redirect("/app/pages/lista_demandas.html");
});
=======
app.get("/login", (req, res) => {
    res.status(200).redirect("/app/pages/login.html");
});
app.get("/cadastro", (req, res) => {
    res.status(200).redirect("/app/pages/cadastro_usuario.html");
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
const pesoPrioridade = {
    "Crítica": 1, //coloca esses campos com um "peso" pra quando for feito o filtro ser decidido por ele
    "Alta": 2,
    "Média": 3,
    "Baixa": 4,
};
const pesoStatus = {
    "Aberta": 1,
    "Andamento": 2,
    "Revisão": 3,
    "Concluída": 4,
    "Cancelada": 5,
};
function ordenarDemandas(lista, //pega todas as demandas criadas
campo, // qual campo que vai ser ordenado
direcao // se vai ser crecente ou decrescente
) {
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
app.get("/demandas", (_req, res) => {
    const { titulo, descricao, prioridade, tipo, idUsuario, idProjetoAssociado, ordenarPor, direcao } = _req.query;
    let resultado = demandas;
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
        resultado = resultado.filter((item) => item.tipo.toLowerCase() === String(tipo));
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
});
app.get("/dashboard", (_req, res) => {
    res.status(200).redirect("/app/pages/dashboard.html");
});
>>>>>>> local
app.listen(PORT, () => {
    console.log(`Servidor executando em http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map