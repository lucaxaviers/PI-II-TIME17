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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErroDemanda = void 0;
exports.validarPrazo = validarPrazo;
// Gabriel Santucci de Novaes | Consulta de feriados nacionais pela BrasilAPI.
class ErroDemanda extends Error {
    constructor(status, mensagem) {
        super(mensagem);
        this.status = status;
    }
}
exports.ErroDemanda = ErroDemanda;
function validarPrazo(prazo) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = new Date(prazo);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(prazo) || !Number.isFinite(data.getTime()) ||
            data.toISOString().slice(0, 10) !== prazo) {
            throw new ErroDemanda(400, "Informe uma data válida no formato AAAA-MM-DD.");
        }
        const hoje = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Sao_Paulo" }).format(new Date());
        if (prazo < hoje)
            throw new ErroDemanda(400, "O prazo não pode estar no passado.");
        let feriados;
        try {
            const resposta = yield fetch("https://brasilapi.com.br/api/feriados/v1/" + prazo.slice(0, 4), { signal: AbortSignal.timeout(5000) });
            if (!resposta.ok)
                throw new Error();
            feriados = yield resposta.json();
            if (!Array.isArray(feriados) || !feriados.every(f => typeof (f === null || f === void 0 ? void 0 : f.date) === "string"))
                throw new Error();
        }
        catch (_a) {
            throw new ErroDemanda(503, "Não foi possível verificar os feriados. Tente novamente.");
        }
        if (feriados.some(f => f.date === prazo))
            throw new ErroDemanda(400, "O prazo coincide com um feriado nacional.");
    });
}
//# sourceMappingURL=feriados.js.map