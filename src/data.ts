/*
  Autor: Lucas Rodrigues Xavier | 25000508
  Descricao: Dados em memoria para autenticacao e usuarios (Reuniao 4)
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
];
