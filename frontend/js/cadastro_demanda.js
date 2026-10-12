/*------------------------------------------------------------------
 * Autor: Gabriel Santucci de Novaes | 26002102
 * Descricao: Validacao dos campos do cadastro de demanda.
 *            Escopo PI2 - Reuniao 3 (validacoes em JavaScript):
 *            - campos obrigatorios nao podem ficar vazios;
 *            - quantidade minima/maxima de caracteres em titulo e descricao;
 *            - tipo aceito apenas: Tarefa, Defeito, Melhoria ou Documentacao;
 *            - prioridade aceita apenas: Critica, Alta, Media ou Baixa;
 *            - projeto e selecoes obrigatorias;
 *            - prazo com formato e consistencia basica de data;
 *            - mensagens de erro claras e bloqueio do envio com dados invalidos.
 -------------------------------------------------------------------*/

(function () {
    "use strict";

    /* Apenas os valores previstos no escopo do sistema */
    var TIPOS_PERMITIDOS = ["tarefa", "defeito", "melhoria", "documentacao"];
    var PRIORIDADES_PERMITIDAS = ["critica", "alta", "media", "baixa"];
    var RESPONSAVEIS_PERMITIDOS = ["gabriel", "gabriela", "lucas"];

    var formCadastro = document.getElementById("form-cadastro");

    /*--------------------------------------------------------------
     * Retorna o elemento .campo (data-campo) de um determinado campo
     --------------------------------------------------------------*/
    function obterCampo(nome) {
        return formCadastro.querySelector('[data-campo="' + nome + '"]');
    }

    /*--------------------------------------------------------------
     * Exibe a mensagem de erro dentro do campo
     --------------------------------------------------------------*/
    function mostrarErro(campo, mensagem) {
        campo.classList.add("invalido");
        var erro = campo.querySelector(".mensagem-erro");
        if (erro) {
            erro.textContent = mensagem;
        }
    }

    /*--------------------------------------------------------------
     * Limpa a mensagem de erro do campo
     --------------------------------------------------------------*/
    function limparErro(campo) {
        campo.classList.remove("invalido");
        var erro = campo.querySelector(".mensagem-erro");
        if (erro) {
            erro.textContent = "";
        }
    }

    /*--------------------------------------------------------------
     * Oculta o alerta de sucesso
     --------------------------------------------------------------*/
    function ocultarAlerta() {
        var alerta = document.getElementById("alerta-cadastro");
        if (alerta) {
            alerta.hidden = true;
        }
    }

    /*--------------------------------------------------------------
     * Exibe o alerta de sucesso
     --------------------------------------------------------------*/
    function mostrarAlerta() {
        var alerta = document.getElementById("alerta-cadastro");
        if (alerta) {
            alerta.hidden = false;
        }
    }

    /*--------------------------------------------------------------
     * Valida texto obrigatorio respeitando minimo e maximo de caracteres
     --------------------------------------------------------------*/
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

    /*--------------------------------------------------------------
     * Verifica se a data possui formato e consistência válidos
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
     * Data de hoje no formato AAAA-MM-DD (para comparar com o prazo)
     --------------------------------------------------------------*/
    function hojeISO() {
        var agora = new Date();
        var mes = String(agora.getMonth() + 1).padStart(2, "0");
        var dia = String(agora.getDate()).padStart(2, "0");
        return agora.getFullYear() + "-" + mes + "-" + dia;
    }

    /*--------------------------------------------------------------
     * Validacao do titulo
     --------------------------------------------------------------*/
    function validarTitulo() {
        var campo = obterCampo("titulo");
        var input = document.getElementById("titulo");
        var mensagem = textoValido(input.value, 5, 120);

        if (mensagem) {
            mostrarErro(campo, mensagem);
            return false;
        }

        limparErro(campo);
        return true;
    }

    /*--------------------------------------------------------------
     * Validacao da descricao
     --------------------------------------------------------------*/
    function validarDescricao() {
        var campo = obterCampo("descricao");
        var area = document.getElementById("descricao");
        var mensagem = textoValido(area.value, 10, 1000);

        if (mensagem) {
            mostrarErro(campo, mensagem);
            return false;
        }

        limparErro(campo);
        return true;
    }

    /*--------------------------------------------------------------
     * Validacao do projeto (selecao obrigatoria)
     --------------------------------------------------------------*/
    function validarProjeto() {
        var campo = obterCampo("projeto");
        var select = document.getElementById("projeto");

        if (!select.value) {
            mostrarErro(campo, "Selecione um projeto.");
            return false;
        }

        limparErro(campo);
        return true;
    }

    /*--------------------------------------------------------------
     * Validacao do tipo (apenas Tarefa, Defeito, Melhoria ou Documentacao)
     --------------------------------------------------------------*/
    function validarTipo() {
        var campo = obterCampo("tipo");
        var select = document.getElementById("tipo");
        var valor = select.value;

        if (!valor) {
            mostrarErro(campo, "Selecione o tipo da demanda.");
            return false;
        }

        if (TIPOS_PERMITIDOS.indexOf(valor) === -1) {
            mostrarErro(campo, "Tipo inválido. Use apenas: Tarefa, Defeito, Melhoria ou Documentação.");
            return false;
        }

        limparErro(campo);
        return true;
    }

    /*--------------------------------------------------------------
     * Validacao da prioridade (apenas Critica, Alta, Media ou Baixa)
     --------------------------------------------------------------*/
    function validarPrioridade() {
        var campo = obterCampo("prioridade");
        var select = document.getElementById("prioridade");
        var valor = select.value;

        if (!valor) {
            mostrarErro(campo, "Selecione a prioridade.");
            return false;
        }

        if (PRIORIDADES_PERMITIDAS.indexOf(valor) === -1) {
            mostrarErro(campo, "Prioridade inválida. Use apenas: Crítica, Alta, Média ou Baixa.");
            return false;
        }

        limparErro(campo);
        return true;
    }

    /*--------------------------------------------------------------
     * Validacao do responsavel (opcional, mas deve ser um valor previsto)
     --------------------------------------------------------------*/
    function validarResponsavel() {
        var campo = obterCampo("responsavel");
        var select = document.getElementById("responsavel");
        var valor = select.value;

        // Responsavel pode ficar sem atribuicao (valor vazio = Aberto)
        if (valor && RESPONSAVEIS_PERMITIDOS.indexOf(valor) === -1) {
            mostrarErro(campo, "Responsável inválido. Selecione uma opção da lista.");
            return false;
        }

        limparErro(campo);
        return true;
    }

    /*--------------------------------------------------------------
     * Validacao do prazo (formato e consistencia basica da data)
     --------------------------------------------------------------*/
    function validarPrazo() {
        var campo = obterCampo("prazo");
        var input = document.getElementById("prazo");
        var valor = input.value.trim();

        // O prazo pode ficar vazio no cadastro
        if (!valor) {
            limparErro(campo);
            return true;
        }

        if (!dataEhValida(valor)) {
            mostrarErro(campo, "A data informada é inválida.");
            return false;
        }

        if (valor < hojeISO()) {
            mostrarErro(campo, "O prazo não pode ser anterior à data de hoje.");
            return false;
        }

        limparErro(campo);
        return true;
    }

    /*--------------------------------------------------------------
     * Agrupa todas as validacoes do formulario
     --------------------------------------------------------------*/
    function validarFormulario() {
        var valido = true;

        valido = validarTitulo() && valido;
        valido = validarDescricao() && valido;
        valido = validarProjeto() && valido;
        valido = validarTipo() && valido;
        valido = validarPrioridade() && valido;
        valido = validarResponsavel() && valido;
        valido = validarPrazo() && valido;

        return valido;
    }

    /*--------------------------------------------------------------
     * Impede o envio enquanto houver dados invalidos
     --------------------------------------------------------------*/
    formCadastro.addEventListener("submit", function (evento) {
        evento.preventDefault();
        ocultarAlerta();

        if (!validarFormulario()) {
            var primeiroInvalido = formCadastro.querySelector(
                ".campo.invalido input, .campo.invalido select, .campo.invalido textarea"
            );
            if (primeiroInvalido) {
                primeiroInvalido.focus();
            }
            return;
        }

        mostrarAlerta();
        formCadastro.reset();
        limparErro(obterCampo("titulo"));
        limparErro(obterCampo("descricao"));
        limparErro(obterCampo("projeto"));
        limparErro(obterCampo("tipo"));
        limparErro(obterCampo("prioridade"));
        limparErro(obterCampo("responsavel"));
        limparErro(obterCampo("prazo"));
    });

    /*--------------------------------------------------------------
     * Valida cada campo quando o usuario interage com ele
     --------------------------------------------------------------*/
    document.getElementById("titulo").addEventListener("input", validarTitulo);
    document.getElementById("descricao").addEventListener("input", validarDescricao);
    document.getElementById("projeto").addEventListener("change", validarProjeto);
    document.getElementById("tipo").addEventListener("change", validarTipo);
    document.getElementById("prioridade").addEventListener("change", validarPrioridade);
    document.getElementById("responsavel").addEventListener("change", validarResponsavel);
    document.getElementById("prazo").addEventListener("change", validarPrazo);

}());
