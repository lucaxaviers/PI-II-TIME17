# PI-II-TIME17 — DevTrack

Repositório oficial do **TIME 17** para o componente curricular **Projeto Integrador II** do curso de Engenharia de Software da Pontifícia Universidade Católica de Campinas (PUC-Campinas).

---

## 📖 Sobre o Projeto

O **DevTrack** é um Sistema de Acompanhamento de Demandas de Desenvolvimento de software inspirado em ferramentas do mercado de tecnologia (como Jira e GitHub Issues). 

O sistema permite que diferentes projetos e equipes registrem e acompanhem tarefas, defeitos (*bugs*), melhorias e documentações ao longo do ciclo de vida de desenvolvimento, controlando prioridades, responsáveis, comentários, histórico de mudanças e regras de acesso por perfil.

### 👤 Perfis de Usuário Previstos
- **Administrador:** Acesso global para visualização de projetos, usuários e demandas, bem como gestão de responsáveis, prazos e cancelamento.
- **Líder de Projeto:** Gestão das demandas dos projetos aos quais está vinculado, atribuição de responsáveis, alteração de prioridades e transição de qualquer status.
- **Membro da Equipe:** Acompanhamento e execução das demandas atribuídas, registro de comentários e movimentação de status (*Aberta → Em andamento → Em revisão*).

---

## 📌 Informações da Disciplina

- **Projeto / Time:** PI-II-TIME17
- **Componente Curricular:** Projeto Integrador II (PI2)
- **Curso:** Engenharia de Software
- **Instituição:** Pontifícia Universidade Católica de Campinas (PUC-Campinas)
- **Semestre / Ano:** 2º Semestre de 2026 (2026.2)
- **Professora Orientadora:** Prof.ª Dra. Renata Antonia Tadeu Arantes ([@RenataArantes](https://github.com/RenataArantes))

---

## 👥 Integrantes do Grupo

| Nome Completo | RA | Usuário GitHub | Responsabilidade Principal |
| :--- | :---: | :---: | :--- |
| **Enrico Locateli Costa** | 26003119 | [@imazz7](https://github.com/imazz7) | Detalhes da Demanda |
| **Felipe Dalan dos Passos** | 26002875 | [@felipepassos03](https://github.com/felipepassos03) | Listagem de Demandas |
| **Gabriel Santucci de Novaes** | 26002102 | [@gbnvaes](https://github.com/gbnvaes) | Cadastro e Edição de Demandas |
| **Gabriela Amanda Pereira** | 26005884 | [@gapcipher](https://github.com/gapcipher) | Dashboard |
| **Lucas Rodrigues Xavier** | 25000508 | [@lucaxaviers](https://github.com/lucaxaviers) | Login e Usuários |

---

## 📋 Andamento das Reuniões de Orientação

| Reunião | Data | Foco Principal | Situação |
| :---: | :---: | :--- | :---: |
| **1** | 18/08 | Preparação do ambiente, Git/GitHub e GitHub Projects | ✅ Concluída |
| **2** | 01/09 | Desenvolvimento do frontend (HTML5 e CSS3) | ✅ Concluída |
| **3** | 15/09 | Validação do frontend em JavaScript e servidor inicial Node.js | ✅ Concluída |
| **4** | 29/09 | Backend com Express e TypeScript, dados de teste em memória | ✅ Concluída |
| **5** | 13/10 | Modelagem e integração com Banco de Dados Relacional | 🔄 Em andamento |

O histórico detalhado de cada reunião está documentado em [`documentos/time/reunioes.md`](documentos/time/reunioes.md).  
O apontamento de esforço e horas de cada integrante é registrado continuamente no **GitHub Projects**.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5 semântico, CSS3 (responsivo com Flexbox/Grid) e JavaScript puro (DOM e eventos).
- **Backend:** Node.js (v24 LTS), TypeScript e Express.
- **Banco de Dados:** Banco de Dados Relacional (MySQL / Oracle — em modelagem).
- **Controle de Versão:** Git e GitHub (fluxo baseado em branches e Pull Requests).

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 24 LTS instalada.
- [Git](https://git-scm.com/) instalado.

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/lucaxaviers/PI-II-TIME17.git
   cd PI-II-TIME17
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm start
   ```

   O servidor iniciará automaticamente com recarregamento contínuo em `http://localhost:3000`.

---

## 🌐 Rotas e Navegação da Aplicação

### Páginas do Frontend
| Rota Amigável | Caminho Completo | Descrição |
| :--- | :--- | :--- |
| `http://localhost:3000/login` | `/app/pages/login.html` | Tela de autenticação de usuários |
| `http://localhost:3000/cadastro` | `/app/pages/cadastro_usuario.html` | Tela de cadastro de novos usuários |
| `http://localhost:3000/dashboard` | `/app/pages/dashboard.html` | Visão geral de indicadores e demandas |
| `http://localhost:3000/demandas` | `/app/pages/lista_demandas.html` | Listagem e filtros de demandas |

### Endpoints da API (Backend)
| Método | Endpoint | Descrição |
| :---: | :--- | :--- |
| `GET` | `/` | Verificação de status do servidor (`status: ok`) |
| `POST` | `/login` | Autenticação de usuário (valida credenciais e retorna dados/perfil) |
| `GET` | `/usuarios` | Listagem de usuários cadastrados para atribuição de demandas |

---

## 🔑 Credenciais para Testes (Dados em Memória)

Para testes das rotas e validações durante as etapas de avaliação, utilize as seguintes credenciais pré-configuradas:

| Perfil | E-mail | Senha |
| :--- | :--- | :--- |
| **Administrador** | `lucas@devtrack.com` | `senha123` |
| **Líder de Projeto** | `enrico@devtrack.com` | `senha123` |
| **Membro da Equipe** | `gabriela@devtrack.com` | `senha123` |