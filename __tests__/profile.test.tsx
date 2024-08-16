import { render, screen, fireEvent } from "@testing-library/react";
import Profile from "../src/services/ProfileDetails";
import { BrowserRouter as Router } from "react-router-dom";
import fetchMock from "jest-fetch-mock";
import { MemoryRouter } from "react-router-dom";
import { handleSignOut } from "../src/services/authService";

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
  localStorage.clear();
});

jest.mock("../src/services/authService", () => ({
  handleSignOut: jest.fn(),
}));

jest.mock("../src/useWindowWidth", () => jest.fn(() => 1200));
jest.mock("../src/Loading", () => () => <div>Loading...</div>);

describe("Profile Component", () => {
  test("renders user profile details when loading is false", async () => {
    const user = {
      id: "123",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
      profileImg: "https://example.com/profile.jpg",
      links: [],
    };

    localStorage.setItem("user", JSON.stringify(user));
    fetchMock.mockResponseOnce(JSON.stringify([]));

    render(
      <Router>
        <Profile loading={false} />
      </Router>
    );

    expect(await screen.findByText("Profile")).toBeInTheDocument();
    expect(await screen.findByText("User details")).toBeInTheDocument();
  });

  test("renders sign-in options when not logged in", async () => {
    render(
      <Router>
        <Profile loading={false} />
      </Router>
    );

    expect(
      await screen.findByText(
        "You need to log in or sign up first to view your profile details."
      )
    ).toBeInTheDocument();
    expect(await screen.findByText("Login")).toBeInTheDocument();
    expect(await screen.findByText("Get Started ➔")).toBeInTheDocument();
  });

  test("calls handleSignOut when sign-out button is clicked", async () => {
    render(
      <MemoryRouter>
        <Profile loading={false} />
      </MemoryRouter>
    );

    expect(await screen.findByText("Profile")).toBeInTheDocument();

    const signOutButton = screen.getByText(/sign out/i);
    fireEvent.click(signOutButton);

    expect(handleSignOut).toHaveBeenCalled();
  });
});
