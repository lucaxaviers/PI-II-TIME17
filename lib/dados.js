"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demandas = void 0;
exports.demandas = [
    {
        id: 1,
        titulo: "Corrigir erro no login",
        status: "Aberta",
        prioridade: "Crítica",
        tipo: "Defeito",
        prazoFinalizacao: diasAFrente(1)
    },
    {
        id: 2,
        titulo: "Criar tela de cadastro",
        status: "Em andamento",
        prioridade: "Alta",
        tipo: "Tarefa",
        prazoFinalizacao: diasAFrente(2)
    },
    {
        id: 3,
        titulo: "Revisar documentação",
        status: "Em revisão",
        prioridade: "Média",
        tipo: "Documentação",
        prazoFinalizacao: diasAFrente(5)
    },
    {
        id: 4,
        titulo: "Melhorar dashboard",
        status: "Concluída",
        prioridade: "Baixa",
        tipo: "Melhoria",
        prazoFinalizacao: diasAFrente(-2)
    },
    {
        id: 5,
        titulo: "Corrigir filtro de demandas",
        status: "Cancelada",
        prioridade: "Alta",
        tipo: "Defeito",
        prazoFinalizacao: diasAFrente(4)
    },
    {
        id: 6,
        titulo: "Ajustar formulário",
        status: "Aberta",
        prioridade: "Média",
        tipo: "Tarefa",
        prazoFinalizacao: diasAFrente(3)
    },
    {
        id: 7,
        titulo: "Atualizar relatório",
        status: "Em andamento",
        prioridade: "Crítica",
        tipo: "Melhoria",
        prazoFinalizacao: diasAFrente(6)
    },
    {
        id: 8,
        titulo: "Documentar a API",
        status: "Aberta",
        prioridade: "Baixa",
        tipo: "Documentação",
        prazoFinalizacao: diasAFrente(8)
    }
];
function diasAFrente(dias) {
    const data = new Date();
    data.setDate(data.getDate() + dias);
    return [
        data.getFullYear(),
        String(data.getMonth() + 1).padStart(2, "0"),
        String(data.getDate()).padStart(2, "0")
    ].join("-");
}
//# sourceMappingURL=dados.js.map