/*
  Autor: Lucas Rodrigues Xavier | 25000508
  Descricao: Validacao e integracao da tela de login com a API (Reuniao 5 / PI-II)
*/

// Ao carregar a tela de login, limpa qualquer sessao anterior
sessionStorage.removeItem('usuarioLogado');

document.getElementById('form-login').addEventListener('submit', async function (evento) {
  evento.preventDefault();
  ocultarAlerta();

  const email = document.getElementById('email');
  const senha = document.getElementById('senha');
  const botaoEntrar = document.querySelector('#form-login button[type="submit"]');

  const emailValor = email.value.trim().toLowerCase();
  const senhaValor = senha.value;

  // Regex para formato de e-mail valido
  const regexEmail = /^[^\s@]+@[^\s@]+$/;

  let valido = true;

  // 1. Validacao do campo de e-mail no cliente
  valido = validarCampo(
    email,
    emailValor !== '' && regexEmail.test(emailValor),
    'erro-email',
    emailValor === '' ? 'Informe seu e-mail.' : 'Informe um e-mail válido.'
  ) && valido;

  // 2. Validacao do campo de senha no cliente (minimo 6 caracteres)
  valido = validarCampo(
    senha,
    senhaValor.length >= 6,
    'erro-senha',
    senhaValor === '' ? 'Informe sua senha.' : 'A senha deve ter no mínimo 6 caracteres.'
  ) && valido;

  if (!valido) {
    return;
  }

  // Desabilita botao temporariamente durante a requisicao
  if (botaoEntrar) {
    botaoEntrar.disabled = true;
    botaoEntrar.textContent = 'Entrando...';
  }

  try {
    // 3. Consumo da API: envia e-mail e senha para POST /login
    const resposta = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: emailValor, senha: senhaValor })
    });

    const dados = await resposta.json().catch(function () {
      return {};
    });

    if (resposta.ok) {
      // Guarda os dados e o perfil do usuario autenticado para manter a sessao ao navegar
      sessionStorage.setItem('usuarioLogado', JSON.stringify({
        id: dados.id,
        nome: dados.nome,
        email: dados.email,
        perfil: dados.perfil
      }));

      // Redireciona para o Dashboard apos autenticacao com sucesso
      window.location.href = 'dashboard.html';
    } else {
      // Exibe a mensagem de erro retornada diretamente pelo servidor (ex: status 400 ou 401)
      const mensagemErro = dados.mensagem || dados.erro || 'E-mail ou senha inválidos.';
      mostrarAlerta(mensagemErro);
    }
  } catch (erro) {
    // Falha de conexao com o servidor
    mostrarAlerta('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
  } finally {
    if (botaoEntrar) {
      botaoEntrar.disabled = false;
      botaoEntrar.textContent = 'Entrar';
    }
  }
});

function validarCampo(input, condicao, idErro, mensagem) {
  const campo = input.closest('.campo');
  if (campo) {
    campo.classList.toggle('invalido', !condicao);
  }
  const elementoErro = document.getElementById(idErro);
  if (elementoErro) {
    elementoErro.textContent = condicao ? '' : mensagem;
  }
  return condicao;
}

function mostrarAlerta(mensagem) {
  const alerta = document.getElementById('alerta');
  if (alerta) {
    alerta.textContent = mensagem;
    alerta.className = 'alerta alerta-erro visivel';
  }
}

function ocultarAlerta() {
  const alerta = document.getElementById('alerta');
  if (alerta) {
    alerta.textContent = '';
    alerta.className = 'alerta';
  }
}
