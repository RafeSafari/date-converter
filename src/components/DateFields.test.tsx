import { act, render, screen } from "@testing-library/react";
import DateFields from "./DateFields";
import CALENDARS from "calendars";
import { useCalendarDate } from "hooks/useCalendarDate";

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

const Harness = ({ initialCalendar }: { initialCalendar?: (typeof CALENDARS)[number] }) => {
  const value = useCalendarDate(new Date(2025, 10, 7), initialCalendar);
  return <DateFields label="تاریخ شروع" value={value} />;
};

const setup = (initialCalendar?: (typeof CALENDARS)[number]) => {
  render(<Harness initialCalendar={initialCalendar} />);
  const [calendar, day, month] = screen.getAllByRole("combobox");
  const year = screen.getByRole("spinbutton") as HTMLInputElement;
  return { calendar, day, month, year };
};

const wheel = (control: Element, deltaY: number) =>
  act(() => {
    control.dispatchEvent(new WheelEvent("wheel", { deltaY, bubbles: true, cancelable: true }));
  });

const formControlOf = (element: Element) => {
  const control = element.closest(".MuiFormControl-root");
  if (!control) {
    throw new Error("Select control not found");
  }
  return control;
};

describe("DateFields", () => {
  it("renders the calendar, day, month and year of the selected date", () => {
    const { calendar, day, month, year } = setup();

    expect(calendar).toHaveTextContent("شمسی");
    expect(day).toHaveTextContent("16");
    expect(month).toHaveTextContent("بان");
    expect(year.value).toBe("1404");
  });

  it("can start in a different calendar", () => {
    const gregorian = CALENDARS.find(item => item.name === "Gregorian");
    const { calendar, day, month, year } = setup(gregorian);

    expect(calendar).toHaveTextContent("میلادی");
    expect(day).toHaveTextContent("7");
    expect(month).toHaveTextContent("November");
    expect(year.value).toBe("2025");
  });

  it("steps the day with the wheel", () => {
    const { day } = setup();

    wheel(formControlOf(day), 100);

    expect(day).toHaveTextContent("17");
  });

  it("switches calendars while keeping the same date", () => {
    const { calendar, day, month, year } = setup();

    wheel(formControlOf(calendar), 100);

    expect(calendar).toHaveTextContent("میلادی");
    expect(day).toHaveTextContent("7");
    expect(month).toHaveTextContent("November");
    expect(year.value).toBe("2025");
  });

  it("moves to the next month when stepping past the last day", () => {
    const { day, month } = setup();

    for (let index = 0; index < 15; index += 1) {
      wheel(formControlOf(day), 100);
    }

    expect(month).toHaveTextContent("ذر");
    expect(day).toHaveTextContent("1");
  });
});
