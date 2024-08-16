// import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import QrCodeGenerator from "../src/services/QrCodeGenerator";
import html2canvas from "html2canvas";

jest.mock("html2canvas", () => jest.fn());
HTMLCanvasElement.prototype.getContext = jest.fn();

describe("QrCodeGenerator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the input fields and QR code", () => {
    const { container } = render(<QrCodeGenerator />);

    const urlInput = screen.getByPlaceholderText(/Enter URL for QR Code/i);
    expect(urlInput).toBeInTheDocument();

    const qrCodeCanvas = container.querySelector("canvas");
    expect(qrCodeCanvas).toBeInTheDocument();
  });

  test("uploads and sets the logo correctly", async () => {
    render(<QrCodeGenerator />);

    const file = new File(["dummy content"], "logo.png", { type: "image/png" });
    const input = screen.getByTestId("logo-upload") as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(input.files![0]).toBe(file));
    expect(input.files).toHaveLength(1);
  });

  test("generates and downloads QR code image", async () => {
    const mockCanvas = document.createElement("canvas");
    mockCanvas.toDataURL = jest.fn(() => "data:image/png;base64,QR_CODE");

    (html2canvas as jest.Mock).mockResolvedValue(mockCanvas);

    render(<QrCodeGenerator />);

    const urlInput = screen.getByPlaceholderText(/Enter URL for QR Code/i);
    fireEvent.change(urlInput, { target: { value: "http://example.com" } });

    const generateButton = screen.getByText(/Generate QR Code/i);
    fireEvent.click(generateButton);

    await waitFor(() => expect(html2canvas).toHaveBeenCalled());

    const downloadButton = screen.getByText(/Download QR Code/i);
    fireEvent.click(downloadButton);

    expect(mockCanvas.toDataURL).toHaveBeenCalledWith("image/png");
  });
});
