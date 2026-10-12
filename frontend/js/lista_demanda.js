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
});

formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const titulo = campoTitulo.value.trim();
    const prioridade = campoPrioridade.value;
    const tipo = campoTipo.value;
    const responsavel = campoResponsavel.value;
    const projeto = campoProjeto.value;
    const descricao = campoDescricao.value.trim();

    if((verificarFiltros(prioridade,tipo,responsavel,projeto)) < 2){
        mostrarErro(erroQtdFiltros,"Precisa de no mínimo 2 filtros");
    }
    else{
        esconderErro(erroQtdFiltros);
    }
    
 
});





