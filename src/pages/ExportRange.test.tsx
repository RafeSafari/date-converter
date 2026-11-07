import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ExportRange from "./ExportRange";

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

const renderPage = () =>
  render(
    <MemoryRouter>
      <ExportRange />
    </MemoryRouter>,
  );

const yearInputs = () => screen.getAllByRole("spinbutton") as HTMLInputElement[];

describe("ExportRange", () => {
  it("shows the inclusive range length and enables export", () => {
    renderPage();

    expect(screen.getByText("31 روز")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "دریافت اکسل" })).toBeEnabled();
  });

  it("blocks ranges longer than the maximum", () => {
    renderPage();
    const [startYear, endYear] = yearInputs();

    fireEvent.change(endYear, { target: { value: String(Number(startYear.value) + 3) } });

    expect(screen.getByText("حداکثر بازه خروجی 1,000 روز است")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "دریافت اکسل" })).toBeDisabled();
  });

  it("blocks ranges that end before they start", () => {
    renderPage();
    const [startYear, endYear] = yearInputs();

    fireEvent.change(endYear, { target: { value: String(Number(startYear.value) - 1) } });

    expect(screen.getByText("تاریخ پایان باید بعد از تاریخ شروع باشد")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "دریافت اکسل" })).toBeDisabled();
  });

  it("blocks invalid dates", () => {
    renderPage();
    const [startYear] = yearInputs();

    fireEvent.change(startYear, { target: { value: "1404.5" } });

    expect(screen.getByText("تاریخ شروع و پایان باید معتبر باشند")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "دریافت اکسل" })).toBeDisabled();
  });

  it("downloads the range as CSV", async () => {
    const createObjectURL = jest.fn((blob: Blob) => `blob:${blob.size}`);
    const revokeObjectURL = jest.fn();
    Object.assign(URL, { createObjectURL, revokeObjectURL });
    const anchorClick = jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    try {
      renderPage();

      fireEvent.click(screen.getByRole("button", { name: "انتخاب قالب خروجی" }));
      fireEvent.click(await screen.findByRole("menuitem", { name: "CSV" }));

      await waitFor(() => expect(createObjectURL).toHaveBeenCalledTimes(1));

      const blob = createObjectURL.mock.calls[0][0] as Blob;
      expect(blob.type).toBe("text/csv;charset=utf-8");
      expect(blob.size).toBeGreaterThan(0);
      expect(anchorClick).toHaveBeenCalled();

      await waitFor(() => expect(revokeObjectURL).toHaveBeenCalledTimes(1), { timeout: 3000 });
      expect(screen.getByRole("button", { name: "دریافت CSV" })).toBeEnabled();
    } finally {
      anchorClick.mockRestore();
      delete (URL as { createObjectURL?: unknown }).createObjectURL;
      delete (URL as { revokeObjectURL?: unknown }).revokeObjectURL;
    }
  });
});
