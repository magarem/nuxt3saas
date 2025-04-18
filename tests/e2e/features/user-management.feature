Feature: Gerenciamento de Usuários
  Como um administrador
  Quero gerenciar usuários do sistema
  Para controlar o acesso à plataforma

  Background:
    Given estou logado como administrador
    And estou na página de "Gerenciamento de Usuários"

  Scenario: Criar novo usuário
    When clico no botão "Adicionar Usuário"
    And preencho o campo "Nome" com "João Silva"
    And preencho o campo "Email" com "joao@exemplo.com"
    And seleciono a role "Editor"
    And clico no botão "Salvar"
    Then devo ver o usuário "João Silva" na lista de usuários
    And devo ver a mensagem "Usuário criado com sucesso"

  Scenario: Editar usuário existente
    Given existe um usuário "Maria Santos" na lista
    When clico no botão "Editar" do usuário "Maria Santos"
    And altero o campo "Nome" para "Maria Silva Santos"
    And seleciono a role "Administrador"
    And clico no botão "Salvar"
    Then devo ver o usuário "Maria Silva Santos" na lista de usuários
    And devo ver a role "Administrador" para este usuário
    And devo ver a mensagem "Usuário atualizado com sucesso"
    
  Scenario: Remover usuário
    Given existe um usuário "Carlos Pereira" na lista
    When clico no botão "Remover" do usuário "Carlos Pereira"
    And confirmo a ação na caixa de diálogo
    Then não devo ver o usuário "Carlos Pereira" na lista
    And devo ver a mensagem "Usuário removido com sucesso" 