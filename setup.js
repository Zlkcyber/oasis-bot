import { readToken, delay } from "./utils/file.js";
import { showBanner } from "./utils/banner.js";
import { loginFromFile } from "./utils/login.js";
import { createProviders } from "./utils/providers.js";
import { logger } from "./utils/logger.js";
import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  showBanner();
  // Ask for number of providers to create
  const input = await askQuestion('Enter the number of Providers you want to create [1-1000]: ');
  const numProv = parseInt(input, 10);
  
  if (isNaN(numProv) || numProv < 1 || numProv > 1000) {
    logger("Invalid input. Please enter a number between 1 and 1000.", "", "error");
    rl.close();
    return;
  };
  const proxies = await readToken("proxy.txt");
  const isLogin = await loginFromFile('accounts.txt');

  if (proxies.length === 0) { 
    logger('No proxies found in proxy.txt Exiting...', "", "error");
    rl.close();
    return; 
  }
  if (!isLogin) {
    logger("No accounts were successfully logged in. Exiting...", "", "error");
    rl.close();
    return; 
  }

  logger(`Creating ${numProv} Providers...`);
  await createProviders(numProv);
  
  rl.close();
}

setup();
