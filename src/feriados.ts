// Gabriel Santucci de Novaes | Consulta de feriados nacionais pela BrasilAPI.
export class ErroDemanda extends Error {
  constructor(public status: number, mensagem: string) { super(mensagem); }
}

export async function validarPrazo(prazo: string) {
  const data = new Date(prazo);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(prazo) || !Number.isFinite(data.getTime()) ||
      data.toISOString().slice(0, 10) !== prazo) {
    throw new ErroDemanda(400, "Informe uma data válida no formato AAAA-MM-DD.");
  }
  const hoje = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Sao_Paulo" }).format(new Date());
  if (prazo < hoje) throw new ErroDemanda(400, "O prazo não pode estar no passado.");
  let feriados;
  try {
    const resposta = await fetch("https://brasilapi.com.br/api/feriados/v1/" + prazo.slice(0, 4),
      { signal: AbortSignal.timeout(5000) });
    if (!resposta.ok) throw new Error();
    feriados = await resposta.json();
    if (!Array.isArray(feriados) || !feriados.every(f => typeof f?.date === "string")) throw new Error();
  } catch {
    throw new ErroDemanda(503, "Não foi possível verificar os feriados. Tente novamente.");
  }
  if (feriados.some(f => f.date === prazo)) throw new ErroDemanda(400, "O prazo coincide com um feriado nacional.");
}
