
const formulario = document.querySelector("#formFiltros");
const campoTitulo = document.querySelector("#titulo");
const campoPrioridade = document.querySelector("#prioridade");
const campoTipo = document.querySelector("#tipo");
const campoResponsavel = document.querySelector("#responsavel");
const campoProjeto = document.querySelector("#projeto");
const campoDescricao = document.querySelector("#descricao");

const erroTitulo = document.querySelector("#errotitulo");
const erroDescricao = document.querySelector("#errodescricao");
const erroQtdFiltros = document.querySelector("#erroqtdfiltros");

const btnAplicar = document.querySelector("#btnAplicar");
const btnLimpar = document.querySelector("#btnLimpar");

const botoesStatus = document.querySelectorAll("#filtros-status .filtro");

const API_URL = "/demandas";

// Armazena as demandas recebidas do backend
let demandasCarregadas = [];

// Status selecionado. Vazio representa Todas.
let statusSelecionado = "";

function mostrarErro(divErro, mensagem) {
    divErro.textContent = mensagem;
    divErro.style.display = "block";
}

function esconderErro(divErro) {
    divErro.textContent = "";
    divErro.style.display = "none";
}


// Normaliza o texto do status para facilitar as comparações
function normalizarStatus(status) {
    return String(status ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, "");
}


// Busca as demandas no backend
async function buscarDemandas(filtros = {}) {
    try {
        const parametros = new URLSearchParams();

        Object.entries(filtros).forEach(([chave, valor]) => {
            if (valor !== "") {
                parametros.append(chave, valor);
            }
        });

        const url = parametros.toString()
            ? `${API_URL}?${parametros.toString()}`
            : API_URL;

        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar demandas");
        }

        const demandas = await resposta.json();

        demandasCarregadas = demandas;

        atualizarContadores(demandasCarregadas);
        exibirDemandas(demandasCarregadas);

    } catch (erro) {
        console.error("Erro:", erro);
    }
}


// Atualiza a quantidade de demandas em cada status
function atualizarContadores(demandas) {
    botoesStatus.forEach(botao => {
        const status = botao.dataset.status;
        const contador = botao.querySelector(".contador");

        let quantidade;

        if (status === "") {
            quantidade = demandas.length;
        } else {
            quantidade = demandas.filter(demanda =>
                normalizarStatus(demanda.status) === normalizarStatus(status)
            ).length;
        }

        contador.textContent = quantidade;
    });
}


// Seleciona um status e atualiza a tabela
function selecionarStatus(status) {
    statusSelecionado = status;

    botoesStatus.forEach(botao => {
        botao.classList.toggle(
            "ativo",
            botao.dataset.status === statusSelecionado
        );
    });

    exibirDemandas(demandasCarregadas);
}


// Formata datas
function formatarData(data) {
    if (!data) {
        return "—";
    }

    const dataConvertida = new Date(data);

    if (isNaN(dataConvertida.getTime())) {
        return "—";
    }

    return dataConvertida.toLocaleDateString("pt-BR");
}


// Carrega os usuários disponíveis
async function carregarUsuarios() {
    try {
        const resposta = await fetch("/usuarios/projeto");

        if (!resposta.ok) {
            throw new Error("Erro ao carregar usuários");
        }

        const usuarios = await resposta.json();

        usuarios.forEach(usuario => {
            const opcao = document.createElement("option");

            opcao.value = usuario.nome;
            opcao.textContent = usuario.nome;

            campoResponsavel.appendChild(opcao);
        });

    } catch (erro) {
        console.error("Erro ao carregar usuários:", erro);
    }
}


// Carrega os projetos disponíveis
async function carregarProjetos() {
    try {
        const resposta = await fetch("/projetos");

        if (!resposta.ok) {
            throw new Error("Erro ao carregar projetos");
        }

        const projetos = await resposta.json();

        projetos.forEach(projeto => {
            const opcao = document.createElement("option");

            opcao.value = projeto.id;
            opcao.textContent = projeto.nome;

            campoProjeto.appendChild(opcao);
        });

    } catch (erro) {
        console.error("Erro ao carregar projetos:", erro);
    }
}


// Evita que dados sejam interpretados como HTML
function escaparHTML(valor) {
    return String(valor ?? "—").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caractere]);
}


// Retorna a classe CSS correspondente ao status
function classeStatus(status) {
    const normalizado = normalizarStatus(status);

    const classes = {
        "aberta": "aberta",
        "emandamento": "andamento",
        "emrevisao": "revisao",
        "concluida": "concluida",
        "cancelada": "cancelada"
    };

    return classes[normalizado] || "";
}


// Exibe as demandas na tabela
function exibirDemandas(demandas) {
    const tabela = document.getElementById("tabelaDemandas");

    tabela.innerHTML = "";

    // Aplica o filtro de status selecionado
    const demandasFiltradas = statusSelecionado === ""
        ? demandas
        : demandas.filter(demanda =>
            normalizarStatus(demanda.status) === normalizarStatus(statusSelecionado)
        );

    if (!demandasFiltradas || demandasFiltradas.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center;">
                    Não há demandas para este filtro.
                </td>
            </tr>
        `;
        return;
    }

    tabela.innerHTML = demandasFiltradas.map(demanda => {
        const statusClasse = classeStatus(demanda.status);

        return `
            <tr>
                <td data-label="ID">
                    ${escaparHTML(demanda.id)}
                </td>

                <td data-label="Título">
                    ${escaparHTML(demanda.titulo)}
                </td>

                <td data-label="Tipo">
                    ${escaparHTML(demanda.tipo)}
                </td>

                <td data-label="Prioridade">
                    ${escaparHTML(demanda.prioridade)}
                </td>

                <td data-label="Responsável">
                    ${escaparHTML(demanda.responsavel)}
                </td>

                <td data-label="Status">
                    <span class="status ${statusClasse}">
                        ${escaparHTML(demanda.status)}
                    </span>
                </td>

                <td data-label="Data criação">
                    ${formatarData(demanda.dataCriacao)}
                </td>

                <td data-label="Data finalização">
                    ${formatarData(demanda.dataFinalizacao)}
                </td>

              <td class="acao" data-label="Ações">
                <a href="detalhes_demanda.html?id=${encodeURIComponent(demanda.id)}"class="btn-detalhes">
                Detalhes
                </a>
            </td>
            </tr>
        `;
    }).join("");
}


// Inicialização da página
document.addEventListener("DOMContentLoaded", () => {
    buscarDemandas();
    carregarUsuarios();
    carregarProjetos();
});


// Eventos dos botões de status
botoesStatus.forEach(botao => {
    botao.addEventListener("click", () => {
        selecionarStatus(botao.dataset.status);
    });
});


// Verifica quantos filtros foram preenchidos
function verificarFiltros(titulo, prioridade, tipo, responsavel, projeto, descricao) {
    let cont = 0;

    if (titulo !== "") cont++;
    if (prioridade !== "") cont++;
    if (tipo !== "") cont++;
    if (responsavel !== "") cont++;
    if (projeto !== "") cont++;
    if (descricao !== "") cont++;

    return cont;
}


// Botão Limpar
btnLimpar.addEventListener("click", function () {
    formulario.reset();

    esconderErro(erroTitulo);
    esconderErro(erroQtdFiltros);
    esconderErro(erroDescricao);

    selecionarStatus("");

    buscarDemandas();
});


// Aplicação dos filtros
formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const titulo = campoTitulo.value.trim();
    const prioridade = campoPrioridade.value;
    const tipo = campoTipo.value;
    const responsavel = campoResponsavel.value;
    const projeto = campoProjeto.value;
    const descricao = campoDescricao.value.trim();

    if (verificarFiltros(titulo, prioridade, tipo, responsavel, projeto, descricao) < 2) {
        mostrarErro(erroQtdFiltros, "Precisa de no mínimo 2 filtros");
        return;
    }

    esconderErro(erroQtdFiltros);

    const filtros = {
        titulo,
        prioridade,
        tipo,
        responsavel,
        idProjetoAssociado: projeto,
        descricao
    };

    // Ao aplicar novos filtros, volta para Todas
    selecionarStatus("");

    buscarDemandas(filtros);
});
