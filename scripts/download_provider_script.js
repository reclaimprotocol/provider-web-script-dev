#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const https = require("https");

// Get provider ID from command line arguments
const providerId = process.argv[2];

if (!providerId) {
  console.error("Error: Please provide a provider ID as an argument");
  console.log("Usage: node download_provider_script.js <provider-id>");
  process.exit(1);
}

// Function to make HTTPS request
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
                new Error(`Failed to parse JSON response: ${error.message}`),
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

// Function to update index.ts with new import
function updateIndexFile(providerId) {
  const indexPath = path.join(__dirname, "..", "src", "index.ts");

  try {
    let content = fs.readFileSync(indexPath, "utf-8");

    // Check if import already exists
    const importStatement = `import "./providers/${providerId}";`;
    if (content.includes(importStatement)) {
      console.log(
        `Import for provider '${providerId}' already exists in index.ts`,
      );
      return;
    }

    // Find the comment and remove any imports below it, then add new import
    const commentPattern = /\/\/ import "\.\/providers\/example";/;
    if (commentPattern.test(content)) {
      // Split content into lines
      const lines = content.split("\n");
      const commentLineIndex = lines.findIndex((line) =>
        commentPattern.test(line),
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
          `✓ Removed existing provider imports and added import for provider '${providerId}' to index.ts`,
        );
      }
    } else {
      console.warn(
        "Warning: Could not find the comment \"// import './providers/example';\" in index.ts",
      );
      console.warn("Please manually add the import statement to index.ts");
    }
  } catch (error) {
    console.error(`Error updating index.ts: ${error.message}`);
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

    const customInjection = providerData.providers.customInjection;

    if (!customInjection) {
      console.log(`Provider '${providerId}' has no customInjection code`);
      return;
    }

    // Create providers directory if it doesn't exist
    const providersDir = path.join(__dirname, "..", "src", "providers");
    if (!fs.existsSync(providersDir)) {
      fs.mkdirSync(providersDir, { recursive: true });
      console.log("✓ Created providers directory");
    }

    // Write the custom injection code to a file with provider info comment
    const providerFilePath = path.join(providersDir, `${providerId}.js`);
    const providerName = providerData.providers.name || providerId;
    const providerComment = `// \`${providerName}\` (${providerId}) https://api.reclaimprotocol.org/api/providers/${providerId}\n\n`;
    const fileContent = providerComment + customInjection;
    fs.writeFileSync(providerFilePath, fileContent, "utf-8");
    console.log(
      `✓ Written custom injection code to: src/providers/${providerId}.js`,
    );

    // Update index.ts with the new import
    updateIndexFile(providerId);

    console.log(`\n✓ Successfully processed provider '${providerId}'`);
  } catch (error) {
    console.error(`\n✗ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
main();
