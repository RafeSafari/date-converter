import SunCalc from 'suncalc';
import yearSpecifics, { YearSpecifics } from './Badi.YearSpecifics';

export default class BadiDate {
    static readonly LAST_YEAR_SUPPORTED = 221;
    static readonly YEAR_ONE_IN_GREGORIAN = 1844;
    static readonly YEAR_ZERO_IN_GREGORIAN = BadiDate.YEAR_ONE_IN_GREGORIAN - 1;

    private _monthIntern: number = -1;

    constructor(
        public day: number,
        public month: number = 0,
        public year: number,
        public ayyamIHa: boolean = false,
        public latitude?: number,
        public longitude?: number,
        public altitude?: number
    ) {
        if (day < 1 || day > 19) {
            throw new RangeError(`Day must be in the range [1-19]: ${day}`);
        }
        if (month < 0 || month > 19) {
            throw new RangeError(`Month must be in the range [0-19]: ${month}`);
        }
        if (month !== 0 && ayyamIHa) {
            throw new Error('Please set month to 0 or leave it out for AyyamIHa');
        }
        if (year > BadiDate.LAST_YEAR_SUPPORTED) {
            throw new Error(`Years greater than ${BadiDate.LAST_YEAR_SUPPORTED} are not supported yet`);
        }
        this._monthIntern = month === 0 ? 19 : month === 19 ? 20 : month;
    }

    get yearInVahid(): number {
        return this.year % 19 === 0 ? 19 : this.year % 19;
    }

    get vahid(): number {
        return Math.floor((this.year - this.yearInVahid) / 19) + 1;
    }

    get kullIShay(): number {
        return Math.floor(this.year / 361) + 1;
    }

    private static _getNumberAyyamIHaDays(year: number): number {
        const yearSpecific = yearSpecifics[year];
        if (!yearSpecific) {
            const gregYear = year + BadiDate.YEAR_ONE_IN_GREGORIAN;
            const isLeapYear = (gregYear % 4 === 0 && gregYear % 100 !== 0) || (gregYear % 400 === 0);
            return isLeapYear ? 5 : 4;
        }
        return yearSpecific.leapday ? 5 : 4;
    }

    static getDayOfNawRuz(year: number): number {
        const yearSpecific = yearSpecifics[year];
        return yearSpecific && yearSpecific.nawRuzOnMarch21 ? 21 : 20;
    }

    get dayOfYear(): number {
        if (this._monthIntern === 20) {
            return 342 + BadiDate._getNumberAyyamIHaDays(this.year) + this.day;
        }
        return (this._monthIntern - 1) * 19 + this.day;
    }

    get isPeriodOfFast(): boolean {
        return this.month === 19;
    }

    get isAyyamIHa(): boolean {
        return this.month === 0;
    }

    get isFeastDay(): boolean {
        return this.day === 1 && !this.isAyyamIHa;
    }

    private static _calculateSunSet(date: Date, longitude?: number, latitude?: number, altitude?: number): Date {
        const fallback = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 18); // Default to 6 PM
        if (latitude == null || longitude == null || latitude > 66.0 || latitude < -66.0 || Math.abs(longitude) > 180.0) {
            return fallback;
        }
        
        const sunCalcTimes = SunCalc.getTimes(date, latitude, longitude, altitude ?? 0);
        
        if (sunCalcTimes.sunset?.getDate() === date.getDate() - 1) {
            const sunCalcWithAdjustment = SunCalc.getTimes(new Date(date.getTime() + (24 * 60 * 60 * 1000)), latitude, longitude, altitude ?? 0);
            return sunCalcWithAdjustment.sunset ?? fallback;
        }
        
        return sunCalcTimes.sunset ?? fallback;
    }

    private static _utcToLocale(date: Date): Date {
        if (!date.getUTCFullYear()) { // Check if not UTC
            return date;
        }
        
        const localeDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
        
        return new Date(localeDate.getTime() + date.getUTCHours() * 3600000 + date.getUTCMinutes() * 60000 + localeDate.getTimezoneOffset() * 60000);
    }

    get nawRuzDate(): Date {
        return new Date(Date.UTC(this.year + BadiDate.YEAR_ZERO_IN_GREGORIAN, 3, BadiDate.getDayOfNawRuz(this.year)));
    }

    get startDateTime(): Date {
        const date = new Date(this.nawRuzDate.getTime() + ((this.dayOfYear - 2) * (24 * 60 * 60 * 1000)));
        return BadiDate._utcToLocale(BadiDate._calculateSunSet(date, this.longitude, this.latitude, this.altitude));
    }

    get endDateTime(): Date {
        const date = new Date(this.nawRuzDate.getTime() + ((this.dayOfYear - 1) * (24 * 60 * 60 * 1000)));
        return BadiDate._utcToLocale(BadiDate._calculateSunSet(date, this.longitude, this.latitude, this.altitude));
    }

    private static _fromYearAndDayOfYear(year: number, doy: number, longitude?: number, latitude?: number, altitude?: number): BadiDate {
        if (doy < 1 || doy > 366) {
            throw new RangeError(`Day of year must be in the range [1-366]: ${doy}`);
        }
        
        const month = Math.ceil(doy / 19);
        const day = doy - (month - 1) * 19;

        if (month < 19) {
            return new BadiDate(day, month, year, undefined, longitude, latitude, altitude);
        } else if (month === 19 && day <= BadiDate._getNumberAyyamIHaDays(year)) {
            return new BadiDate(day, 0, year, undefined, longitude, latitude, altitude);
        }
        
        const alaDay = doy - (342 + BadiDate._getNumberAyyamIHaDays(year));
        
        return new BadiDate(alaDay, month === undefined ? undefined : month -1 , year , undefined , longitude , latitude , altitude);
    }

    static fromDate(gregorianDate: Date, longitude?: number, latitude?: number, altitude?: number): BadiDate {
      // Convert to UTC to avoid daylight saving issues
      const dateTime = new Date(Date.UTC(gregorianDate.getFullYear(), gregorianDate.getMonth(), gregorianDate.getDate()));
      
      if (dateTime > new Date(Date.UTC(2065,3,19))) { // Check against unsupported dates
          throw new Error('Dates after March-19-2064 are not supported yet.');
      }
      
      const isAfterSunset = gregorianDate > BadiDate._calculateSunSet(gregorianDate, longitude, latitude, altitude);
      const date = isAfterSunset ? new Date(dateTime.getTime() + (24 *60 *60*1000)) : dateTime;

      const badiYear = date.getFullYear() - BadiDate.YEAR_ZERO_IN_GREGORIAN;

      const isBeforeNawRuz = date < new Date(Date.UTC(date.getFullYear(),3,BadiDate.getDayOfNawRuz(badiYear)));

      if (!isBeforeNawRuz) { 
          const doy = Math.floor((date.valueOf() - new Date(Date.UTC(date.getFullYear(),3,BadiDate.getDayOfNawRuz(badiYear))).valueOf()) / (24*60*60*1000)) +1; 
          return BadiDate._fromYearAndDayOfYear(badiYear,doy ,longitude ,latitude ,altitude);
      } 

      const doy = Math.floor((date.valueOf() - new Date(Date.UTC(date.getFullYear()-1 ,3,BadiDate.getDayOfNawRuz(badiYear-1))).valueOf()) / (24*60*60*1000)) +1; 
      return BadiDate._fromYearAndDayOfYear(badiYear-1,doy ,longitude ,latitude ,altitude);
   }

    /// If the BadiDate is a Baha'i Holy day the Holy date else null
    get holyDay(): BahaiHolyDay | null {
        const birthOfBab = yearSpecifics[this.year]?.birthOfBab;
        return bahaiHolyDays
            .find(holyDay => holyDay?.getDayOfTheYear(birthOfBab) === this.dayOfYear) ?? null;
    }

    /// The BadiDate of the next feast
    getNextFeast(): BadiDate {
        if (this.month === 19) {
            return new BadiDate(
                1,
                1,
                this.year + 1,
                false,
                this.longitude,
                this.latitude,
                this.altitude
            );
        }
        return new BadiDate(
            1,
            this.month + 1,
            this.year,
            false,
            this.longitude,
            this.latitude,
            this.altitude
        );
    }

    /// The BadiDate of the next Holy day
    get nextHolyDate(): BadiDate {
        const birthOfBab = yearSpecifics[this.year]?.birthOfBab;
        const doy = bahaiHolyDays
            .find(holyDay => (holyDay?.getDayOfTheYear(birthOfBab) ?? 0) > this.dayOfYear)
            ?.getDayOfTheYear(birthOfBab);

        if (doy == null) {
            return BadiDate._fromYearAndDayOfYear(
                this.year + 1,
                1,
                this.longitude,
                this.latitude,
                this.altitude
            );
        }
        return BadiDate._fromYearAndDayOfYear(
            this.year,
            doy,
            this.longitude,
            this.latitude,
            this.altitude
        );
    }

    // Return the last Ayyam'i'Ha day of that Badi year
    get lastAyyamIHaDayOfYear(): BadiDate {
        const firstAla = new BadiDate(
            1,
            19,
            this.year,
            false,
            this.longitude,
            this.latitude,
            this.altitude
        );
        return BadiDate._fromYearAndDayOfYear(
            this.year,
            firstAla.dayOfYear - 1,
            this.longitude,
            this.latitude,
            this.altitude
        );
    }
   // Equality check
   equals(other: any): boolean {
       return other instanceof BadiDate && other.year === this.year && other.dayOfYear === this.dayOfYear;
   }

   // Hash code method
   hashCode(): number {
       return this.year *1000 + this.dayOfYear; 
   }
}
