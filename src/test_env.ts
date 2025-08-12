const _sendMessage = (event: string, data: any) => {
  window.postMessage({
    type: `org.reclaimprotocol.inapp.messages.${event}`,
    data: JSON.stringify(data),
  });
};

const _onMessage = (event: MessageEvent) => {
  const type = event.data.type;
  const data = event.data.data;
  if (
    typeof type === "string" &&
    type.startsWith("org.reclaimprotocol.inapp.messages")
  ) {
    console.info({ type, data, debug: true });
  }
};

window.addEventListener("message", _onMessage);

// BELOW ARE THE OBJECTS THAT CAN BE USED TO MOCK THE INAPP SDK's Web Script Environment.
// Feel free to modify them to test your provider.
window.Reclaim = {
  version: 1,
  provider: {
    name: "Test Provider",
    description: "Test Provider Description",
    loginUrl: "https://example.com/",
    userAgent: {
      android: null,
      ios: null,
    },
    geoLocation: "{{DYNAMIC_GEO}}",
    requestData: [
      {
        url: "https://example.com/",
        expectedPageUrl: "https://example.com",
        urlType: "TEMPLATE",
        method: "GET",
        responseMatches: [
          {
            value: "{{pageTitle}}",
            type: "contains",
            invert: false,
            description: null,
            order: 0,
            isOptional: false,
          },
          {
            value:
              "\u003Ca href={{ianaLinkUrl}}\u003EMore information...\u003C/a\u003E",
            type: "contains",
            invert: false,
            description: "",
            order: null,
            isOptional: false,
          },
        ],
        responseRedactions: [
          {
            xPath: "//title/text()",
            jsonPath: "",
            regex: "(.*)",
            hash: "",
          },
          {
            xPath: "/html/body/div[1]/p[2]/a",
            jsonPath: "",
            regex: "\u003Ca href=(.*)\u003EMore information...\u003C/a\u003E",
            hash: null,
          },
        ],
        bodySniff: {
          enabled: false,
          template: "",
        },
        requestHash:
          "0x49629317122233f49c189cda3532a62547d97660dd82aa2bb147a75571d56cfd",
        credentials: null,
      },
    ],
    additionalClientOptions: null,
    useIncognitoWebview: null,
  },
  parameters: {},
  requestClaim: async (claim: HttpClaimRequest) => {
    _sendMessage("requestClaim", claim);
    return "0xsome-hex-encoded-request-id";
  },
  requiresUserInteraction: (isUserInteractionRequired: boolean) => {
    _sendMessage("requiresUserInteraction", isUserInteractionRequired);
  },
  canExpectManyClaims: (canExpectManyClaims: boolean) => {
    _sendMessage("canExpectManyClaims", canExpectManyClaims);
  },
  updatePublicData: (data: any) => {
    _sendMessage("updatePublicData", data);
  },
  reportProviderError: (error) => {
    _sendMessage("reportProviderError", error);
  },
  updateDefaultErrorMessage: (errorMessage: string) => {
    _sendMessage("updateDefaultErrorMessage", errorMessage);
  },
  getVerificationStatus: async () => {
    return {
      isCompleted: false,
      error: null,
      claims: [
        {
          id: "0xsome-hex-encoded-request-id",
          request: {
            url: "https://example.com/",
            expectedPageUrl: "https://example.com",
            urlType: "TEMPLATE",
            method: "GET",
            responseMatches: [
              {
                value: "{{pageTitle}}",
                type: "contains",
                invert: false,
                description: null,
                order: 0,
                isOptional: false,
              },
              {
                value:
                  "\u003Ca href={{ianaLinkUrl}}\u003EMore information...\u003C/a\u003E",
                type: "contains",
                invert: false,
                description: "",
                order: null,
                isOptional: false,
              },
            ],
            responseRedactions: [
              {
                xPath: "//title/text()",
                jsonPath: "",
                regex: "(.*)",
                hash: "",
              },
              {
                xPath: "/html/body/div[1]/p[2]/a",
                jsonPath: "",
                regex:
                  "\u003Ca href=(.*)\u003EMore information...\u003C/a\u003E",
                hash: null,
              },
            ],
            bodySniff: {
              enabled: false,
              template: "",
            },
            requestHash:
              "0x49629317122233f49c189cda3532a62547d97660dd82aa2bb147a75571d56cfd",
            credentials: null,
          },
          error: null,
          isPending: true,
        },
      ],
    };
  },
};
