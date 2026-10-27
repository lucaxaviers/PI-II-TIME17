/*
  Autor: Lucas Rodrigues Xavier | 25000508
  Descricao: Validacao e integracao da tela de cadastro de novos usuarios (Reuniao 5 / PI-II)
*/

document.getElementById('form-cadastro').addEventListener('submit', async function (evento) {
  evento.preventDefault();
  ocultarAlerta();

  const nome = document.getElementById('nome');
  const email = document.getElementById('email');
  const perfil = document.getElementById('perfil');
  const senha = document.getElementById('senha');
  const confirmarSenha = document.getElementById('confirmar-senha');
  const botaoCadastrar = document.querySelector('#form-cadastro button[type="submit"]');

  const nomeValor = nome.value.trim();
  const emailValor = email.value.trim().toLowerCase();
  const perfilValor = perfil.value;
  const senhaValor = senha.value;
  const confirmarSenhaValor = confirmarSenha.value;

  const regexEmail = /^[^\s@]+@[^\s@]+$/;
  let valido = true;

  // 1. Validacao do nome
  valido = validarCampo(
    nome,
    nomeValor.length >= 3,
    'erro-nome',
    nomeValor === '' ? 'Informe seu nome completo.' : 'O nome deve ter no mínimo 3 caracteres.'
  ) && valido;

  // 2. Validacao do e-mail
  valido = validarCampo(
    email,
    emailValor !== '' && regexEmail.test(emailValor),
    'erro-email',
    emailValor === '' ? 'Informe seu e-mail.' : 'Informe um e-mail válido.'
  ) && valido;

  // 3. Validacao do perfil de acesso
  valido = validarCampo(
    perfil,
    perfilValor !== '',
    'erro-perfil',
    'Selecione um perfil de acesso.'
  ) && valido;

  // 4. Validacao da senha (minimo 6 caracteres)
  valido = validarCampo(
    senha,
    senhaValor.length >= 6,
    'erro-senha',
    senhaValor === '' ? 'Informe uma senha.' : 'A senha deve ter no mínimo 6 caracteres.'
  ) && valido;

  // 5. Validacao da confirmacao de senha
  valido = validarCampo(
    confirmarSenha,
    confirmarSenhaValor === senhaValor && confirmarSenhaValor !== '',
    'erro-confirmar-senha',
    confirmarSenhaValor === '' ? 'Confirme sua senha.' : 'As senhas não coincidem.'
  ) && valido;

  if (!valido) {
    return;
  }

  if (botaoCadastrar) {
    botaoCadastrar.disabled = true;
    botaoCadastrar.textContent = 'Cadastrando...';
  }

  try {
    const resposta = await fetch('/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: nomeValor,
        email: emailValor,
        perfil: perfilValor,
        senha: senhaValor
      })
    });

    const dados = await resposta.json().catch(function () {
      return {};
    });

    if (resposta.ok) {
      mostrarAlerta(dados.mensagem || 'Conta criada com sucesso! Redirecionando para o login...', true);
      setTimeout(function () {
        window.location.href = 'login.html';
      }, 1800);
    } else {
      mostrarAlerta(dados.mensagem || 'Erro ao realizar cadastro.', false);
    }
  } catch (erro) {
    mostrarAlerta('Não foi possível conectar ao servidor. Tente novamente mais tarde.', false);
  } finally {
    if (botaoCadastrar) {
      botaoCadastrar.disabled = false;
      botaoCadastrar.textContent = 'Criar Conta';
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

function mostrarAlerta(mensagem, sucesso = false) {
  const alerta = document.getElementById('alerta');
  if (alerta) {
    alerta.textContent = mensagem;
    alerta.className = sucesso ? 'alerta alerta-sucesso visivel' : 'alerta alerta-erro visivel';
  }
}

function ocultarAlerta() {
  const alerta = document.getElementById('alerta');
  if (alerta) {
    alerta.textContent = '';
    alerta.className = 'alerta';
  }
}
