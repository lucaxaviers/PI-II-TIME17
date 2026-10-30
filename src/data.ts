/*
  Autor: Lucas Rodrigues Xavier | 25000508
  Descricao: Dados em memoria para autenticacao e usuarios (Reuniao 4 e 5)
*/

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha?: string;
  perfil: "Administrador" | "Líder de Projeto" | "Membro da Equipe";
}

// Usuarios de teste em memoria com os 3 perfis exigidos pelo escopo
export const usuarios: Usuario[] = [
  {
    id: 1,
    nome: "Lucas Rodrigues Xavier",
    email: "lucas@devtrack.com",
    senha: "senha123",
    perfil: "Administrador",
  },
  {
    id: 2,
    nome: "Enrico Locateli Costa",
    email: "enrico@devtrack.com",
    senha: "senha123",
    perfil: "Líder de Projeto",
  },
  {
    id: 3,
    nome: "Gabriela Amanda Pereira",
    email: "gabriela@devtrack.com",
    senha: "senha123",
    perfil: "Membro da Equipe",
  },
  {
    id: 4,
    nome: "Felipe Dalan dos Passos",
    email: "felipe@devtrack.com",
    senha: "senha123",
    perfil: "Membro da Equipe",
  },
  {
    id: 5,
    nome: "Gabriel Santucci de Novaes",
    email: "gabriel@devtrack.com",
    senha: "senha123",
    perfil: "Membro da Equipe",
  },
  {
    id: 6,
    nome: "Mariana Souza Silveira",
    email: "mariana.silveira@devtrack.com",
    senha: "senha123",
    perfil: "Líder de Projeto",
  },
  {
    id: 7,
    nome: "Rafael Alves de Oliveira",
    email: "rafael.oliveira@devtrack.com",
    senha: "senha123",
    perfil: "Membro da Equipe",
  },
  {
    id: 8,
    nome: "Beatriz Lima Mendes",
    email: "beatriz.mendes@devtrack.com",
    senha: "senha123",
    perfil: "Membro da Equipe",
  },
  {
    id: 9,
    nome: "Thiago Henrique Martins",
    email: "thiago.martins@devtrack.com",
    senha: "senha123",
    perfil: "Administrador",
  },
  {
    id: 10,
    nome: "Camila Duarte Fernandes",
    email: "camila.fernandes@devtrack.com",
    senha: "senha123",
    perfil: "Membro da Equipe",
  },
  {
    id: 11,
    nome: "Rodrigo Barbosa Ramos",
    email: "rodrigo.ramos@devtrack.com",
    senha: "senha123",
    perfil: "Membro da Equipe",
  },
  {
    id: 12,
    nome: "Juliana Castro Ribeiro",
    email: "juliana.castro@devtrack.com",
    senha: "senha123",
    perfil: "Líder de Projeto",
  },
  {
    id: 13,
    nome: "Lucas Ferreira Guimarães",
    email: "lucas.guimaraes@devtrack.com",
    senha: "senha123",
    perfil: "Membro da Equipe",
  },
  {
    id: 14,
    nome: "Larissa Moreira Carvalho",
    email: "larissa.carvalho@devtrack.com",
    senha: "senha123",
    perfil: "Membro da Equipe",
  },
  {
    id: 15,
    nome: "Bruno Vinicius Cardoso",
    email: "bruno.cardoso@devtrack.com",
    senha: "senha123",
    perfil: "Membro da Equipe",
  },
];
