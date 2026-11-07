import { render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
});

test("renders the app shell and the default converter page", () => {
  render(<App />);

  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(screen.getByTestId("SwapHorizIcon")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Toggle dark mode|روشن|تیره/i })).toBeInTheDocument();
  expect(screen.getAllByRole("combobox")).toHaveLength(3);
  expect(screen.getByRole("heading", { level: 6, name: "دیگر ابزار ها" })).toBeInTheDocument();
});

test("renders the export range page at /Export", () => {
  window.history.pushState({}, "", "/Export");
  render(<App />);

  expect(screen.getByRole("button", { name: "دریافت اکسل برای 31 روز" })).toBeInTheDocument();

  window.history.pushState({}, "", "/");
});
