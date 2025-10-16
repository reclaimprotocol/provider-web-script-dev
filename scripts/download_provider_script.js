#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const https = require("https");
const crypto = require("crypto");
const readline = require("readline");

/**
 *
 * @param {unknown} error
 * @returns
 */
const getErrorMessage = (error) => {
  return (
    (typeof error === "object" &&
      error &&
      "message" in error &&
      error.message) ||
    error
  );
};

// Get provider ID from command line arguments
const providerId = process.argv[2];

if (!providerId) {
  console.error("Error: Please provide a provider ID as an argument");
  console.log("Usage: node download_provider_script.js <provider-id>");
  process.exit(1);
}

/**
 * Function to calculate SHA256 hash of a string
 * @param {string} content
 * @returns
 */
function calculateSHA256(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

/**
 * Function to prompt user for confirmation
 * @param {string} question
 * @returns
 */
function askForConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
    });
  });
}

/**
 * Function to make HTTPS request
 * @param {string} providerId
 * @returns
 */
function fetchProviderData(providerId) {
  return new Promise((resolve, reject) => {
    const url = `https://api.reclaimprotocol.org/api/providers/${providerId}`;
    console.log(`Fetching provider data from: ${url}`);

    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (res.statusCode === 200) {
            try {
              const jsonData = JSON.parse(data);
              resolve(jsonData);
            } catch (error) {
              reject(
                new Error(
                  `Failed to parse JSON response: ${getErrorMessage(error)}`
                )
              );
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      })
      .on("error", (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });
  });
}

/**
 * Function to update index.ts with new import
 *
 * @param {string} providerId
 * @returns
 */
function updateIndexFile(providerId) {
  const indexPath = path.join(__dirname, "..", "src", "index.ts");

  try {
    let content = fs.readFileSync(indexPath, "utf-8");

    // Check if import already exists
    const importStatement = `import "./providers/${providerId}";`;
    if (content.includes(importStatement)) {
      console.log(
        `Import for provider '${providerId}' already exists in index.ts`
      );
      return;
    }

    // Find the comment and remove any imports below it, then add new import
    const commentPattern = /\/\/ import "\.\/providers\/example";/;
    if (commentPattern.test(content)) {
      // Split content into lines
      const lines = content.split("\n");
      const commentLineIndex = lines.findIndex((line) =>
        commentPattern.test(line)
      );

      if (commentLineIndex !== -1) {
        // Find where provider imports end (after the comment)
        let endOfImportsIndex = commentLineIndex + 1;

        // Remove all import lines that come after the comment
        while (endOfImportsIndex < lines.length) {
          const line = lines[endOfImportsIndex].trim();
          // Check if this line is a provider import
          if (line.startsWith('import "./providers/') && line.endsWith('";')) {
            lines.splice(endOfImportsIndex, 1);
          } else if (line === "") {
            // Skip empty lines but don't remove them
            endOfImportsIndex++;
          } else {
            // Stop at first non-import, non-empty line
            break;
          }
        }

        // Insert the new import right after the comment
        lines.splice(commentLineIndex + 1, 0, importStatement);

        // Reconstruct the content
        content = lines.join("\n");
        fs.writeFileSync(indexPath, content, "utf-8");
        console.log(
          `✓ Removed existing provider imports and added import for provider '${providerId}' to index.ts`
        );
      }
    } else {
      console.warn(
        "Warning: Could not find the comment \"// import './providers/example';\" in index.ts"
      );
      console.warn("Please manually add the import statement to index.ts");
    }
  } catch (error) {
    console.error(`Error updating index.ts: ${getErrorMessage(error)}`);
  }
}

// Main function
async function main() {
  try {
    // Fetch provider data
    const providerData = await fetchProviderData(providerId);

    // Check if provider exists and has customInjection (note: API returns 'providers' not 'provider')
    if (!providerData.providers) {
      console.log(`No provider found with ID: ${providerId}`);
      return;
    }

    const customInjection = providerData.providers.customInjection ?? "";

    if (!customInjection) {
      console.log(`⚠️  Provider '${providerId}' has no customInjection code`);
    }

    // Create providers directory if it doesn't exist
    const providersDir = path.join(__dirname, "..", "src", "providers");
    if (!fs.existsSync(providersDir)) {
      fs.mkdirSync(providersDir, { recursive: true });
      console.log("✓ Created providers directory");
    }

    const providerName = providerData.providers.name || providerId;
    const providerFilePath = path.join(providersDir, providerId);
    if (!fs.existsSync(providerFilePath)) {
      fs.mkdirSync(providerFilePath, { recursive: true });
      console.log("✓ Created providers directory");
    }

    const providerScriptFilePath = path.join(providerFilePath, "index.js");
    const providerConfigFilePath = path.join(providerFilePath, "config.json");

    fs.writeFileSync(
      providerConfigFilePath,
      JSON.stringify(providerData.providers, null, 2),
      {
        encoding: "utf8",
        flag: "w+",
      }
    );

    console.log(
      `✓ Written provider config to: src/providers/${providerId}/config.json`
    );

    // Prepare the new file content
    const providerComment = `// \`${providerName}\` (${providerId}) https://api.reclaimprotocol.org/api/providers/${providerId}\n\n`;
    const fileContent = providerComment + customInjection;

    // Check if file already exists and compare hashes
    if (fs.existsSync(providerScriptFilePath)) {
      const existingContent = fs.readFileSync(providerScriptFilePath, "utf-8");
      const existingHash = calculateSHA256(existingContent);
      const newHash = calculateSHA256(fileContent);

      if (existingHash !== newHash) {
        console.log(``);
        console.log(`⚠️  File already exists: src/providers/${providerId}.js`);
        console.log(`   Existing SHA256: ${existingHash}`);
        console.log(`   New SHA256:      ${newHash}`);

        const shouldOverwrite = await askForConfirmation(
          "\nThe file has different content. Do you want to overwrite it? (y/n): "
        );

        if (!shouldOverwrite) {
          console.log("✗ Skipped overwriting the file");
          return;
        }
      } else {
        console.log(
          `✓ File already exists with same content: src/providers/${providerId}/index.js`
        );
        // Still update index.ts in case it needs updating
        updateIndexFile(providerId);
        return;
      }
    }

    // Write the file (either new or confirmed overwrite)
    fs.writeFileSync(providerScriptFilePath, fileContent, "utf-8");
    console.log(
      `✓ Written custom injection code to: src/providers/${providerId}/index.js`
    );

    // Update index.ts with the new import
    updateIndexFile(providerId);

    console.log(`\n✓ Successfully processed provider '${providerId}'`);
  } catch (error) {
    console.error(`\n✗ Error: ${getErrorMessage(error)}`);
    process.exit(1);
  }
}

// Run the script
main();
