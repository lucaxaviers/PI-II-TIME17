/*------------------------------------------------------------------
 * Autor: Gabriela Amanda Pereira
 * Descrição: Validação dos campos do cadastro de demanda.
 -------------------------------------------------------------------*/

(function () {
    "use strict";

    var formulario = document.querySelector("form");

    var titulo = document.getElementById("titulo");
    var descricao = document.getElementById("descricao");
    var projeto = document.getElementById("projeto");
    var tipo = document.getElementById("tipo");
    var prioridade = document.getElementById("prioridade");
    var campoPrazo = document.getElementById("prazo");

    /*--------------------------------------------------------------
     * Criação da mensagem de erro do prazo
     --------------------------------------------------------------*/

    var mensagemErro = document.createElement("small");
    mensagemErro.className = "erro-prazo";
    campoPrazo.parentNode.appendChild(mensagemErro);


    /*--------------------------------------------------------------
     * Verifica se a data possui um formato válido
     --------------------------------------------------------------*/

    function dataEhValida(valor) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
            return false;
        }

        var partes = valor.split("-");
        var ano = Number(partes[0]);
        var mes = Number(partes[1]);
        var dia = Number(partes[2]);

        var data = new Date(ano, mes - 1, dia);

        return (
            data.getFullYear() === ano &&
            data.getMonth() === mes - 1 &&
            data.getDate() === dia
        );
    }


    /*--------------------------------------------------------------
     * Validação do prazo
     --------------------------------------------------------------*/

    function validarPrazo() {
        var valor = campoPrazo.value.trim();

        mensagemErro.textContent = "";
        campoPrazo.classList.remove("invalido");

        // O prazo pode ficar vazio no cadastro
        if (!valor) {
            return true;
        }

        if (!dataEhValida(valor)) {
            mensagemErro.textContent = "A data informada é inválida.";
            campoPrazo.classList.add("invalido");
            return false;
        }

        return true;
    }


    /*--------------------------------------------------------------
     * Validação do título
     --------------------------------------------------------------*/

    function validarTitulo() {
        var valor = titulo.value.trim();

        if (valor === "") {
            alert("Preencha o título da demanda.");
            titulo.focus();
            return false;
        }

        if (valor.length < 5) {
            alert("O título da demanda deve ter pelo menos 5 caracteres.");
            titulo.focus();
            return false;
        }

        return true;
    }


    /*--------------------------------------------------------------
     * Validação da descrição
     --------------------------------------------------------------*/

    function validarDescricao() {
        var valor = descricao.value.trim();

        if (valor === "") {
            alert("Preencha a descrição da demanda.");
            descricao.focus();
            return false;
        }

        return true;
    }


    /*--------------------------------------------------------------
     * Validação do projeto
     --------------------------------------------------------------*/

    function validarProjeto() {
        if (projeto.value === "") {
            alert("Selecione um projeto.");
            projeto.focus();
            return false;
        }

        return true;
    }


    /*--------------------------------------------------------------
     * Validação do tipo
     --------------------------------------------------------------*/

    function validarTipo() {
        if (tipo.value === "") {
            alert("Selecione o tipo da demanda.");
            tipo.focus();
            return false;
        }

        return true;
    }


    /*--------------------------------------------------------------
     * Validação da prioridade
     --------------------------------------------------------------*/

    function validarPrioridade() {
        if (prioridade.value === "") {
            alert("Selecione a prioridade.");
            prioridade.focus();
            return false;
        }

        return true;
    }


    /*--------------------------------------------------------------
     * Validações realizadas ao enviar o formulário
     --------------------------------------------------------------*/

    formulario.addEventListener("submit", function (evento) {

        if (!validarTitulo()) {
            evento.preventDefault();
            return;
        }

        if (!validarDescricao()) {
            evento.preventDefault();
            return;
        }

        if (!validarProjeto()) {
            evento.preventDefault();
            return;
        }

        if (!validarTipo()) {
            evento.preventDefault();
            return;
        }

        if (!validarPrioridade()) {
            evento.preventDefault();
            return;
        }

        if (!validarPrazo()) {
            evento.preventDefault();
            campoPrazo.focus();
            return;
        }
    });


    /*--------------------------------------------------------------
     * Valida o prazo quando o usuário altera o campo
     --------------------------------------------------------------*/

    campoPrazo.addEventListener("change", validarPrazo);

}());