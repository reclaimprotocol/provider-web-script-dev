
import fs from 'fs';
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

    fs.mkdirSync('.provider', { recursive: true });

    fs.writeFileSync('.provider/selected', providerId);

    if (fs.existsSync('src/provider.js')) {
        fs.unlinkSync('src/provider.js');
    }

    fs.symlinkSync(providerScriptFilePath, 'src/provider.js');
}