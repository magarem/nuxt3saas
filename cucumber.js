module.exports = {
  default: {
    parallel: 2,
    format: [
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
      'summary'
    ],
    paths: [
      'tests/e2e/features/**/*.feature'
    ],
    require: [
      'tests/e2e/step-definitions/**/*.js',
      'tests/e2e/support/**/*.js'
    ],
    publishQuiet: true
  }
}; 