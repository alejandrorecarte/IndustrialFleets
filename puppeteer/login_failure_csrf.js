const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new', // o true si estás en Node < 20
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();

  // Mostrar logs del navegador
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  try {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36');

    await page.goto('http://apache:80/img/register.html', { waitUntil: 'networkidle2' });

    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const email = `puppeteer-${timestamp}@test.com`;
    const surname = `Test-${timestamp}`;

    await page.type('input[id="email"]', email);
    await page.type('input[id="name"]', 'Puppeteer Test');
    await page.type('input[id="surname"]', surname);
    await page.type('input[id="password"]', 'test');

    // Escuchar alert del navegador
    let alertMessage = null;
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      console.log('⚠️ Alert detected:', alertMessage);
      await dialog.dismiss();
    });

    // Verificar que el botón existe
    const submitButton = await page.$('button[type="submit"]');
    if (!submitButton) {
      console.error("❌ Botón de registro no encontrado.");
      await page.screenshot({ path: 'register-button-missing.png' });
      return;
    }

    // Hacer click en el botón de registro
    await submitButton.click();

    // Esperar unos segundos para que se dispare el alert
    await new Promise(resolve => setTimeout(resolve, 30000));

    if (alertMessage) {
      console.log('✅ Alert appeared:', alertMessage);
      if (alertMessage === "Hubo un problema al registrarse") {
        console.log('✅ The API is not vulnerable and the webpage is working fine.');
      } else {
        console.log('⚠️ The API responded, but alert was unexpected:', alertMessage);
      }
    } else {
      console.log('❌ No alert detected after submission.');
    }

    await page.screenshot({ path: 'register-result.png' });

  } catch (error) {
    console.error('🔥 Error during Puppeteer register test:', error);
    await page.screenshot({ path: 'register-error.png' });
  } finally {
    await browser.close();
  }
})();
