Feature: Dashboard
  Como um usuário logado
  Quero visualizar e interagir com o dashboard
  Para acessar informações importantes do sistema

  Background:
    Given estou logado no sistema
    And estou na página do dashboard

  Scenario: Visualizar widgets do dashboard
    Then devo ver o widget "Usuários Ativos"
    And devo ver o widget "Receita Mensal"
    And devo ver o widget "Tickets de Suporte"
    And devo ver o widget "Conversão de Clientes"

  Scenario: Filtrar dados do dashboard por período
    When seleciono o filtro de período "Últimos 30 dias"
    Then os widgets devem exibir dados dos "últimos 30 dias"
    When seleciono o filtro de período "Este ano"
    Then os widgets devem exibir dados de "este ano"
    
  Scenario: Exportar relatório do dashboard
    When clico no botão "Exportar Relatório"
    And seleciono o formato "PDF"
    And clico em "Confirmar"
    Then o relatório deve ser baixado no formato PDF
    And devo ver uma mensagem de sucesso 