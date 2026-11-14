const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const servicesPath = path.join(ROOT, 'src', 'data', 'services.json');
const currenciesPath = path.join(ROOT, 'src', 'data', 'currencies.json');
const allowedCategories = [
  'Streaming',
  'Music',
  'Gaming',
  'Cloud & Storage',
  'Software & Productivity',
  'Education',
  'News & Reading',
  'Fitness & Health',
  'Utilities & Bills',
  'Finance & Insurance',
  'Shopping & Delivery',
  'Other',
];
const allowedCycles = ['Weekly', 'Monthly', 'Quarterly', 'Yearly'];
const allowedDifficulties = ['Easy', 'Medium', 'Hard'];

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`OK: ${message}`);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`${filePath} is not valid JSON: ${error.message}`);
    return null;
  }
}

function uniqueCheck(items, field, label) {
  const seen = new Set();
  for (const item of items) {
    const value = item[field];
    if (seen.has(value)) {
      fail(`${label} duplicate: ${value}`);
    }
    seen.add(value);
  }
}

function validateServices() {
  const services = readJson(servicesPath);
  if (!services) return;

  const ids = services.map((item) => item.id);
  const names = services.map((item) => item.name);
  uniqueCheck(services, 'id', 'service id');
  uniqueCheck(services, 'name', 'service name');

  for (const item of services) {
    if (!item.id || !item.name || !item.category || !item.description || !Array.isArray(item.typicalPlans)) {
      fail(`Service missing required fields: ${item.id || item.name || 'unknown'}`);
    }
    if (!allowedCategories.includes(item.category)) {
      fail(`Invalid category for ${item.name}: ${item.category}`);
    }
    if (!Array.isArray(item.tags) || item.tags.length < 3 || item.tags.length > 5) {
      fail(`Invalid tags for ${item.name}: ${item.tags}`);
    }
    if (!allowedDifficulties.includes(item.cancelDifficulty)) {
      fail(`Invalid cancel difficulty for ${item.name}: ${item.cancelDifficulty}`);
    }
    if (!item.cancelTip || !item.savingTip) fail(`Missing cancel/saving tip for ${item.name}`);
    for (const plan of item.typicalPlans) {
      if (!plan.planName || !plan.cycle || !plan.priceUSD || Number(plan.priceUSD) <= 0) {
        fail(`Bad plan for ${item.name}: ${JSON.stringify(plan)}`);
      }
      if (!allowedCycles.includes(plan.cycle)) fail(`Invalid cycle for ${item.name}: ${plan.cycle}`);
    }
  }

  const categoryMap = {};
  for (const item of services) {
    categoryMap[item.category] = (categoryMap[item.category] || 0) + 1;
  }
  for (const [category, count] of Object.entries(categoryMap)) {
    if (count < 5) fail(`Category has fewer than 5 services: ${category} (${count})`);
  }

  ok(`Validated ${services.length} services with unique ids and names.`);

  console.log('CATALOG REVIEW');
  for (const item of services) {
    console.log(`${item.id} | ${item.name} | ${item.category} | ${item.typicalPlans.map((plan) => `${plan.planName}:${plan.priceUSD}/${plan.cycle}`).join(', ')}`);
  }
}

function validateCurrencies() {
  const currencies = readJson(currenciesPath);
  if (!currencies) return;
  const validCodes = ['USD', 'EUR', 'GBP', 'INR', 'LKR'];
  const names = new Set();
  for (const item of currencies) {
    if (!validCodes.includes(item.code)) fail(`Unsupported currency code: ${item.code}`);
    if (!item.symbol || !item.name) fail(`Currency info missing fields: ${JSON.stringify(item)}`);
    if (names.has(item.code)) fail(`Duplicate currency code: ${item.code}`);
    names.add(item.code);
    if (!Number(item.perUSD) || Number(item.perUSD) <= 0) fail(`Currency rate invalid: ${item.code}`);
  }
  ok(`Validated ${currencies.length} supported currencies.`);
}

function main() {
  validateServices();
  validateCurrencies();
  if (process.exitCode) {
    console.error('VALIDATION FAILED');
    return;
  }
  ok('All validation checks passed.');
}

main();
