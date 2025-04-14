const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('estou na página de login', async function() {
  await this.page.goto('/login');
});

When('preencho o email {string}', async function(email) {
  await this.page.fill('input[type="email"]', email);
});

When('preencho a senha {string}', async function(senha) {
  await this.page.fill('input[type="password"]', senha);
});

When('clico no botão de login', async function() {
  await this.page.click('button[type="submit"]');
});

Then('devo ser redirecionado para o dashboard', async function() {
  await expect(this.page).toHaveURL(/dashboard/);
});

Then('devo ver a mensagem de boas-vindas', async function() {
  await expect(this.page.locator('.welcome-message')).toBeVisible();
});

Then('devo ver uma mensagem de erro', async function() {
  await expect(this.page.locator('.error-message')).toBeVisible();
});

Then('devo permanecer na página de login', async function() {
  await expect(this.page).toHaveURL(/login/);
});

Given('estou logado no sistema', async function() {
  await this.page.goto('/login');
  await this.page.fill('input[type="email"]', 'usuario@exemplo.com');
  await this.page.fill('input[type="password"]', 'senha123');
  await this.page.click('button[type="submit"]');
  await expect(this.page).toHaveURL(/dashboard/);
});

When('clico no botão de logout', async function() {
  await this.page.click('.logout-button');
});

Then('não devo ter acesso às áreas protegidas', async function() {
  await this.page.goto('/dashboard');
  // Verifica se foi redirecionado para login
  await expect(this.page).toHaveURL(/login/);
}); 