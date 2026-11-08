
// Desenvolvedora: Gabriela Amanda Pereira
// Descrição: Integração dos dados da API com a Dashboard

const totalDemandas = document.getElementById("totalDemandas");
const totalCriticas = document.getElementById("totalCriticas");
const totalProximas = document.getElementById("totalProximas");

const listaStatus = document.getElementById("listaStatus");
const listaPrioridade = document.getElementById("listaPrioridade");
const listaTipo = document.getElementById("listaTipo");

const listaCriticas = document.getElementById("listaCriticas");
const listaPrazos = document.getElementById("listaPrazos");

function formatarData(data) {
    const partes = data.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function mostrarContagem(elemento, dados) {
    elemento.innerHTML = "";

    for (const [nome, quantidade] of Object.entries(dados)) {
        const item = document.createElement("div");
        item.className = "item-contagem";

        item.innerHTML = `
            <span>${nome}</span>
            <strong>${quantidade}</strong>
        `;

        elemento.appendChild(item);
    }
}

function mostrarDemandas(elemento, demandas) {
    elemento.innerHTML = "";

    if (demandas.length === 0) {
        elemento.innerHTML = "<p>Nenhuma demanda encontrada.</p>";
        return;
    }

    demandas.forEach(demanda => {
        const item = document.createElement("div");
        item.className = "demanda-dashboard";

        item.innerHTML = `
            <strong>${demanda.titulo}</strong>
            <span>ID: ${demanda.id}</span>
            <span>Status: ${demanda.status}</span>
            <span>Prioridade: ${demanda.prioridade}</span>
            <span>Prazo: ${formatarData(demanda.prazoFinalizacao)}</span>
        `;

        elemento.appendChild(item);
    });
}

async function carregarDashboard() {
    try {
        const resposta = await fetch("/dashboard");

        if (!resposta.ok) {
            throw new Error("Erro ao carregar os dados.");
        }

        const dados = await resposta.json();

        totalDemandas.textContent = dados.total;
        totalCriticas.textContent = dados.demandasCriticasEmAberto.length;
        totalProximas.textContent = dados.demandasProximasDoPrazo.length;

        mostrarContagem(listaStatus, dados.porStatus);
        mostrarContagem(listaPrioridade, dados.porPrioridade);
        mostrarContagem(listaTipo, dados.porTipo);

        mostrarDemandas(listaCriticas, dados.demandasCriticasEmAberto);
        mostrarDemandas(listaPrazos, dados.demandasProximasDoPrazo);

    } catch (erro) {
        console.error("Erro na Dashboard:", erro);

        document.querySelector(".conteudo").insertAdjacentHTML(
            "beforeend",
            '<p class="erro-dashboard">Não foi possível carregar os dados da Dashboard.</p>'
        );
    }
}

carregarDashboard();
