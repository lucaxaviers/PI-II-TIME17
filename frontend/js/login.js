/*
  Autor: Lucas Rodrigues Xavier | 25000508
  Descricao: Validacao e autenticacao simples da tela de login (ITW / PI-II)
*/

// Usuarios de teste em memoria (3 perfis definidos no escopo)
const usuariosValidos = [
  { email: 'lucas@devtrack.com', senha: 'senha123' },
  { email: 'enrico@devtrack.com', senha: 'senha123' },
  { email: 'gabriela@devtrack.com', senha: 'senha123' }
];

document.getElementById('form-login').addEventListener('submit', function (evento) {
  evento.preventDefault();
  ocultarAlerta();

  const email = document.getElementById('email');
  const senha = document.getElementById('senha');

  const emailValor = email.value.trim().toLowerCase();
  const senhaValor = senha.value;

  // Regex simples para formato de e-mail basico
  const regexEmail = /^[^\s@]+@[^\s@]+$/;

  let valido = true;

  // 1. Validacao do campo de e-mail
  valido = validarCampo(
    email,
    emailValor !== '' && regexEmail.test(emailValor),
    'erro-email',
    emailValor === '' ? 'Informe seu e-mail.' : 'Informe um e-mail válido.'
  ) && valido;

  // 2. Validacao do campo de senha (minimo 6 caracteres)
  valido = validarCampo(
    senha,
    senhaValor.length >= 6,
    'erro-senha',
    senhaValor === '' ? 'Informe sua senha.' : 'A senha deve ter no mínimo 6 caracteres.'
  ) && valido;

  if (!valido) {
    return;
  }

  // 3. Autenticacao: verifica se as credenciais correspondem a um usuario valido
  if (window.location.protocol.startsWith('http')) {
    // Se estiver rodando pelo servidor Express, consome a rota POST /login
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: emailValor, senha: senhaValor })
    })
      .then(function (resposta) {
        if (resposta.ok) {
          window.location.href = 'dashboard.html';
        } else {
          mostrarAlerta('E-mail ou senha inválidos.');
        }
      })
      .catch(function () {
        // Fallback caso a API falhe ou nao responda
        autenticarLocal(emailValor, senhaValor);
      });
  } else {
    // Se o arquivo HTML foi aberto diretamente no navegador
    autenticarLocal(emailValor, senhaValor);
  }
});

function autenticarLocal(emailValor, senhaValor) {
  const usuario = usuariosValidos.find(function (u) {
    return u.email === emailValor && u.senha === senhaValor;
  });

  if (usuario) {
    window.location.href = 'dashboard.html';
  } else {
    mostrarAlerta('E-mail ou senha inválidos.');
  }
}

function validarCampo(input, condicao, idErro, mensagem) {
  const campo = input.closest('.campo');
  campo.classList.toggle('invalido', !condicao);
  document.getElementById(idErro).textContent = condicao ? '' : mensagem;
  return condicao;
}

function mostrarAlerta(mensagem) {
  const alerta = document.getElementById('alerta');
  alerta.textContent = mensagem;
  alerta.className = 'alerta alerta-erro visivel';
}

function ocultarAlerta() {
  const alerta = document.getElementById('alerta');
  alerta.textContent = '';
  alerta.className = 'alerta';
}
