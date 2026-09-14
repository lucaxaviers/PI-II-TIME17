/*------------------------------------------------------------------
 * Autor: Gabriela Amanda Pereira
 * Descrição: Validação do prazo de finalização no cadastro de demanda.
 -------------------------------------------------------------------*/

 (function () {
    "use strict";

    var formulario = document.querySelector("form");
    var campoPrazo = document.getElementById("prazo");

    var mensagemErro = document.createElement("small");
    mensagemErro.className = "erro-prazo";
    campoPrazo.parentNode.appendChild(mensagemErro);


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
function validarPrazo() {
    var valor = campoPrazo.value.trim();

    mensagemErro.textContent = "";
    campoPrazo.classList.remove("invalido");

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
formulario.addEventListener("submit", function (evento) {
    if (!validarPrazo()) {
        evento.preventDefault();
        campoPrazo.focus();
    }
});

campoPrazo.addEventListener("change", validarPrazo);

}());