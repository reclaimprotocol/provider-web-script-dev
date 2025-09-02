/**
 * Returns an element from document that matches xpath.
 * Note: Sometimes, especially on iOS, <a> tag elements only when when used `//*` and not `//a`. (Weird bug from webkit?)
 *
 * @param {string} xpath
 * @returns
 */
export function getElementByXPath(xpath: string) {
  const result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  return result.singleNodeValue;
}

/**
 * Use this function to write documentation comments in typescript.
 * Typescript compilers like tsc, esbuild, swc, etc remove comments when transpiled to `js`.
 * This will let you add comments/documentation without getting stripped out.
 *
 * This function can be used to document any part of your code and it has no effect.
 *
 * @param {string} _documentation
 */
export function notes(_documentation: string) {}

/**
 * @param value
 * @returns {boolean}
 */
export function isNull(value: any): boolean {
  return value === null || value === undefined || typeof value === "undefined";
}

/**
 * Stringifies all values of an object or a Map using .toString().
 * @param {object | Map<any, any>} input The input object or Map.
 * @returns {Record<string, string>} A new object or Map with stringified values.
 */
export function stringifyValues(
  input: object | Map<any, any>
): Record<string, string> {
  const newObj: Record<string, string> = {};
  // Handle Map input
  if (input instanceof Map) {
    input.forEach((value, key, _) => {
      newObj[String(key)] = !isNull(value) ? String(value) : "";
    });
    return newObj;
  }

  // Handle plain object input
  for (const key of Object.keys(input)) {
    // @ts-ignore
    const value = input[key];
    newObj[String(key)] = !isNull(value) ? String(value) : "";
  }
  return newObj;
}
