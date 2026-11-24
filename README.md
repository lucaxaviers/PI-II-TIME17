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
| **5** | 13/10 | Modelagem e integração com Banco de Dados Relacional, integração frontend-backend e conclusão do escopo | 🔄 Em andamento |

A reunião de 10/11 foi a última reunião de orientação. Depois dela, a equipe conclui o sistema por conta própria, que deve estar completo até o final de novembro para a banca.

O histórico detalhado de cada reunião está documentado em [`documentos/time/reunioes.md`](documentos/time/reunioes.md).  
O apontamento de esforço e horas de cada integrante é registrado continuamente no **GitHub Projects**.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5 semântico, CSS3 (responsivo com Flexbox/Grid) e JavaScript puro (DOM e eventos).
- **Backend:** Node.js (v24 LTS), TypeScript e Express.
- **Banco de Dados:** Oracle Database (scripts DDL e DML em `banco/`).
- **Controle de Versão:** Git e GitHub (fluxo baseado em branches e Pull Requests).

---

## 🗄️ Banco de Dados (Oracle via Docker)

Os scripts SQL do banco de dados relacional estão localizados na pasta [`banco/`](banco/):
- **`banco/schema.sql`:** Script de criação das 6 tabelas (`usuarios`, `projetos`, `usuarios_projetos`, `demandas`, `comentarios`, `historico_demandas`) e chaves.
- **`banco/seed.sql`:** Script de carga inicial com os 3 perfis de usuários (Admin, Líder, Membro), projetos e demandas de exemplo.

### Como subir e configurar o Oracle localmente:

1. **Suba o container do Oracle via terminal:**
   ```bash
   docker run -d --name oracle-devtrack -p 1521:1521 -e ORACLE_PASSWORD=oracle gvenzl/oracle-free:slim
   ```
   *(Aguarde cerca de 30 a 60 segundos após o comando para o Oracle inicializar completamente o banco `FREEPDB1`).*

2. **Configure o arquivo `.env` na raiz do projeto:**
   ```bash
   cp .env.example .env
   ```
   *(Descomente e ajuste `DB_USER`, `DB_PASSWORD` e `DB_CONNECT_STRING` conforme o banco usado. Para o Docker acima: `system`, `oracle` e `localhost:1521/FREEPDB1`).*

3. **Execute os scripts no banco:**
   
   - **Opção A (Via Terminal / PowerShell - mais rápido):**
     ```powershell
     Get-Content banco/schema.sql, banco/seed.sql | docker exec -i oracle-devtrack sqlplus system/oracle@FREEPDB1
     ```
     *(No Linux/macOS ou Git Bash: `cat banco/schema.sql banco/seed.sql | docker exec -i oracle-devtrack sqlplus system/oracle@FREEPDB1`)*

   - **Opção B (Via SQL Developer, DBeaver ou extensão do VS Code):**
     Conecte ao banco (`localhost:1521/FREEPDB1`, usuário `system`, senha `oracle`) e execute como script (**F5**):
     1. Execute primeiro o script `banco/schema.sql`
     2. Em seguida, execute o script `banco/seed.sql`

> 💡 **Nota sobre a primeira execução:** No início do `schema.sql`, os comandos `DROP TABLE ... CASCADE CONSTRAINTS` garantem a limpeza de tabelas antigas. Se for a primeira vez rodando num banco vazio, mensagens de aviso `ORA-00942: table or view does not exist` são normais e esperadas; o script continuará e criará todas as tabelas e dados com sucesso.

> **Variáveis de ambiente lidas pelo servidor:** `DB_USER`, `DB_PASSWORD`, `DB_CONNECT_STRING` e `PORT`. Se alguma não estiver definida no `.env`, o servidor usa a conexão padrão do Oracle do laboratório da faculdade. Para usar o Oracle local (Docker), defina as três variáveis `DB_*` no `.env`, como mostrado acima.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 24 LTS instalada.
- [Git](https://git-scm.com/) instalado.
- [Docker](https://www.docker.com/) (ou instância do **Oracle Database** / SQL Developer conectado ao servidor da faculdade).

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/lucaxaviers/PI-II-TIME17.git
   cd PI-II-TIME17
   ```

2. **Configure o banco de dados Oracle:**
   Siga os passos da seção [Banco de Dados (Oracle via Docker)](#️-banco-de-dados-oracle-via-docker) acima.

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Inicie o servidor:**
   - Desenvolvimento (recompila ao salvar):
     ```bash
     npm start
     ```
   - Execução simples (compilar e rodar):
     ```bash
     npx tsc
     node lib/server.js
     ```

   O servidor iniciará em `http://localhost:3000`. Abra `http://localhost:3000/login` para começar.

---

## 🌐 Rotas e Navegação da Aplicação

### Páginas do Frontend
| Endereço | Descrição |
| :--- | :--- |
| `http://localhost:3000/login` | Tela de autenticação de usuários |
| `http://localhost:3000/cadastro` | Tela de cadastro de novos usuários |
| `http://localhost:3000/dashboard` | Redireciona para o dashboard (`/app/pages/dashboard.html`) |
| `http://localhost:3000/app/pages/lista_demandas.html` | Listagem, filtros e busca de demandas |
| `http://localhost:3000/app/pages/cadastro_demanda.html` | Cadastro e edição de demandas |
| `http://localhost:3000/app/pages/detalhes_demanda.html` | Detalhes de uma demanda |

### Endpoints da API (Backend)
| Método | Endpoint | Descrição |
| :---: | :--- | :--- |
| `GET` | `/` | Verificação de status do servidor |
| `POST` | `/login` | Autenticação de usuário e criação da sessão |
| `POST` | `/logout` | Encerra a sessão |
| `GET` | `/usuarios` | Lista usuários cadastrados |
| `POST` | `/usuarios` | Cadastra novo usuário |
| `GET` | `/usuarios/projeto` | Lista usuários de um projeto (usado para responsáveis) |
| `GET` | `/projetos` | Lista projetos visíveis ao usuário logado |
| `GET` | `/demandas` | Lista demandas com filtros, busca e ordenação |
| `GET` | `/demandas/editaveis` | Demandas que o usuário logado pode editar |
| `GET` | `/demandas/:id/edicao` | Dados de uma demanda para edição |
| `POST` | `/demandas` | Cadastra demanda (status inicial Aberta, valida prazo em feriado nacional pela BrasilAPI) |
| `PUT` | `/demandas/:id` | Edita demanda e registra o histórico de alterações |

---

## 📌 Situação Atual do Desenvolvimento

| Funcionalidade | Situação |
| :--- | :---: |
| Login, logout e sessão | ✅ Implementado |
| Cadastro de usuários | ✅ Implementado |
| Cadastro e edição de demandas, com validação de feriado | ✅ Implementado |
| Listagem com filtros, busca e ordenação | ✅ Implementado |
| Dashboard | 🔄 Em integração |
| Detalhes da demanda, comentários e histórico | 🔄 Em integração |
| Atualização de status e cancelamento de demanda | 🔄 Em desenvolvimento |

> Esta tabela deve ser revisada pelo time antes da entrega final.

---

## 🔑 Credenciais para Testes

Os usuários abaixo são criados pelo `banco/seed.sql`. A senha de todos é `senha123`.

| Perfil | E-mail |
| :--- | :--- |
| **Administrador** | `lucas@devtrack.com` |
| **Líder de Projeto** | `enrico@devtrack.com` |
| **Membro da Equipe** | `gabriela@devtrack.com`, `felipe@devtrack.com`, `gabriel@devtrack.com` |
