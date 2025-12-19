# Reclaim Web Script Development

Development environment for Reclaim Devtools Provider developers to simulate, test, and compile scripts for the Reclaim InApp SDK web environment.

Any custom script you have in provider will be loaded as user script in browser and run on every page load and before every page loading completes.

All available Reclaim APIs are defined as types and documented here: [github.com/reclaimprotocol/src/support/env.d.ts](src/support/env.d.ts)

## Usage

### Preparing

1. **Install dependencies**:

   ```bash
   npm install
   ```
2. **Setup your provider script**:

   ```bash
   npm run provider
   ```

   This will prompt you for a provider id. After typing and pressing enter, it'll download the provider and place it in `src/providers/:provider-id` directory.

### Testing Scripts

1. **Work on script downloaded with `npm run provider`**:

2. **Modify the source files**:
   - Your provider script code will be imported from `src/index.ts`.
   - To download provider script and import it in `src/index.ts`, you can use `npm run provider`.
   - You can modify `src/dev.ts` file to simulate Reclaim InApp SDK's provider script environment behaviour.
   - You can modify `src/website.d.ts` file to declare any types which are available in the real website for which you're building a provider script.
   - DO NOT EDIT anything inside `src/support` directory.

3. **Build the development script**:
   - For building a bundle for your development testing, use the following script to build with development overrides from `src/dev.ts` and mock data.

   ```bash
   npm run build:dev
   ```

4. **Test your script**:
   - Open the target website in your browser
   - Open browser developer tools (F12)
   - Paste the compiled script from `build/script.js` into the console
   - Press Enter to execute and see how it works

5. **Publish to Devtools**:
   - When everything looks good, we can prepare for publishing.
   - Run `npm run build` again to compile for publishing to devtools.
   - Copy the js script generated in `build/script.js` and publish to your provider on Reclaim Devtools

### Available APIs

The development environment provides a mock `window.Reclaim` object with these methods:

- `requestClaim(claim)` - Start claim creation
- `requiresUserInteraction(boolean)` - Notify if user interaction needed
- `canExpectManyClaims(boolean)` - Control claim expectations
- `updatePublicData(data)` - Add extra data to response
- `reportProviderError(error)` - Stop verification with error
- `getVerificationStatus()` - Get verification status for all claims processed by the InApp SDK
- `updateDefaultErrorMessage(message)` - Update error message on attestor claim creation failures

### Example Script

```typescript
// Check if running in Reclaim environment
if ("Reclaim" in window) {
  await onReady();
} else {
  console.error("Not running in Reclaim Web Environment");
}

const onReady = async () => {
  // Update public data
  window.Reclaim.updatePublicData({
    "User Info": { name: "John Doe", email: "john@example.com" },
  });

  // Request a claim
  const claimId = await window.Reclaim.requestClaim({
    url: "https://api.example.com/user",
    method: "GET",
    responseMatches: [
      { value: "{{userName}}", type: "contains", isOptional: false },
    ],
    responseRedactions: [{ xPath: "//title/text()", regex: "(.*)", hash: "" }],
  });
};
```

## Scripts

- `npm run build` - Compile TypeScript to a single JavaScript file
- `npm run build:dev` - Compile TypeScript with mock data to a single JavaScript file
- `npm run format` - Format code

## File Structure

- `src/index.ts` - Main script (edit this)
- `src/dev.ts` - Development environment setup and mock data
- `src/website.d.ts` - TypeScript definitions for website-specific types
- `src/support/` - Support files (do not edit)
  - `src/support/env.d.ts` - TypeScript definitions for Reclaim SDK
  - `src/support/mock_apis.ts` - Mock API implementations
  - `src/support/dev_index.ts` - Development entry point
- `src/providers/` - You can keep source code of different providers here and import them in `src/index.ts` to selectively build for those providers separately

## Tip

1. Write your providers in separate files inside `src/providers/` and import whichever you wish to build in `src/index.ts`.
2. You get suggestions in js & ts to help you write more accurate code that supports more platforms. For example:

```sh
✘ [ERROR] Transforming destructuring to the configured target environment ("chrome58", "edge16", "firefox57", "safari11") is not supported yet

    src/providers/7e5b59a9-56c5-490c-a169-82a443f9b507.js:226:19:
      226 │             async ({ requestId, response }) => {
          ╵                    ^

```

## Notes

- The mock environment is loaded via `import "./test_env"` during development
- All API calls are logged to console for debugging
- Full TypeScript support with comprehensive type definitions
- Remember to comment out test environment import before compiling for production
