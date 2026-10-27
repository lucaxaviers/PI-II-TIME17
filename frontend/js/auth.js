/*
  Autor: Lucas Rodrigues Xavier | 25000508
  Descricao: Utilitario compartilhado de autenticacao, controle de sessao e perfis (Reuniao 5 / PI-II)
*/

/**
 * Retorna os dados do usuario atualmente autenticado na sessao.
 * @returns {{ id: number, nome: string, email: string, perfil: 'Administrador' | 'Líder de Projeto' | 'Membro da Equipe' } | null}
 */
function obterUsuarioLogado() {
  try {
    const dados = sessionStorage.getItem('usuarioLogado');
    return dados ? JSON.parse(dados) : null;
  } catch (e) {
    console.error('Erro ao ler usuario da sessao:', e);
    return null;
  }
}

/**
 * Verifica se ha usuario autenticado. Se nao houver, redireciona para a tela de login.
 * @param {string} caminhoLogin Caminho relativo para a tela de login (padrao: 'login.html')
 */
function exigirAutenticacao(caminhoLogin = 'login.html') {
  const usuario = obterUsuarioLogado();
  if (!usuario) {
    window.location.href = caminhoLogin;
  }
  return usuario;
}

/**
 * Realiza o encerramento da sessao (logout) e redireciona para o login.
 * @param {string} caminhoLogin Caminho relativo para a tela de login (padrao: 'login.html')
 */
function fazerLogout(caminhoLogin = 'login.html') {
  sessionStorage.removeItem('usuarioLogado');
  window.location.href = caminhoLogin;
}

/**
 * Verifica se o usuario logado possui um dos perfis exigidos.
 * Perfis previstos no escopo: 'Administrador', 'Líder de Projeto', 'Membro da Equipe'
 * @param {string[]} perfisPermitidos Lista de perfis autorizados
 * @returns {boolean}
 */
function temPermissao(perfisPermitidos) {
  const usuario = obterUsuarioLogado();
  if (!usuario || !usuario.perfil) return false;
  return perfisPermitidos.includes(usuario.perfil);
}

/**
 * Atualiza automaticamente elementos de interface com as informacoes do usuario logado
 * e vincula o clique dos botoes de sair/logout.
 */
document.addEventListener('DOMContentLoaded', function () {
  const usuario = obterUsuarioLogado();

  // Vincula evento de logout em qualquer botao/link com a classe .sair ou id #btn-logout
  const botoesSair = document.querySelectorAll('.sair, #btn-logout, a[href="login.html"]');
  botoesSair.forEach(function (botao) {
    botao.addEventListener('click', function (e) {
      // Se for a propria pagina de login, nao intercepta
      if (window.location.pathname.endsWith('login.html')) return;
      e.preventDefault();
      fazerLogout();
    });
  });

  if (usuario) {
    // Atualiza saudacao personalizada se existir no dashboard
    const saudacao = document.querySelector('.cabecalho-dashboard .titulo h1');
    if (saudacao && usuario.nome) {
      const primeiroNome = usuario.nome.split(' ')[0];
      saudacao.textContent = `Olá, ${primeiroNome}!`;
    }

    // Atualiza avatar com a inicial do usuario
    const avatar = document.querySelector('.usuario .avatar');
    if (avatar && usuario.nome) {
      avatar.textContent = usuario.nome.charAt(0).toUpperCase();
    }

    // Atualiza nome e perfil no box do usuario
    const dadosUsuarioNome = document.querySelector('.dados-usuario strong');
    if (dadosUsuarioNome && usuario.nome) {
      dadosUsuarioNome.textContent = usuario.nome;
    }

    const dadosUsuarioCargo = document.querySelector('.dados-usuario span');
    if (dadosUsuarioCargo && usuario.perfil) {
      dadosUsuarioCargo.textContent = usuario.perfil;
    }
  }
});
