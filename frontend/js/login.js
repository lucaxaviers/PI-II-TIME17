/*
  Autor: Lucas Rodrigues Xavier | 25000508
  Descricao: Validacao simples do formulario de login (campos obrigatorios, formato de e-mail e regras de senha)
*/

document.getElementById('form-login').addEventListener('submit', function (evento) {
  evento.preventDefault();

  const email = document.getElementById('email');
  const senha = document.getElementById('senha');
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let valido = true;
  valido = validarCampo(email, email.value.trim() !== '' && regexEmail.test(email.value.trim()), 'erro-email',
    email.value.trim() === '' ? 'Informe seu e-mail.' : 'Informe um e-mail valido.') && valido;

  valido = validarCampo(senha, senha.value.length >= 6, 'erro-senha',
    senha.value === '' ? 'Informe sua senha.' : 'A senha deve ter no minimo 6 caracteres.') && valido;

  if (valido) {
    window.location.href = 'dashboard.html';
  }
});

function validarCampo(input, condicao, idErro, mensagem) {
  const campo = input.closest('.campo');
  campo.classList.toggle('invalido', !condicao);
  document.getElementById(idErro).textContent = condicao ? '' : mensagem;
  return condicao;
}
