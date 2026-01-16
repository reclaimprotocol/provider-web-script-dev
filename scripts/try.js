const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { getSelectedProvider } = require('./change_provider');
const providerConfig = require('./../src/providerConfig.json');

async function main() {
    try {
        // 1. Run npm run build:dev
        console.log('Building development script...');
        execSync('npm run build:dev', { stdio: 'inherit' });

        // 2. Take selected provider id with getSelectedProvider
        const providerId = await getSelectedProvider();
        if (!providerId) {
            console.error('No provider selected. Please select a provider first.');
            process.exit(1);
        }
        console.log(`Selected Provider ID: ${providerId}`);

        // 3. Ensure chrome for testing is downloaded locally
        // Check if playwright is installed, if not install it
        try {
            require.resolve('playwright');
        } catch (e) {
            console.log('Playwright not found, installing...');
            execSync('npm install playwright', { stdio: 'inherit' });
        }

        console.log('Ensuring Chromium is installed...');
        execSync('npx playwright install chromium', { stdio: 'inherit' });

        // 4. Use playwright to launch it and add build/script.js as user script
        const { chromium } = require('playwright');

        console.log('Launching Chromium...');

        const proxyConfig = {
            server: process.env.PROXY_SERVER,
            username: process.env.PROXY_USERNAME,
            password: process.env.PROXY_PASSWORD
        };

        const browser = await chromium.launch({
            headless: false,
            proxy: proxyConfig.server ? {
                server: proxyConfig.server,
                username: proxyConfig.username,
                password: proxyConfig.password
            } : undefined
        });
        const context = await browser.newContext();

        const buildScriptPath = path.join(__dirname, '../build/script.js');
        if (fs.existsSync(buildScriptPath)) {
            await context.addInitScript({ path: buildScriptPath });
            console.log(`Added user script from ${buildScriptPath}`);
        } else {
            console.error(`Build script not found at ${buildScriptPath}`);
            await browser.close();
            process.exit(1);
        }

        if (providerConfig.customInjection) {
            await context.addInitScript(providerConfig.customInjection);
        }


        const logsPath = path.join(__dirname, '../build/logs.txt');
        fs.writeFileSync(logsPath, '');

        context.on('page', (p) => {
            p.on('console', (msg) => {
                const logLine = `[${new Date().toISOString()}] [${msg.type()} (${p.url()})] ${msg.text()}\n`;
                fs.appendFileSync(logsPath, logLine);
            });
        });

        const page = await context.newPage();

        page.goto(providerConfig.loginUrl);

        console.log('Browser launched. Navigate to a page to test the script.');
        console.log('Press Ctrl+C to stop.');

        // Keep the process alive
        await new Promise(() => { });

    } catch (error) {
        console.error('An error occurred:', error);
        process.exit(1);
    }
}

main();
