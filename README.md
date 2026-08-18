# Landind MVP

> Landing page de demonstração construída com **React**, **TypeScript** e **Vite**, publicada no **GitHub Pages**.

Uma página institucional simples, visual e funcional, organizada em páginas separadas com navegação por rotas.

## Funcionalidades

- **Página Inicial**
  - **Hero** — área de destaque com imagem de fundo, título, descrição e chamada para ação.
  - **Carrossel** — apresentação de conteúdos com transição em *fade-in* e reprodução automática.
  - **Formulário de contato** — nome, idade, CPF, número/WhatsApp, e-mail e anexos (múltiplos documentos, até 10 MB cada), com máscaras, validação no cliente e mensagem de confirmação.
- **Quem Sou Eu?** — página de apresentação pessoal com foto, formação acadêmica, experiência profissional e contatos (Instagram, WhatsApp e e-mail).
- **Design responsivo** — tema claro adaptado a dispositivos móveis, tablets e desktops.

## Tecnologias

- [React](https://react.dev/) 18
- [TypeScript](https://www.typescriptlang.org/) 5
- [Vite](https://vitejs.dev/) 5
- [React Router](https://reactrouter.com/) 7

## Começando

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [npm](https://www.npmjs.com/) (instalado com o Node.js)

### Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/USUARIO/landind-mvp.git
cd landind-mvp
npm install
```

### Executando em desenvolvimento

Inicia o servidor local com recarga automática:

```bash
npm run dev
```

Abra `http://localhost:5173` no navegador.

### Scripts disponíveis

| Comando           | Descrição                                                  |
| ----------------- | ---------------------------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento                       |
| `npm run build`   | Compila o TypeScript e gera o build em `dist/`             |
| `npm run preview` | Serve o build de produção localmente para conferência      |

## Licença

Projeto de demonstração para fins de estudo e apresentação.
