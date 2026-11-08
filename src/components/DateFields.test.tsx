import { act, render, screen } from "@testing-library/react";
import DateFields from "./DateFields";
import CALENDARS from "@/calendars";
import { useCalendarDate } from "@/hooks/useCalendarDate";

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

  it("steps the day backwards when scrolling down", () => {
    const { day } = setup();

    wheel(formControlOf(day), 100);

    expect(day).toHaveTextContent("15");
  });

  it("steps the day forwards when scrolling up", () => {
    const { day } = setup();

    wheel(formControlOf(day), -100);

    expect(day).toHaveTextContent("17");
  });

  it("steps the month backwards when scrolling down", () => {
    const { month } = setup();

    wheel(formControlOf(month), 100);

    expect(month).toHaveTextContent("مهر");
  });

  it("steps the year backwards when scrolling down", () => {
    const { year } = setup();

    wheel(year, 100);

    expect(year.value).toBe("1403");
  });

  it("switches calendars while keeping the same date", () => {
    const { calendar, day, month, year } = setup();

    wheel(formControlOf(calendar), 100);

    expect(calendar).toHaveTextContent("میلادی");
    expect(day).toHaveTextContent("7");
    expect(month).toHaveTextContent("November");
    expect(year.value).toBe("2025");
  });

  it("moves to the previous month when scrolling down past the first day", () => {
    const { day, month } = setup();

    for (let index = 0; index < 16; index += 1) {
      wheel(formControlOf(day), 100);
    }

    expect(month).toHaveTextContent("مهر");
    expect(day).toHaveTextContent("30");
  });

  it("moves to the next month when scrolling up past the last day", () => {
    const { day, month } = setup();

    for (let index = 0; index < 15; index += 1) {
      wheel(formControlOf(day), -100);
    }

    expect(month).toHaveTextContent("ذر");
    expect(day).toHaveTextContent("1");
  });
});
