const { Before, After, BeforeAll, AfterAll, Status } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

// Hooks antes e depois de cada cenário
Before(async function() {
  await this.setup();
});

After(async function(scenario) {
  // Capturar screenshot quando o cenário falhar
  if (scenario.result.status === Status.FAILED) {
    const screenshot = await this.page.screenshot({ 
      path: `./tests/screenshots/${scenario.pickle.name.replace(/\s+/g, '-')}-failure.png`,
      fullPage: true
    });
    await this.attach(screenshot, 'image/png');
  }

  await this.teardown();
});

// Hooks globais
let globalBrowser;

BeforeAll(async function() {
  // Alguma configuração global antes de todos os testes
  console.log('Iniciando execução dos testes BDD...');
});

AfterAll(async function() {
  // Cleanup global após todos os testes
  console.log('Todos os testes BDD foram concluídos.');
  
  if (globalBrowser) {
    await globalBrowser.close();
  }
}); 