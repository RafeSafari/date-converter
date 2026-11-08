import { act, fireEvent, render, screen } from "@testing-library/react";
import InstallPrompt from "./InstallPrompt";

const BANNER_TEXT = "این برنامه را نصب کنید تا بدون اینترنت هم در دسترس باشد.";

const createInstallEvent = (outcome: "accepted" | "dismissed" = "accepted") => {
  const event = new Event("beforeinstallprompt", { cancelable: true }) as Event & {
    prompt: jest.Mock;
    userChoice: Promise<{ outcome: string; platform: string }>;
  };
  event.prompt = jest.fn().mockResolvedValue(undefined);
  event.userChoice = Promise.resolve({ outcome, platform: "web" });
  return event;
};

const fireInstallPrompt = (event: Event) => {
  act(() => {
    window.dispatchEvent(event);
  });
};

describe("InstallPrompt", () => {
  it("renders nothing until the browser offers an install prompt", () => {
    render(<InstallPrompt />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "نصب" })).not.toBeInTheDocument();
  });

  it("shows the banner and opens the browser prompt when install is clicked", async () => {
    render(<InstallPrompt />);
    const event = createInstallEvent();
    fireInstallPrompt(event);

    expect(screen.getByRole("alert")).toHaveTextContent(BANNER_TEXT);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "نصب" }));
    });

    expect(event.prompt).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("hides the banner when the app has been installed", () => {
    render(<InstallPrompt />);
    fireInstallPrompt(createInstallEvent());
    expect(screen.getByRole("alert")).toBeInTheDocument();

    fireInstallPrompt(new Event("appinstalled"));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("removes its window listeners on unmount", () => {
    const addSpy = jest.spyOn(window, "addEventListener");
    const removeSpy = jest.spyOn(window, "removeEventListener");
    const { unmount } = render(<InstallPrompt />);

    unmount();

    const added = addSpy.mock.calls.filter(([name]) => name === "beforeinstallprompt" || name === "appinstalled");
    const removed = removeSpy.mock.calls.filter(([name]) => name === "beforeinstallprompt" || name === "appinstalled");
    expect(added).toHaveLength(2);
    expect(removed).toEqual(expect.arrayContaining(added));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
