/*
  Autor: Lucas Rodrigues Xavier | 25000508
  Descricao: Modulo simples de conexao com o banco de dados Oracle (Reuniao 5 / PI-II)
*/

import oracledb from "oracledb";
import dotenv from "dotenv";

dotenv.config();

// Habilita retorno de objetos com os nomes das colunas em vez de arrays posicionais
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

const dbConfig = {
  user: process.env.DB_USER || "system",
  password: process.env.DB_PASSWORD || "oracle",
  connectString: process.env.DB_CONNECT_STRING || "localhost:1521/XEPDB1",
};

/**
 * Executa uma consulta SQL no Oracle de forma simples e direta.
 * Fecha a conexao automaticamente ao finalizar.
 */
export async function executarConsulta<T = any>(
  sql: string,
  params: Record<string, any> | any[] = []
): Promise<T[]> {
  let conexao;
  try {
    conexao = await oracledb.getConnection(dbConfig);
    const resultado = await conexao.execute(sql, params);
    return (resultado.rows as T[]) || [];
  } finally {
    if (conexao) {
      try {
        await conexao.close();
      } catch (err) {
        console.error("Erro ao fechar conexao com o Oracle:", err);
      }
    }
  }
}

/**
 * Testa se o banco Oracle esta acessivel.
 */
export async function testarConexao(): Promise<boolean> {
  let conexao;
  try {
    conexao = await oracledb.getConnection(dbConfig);
    console.log("Conectado ao Banco de Dados Oracle com sucesso!");
    return true;
  } catch (erro) {
    console.warn(
      "Aviso: Nao foi possivel conectar ao Oracle. Utilizando dados de teste em memoria como fallback."
    );
    return false;
  } finally {
    if (conexao) {
      await conexao.close();
    }
  }
}
