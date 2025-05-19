const puppeteer = require('puppeteer');

(async () => {
  /*const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });*/

  const browser = await puppeteer.launch({
    headless: false,        // Muestra el navegador
    slowMo: 50,             // Opcional: ralentiza cada acción (en ms)
    devtools: true          // Opcional: abre las herramientas de desarrollo
  });

  const page = await browser.newPage();

  try {
    // Cambia esta URL por la de tu login
    await page.goto('http://localhost:6008/img/register.html', { waitUntil: 'networkidle2' });

    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14); // Ej: 20250519_153000
    
    const email = `puppeteer-${timestamp}@test.com`;
    const surname = `Test-${timestamp}`;
    
    await page.type('input[id="email"]', email);
    await page.type('input[id="name"]', 'Puppeteer Test');
    await page.type('input[id="surname"]', surname);
    await page.type('input[id="password"]', 'test');

    // Hacer click en el botón de login (ajusta el selector si es necesario)
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);

    // Esperar un elemento del dashboard o validar login exitoso
    const isDashboard = await page.$('h1.dashboard-title') !== null;

    if (isDashboard) {
      console.log('✅ Register successful, dashboard loaded.');
    } else {
      console.log('❌ Register failed or unexpected page.');
    }

    // Captura de pantalla para revisar
    await page.screenshot({ path: 'login-result.png' });

  } catch (error) {
    console.error('🔥 Error during Puppeteer register test:', error);
  } finally {
    await browser.close();
  }
})();
