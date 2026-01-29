
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

/**
 * @param {string} providerId 
 */
export async function changeProvider(providerId) {
    // Create providers directory if it doesn't exist
    const providersDir = path.join(process.cwd(), ".provider", "providers");
    if (!fs.existsSync(providersDir)) {
        fs.mkdirSync(providersDir, { recursive: true });
        console.log("✓ Created providers directory");
    }

    const providerFilePath = path.join(providersDir, providerId);
    if (!fs.existsSync(providerFilePath)) {
        fs.mkdirSync(providerFilePath, { recursive: true });
        console.log("✓ Created providers directory");
    }

    const providerScriptFilePath = path.join(providerFilePath, "index.js");
    const providerConfigFilePath = path.join(providerFilePath, "config.json");

    fs.mkdirSync('.provider', { recursive: true });

    fs.writeFileSync('.provider/selected', providerId);

    if (fs.existsSync('src/provider.js')) {
        fs.unlinkSync('src/provider.js');
    }

    fs.symlinkSync(providerScriptFilePath, 'src/provider.js');

    if (fs.existsSync('src/providerConfig.json')) {
        fs.unlinkSync('src/providerConfig.json');
    }

    fs.symlinkSync(providerConfigFilePath, 'src/providerConfig.json');
}

export const getSelectedProvider = () => {
    return fsPromises.readFile('.provider/selected', 'utf-8').then((data) => data.trim()).catch((err) => {
        if (!err.toString().includes('no such file or directory')) {
            console.error(err);
        }
        return '';
    });
}