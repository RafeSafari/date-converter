import { act, render } from "@testing-library/react";
import { useState } from "react";
import Select from "./Select";

const options = [
  { title: "A", value: "a" },
  { title: "B", value: "b" },
  { title: "C", value: "c" },
];

const wheel = (element: Element, deltaY: number) =>
  act(() => {
    element.dispatchEvent(new WheelEvent("wheel", { deltaY, bubbles: true, cancelable: true }));
  });

const setup = (initial: string, onStepBeyond?: (direction: 1 | -1) => void) => {
  const onChange = jest.fn();
  const Harness = () => {
    const [value, setValue] = useState(initial);
    return (
      <Select
        label="test"
        options={options}
        value={value}
        onChange={next => {
          onChange(next);
          setValue(next);
        }}
        onStepBeyond={onStepBeyond}
      />
    );
  };
  const { container } = render(<Harness />);
  const control = container.querySelector(".MuiFormControl-root");
  if (!control) {
    throw new Error("Select control not rendered");
  }
  return { onChange, control };
};

describe("Select wheel navigation", () => {
  it("steps down and clamps at the last option", () => {
    const { onChange, control } = setup("a");

    wheel(control, 100);
    expect(onChange).toHaveBeenLastCalledWith("b");

    wheel(control, 100);
    expect(onChange).toHaveBeenLastCalledWith("c");

    wheel(control, 100);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("steps up and clamps at the first option", () => {
    const { onChange, control } = setup("b");

    wheel(control, -100);
    expect(onChange).toHaveBeenLastCalledWith("a");

    wheel(control, -100);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("ignores wheel events without vertical movement", () => {
    const { onChange, control } = setup("b");

    wheel(control, 0);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("reports downward steps past the last option", () => {
    const onStepBeyond = jest.fn();
    const { onChange, control } = setup("c", onStepBeyond);

    wheel(control, 100);

    expect(onStepBeyond).toHaveBeenCalledWith(1);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("reports upward steps past the first option", () => {
    const onStepBeyond = jest.fn();
    const { control } = setup("a", onStepBeyond);

    wheel(control, -100);

    expect(onStepBeyond).toHaveBeenCalledWith(-1);
  });

  it("does not report in-range steps as boundary steps", () => {
    const onStepBeyond = jest.fn();
    const { onChange, control } = setup("b", onStepBeyond);

    wheel(control, 100);

    expect(onChange).toHaveBeenLastCalledWith("c");
    expect(onStepBeyond).not.toHaveBeenCalled();
  });
});
