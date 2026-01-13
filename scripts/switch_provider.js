const readline = require('readline');
const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const { changeProvider } = require('./change_provider.js');

async function main() {
    const providerId = await fsPromises.readFile('.provider/selected', 'utf-8').then((data) => data.trim()).catch((err) => {
        if (!err.toString().includes('no such file or directory')) {
            console.error(err);
        }
        return '';
    });

    const providers = await fsPromises.readdir('.provider/providers').then((providers) => {
        return providers.map((provider) => path.basename(provider));
    }).catch((err) => {
        if (!err.toString().includes('no such file or directory')) {
            console.error(err);
        }
        return [];
    });

    if (!providers.length) {
        console.info('No providers available for use locally');
        return;
    }

    console.info('Available providers:\n');

    for (var i = 0; i < providers.length; i++) {
        const provider = providers[i];

        if (providerId == provider) {
            console.info(`${i.toString().padStart(2, ' ')} ${provider} * current`);
        } else {
            console.info(`${i.toString().padStart(2, ' ')} ${provider}`);
        }
    }

    if (providers.length == 1) {
        console.info('\nOnly one provider available, skipping selection');
        return;
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('\nWhat provider do you want to switch to?: ', async (selectedProviderIndex) => {
        if (!selectedProviderIndex) {
            console.error("Error: Please provide a selection");
            process.exit(1);
        }

        const selectedProviderId = providers[Number.parseInt(selectedProviderIndex)];

        if (!selectedProviderId) {
            console.error("Error: Invalid selection");
            process.exit(1);
        }

        await changeProvider(selectedProviderId);

        console.log(`\n✓ Successfully switched provider to '${selectedProviderId}'`);

        rl.close();
    });
}

main();
