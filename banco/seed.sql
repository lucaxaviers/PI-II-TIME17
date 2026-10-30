-- ============================================================
-- Autor: Lucas Rodrigues Xavier | RA: 25000508
-- Disciplina: Projeto Integrador II - PUC-Campinas
-- Descricao: Carga inicial de dados para testes (Oracle)
-- ============================================================

-- 1. Usuarios (Integrantes do grupo + usuarios de teste)
INSERT INTO usuarios (nome, email, senha, perfil)
VALUES ('Lucas Rodrigues Xavier', 'lucas@devtrack.com', 'senha123', 'Administrador');

INSERT INTO usuarios (nome, email, senha, perfil)
VALUES ('Enrico Locateli Costa', 'enrico@devtrack.com', 'senha123', 'Líder de Projeto');

INSERT INTO usuarios (nome, email, senha, perfil)
VALUES ('Gabriela Amanda Pereira', 'gabriela@devtrack.com', 'senha123', 'Membro da Equipe');

INSERT INTO usuarios (nome, email, senha, perfil)
VALUES ('Felipe Dalan dos Passos', 'felipe@devtrack.com', 'senha123', 'Membro da Equipe');

INSERT INTO usuarios (nome, email, senha, perfil)
VALUES ('Gabriel Santucci de Novaes', 'gabriel@devtrack.com', 'senha123', 'Membro da Equipe');

-- Novos usuarios de teste para validacao do sistema (Issue #55)
INSERT INTO usuarios (nome, email, senha, perfil)
VALUES ('Mariana Souza Silveira', 'mariana.silveira@devtrack.com', 'senha123', 'Líder de Projeto');

INSERT INTO usuarios (nome, email, senha, perfil)
VALUES ('Rafael Alves de Oliveira', 'rafael.oliveira@devtrack.com', 'senha123', 'Membro da Equipe');

INSERT INTO usuarios (nome, email, senha, perfil)
VALUES ('Beatriz Lima Mendes', 'beatriz.mendes@devtrack.com', 'senha123', 'Membro da Equipe');

INSERT INTO usuarios (nome, email, senha, perfil)
VALUES ('Thiago Henrique Martins', 'thiago.martins@devtrack.com', 'senha123', 'Administrador');

INSERT INTO usuarios (nome, email, senha, perfil)
VALUES ('Camila Duarte Fernandes', 'camila.fernandes@devtrack.com', 'senha123', 'Membro da Equipe');

INSERT INTO usuarios (nome, email, senha, perfil)
VALUES ('Rodrigo Barbosa Ramos', 'rodrigo.ramos@devtrack.com', 'senha123', 'Membro da Equipe');

INSERT INTO usuarios (nome, email, senha, perfil)
VALUES ('Juliana Castro Ribeiro', 'juliana.castro@devtrack.com', 'senha123', 'Líder de Projeto');

INSERT INTO usuarios (nome, email, senha, perfil)
VALUES ('Lucas Ferreira Guimarães', 'lucas.guimaraes@devtrack.com', 'senha123', 'Membro da Equipe');

INSERT INTO usuarios (nome, email, senha, perfil)
VALUES ('Larissa Moreira Carvalho', 'larissa.carvalho@devtrack.com', 'senha123', 'Membro da Equipe');

INSERT INTO usuarios (nome, email, senha, perfil)
VALUES ('Bruno Vinicius Cardoso', 'bruno.cardoso@devtrack.com', 'senha123', 'Membro da Equipe');

-- 2. Projetos
INSERT INTO projetos (nome, descricao)
VALUES ('Portal do Aluno', 'Sistema academico web para alunos e professores.');

INSERT INTO projetos (nome, descricao)
VALUES ('App Mobile DevTrack', 'Aplicativo mobile para notificacoes de demandas.');

INSERT INTO projetos (nome, descricao)
VALUES ('API DevTrack', 'Servicos e backend central do sistema.');

-- 3. Vinculo Usuario-Projeto (Participa)
INSERT INTO usuarios_projetos (id_usuario, id_projeto) VALUES (1, 1);
INSERT INTO usuarios_projetos (id_usuario, id_projeto) VALUES (1, 2);
INSERT INTO usuarios_projetos (id_usuario, id_projeto) VALUES (1, 3);
INSERT INTO usuarios_projetos (id_usuario, id_projeto) VALUES (2, 1);
INSERT INTO usuarios_projetos (id_usuario, id_projeto) VALUES (3, 1);
INSERT INTO usuarios_projetos (id_usuario, id_projeto) VALUES (4, 2);
INSERT INTO usuarios_projetos (id_usuario, id_projeto) VALUES (5, 3);
INSERT INTO usuarios_projetos (id_usuario, id_projeto) VALUES (6, 1);
INSERT INTO usuarios_projetos (id_usuario, id_projeto) VALUES (7, 1);
INSERT INTO usuarios_projetos (id_usuario, id_projeto) VALUES (8, 2);
INSERT INTO usuarios_projetos (id_usuario, id_projeto) VALUES (9, 2);
INSERT INTO usuarios_projetos (id_usuario, id_projeto) VALUES (10, 3);
INSERT INTO usuarios_projetos (id_usuario, id_projeto) VALUES (11, 3);
INSERT INTO usuarios_projetos (id_usuario, id_projeto) VALUES (12, 1);
INSERT INTO usuarios_projetos (id_usuario, id_projeto) VALUES (13, 2);
INSERT INTO usuarios_projetos (id_usuario, id_projeto) VALUES (14, 2);
INSERT INTO usuarios_projetos (id_usuario, id_projeto) VALUES (15, 3);

-- 4. Demandas (diferentes tipos, status e prioridades)
INSERT INTO demandas (titulo, descricao, tipo, prioridade, status, data_criacao, data_atualizacao, prazo_finalizacao, id_projeto, id_responsavel)
VALUES ('Implementar tela de login', 'Criar tela de login com validacao e sessao.', 'Tarefa', 'Alta', 'Em andamento', DATE '2026-10-10', DATE '2026-10-15', DATE '2026-11-10', 1, 1);

INSERT INTO demandas (titulo, descricao, tipo, prioridade, status, data_criacao, data_atualizacao, prazo_finalizacao, id_projeto, id_responsavel)
VALUES ('Corrigir erro de conexao', 'Falha ao conectar na base de dados.', 'Defeito', 'Crítica', 'Aberta', DATE '2026-10-12', DATE '2026-10-12', DATE '2026-10-30', 3, 2);

INSERT INTO demandas (titulo, descricao, tipo, prioridade, status, data_criacao, data_atualizacao, prazo_finalizacao, id_projeto, id_responsavel)
VALUES ('Melhorar layout do menu', 'Ajustar responsividade para telas menores.', 'Melhoria', 'Média', 'Concluída', DATE '2026-10-01', DATE '2026-10-08', DATE '2026-10-08', 1, 3);

INSERT INTO demandas (titulo, descricao, tipo, prioridade, status, data_criacao, data_atualizacao, prazo_finalizacao, id_projeto, id_responsavel)
VALUES ('Filtros da listagem', 'Permitir filtrar demandas por status e prioridade.', 'Tarefa', 'Alta', 'Em revisão', DATE '2026-10-14', DATE '2026-10-20', DATE '2026-10-29', 2, 4);

INSERT INTO demandas (titulo, descricao, tipo, prioridade, status, data_criacao, data_atualizacao, prazo_finalizacao, id_projeto, id_responsavel)
VALUES ('Tema escuro no dashboard', 'Funcionalidade cancelada pelo time de escopo.', 'Melhoria', 'Baixa', 'Cancelada', DATE '2026-09-20', DATE '2026-09-25', NULL, 2, 5);

INSERT INTO demandas (titulo, descricao, tipo, prioridade, status, data_criacao, data_atualizacao, prazo_finalizacao, id_projeto, id_responsavel)
VALUES ('Documentar instrucoes no README', 'Passo a passo para rodar o banco e a aplicacao.', 'Documentação', 'Baixa', 'Aberta', DATE '2026-10-22', DATE '2026-10-22', DATE '2026-11-15', 3, NULL);

-- 5. Comentarios
INSERT INTO comentarios (texto, data_hora, id_demanda, id_usuario)
VALUES ('Iniciando a codificacao do componente de login.', SYSDATE - 5, 1, 1);

INSERT INTO comentarios (texto, data_hora, id_demanda, id_usuario)
VALUES ('Investigando o log de conexao com o banco.', SYSDATE - 3, 2, 2);

-- 6. Historico de alteracoes
INSERT INTO historico_demandas (tipo_alteracao, valor_anterior, valor_novo, data_alteracao, id_demanda, id_usuario)
VALUES ('Status', 'Aberta', 'Em andamento', SYSDATE - 4, 1, 1);

INSERT INTO historico_demandas (tipo_alteracao, valor_anterior, valor_novo, data_alteracao, id_demanda, id_usuario)
VALUES ('Status', 'Em andamento', 'Em revisão', SYSDATE - 1, 4, 4);

INSERT INTO historico_demandas (tipo_alteracao, valor_anterior, valor_novo, data_alteracao, id_demanda, id_usuario)
VALUES ('Cancelamento', 'Aberta', 'Cancelada', SYSDATE - 10, 5, 2);

COMMIT;
