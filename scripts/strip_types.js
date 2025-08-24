const { readFileSync, writeFileSync, mkdirSync } = require("fs");
const { resolve, dirname } = require("path");
const prettier = require("prettier");

const main = async () => {
  const tsBlankSpace = (await import("ts-blank-space")).default;

  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error("Usage: node strip_types.js <input-file> <output-file>");
    process.exit(1);
  }

  const [inputPath, outputPath] = args.map((p) => resolve(p));

  console.info(
    `Reading from ${inputPath} and writing with stripped types to ${outputPath}`
  );

  try {
    const inputContent = readFileSync(inputPath, "utf-8");

    const strippedContent = tsBlankSpace(inputContent);

    const prettyContent = await prettier.format(strippedContent, {
      semi: false,
      parser: "babel",
    });

    mkdirSync(dirname(outputPath), { recursive: true });

    writeFileSync(outputPath, prettyContent, "utf-8");

    console.log(`Successfully processed ${inputPath} -> ${outputPath}`);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

main();
