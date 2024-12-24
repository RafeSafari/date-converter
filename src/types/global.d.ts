
declare global {
    interface iCalendar {
        date: Date;
        valueOf(): Date;
        format(format: string): string;
        unixDays(): number;
        day(): number;
        month(): number;
        year(): number;
    }
}

export {};
