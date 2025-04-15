Feature: Autenticação de Usuário
  Como um usuário do sistema
  Quero poder fazer login na plataforma
  Para acessar as funcionalidades do dashboard

  Scenario: Login com credenciais válidas
    Given estou na página de login
    When preencho o email "usuario@exemplo.com"
    And preencho a senha "senha123"
    And clico no botão de login
    Then devo ser redirecionado para o dashboard
    And devo ver a mensagem de boas-vindas

  Scenario: Login com credenciais inválidas
    Given estou na página de login
    When preencho o email "usuario@exemplo.com"
    And preencho a senha "senha_incorreta"
    And clico no botão de login
    Then devo ver uma mensagem de erro
    And devo permanecer na página de login

  Scenario: Logout
    Given estou logado no sistema
    When clico no botão de logout
    Then devo ser redirecionado para a página de login
    And não devo ter acesso às áreas protegidas 