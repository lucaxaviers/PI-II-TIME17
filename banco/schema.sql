-- ============================================================
-- Autor: Lucas Rodrigues Xavier | RA: 25000508
-- Disciplina: Projeto Integrador II - PUC-Campinas
-- Descricao: Criacao das tabelas do banco de dados (Oracle)
-- ============================================================

-- Remove as tabelas se ja existirem
DROP TABLE historico_demandas CASCADE CONSTRAINTS;
DROP TABLE comentarios CASCADE CONSTRAINTS;
DROP TABLE demandas CASCADE CONSTRAINTS;
DROP TABLE usuarios_projetos CASCADE CONSTRAINTS;
DROP TABLE projetos CASCADE CONSTRAINTS;
DROP TABLE usuarios CASCADE CONSTRAINTS;

-- 1. Tabela de Usuarios
CREATE TABLE usuarios (
    id_usuario NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) NOT NULL UNIQUE,
    senha VARCHAR2(100) NOT NULL,
    perfil VARCHAR2(30) NOT NULL,
    CONSTRAINT chk_perfil CHECK (perfil IN ('Administrador', 'Líder de Projeto', 'Membro da Equipe'))
);

-- 2. Tabela de Projetos
CREATE TABLE projetos (
    id_projeto NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR2(100) NOT NULL,
    descricao VARCHAR2(255)
);

-- 3. Tabela de Vinculo: Usuario participa de Projeto (N para N)
CREATE TABLE usuarios_projetos (
    id_usuario NUMBER NOT NULL,
    id_projeto NUMBER NOT NULL,
    PRIMARY KEY (id_usuario, id_projeto),
    CONSTRAINT fk_up_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_up_projeto FOREIGN KEY (id_projeto) REFERENCES projetos(id_projeto)
);

-- 4. Tabela de Demandas
CREATE TABLE demandas (
    id_demanda NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR2(100) NOT NULL,
    descricao VARCHAR2(500) NOT NULL,
    tipo VARCHAR2(30) NOT NULL,
    prioridade VARCHAR2(20) NOT NULL,
    status VARCHAR2(20) DEFAULT 'Aberta' NOT NULL,
    data_criacao DATE DEFAULT SYSDATE NOT NULL,
    data_atualizacao DATE DEFAULT SYSDATE NOT NULL,
    prazo_finalizacao DATE,
    id_projeto NUMBER NOT NULL,
    id_responsavel NUMBER,
    CONSTRAINT fk_demanda_proj FOREIGN KEY (id_projeto) REFERENCES projetos(id_projeto),
    CONSTRAINT fk_demanda_resp FOREIGN KEY (id_responsavel) REFERENCES usuarios(id_usuario),
    CONSTRAINT chk_tipo CHECK (tipo IN ('Tarefa', 'Defeito', 'Melhoria', 'Documentação')),
    CONSTRAINT chk_prioridade CHECK (prioridade IN ('Crítica', 'Alta', 'Média', 'Baixa')),
    CONSTRAINT chk_status CHECK (status IN ('Aberta', 'Em andamento', 'Em revisão', 'Concluída', 'Cancelada'))
);

-- 5. Tabela de Comentarios
CREATE TABLE comentarios (
    id_comentario NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    texto VARCHAR2(500) NOT NULL,
    data_hora DATE DEFAULT SYSDATE NOT NULL,
    id_demanda NUMBER NOT NULL,
    id_usuario NUMBER NOT NULL,
    CONSTRAINT fk_coment_demanda FOREIGN KEY (id_demanda) REFERENCES demandas(id_demanda),
    CONSTRAINT fk_coment_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- 6. Tabela de Historico da Demanda
CREATE TABLE historico_demandas (
    id_historico NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo_alteracao VARCHAR2(50) NOT NULL,
    valor_anterior VARCHAR2(100),
    valor_novo VARCHAR2(100) NOT NULL,
    data_alteracao DATE DEFAULT SYSDATE NOT NULL,
    id_demanda NUMBER NOT NULL,
    id_usuario NUMBER NOT NULL,
    CONSTRAINT fk_hist_demanda FOREIGN KEY (id_demanda) REFERENCES demandas(id_demanda),
    CONSTRAINT fk_hist_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);
