const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('estou na página do dashboard', async function() {
  await this.page.goto('/dashboard');
});

Then('devo ver o widget {string}', async function(widgetName) {
  await expect(this.page.locator(`.widget:has-text("${widgetName}")`)).toBeVisible();
});

When('seleciono o filtro de período {string}', async function(periodo) {
  await this.page.click('.period-filter');
  await this.page.click(`text=${periodo}`);
});

Then('os widgets devem exibir dados dos {string}', async function(periodo) {
  // Verificação de que os dados estão atualizados para o período
  await expect(this.page.locator(`.period-indicator:has-text("${periodo}")`)).toBeVisible();
});

Then('os widgets devem exibir dados de {string}', async function(periodo) {
  await expect(this.page.locator(`.period-indicator:has-text("${periodo}")`)).toBeVisible();
});

When('clico no botão {string}', async function(botao) {
  await this.page.click(`button:has-text("${botao}")`);
});

When('seleciono o formato {string}', async function(formato) {
  await this.page.click(`label:has-text("${formato}")`);
});

When('clico em {string}', async function(botao) {
  await this.page.click(`button:has-text("${botao}")`);
});

Then('o relatório deve ser baixado no formato PDF', async function() {
  // Verificar se o download foi iniciado
  const download = await Promise.race([
    this.page.waitForEvent('download'),
    this.page.waitForTimeout(5000).then(() => null)
  ]);
  
  expect(download).not.toBeNull();
  expect(download.suggestedFilename()).toMatch(/\.pdf$/);
});

Then('devo ver uma mensagem de sucesso', async function() {
  await expect(this.page.locator('.success-message')).toBeVisible();
}); 