/**
 * Autor: Enrico Locateli Costa | 26003119
 */

(function () {
    "use strict";

    var STATUS_PERMITIDOS = [
        "aberta",
        "em-andamento",
        "em-revisao",
        "concluida",
        "cancelada"
    ];

    var DATA_CRIACAO = "2026-08-27";

    var formComentario = document.getElementById("form-comentario");
    var formAtualizacao = document.getElementById("form-atualizacao");

    function obterCampo(formulario, nome) {
        return formulario.querySelector('[data-campo="' + nome + '"]');
    }

    function mostrarErro(campo, mensagem) {
        campo.classList.add("invalido");
        var erro = campo.querySelector(".mensagem-erro");
        if (erro) {
            erro.textContent = mensagem;
        }
    }

    function limparErro(campo) {
        campo.classList.remove("invalido");
        var erro = campo.querySelector(".mensagem-erro");
        if (erro) {
            erro.textContent = "";
        }
    }

    function ocultarAlerta(alerta) {
        if (alerta) {
            alerta.hidden = true;
        }
    }

    function mostrarAlerta(alerta) {
        if (alerta) {
            alerta.hidden = false;
        }
    }

    function textoValido(valor, minimo, maximo) {
        var conteudo = valor.trim();

        if (!conteudo) {
            return "Preencha este campo. Ele não pode ficar vazio.";
        }

        if (conteudo.length < minimo) {
            return "Informe pelo menos " + minimo + " caracteres.";
        }

        if (conteudo.length > maximo) {
            return "Use no máximo " + maximo + " caracteres.";
        }

        return "";
    }

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

    function compararDatas(dataA, dataB) {
        if (dataA === dataB) {
            return 0;
        }

        return dataA < dataB ? -1 : 1;
    }

    function validarComentario() {
        var campo = obterCampo(formComentario, "comentario");
        var area = document.getElementById("novoComentario");
        var mensagem = textoValido(area.value, 10, 500);

        if (mensagem) {
            mostrarErro(campo, mensagem);
            return false;
        }

        limparErro(campo);
        return true;
    }

    function validarStatus() {
        var campo = obterCampo(formAtualizacao, "status");
        var select = document.getElementById("novoStatus");
        var valor = select.value;

        if (!valor) {
            mostrarErro(campo, "Selecione um status para continuar.");
            return false;
        }

        if (STATUS_PERMITIDOS.indexOf(valor) === -1) {
            mostrarErro(campo, "Status inválido. Use apenas os estados previstos no sistema.");
            return false;
        }

        limparErro(campo);
        return true;
    }

    function validarPrazo() {
        var campo = obterCampo(formAtualizacao, "prazo");
        var input = document.getElementById("prazoFinalizacao");
        var valor = input.value.trim();

        if (!valor) {
            mostrarErro(campo, "Informe o prazo de finalização.");
            return false;
        }

        if (!dataEhValida(valor)) {
            mostrarErro(campo, "A data informada é inválida.");
            return false;
        }

        if (compararDatas(valor, DATA_CRIACAO) < 0) {
            mostrarErro(campo, "O prazo não pode ser anterior à data de criação da demanda.");
            return false;
        }

        limparErro(campo);
        return true;
    }

    function validarJustificativa() {
        var campo = obterCampo(formAtualizacao, "justificativa");
        var area = document.getElementById("justificativa");
        var mensagem = textoValido(area.value, 10, 300);

        if (mensagem) {
            mostrarErro(campo, mensagem);
            return false;
        }

        limparErro(campo);
        return true;
    }

    function validarConfirmacao() {
        var campo = obterCampo(formAtualizacao, "confirmacao");
        var checkbox = document.getElementById("confirmarAlteracao");

        if (!checkbox.checked) {
            mostrarErro(campo, "Marque a confirmação para registrar a alteração.");
            return false;
        }

        limparErro(campo);
        return true;
    }

    function validarAtualizacao() {
        var statusOk = validarStatus();
        var prazoOk = validarPrazo();
        var justificativaOk = validarJustificativa();
        var confirmacaoOk = validarConfirmacao();

        return statusOk && prazoOk && justificativaOk && confirmacaoOk;
    }

    formComentario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        ocultarAlerta(document.getElementById("alerta-comentario"));

        if (!validarComentario()) {
            document.getElementById("novoComentario").focus();
            return;
        }

        mostrarAlerta(document.getElementById("alerta-comentario"));
        formComentario.reset();
        limparErro(obterCampo(formComentario, "comentario"));
    });

    formAtualizacao.addEventListener("submit", function (evento) {
        evento.preventDefault();
        ocultarAlerta(document.getElementById("alerta-atualizacao"));

        if (!validarAtualizacao()) {
            var primeiroInvalido = formAtualizacao.querySelector(".invalido select, .invalido input, .invalido textarea");
            if (primeiroInvalido) {
                primeiroInvalido.focus();
            }
            return;
        }

        mostrarAlerta(document.getElementById("alerta-atualizacao"));
    });

    document.getElementById("novoComentario").addEventListener("input", function () {
        ocultarAlerta(document.getElementById("alerta-comentario"));
        validarComentario();
    });

    document.getElementById("novoStatus").addEventListener("change", validarStatus);
    document.getElementById("prazoFinalizacao").addEventListener("change", validarPrazo);
    document.getElementById("justificativa").addEventListener("input", validarJustificativa);
    document.getElementById("confirmarAlteracao").addEventListener("change", validarConfirmacao);
}());
