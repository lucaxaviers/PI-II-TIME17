"use strict";
/*
  Autor: Lucas Rodrigues Xavier | 25000508
  Descricao: Modulo simples de conexao com o banco de dados Oracle (Reuniao 5 / PI-II)
*/
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
exports.executarConsulta = executarConsulta;
exports.testarConexao = testarConexao;
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Habilita retorno de objetos com os nomes das colunas em vez de arrays posicionais
oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
oracledb_1.default.autoCommit = true;
const dbConfig = {
    user: process.env.DB_USER || "system",
    password: process.env.DB_PASSWORD || "oracle",
    connectString: process.env.DB_CONNECT_STRING || "localhost:1521/XEPDB1",
};
/**
 * Executa uma consulta SQL no Oracle de forma simples e direta.
 * Fecha a conexao automaticamente ao finalizar.
 */
function executarConsulta(sql_1) {
    return __awaiter(this, arguments, void 0, function* (sql, params = []) {
        let conexao;
        try {
            conexao = yield oracledb_1.default.getConnection(dbConfig);
            const resultado = yield conexao.execute(sql, params);
            return resultado.rows || [];
        }
        finally {
            if (conexao) {
                try {
                    yield conexao.close();
                }
                catch (err) {
                    console.error("Erro ao fechar conexao com o Oracle:", err);
                }
            }
        }
    });
}
/**
 * Testa se o banco Oracle esta acessivel.
 */
function testarConexao() {
    return __awaiter(this, void 0, void 0, function* () {
        let conexao;
        try {
            conexao = yield oracledb_1.default.getConnection(dbConfig);
            console.log("Conectado ao Banco de Dados Oracle com sucesso!");
            return true;
        }
        catch (erro) {
            console.warn("Aviso: Nao foi possivel conectar ao Oracle. Utilizando dados de teste em memoria como fallback.");
            return false;
        }
        finally {
            if (conexao) {
                yield conexao.close();
            }
        }
    });
}
//# sourceMappingURL=database.js.map