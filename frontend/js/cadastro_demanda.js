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
    var TIPOS_PERMITIDOS = ["Tarefa", "Defeito", "Melhoria", "Documentação"];
    var PRIORIDADES_PERMITIDAS = ["Crítica", "Alta", "Média", "Baixa"];
    const id = new URLSearchParams(location.search).get("id");
    let prazoOriginal = "";

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
            alerta.classList.remove("visivel");
            alerta.hidden = true;
        }
    }

    /*--------------------------------------------------------------
     * Exibe o alerta de sucesso
     --------------------------------------------------------------*/
    function mostrarAlerta(mensagem, erro) {
        const alerta = document.getElementById("alerta-cadastro");
        alerta.textContent = mensagem;
        alerta.className = "alerta visivel " + (erro ? "alerta-erro" : "alerta-sucesso");
        alerta.hidden = false;
    }

    async function consultar(url, opcoes) {
        const resposta = await fetch(url, opcoes);
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.erro || dados.mensagem || "Falha ao consultar a API.");
        return dados;
    }

    const campos = formCadastro.elements;
    const botao = formCadastro.querySelector("button");
    const seletor = document.getElementById("selecionar-demanda");
    seletor.addEventListener("change", () => {
        location.href = location.pathname + (seletor.value ? "?id=" + encodeURIComponent(seletor.value) : "");
    });

    async function carregar() {
        try {
            const [projetos, usuarios, demandas] = await Promise.all([
                consultar("/projetos"), consultar("/usuarios?origem=oracle"), consultar("/demandas/editaveis")
            ]);
            projetos.forEach(p => campos.projeto.add(new Option(p.nome, p.id)));
            usuarios.forEach(u => campos.responsavel.add(new Option(u.nome, u.id)));
            demandas.forEach(d => seletor.add(new Option("#" + d.id + " — " + d.titulo, d.id)));
            if (id !== null) {
                const d = await consultar("/demandas/" + encodeURIComponent(id) + "/edicao");
                for (const nome of ["titulo", "descricao", "tipo", "prioridade"]) campos[nome].value = d[nome];
                campos.projeto.value = d.idProjetoAssociado;
                campos.responsavel.value = d.idUsuario ?? "";
                prazoOriginal = d.dataFinalizacao || "";
                campos.prazo.value = prazoOriginal;
                seletor.value = id;
                document.querySelector("h1").textContent = "Edição de demanda";
                document.querySelector(".codigo").textContent = "Demanda #" + id;
                document.querySelector("h2").textContent = "Editar dados da atividade";
            }
            botao.disabled = false;
        } catch (erro) {
            mostrarAlerta(erro.message, true);
        }
    }
    carregar();

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
        var mensagem = textoValido(input.value, 5, 100);

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
        var mensagem = textoValido(area.value, 10, 500);

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
        if (valor && !Array.from(select.options).some(opcao => opcao.value === valor)) {
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

        if (valor !== prazoOriginal && valor < hojeISO()) {
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
    formCadastro.addEventListener("submit", async function (evento) {
        evento.preventDefault();
        ocultarAlerta();

        if (botao.disabled) return;
        if (!validarFormulario()) {
            var primeiroInvalido = formCadastro.querySelector(
                ".campo.invalido input, .campo.invalido select, .campo.invalido textarea"
            );
            if (primeiroInvalido) {
                primeiroInvalido.focus();
            }
            return;
        }

        botao.disabled = true;
        seletor.disabled = true;
        try {
            const dados = {
                titulo: campos.titulo.value, descricao: campos.descricao.value,
                tipo: campos.tipo.value, prioridade: campos.prioridade.value,
                idProjetoAssociado: Number(campos.projeto.value),
                idUsuario: campos.responsavel.value ? Number(campos.responsavel.value) : null,
                dataFinalizacao: campos.prazo.value || null
            };
            const demanda = await consultar(id ? "/demandas/" + encodeURIComponent(id) : "/demandas", {
                method: id ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });
            const rotulo = "#" + demanda.id + " — " + demanda.titulo;
            if (id) {
                seletor.selectedOptions[0].textContent = rotulo;
                prazoOriginal = demanda.dataFinalizacao || "";
            } else {
                seletor.add(new Option(rotulo, demanda.id));
                formCadastro.reset();
            }
            mostrarAlerta("Demanda #" + demanda.id + (id ? " atualizada." : " cadastrada."), false);
        } catch (erro) {
            mostrarAlerta(erro.message, true);
        } finally {
            botao.disabled = false;
            seletor.disabled = false;
        }
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
