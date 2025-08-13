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
- `src/test_env.ts` - Mock Reclaim SDK environment (edit this to simulate Reclaim web script environment)
- `src/env.d.ts` - TypeScript definitions

## Notes

- The mock environment is loaded via `import "./test_env"` during development
- All API calls are logged to console for debugging
- Full TypeScript support with comprehensive type definitions
- Remember to comment out test environment import before compiling for production
