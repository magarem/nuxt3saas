# Nuxt 3 SaaS Admin Dashboard Starter

Este projeto é um template inicial para aplicações SaaS (Software as a Service) construídas com Nuxt 3, focado em fornecer um layout administrativo robusto e personalizável. Ele inclui um dashboard pronto para uso e funcionalidades essenciais como autenticação de usuários com diferentes níveis de acesso (roles).

## Tecnologias Utilizadas

* **Nuxt 3:** O framework Vue.js de última geração para desenvolvimento web universal.
* **PrimeVue:** Uma biblioteca de componentes UI completa e elegante para Vue.js.
* **Tailwind CSS:** Um framework CSS utilitário para construção rápida de interfaces responsivas.
* **Autenticação de Usuários:** Sistema de autenticação integrado com suporte a diferentes roles de usuários.

## Funcionalidades

* **Layout Administrativo Moderno:** Interface de usuário intuitiva e responsiva, projetada para aplicações SaaS.
* **Dashboard Personalizável:** Visualize métricas e informações importantes de forma clara e concisa.
* **Autenticação com Roles:** Gerencie usuários com diferentes níveis de acesso e permissões.
* **Componentes Reutilizáveis:** Construa interfaces complexas de forma rápida e eficiente com PrimeVue.
* **Estilização Flexível:** Personalize o visual da sua aplicação com facilidade usando Tailwind CSS.

## Pré-requisitos

* Node.js (versão 18 ou superior)
* npm ou yarn ou pnpm

## Instalação

1.  Clone o repositório:

    ```bash
    git clone [https://github.com/dolthub/dolt](https://github.com/dolthub/dolt)
    ```

2.  Navegue até o diretório do projeto:

    ```bash
    cd [nome do projeto]
    ```

3.  Instale as dependências:

    ```bash
    npm install
    # ou
    yarn install
    # ou
    pnpm install
    ```

## Execução

1.  Inicie o servidor de desenvolvimento:

    ```bash
    npm run dev
    # ou
    yarn dev
    # ou
    pnpm dev
    ```

2.  Acesse a aplicação no seu navegador: `http://localhost:3000`

## Estrutura de Pastas

A estrutura de pastas do projeto segue uma organização que facilita a manutenção e escalabilidade do código. Abaixo, uma breve descrição dos diretórios mais importantes:

```
.
├── assets         # Arquivos estáticos, como estilos, imagens e fontes.
├── components     # Componentes Vue reutilizáveis para construir a interface.
├── composables    # Funções e hooks reutilizáveis em diferentes partes do projeto.
├── layouts        # Layouts base para estruturar as páginas da aplicação.
├── middleware     # Funções que interceptam requisições, úteis para autenticação e outras lógicas.
├── pages          # Páginas da aplicação que correspondem às rotas do Nuxt.
├── public         # Arquivos públicos que são servidos diretamente.
├── server         # Código do lado do servidor, como APIs e middlewares.
└── stores         # Gerenciamento de estado, usado por exemplo com Pinia ou Vuex.
```

Cada diretório possui uma finalidade específica para tornar o desenvolvimento mais modular e organizado.

## Jornadas

Este template foi desenvolvido pensando em diferentes jornadas dos usuários que utilizam a aplicação SaaS. As principais jornadas são:

- **Jornada do Usuário:** Inclui a criação de conta, processo de onboarding, e acesso ao dashboard com informações personalizadas.
- **Jornada do Administrador:** Foca no gerenciamento de usuários, monitoramento de métricas e administração geral do sistema.
- **Jornada de Suporte:** Facilita o acesso a suporte e orientações para resolução de problemas e dúvidas comuns.
- **Jornada de Escalonamento:** Permite ao usuário realizar upgrades ou downgrades dos planos de assinatura, ajustando as funcionalidades conforme sua necessidade.

Cada jornada foi projetada para otimizar a experiência do usuário e fornecer acesso rápido às funcionalidades essenciais da plataforma.
