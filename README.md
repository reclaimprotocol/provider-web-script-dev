# Reclaim Web Script Development

Development environment for Reclaim Devtools Provider developers to simulate, test, and compile scripts for the Reclaim InApp SDK web environment.

## Usage

### Testing Scripts

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Modify the source files**:
    - Your provider script code will be in `src/index.ts`.
    - You can modify and import `src/test_env.ts` file to simulate Reclaim InApp SDK's provider script environment behaviour.
    - APIs available in the Reclaim InApp SDK's provider script environment are defined in `src/env.d.ts` file.

3. **Build the development script**:
   ```bash
   npm run build
   ```

4. **Test your script**:
   - Open the target website in your browser
   - Open browser developer tools (F12)
   - Paste the compiled script from `build/script.js` into the console
   - Press Enter to execute and see how it works

5. **Publish to Devtools**:
    - When everything looks good, comment the `src/test_env.ts` script import in your `src/index.ts` file to prepare for publishing.
    - Run `npm run build` again to compile for publishing to devtools.
    - Copy the js script generated in `build/script.js` and publish to your provider on Reclaim Devtools
    - Refer - [Compile for reclaim devtools instructions.](#compile-for-reclaim-devtools)

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
    "User Info": { name: "John Doe", email: "john@example.com" }
  });

  // Request a claim
  const claimId = await window.Reclaim.requestClaim({
    url: "https://api.example.com/user",
    method: "GET",
    responseMatches: [
      { value: "{{userName}}", type: "contains", isOptional: false }
    ],
    responseRedactions: [
      { xPath: "//title/text()", regex: "(.*)", hash: "" }
    ]
  });
};
```

## Compile for Reclaim Devtools

Before publishing to Reclaim Devtools:

1. **Comment out the test environment import** in `src/index.ts`:
   ```typescript
   // WARNING: Comment the below import when publishing to devtools
   // import "./test_env";
   ```

2. **Compile to single JS file**:
   ```bash
   npm run compile
   ```

3. **Use the generated file** `build/script.js` for Reclaim Devtools

## Scripts

- `npm run build` - Compile TypeScript to a single JavaScript file
- `npm run format` - Format code

## File Structure

- `src/index.ts` - Main script (edit this)
- `src/test_env.ts` - Mock Reclaim SDK environment (edit this to simulate Reclaim web script environment)
- `src/env.d.ts` - TypeScript definitions

## Notes

- The mock environment is loaded via `import "./test_env"` during development
- All API calls are logged to console for debugging
- Full TypeScript support with comprehensive type definitions
- Remember to comment out test environment import before compiling for production
