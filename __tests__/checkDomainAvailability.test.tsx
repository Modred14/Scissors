import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react';
import axios from 'axios';
import useCustomDomains from '../src/useCustomDomains';
import { createRoot } from 'react-dom/client';

// Mock axios to prevent actual API calls during tests
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

let container: HTMLElement;
let root: ReturnType<typeof createRoot>;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container); // Initialize createRoot
});

afterEach(() => {
  root.unmount(); // Unmount using createRoot API
  document.body.removeChild(container);
});

// Suppress React 18 warning about ReactDOM.render
beforeAll(() => {
//   const originalError = console.error;
  jest.spyOn(console, 'error').mockImplementation((message) => {
    if (typeof message === 'string' && message.includes('ReactDOM.render is no longer supported in React 18')) {
      return;
    }
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});

const customDomains = [
  { domain: 'example.com' },
  { domain: 'short.ly' },
];

describe('useCustomDomains', () => {
  it('should return true if the domain is available', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      status: 200,
      data: { domains: customDomains },
    });

    const { result, waitForNextUpdate } = renderHook(() => useCustomDomains());

    await waitForNextUpdate();

    act(() => {
      const isAvailable = result.current.checkDomainAvailability('new-domain.com');
      expect(isAvailable).toBe(true);
    });
  });

  it('should return false if the domain is not available', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      status: 200,
      data: { domains: customDomains },
    });

    const { result, waitForNextUpdate } = renderHook(() => useCustomDomains());

    await waitForNextUpdate();

    act(() => {
      const isAvailable = result.current.checkDomainAvailability('example.com');
      expect(isAvailable).toBe(false);
    });
  });

  it('should correctly handle domains with protocols', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      status: 200,
      data: { domains: customDomains },
    });

    const { result, waitForNextUpdate } = renderHook(() => useCustomDomains());

    await waitForNextUpdate();

    act(() => {
      const isAvailable = result.current.checkDomainAvailability('https://example.com');
      expect(isAvailable).toBe(false);
    });

    act(() => {
      const isAvailable = result.current.checkDomainAvailability('https://new-domain.com');
      expect(isAvailable).toBe(true);
    });
  });

  it('should handle API errors gracefully', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    
    // Mock console.error to suppress error logs in test output
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock axios to throw an error
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    const { result, waitForNextUpdate } = renderHook(() => useCustomDomains());

    // Wait for the hook to handle the error
    await waitForNextUpdate();

    // Check that the hook handled the error and the loading state is set to false
    const isAvailable = result.current.checkDomainAvailability('new-domain.com');
    expect(isAvailable).toBe(true);

    // Restore console.error to its original implementation
    consoleErrorMock.mockRestore();
  });
});
