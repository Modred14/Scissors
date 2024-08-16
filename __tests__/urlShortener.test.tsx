import { shortenUrl, randomString } from "../src/services/ShortUrl";

(global as any).fetch = jest.fn();

describe("shortenUrl", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockReset();
  });

  it("should generate a shortened URL and post it to the API", async () => {
    const longUrl = "https://example.com";
    const mockRandomString = randomString;
    const mockResponse = {
      ok: true,
      json: async () => ({
        shortUrl: `https://app-scissors-api.onrender.com/s/${mockRandomString}`,
      }),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await shortenUrl(longUrl);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://app-scissors-api.onrender.com/api/urls/shorten",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl, shortUrl: mockRandomString }),
      }
    );

    expect(result).toBe(
      `https://app-scissors-api.onrender.com/s/${mockRandomString}`
    );
  });

  it("should throw an error if the API request fails", async () => {
    const longUrl = "https://example.com";

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    await expect(shortenUrl(longUrl)).rejects.toThrow("Failed to shorten URL");
  });
});
