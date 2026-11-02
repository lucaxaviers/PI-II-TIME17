/*
  Autor: Lucas Rodrigues Xavier | 25000508
  Descricao: Utilitario de autenticacao, controle de sessao e permissoes por perfil (Issue #57 / PI-II)
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
    return null;
  }
  return usuario;
}

/**
 * Realiza o encerramento da sessao (logout) e redireciona para o login.
 * @param {string} caminhoLogin Caminho relativo para a tela de login (padrao: 'login.html')
 */
async function fazerLogout(caminhoLogin = 'login.html') {
  await fetch('/logout', { method: 'POST' });
  sessionStorage.removeItem('usuarioLogado');
  window.location.href = caminhoLogin;
}

/**
 * Verifica se o usuario logado possui um dos perfis exigidos.
 * Perfis previstos: 'Administrador', 'Líder de Projeto', 'Membro da Equipe'
 * @param {string[]} perfisPermitidos Lista de perfis autorizados
 * @returns {boolean}
 */
function temPermissao(perfisPermitidos) {
  const usuario = obterUsuarioLogado();
  if (!usuario || !usuario.perfil) return false;
  return perfisPermitidos.includes(usuario.perfil);
}

// -------------------------------------------------------------
// 1. Protecao de telas (executa assim que o script carrega)
// -------------------------------------------------------------
(function protegerTela() {
  const caminho = window.location.pathname.toLowerCase();
  const ehPaginaPublica = caminho.endsWith('login.html') || 
                          caminho.endsWith('cadastro_usuario.html') ||
                          caminho === '/login' ||
                          caminho === '/cadastro';

  if (ehPaginaPublica) {
    return;
  }

  // Redireciona para o login se nao houver usuario autenticado
  const usuario = exigirAutenticacao('login.html');
  if (!usuario) return;

  // Regra de perfil: Cadastro de nova demanda e restrito a Administrador e Lider
  if (caminho.endsWith('cadastro_demanda.html')) {
    if (!temPermissao(['Administrador', 'Líder de Projeto'])) {
      alert('Acesso restrito: seu perfil (' + usuario.perfil + ') não tem permissão para cadastrar novas demandas.');
      window.location.href = 'lista_demandas.html';
    }
  }
})();

// -------------------------------------------------------------
// 2. Ajustes de interface baseados no perfil logado (apos o DOM carregar)
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const usuario = obterUsuarioLogado();
  if (!usuario) return;

  // Vincula evento de logout em qualquer botao/link com a classe .sair ou id #btn-logout
  const botoesSair = document.querySelectorAll('.sair, #btn-logout, a[href="login.html"]');
  botoesSair.forEach(function (botao) {
    botao.addEventListener('click', function (e) {
      if (window.location.pathname.endsWith('login.html')) return;
      e.preventDefault();
      fazerLogout('login.html');
    });
  });

  // Regra de perfil na Listagem de Demandas:
  // Se for 'Membro da Equipe', oculta a opcao de "Cadastrar nova demanda"
  if (!temPermissao(['Administrador', 'Líder de Projeto'])) {
    const linkNovaDemanda = document.querySelector('a[href="cadastro_demanda.html"]');
    if (linkNovaDemanda && linkNovaDemanda.parentElement) {
      linkNovaDemanda.parentElement.style.display = 'none';
    }
  }

  // Atualiza campo 'Perfil visualizado' nas telas de cadastro e detalhes da demanda
  const textoPerfil = document.querySelector('header .perfil, #cabecalho .perfil');
  if (textoPerfil) {
    textoPerfil.textContent = 'Perfil conectado: ' + usuario.perfil + ' (' + usuario.nome.split(' ')[0] + ')';
  }

  // Atualiza saudacao personalizada no Dashboard
  const saudacao = document.querySelector('.cabecalho-dashboard .titulo h1');
  if (saudacao && usuario.nome) {
    const primeiroNome = usuario.nome.split(' ')[0];
    saudacao.textContent = 'Olá, ' + primeiroNome + '!';
  }

  // Atualiza avatar com a inicial do usuario
  const avatar = document.querySelector('.usuario .avatar');
  if (avatar && usuario.nome) {
    avatar.textContent = usuario.nome.charAt(0).toUpperCase();
  }

  // Atualiza nome e cargo no box do usuario na barra lateral
  const dadosUsuarioNome = document.querySelector('.dados-usuario strong');
  if (dadosUsuarioNome && usuario.nome) {
    dadosUsuarioNome.textContent = usuario.nome;
  }

  const dadosUsuarioCargo = document.querySelector('.dados-usuario span');
  if (dadosUsuarioCargo && usuario.perfil) {
    dadosUsuarioCargo.textContent = usuario.perfil;
  }
});
