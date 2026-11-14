/*
 * Autor: Felipe D. dos Passos | 26002875
   Descricao: validação dos filtros das demandas
 */

const formulario = document.querySelector("#formFiltros");
const campoTitulo = document.querySelector("#titulo");
const campoPrioridade = document.querySelector("#prioridade")
const campoTipo = document.querySelector("#tipo");
const campoResponsavel = document.querySelector("#responsavel");
const campoProjeto = document.querySelector("#projeto");
const campoDescricao = document.querySelector("#descricao");
const erroTitulo = document.querySelector("#errotitulo");
const erroDescricao = document.querySelector("#errodescricao");
const erroQtdFiltros = document.querySelector("#erroqtdfiltros");
const btnAplicar = document.querySelector("#btnAplicar");
const btnLimpar = document.querySelector("#btnLimpar");



function mostrarErro(divErro, mensagem) {
    divErro.textContent = mensagem; 
    divErro.style.display = "block";
}
function esconderErro(divErro) {
    divErro.textContent = "";
    divErro.style.display = "none";
}
const API_URL = "/demandas";


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

        exibirDemandas(demandas);

    } catch (erro) {
        console.error("Erro:", erro);
    }
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

async function carregarUsuarios() {
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
}


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



function escaparHTML(valor) {
    return String(valor ?? "—").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caractere]);
}


function classeStatus(status) {
    const normalizado = String(status ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, "");

    const classes = {
        "aberta": "aberta",
        "emandamento": "andamento",
        "emrevisao": "revisao",
        "concluida": "concluida",
        "cancelada": "cancelada"
    };

    return classes[normalizado] || "";
}


function exibirDemandas(demandas) {
    const tabela = document.getElementById("tabelaDemandas");

    tabela.innerHTML = "";

    if (!demandas || demandas.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center;">
                    Não há nenhuma demanda cadastrada.
                </td>
            </tr>
        `;
        return;
    }

    tabela.innerHTML = demandas.map(demanda => {
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
                    
                </td>
            </tr>
        `;
    }).join("");
}



document.addEventListener('DOMContentLoaded',()=>{
    buscarDemandas();
    carregarUsuarios();
    carregarProjetos();
});




function verificarFiltros(prioridade,tipo,responsavel,projeto){
    let cont = 0;
    if(prioridade !== ""){
        cont++;
    }
    if(tipo !== ""){
        cont++;
    }
    if(responsavel !== ""){
        cont++;
    }
    if(projeto !== ""){
        cont++;
    }
    return cont;
}

btnLimpar.addEventListener("click", function(){
    formulario.reset();
    esconderErro(erroTitulo);
    esconderErro(erroQtdFiltros);
    esconderErro(erroDescricao);
    buscarDemandas();
});




formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const titulo = campoTitulo.value.trim();
    const prioridade = campoPrioridade.value;
    const tipo = campoTipo.value;
    const responsavel = campoResponsavel.value;
    const projeto = campoProjeto.value;
    const descricao = campoDescricao.value.trim();

    if (verificarFiltros(prioridade, tipo, responsavel, projeto) < 2) {
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

    buscarDemandas(filtros);
});






