import { render, screen } from "@testing-library/react";
import ToolLinks, { type ToolId } from "./ToolLinks";

const renderFooter = (current: ToolId) => render(<ToolLinks current={current} />);

describe("ToolLinks", () => {
  it("lists the other tools with links", () => {
    renderFooter("conv");

    expect(screen.getByRole("heading", { level: 6, name: "دیگر ابزار ها" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "محاسبه فاصله دو تاریخ" })).toHaveAttribute("href", "/Diff");
    expect(screen.getByRole("link", { name: "خروجی بازه تاریخ" })).toHaveAttribute("href", "/Export");
    expect(screen.queryByRole("link", { name: "تبدیل تاریخ" })).not.toBeInTheDocument();
  });

  it("stacks the links vertically", () => {
    const { container } = renderFooter("diff");

    expect(container.firstElementChild).toHaveStyle({ flexDirection: "column" });
    expect(screen.getByRole("link", { name: "تبدیل تاریخ" })).toHaveAttribute("href", "/Conv");
    expect(screen.getByRole("link", { name: "خروجی بازه تاریخ" })).toHaveAttribute("href", "/Export");
  });

  it("shows an icon for each tool", () => {
    renderFooter("export");

    expect(screen.getByTestId("SwapHorizIcon")).toBeInTheDocument();
    expect(screen.getByTestId("StraightenIcon")).toBeInTheDocument();
    expect(screen.queryByTestId("FileDownloadIcon")).not.toBeInTheDocument();
  });
});
