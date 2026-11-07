import { act, fireEvent, render } from "@testing-library/react";
import TextField from "./TextField";

const wheel = (element: Element, deltaY: number) =>
  act(() => {
    element.dispatchEvent(new WheelEvent("wheel", { deltaY, bubbles: true, cancelable: true }));
  });

describe("TextField", () => {
  it("steps numeric values with the wheel", () => {
    const onChange = jest.fn();
    const { container } = render(<TextField label="year" type="number" value={1404} onChange={onChange} />);
    const input = container.querySelector("input") as HTMLInputElement;

    expect(input.value).toBe("1404");

    wheel(input, 100);
    expect(onChange).toHaveBeenLastCalledWith(1405);

    wheel(input, -100);
    expect(onChange).toHaveBeenLastCalledWith(1404);
  });

  it("ignores the wheel for text fields", () => {
    const onChange = jest.fn();
    const { container } = render(<TextField label="note" type="text" value="hello" onChange={onChange} />);
    const input = container.querySelector("input") as HTMLInputElement;

    wheel(input, 100);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("still reports typed changes", () => {
    const onChange = jest.fn();
    const { container } = render(<TextField label="year" type="number" value={1404} onChange={onChange} />);
    const input = container.querySelector("input") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "1406" } });
    expect(onChange).toHaveBeenLastCalledWith(1406);
  });
});
