import { renderHook } from "@testing-library/react-hooks";
import { act } from "react";
import axios from "axios";
import useCustomDomains from "../src/services/useCustomDomains";
import { createRoot } from "react-dom/client";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

let container: HTMLElement;
let root: ReturnType<typeof createRoot>;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  root.unmount();
  document.body.removeChild(container);
});

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((message) => {
    if (
      typeof message === "string" &&
      message.includes("ReactDOM.render is no longer supported in React 18")
    ) {
      return;
    }
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});

const customDomains = [{ domain: "example.com" }, { domain: "short.ly" }];

describe("useCustomDomains", () => {
  it("should return true if the domain is available", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      status: 200,
      data: { domains: customDomains },
    });

    const { result, waitForNextUpdate } = renderHook(() => useCustomDomains());

    await waitForNextUpdate();

    act(() => {
      const isAvailable =
        result.current.checkDomainAvailability("new-domain.com");
      expect(isAvailable).toBe(true);
    });
  });

  it("should return false if the domain is not available", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      status: 200,
      data: { domains: customDomains },
    });

    const { result, waitForNextUpdate } = renderHook(() => useCustomDomains());

    await waitForNextUpdate();

    act(() => {
      const isAvailable = result.current.checkDomainAvailability("example.com");
      expect(isAvailable).toBe(false);
    });
  });

  it("should correctly handle domains with protocols", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      status: 200,
      data: { domains: customDomains },
    });

    const { result, waitForNextUpdate } = renderHook(() => useCustomDomains());

    await waitForNextUpdate();

    act(() => {
      const isAvailable = result.current.checkDomainAvailability(
        "https://example.com"
      );
      expect(isAvailable).toBe(false);
    });

    act(() => {
      const isAvailable = result.current.checkDomainAvailability(
        "https://new-domain.com"
      );
      expect(isAvailable).toBe(true);
    });
  });

  it("should handle API errors gracefully", async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;

    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));

    const { result, waitForNextUpdate } = renderHook(() => useCustomDomains());

    await waitForNextUpdate();

    const isAvailable =
      result.current.checkDomainAvailability("new-domain.com");
    expect(isAvailable).toBe(true);

    consoleErrorMock.mockRestore();
  });
});
