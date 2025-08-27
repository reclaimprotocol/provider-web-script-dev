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
    null,
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
