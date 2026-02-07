import { describe, it, expect } from "vitest";

describe("Auth0 Domain Configuration", () => {
  it("should have VITE_AUTH0_DOMAIN set to auth.chavedooraculo.com", () => {
    const domain = process.env.VITE_AUTH0_DOMAIN;
    expect(domain).toBeDefined();
    expect(domain).toBe("auth.chavedooraculo.com");
  });

  it("should form a valid Auth0 authorize URL", () => {
    const domain = process.env.VITE_AUTH0_DOMAIN;
    const url = new URL(`https://${domain}/authorize`);
    expect(url.hostname).toBe("auth.chavedooraculo.com");
    expect(url.protocol).toBe("https:");
    expect(url.pathname).toBe("/authorize");
  });
});
