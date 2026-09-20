/*
 * Autor: Felipe D. dos Passos | 26002875
 */

const formulario = document.querySelector("#formFiltros");

const campoTitulo = document.querySelector("#titulo");
const campoPrioridade = document.querySelector("#prioridade")
const campoTipo = document.querySelector("#tipo");
const campoResponsavel = document.querySelector("#responsavel");
const campoProjeto = document.querySelector("#projeto");
const campoDescricao = document.querySelector("#descricao");

const btnAplicar = document.querySelector("#btnAplicar");
const btnLimpar = document.querySelector("#btnLimpar");


formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const titulo = campoTitulo.value.trim();
    const prioridade = campoPrioridade.value;
    const tipo = campoTipo.value;
    const responsavel = campoResponsavel.value;
    const projeto = campoProjeto.value;
    const descricao = campoDescricao.value.trim();

   
});





