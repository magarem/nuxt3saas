const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('estou logado como administrador', async function() {
  await this.page.goto('/login');
  await this.page.fill('input[type="email"]', 'admin@exemplo.com');
  await this.page.fill('input[type="password"]', 'admin123');
  await this.page.click('button[type="submit"]');
  // Verificar se foi para dashboard
  await expect(this.page).toHaveURL(/dashboard/);
});

Given('estou na página de {string}', async function(pageName) {
  await this.page.click(`nav >> text=${pageName}`);
  // Verificar se navegou para a página correta
  await expect(this.page.locator(`h1:has-text("${pageName}")`)).toBeVisible();
});

When('preencho o campo {string} com {string}', async function(campo, valor) {
  await this.page.fill(`[placeholder="${campo}"], [aria-label="${campo}"], label:has-text("${campo}") + input`, valor);
});

When('seleciono a role {string}', async function(role) {
  await this.page.click('.role-selector');
  await this.page.click(`text=${role}`);
});

Then('devo ver o usuário {string} na lista de usuários', async function(nomeUsuario) {
  await expect(this.page.locator(`tr:has-text("${nomeUsuario}")`)).toBeVisible();
});

Then('devo ver a mensagem {string}', async function(mensagem) {
  await expect(this.page.locator(`.notification:has-text("${mensagem}")`)).toBeVisible();
});

Given('existe um usuário {string} na lista', async function(nomeUsuario) {
  // Verificar se o usuário está na lista ou criá-lo se não estiver
  const userExists = await this.page.locator(`tr:has-text("${nomeUsuario}")`).count() > 0;
  
  if (!userExists) {
    // Criar o usuário
    await this.page.click('button:has-text("Adicionar Usuário")');
    await this.page.fill('[placeholder="Nome"], [aria-label="Nome"], label:has-text("Nome") + input', nomeUsuario);
    await this.page.fill('[placeholder="Email"], [aria-label="Email"], label:has-text("Email") + input', `${nomeUsuario.toLowerCase().replace(/\s+/g, '.')}@exemplo.com`);
    await this.page.click('.role-selector');
    await this.page.click('text=Editor');
    await this.page.click('button:has-text("Salvar")');
    
    // Verificar se o usuário foi criado
    await expect(this.page.locator(`tr:has-text("${nomeUsuario}")`)).toBeVisible();
  }
});

When('clico no botão {string} do usuário {string}', async function(botao, usuario) {
  await this.page.click(`tr:has-text("${usuario}") >> button:has-text("${botao}")`);
});

When('altero o campo {string} para {string}', async function(campo, valor) {
  await this.page.fill(`[placeholder="${campo}"], [aria-label="${campo}"], label:has-text("${campo}") + input`, valor);
});

Then('devo ver a role {string} para este usuário', async function(role) {
  await expect(this.page.locator(`tr:has-text("Maria Silva Santos") >> td:has-text("${role}")`)).toBeVisible();
});

When('confirmo a ação na caixa de diálogo', async function() {
  await this.page.click('button:has-text("Confirmar")');
});

Then('não devo ver o usuário {string} na lista', async function(nomeUsuario) {
  await expect(this.page.locator(`tr:has-text("${nomeUsuario}")`)).toHaveCount(0);
}); 