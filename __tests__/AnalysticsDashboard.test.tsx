import { render, screen, waitFor } from "@testing-library/react";
import { doc, onSnapshot, getFirestore } from "firebase/firestore";
import AnalyticsDashboard from "../src/services/AnalysticsDashboard";
import "@testing-library/jest-dom";

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  onSnapshot: jest.fn(),
}));

jest.mock("firebase/analytics", () => ({
  getAnalytics: jest.fn(),
  isSupported: jest.fn().mockResolvedValue(false),
}));

jest.mock("react-chartjs-2", () => ({
  Pie: () => <div>Pie Chart</div>,
  Line: () => <div>Line Chart</div>,
}));

jest.mock("chart.js", () => ({
  Chart: {
    register: jest.fn(),
  },
  registerables: [],
}));

describe("AnalyticsDashboard", () => {
  const mockLinkId = "mockLinkId";
  const mockClicksData = {
    clicks: [
      {
        referrer: "google",
        timestamp: "2023-08-15T12:00:00Z",
        location: {
          country: "USA",
          city: "New York",
        },
        clickCount: "1",
        createdAt: "2023-08-15T12:00:00Z",
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    (getFirestore as jest.Mock).mockReturnValue({});
    (doc as jest.Mock).mockReturnValueOnce({});
    (onSnapshot as jest.Mock).mockImplementation((_, callback) => {
      callback({ exists: () => true, data: () => mockClicksData });
      return jest.fn();
    });

    render(<AnalyticsDashboard linkId={mockLinkId} />);

    expect(screen.getByText("Clicks Over Time")).toBeInTheDocument();
    expect(screen.getByText("Referrer Data")).toBeInTheDocument();
    expect(screen.getByText("Clicks + scans by location")).toBeInTheDocument();
  });

  it("displays correct data for clicks over time", async () => {
    (getFirestore as jest.Mock).mockReturnValue({});
    (doc as jest.Mock).mockReturnValue({});
    (onSnapshot as jest.Mock).mockImplementation((_, callback) => {
      callback({ exists: () => true, data: () => mockClicksData });
      return jest.fn();
    });

    render(<AnalyticsDashboard linkId={mockLinkId} />);

    await waitFor(() => {
      expect(screen.getByText("Clicks Over Time")).toBeInTheDocument();
    });
  });

  it('displays "No data yet" when there are no clicks', async () => {
    (getFirestore as jest.Mock).mockReturnValue({});
    (doc as jest.Mock).mockReturnValue({});
    (onSnapshot as jest.Mock).mockImplementation((_, callback) => {
      callback({ exists: () => true, data: () => ({ clicks: [] }) });
      return jest.fn();
    });

    render(<AnalyticsDashboard linkId={mockLinkId} />);

    const noDataElements = await screen.findAllByText("No data yet");

    expect(noDataElements).toHaveLength(3);
  });

  it("switches between countries and cities tabs", async () => {
    (doc as jest.Mock).mockReturnValueOnce({});
    (onSnapshot as jest.Mock).mockImplementation((_, callback) => {
      callback({ exists: () => true, data: () => mockClicksData });
      return jest.fn();
    });

    render(<AnalyticsDashboard linkId={mockLinkId} />);

    await waitFor(() => {
      expect(screen.getByText("Countries")).toBeInTheDocument();
      expect(screen.getByText("Cities")).toBeInTheDocument();
    });

    expect(screen.getByText("USA")).toBeInTheDocument();
  });

  it("handles missing data gracefully", async () => {
    (getFirestore as jest.Mock).mockReturnValue({});
    (doc as jest.Mock).mockReturnValue({});
    (onSnapshot as jest.Mock).mockImplementation((_, callback) => {
      callback({ exists: () => true, data: () => ({ clicks: [] }) });
      return jest.fn();
    });

    render(<AnalyticsDashboard linkId={mockLinkId} />);

    const noDataElements = await screen.findAllByText("No data yet");

    expect(noDataElements).toHaveLength(3);
  });
});
