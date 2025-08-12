declare global {
  interface Window {
    /**
     * The Reclaim SDK object to interact with the inapp sdk.
     * Ensure this object is available before using any methods or properties.
     */
    Reclaim: {
      version: 1;
      /**
       * The provider configuration used in this verification session
       */
      provider: ReclaimHttpProvider;
      /**
       * The parameters used when starting verification session with the sdk
       */
      parameters: Record<string, string>;
      /**
       * Start a claim creation with the attestor by sending this request to the inapp sdk.
       */
      requestClaim: (claim: HttpClaimRequest) => void;
      /**
       * Notify the inapp sdk that the current page requires user interaction, i.e for logging in, etc.
       * Causes the inapp sdk to display this web page to the user and lets them interact with it.
       */
      requiresUserInteraction: (isUserInteractionRequired: boolean) => void;
      /**
       * When true, notifies the inapp sdk to wait for more claims to be created, using `requestClaim`.
       * Doesn't let the inapp sdk to show that the verification has completed.
       *
       * When false, notifies the inapp sdk to not wait for any more claims from js scripts.
       * If proof generation is complete, the inapp sdk will show that the verification has completed.
       */
      canExpectManyClaims: (canExpectManyClaims: boolean) => void;
      /**
       * Add any extra data in the verification response.
       * This data will not go through the claim creation process in the attestor.
       *
       * Note: The root level keys in the data object will be displayed to user. Choose a short and meaningful name for these keys.
       * For example: `{ "User Information": { "name": "John Doe", "email": "john.doe@example.com" } }`
       */
      updatePublicData: (data: Record<string, any>) => void;
      /**
       * Stop verification and reject any further claims from being created.
       * This is useful when the provider wants to stop the verification process, e.g. when requirements for verification cannot for the user.
       * The `message` provided in the error will be shown to the user.
       */
      reportProviderError: (
        error: { message: string; [key: string]: any } | string,
      ) => void;
    };
  }

  export interface ReclaimHttpProvider {
    name: string | null;
    description: string | null;
    loginUrl: string | null;
    userAgent: UserAgentSettings;
    geoLocation: string | null;
    additionalClientOptions: ReclaimAttestorClientOptions | null;
    useIncognitoWebview: boolean | null;
    requestData: HttpClaimRequest[];
  }

  export type ReclaimAttestorSupportedProtocolVersion = "TLS1_2" | "TLS1_3";

  export interface ReclaimAttestorClientOptions {
    supportedProtocolVersions: ReclaimAttestorSupportedProtocolVersion[];
  }

  export interface UserAgentSettings {
    android: string | null;
    ios: string | null;
  }

  export type UrlType = "REGEX" | "CONSTANT" | "TEMPLATE";

  export type RequestMethodType = "GET" | "POST";

  export type WebCredentialsType = "include" | "same-origin" | "omit";

  export interface HttpClaimRequest {
    url: string | null;
    /**
     * If not provided, defaults to 'TEMPLATE' if url includes `{{` and 'CONSTANT' otherwise
     */
    urlType?: UrlType | null;
    /**
     * Defaults to 'GET'
     */
    method: RequestMethodType | null;
    bodySniff?: BodySniff | null;
    /**
     * Must be unique for each request
     */
    requestHash?: string | null;
    expectedPageUrl?: string | null;
    responseMatches: ResponseMatch[];
    responseRedactions: ResponseRedaction[];
    /**
     * If not provided, defaults to 'include'
     */
    credentials: WebCredentialsType | null;
  }

  export interface BodySniff {
    /**
     * Defaults to false
     */
    enabled: boolean | null;
    template: string | null;
  }

  export type ResponseMatchType = "contains" | "regex";

  export interface ResponseMatch {
    value?: string | null;
    /**
     * Defaults to 'contains'
     */
    type?: ResponseMatchType | null;
    /**
     * Defaults to false
     */
    invert?: boolean | null;
    description?: string | null;
    order?: number | null;
    /**
     * Defaults to false. Atleast one response match must be provided with `isOptional` set to false.
     */
    isOptional?: boolean | null;
  }

  export type ResponseRedactionMatchType = "greedy" | "lazy";

  export interface ResponseRedaction {
    xPath?: string | null;
    jsonPath?: string | null;
    regex?: string | null;
    /**
     * Decides whether to use `(.*)` aka greedy matching for variable values or use `(.*?)` aka lazy matching.
     * When null, defaults to 'greedy' if parameter name is suffixed with `_GRD` and 'lazy' otherwise.
     */
    matchType?: ResponseRedactionMatchType | null;
    hash?: string | null;
  }
}

export {};
