const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new', // Usa true si estás en Node < 20
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Mostrar logs del navegador
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  try {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36');

    await page.goto('http://localhost:6008/img/register.html', { waitUntil: 'networkidle2' });

    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const email = `puppeteer-${timestamp}@test.com`;
    const surname = `Test-${timestamp}`;

    await page.type('input[id="email"]', email);
    await page.type('input[id="name"]', 'Puppeteer Test');
    await page.type('input[id="surname"]', surname);
    await page.type('input[id="password"]', 'test');

    // Verificar que el botón existe
    const submitButton = await page.$('button[type="submit"]');
    if (!submitButton) {
      console.error("❌ Botón de registro no encontrado.");
      if (!page.isClosed()) {
        await page.screenshot({ path: 'register-button-missing.png' });
      }
      return;
    }

    // Preparar escucha del alert
    let alertMessage = null;
    let alertAppeared = false;

    const alertPromise = new Promise(resolve => {
      page.once('dialog', async dialog => {
        alertMessage = dialog.message();
        alertAppeared = true;
        console.log('⚠️ Alert detected:', alertMessage);
        await dialog.dismiss();
        resolve();
      });
    });

    // Hacer click en el botón de registro
    await submitButton.click();

    // Esperar a que aparezca alert o timeout (10s)
    await Promise.race([
      alertPromise,
      new Promise(resolve => setTimeout(resolve, 10000))
    ]);

    if (alertAppeared) {
      console.log('✅ Alert appeared:', alertMessage);
      if (alertMessage === "Hubo un problema al registrarse") {
        console.log('✅ The API is not vulnerable and the webpage is working fine.');
      } else {
        console.log('⚠️ The API responded, but alert was unexpected:', alertMessage);
      }
    } else {
      console.log('❌ No alert detected after submission.');
    }

    if (!page.isClosed()) {
      await page.screenshot({ path: 'register-result.png' });
    }

  } catch (error) {
    console.error('🔥 Error during Puppeteer register test:', error);
    try {
      if (!page.isClosed()) {
        await page.screenshot({ path: 'register-error.png' });
      }
    } catch (screenshotError) {
      console.warn('⚠️ No se pudo capturar screenshot del error:', screenshotError);
    }
  } finally {
    await browser.close();
  }
})();
