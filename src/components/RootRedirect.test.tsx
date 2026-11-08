import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import RootRedirect from "./RootRedirect";

describe("RootRedirect", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to the convert page", () => {
    render(<RootRedirect />);

    expect(useRouter().replace).toHaveBeenCalledWith("/Conv/");
  });

  it("shows a loading screen while redirecting", () => {
    render(<RootRedirect />);

    expect(screen.getByRole("status")).toHaveTextContent("در حال انتقال به صفحه تبدیل تاریخ…");
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
