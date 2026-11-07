declare module "astronomia" {
  export const angle: Angle;
  export const apparent: Apparent;
  export const apsis: Apsis;
  export const base: Base;
  export const binary: Binary;
  export const coord: Coord;
  export const conjunction: Conjunction;
  export const circle: Circle;
  export const deltat: DeltaT;
  export const elementequinox: ElementEquinox;
  export const elliptic: Elliptic;
  export const eclipse: Eclipse;
  export const elp: ELP;
  export const eqtime: EqTime;
  export const fit: Fit;
  export const globe: Globe;
  export const illum: Illum;
  export const interpolation: Interpolation;
  export const iterate: Iterate;
  export const jm: JM;
  export const julian: Julian;
  export const jupiter: Jupiter;
  export const jupitermoons: JupiterMoons;
  export const kepler: Kepler;
  export const line: Line;
  export const nearparabolic: NearParabolic;
  export const node: Node;
  export const nutation: Nutation;
  export const mars: Mars;
  export const moon: Moon;
  export const moonillum: MoonIllum;
  export const moonmaxdec: MoonMaxDec;
  export const moonnode: MoonNode;
  export const moonphase: MoonPhases;
  export const moonposition: MoonPosition;
  export const parabolic: Parabolic;
  export const parallax: Parallax;
  export const parallactic: Parallactic;
  export const perihelion: Perihelion;
  export const planetary: Planetary;
  export const planetposition: PlanetPosition;
  export const planetelements: PlanetElements;
  export const pluto: Pluto;
  export const precess: Precess;
  export const refraction: Refraction;
  export const rise: Rise;
  export const saturnmoons: SaturnMoons;
  export const saturnring: SaturnRing;
  export const sexagesimal: Sexagesimal;
  export const sidereal: Sidereal;
  export const solar: Solar;
  export const solardisk: SolarDisk;
  export const solarxyz: SolarXYZ;
  export const solstice: Solstice;
  export const stellar: Stellar;
  export const sundial: Sundial;
  export const sunrise: Sunrise;

  interface Angle {
    /**
     * Returns the angular separation between two celestial bodies.
     * @param c1 - coordinate of celestial body 1
     * @param c2 - coordinate of celestial body 2
     * @returns angular separation between two celestial bodies
     */
    sep(c1: Coord, c2: Coord): number;

    /**
     * Returns the minimum separation between two moving objects.
     * @param jd1 - Julian day - time at cs1[0], cs2[0]
     * @param jd3 - Julian day - time at cs1[2], cs2[2]
     * @param cs1 - 3 coordinates of moving object 1
     * @param cs2 - 3 coordinates of moving object 2
     * @param fnSep - alternative `sep` function (optional)
     * @throws Error if cs1 or cs2 does not have length 3
     * @returns angular separation between two celestial bodies
     */
    minSep(jd1: number, jd3: number, cs1: Coord[], cs2: Coord[], fnSep?: (c1: Coord, c2: Coord) => number): number;

    /**
     * Returns the minimum separation between two moving objects using rectangular coordinates.
     * @param jd1 - Julian day - time at cs1[0], cs2[0]
     * @param jd3 - Julian day - time at cs1[2], cs2[2]
     * @param cs1 - 3 coordinates of moving object 1
     * @param cs2 - 3 coordinates of moving object 2
     * @throws Error if cs1 or cs2 does not have length 3
     * @returns angular separation between two celestial bodies
     */
    minSepRect(jd1: number, jd3: number, cs1: Coord[], cs2: Coord[]): number;

    /**
     * Haversine function for calculating angular separation.
     * @param a - angle in radians
     * @returns haversine value
     */
    hav(a: number): number;

    /**
     * Returns the angular separation between two celestial bodies using the haversine method.
     * @param c1 - coordinate of celestial body 1
     * @param c2 - coordinate of celestial body 2
     * @returns angular separation between two celestial bodies
     */
    sepHav(c1: Coord, c2: Coord): number;

    /**
     * Same as `minSep` but uses `sepHav` to return the minimum separation.
     * @param jd1 - Julian day - time at cs1[0], cs2[0]
     * @param jd3 - Julian day - time at cs1[2], cs2[2]
     * @param cs1 - 3 coordinates of moving object 1
     * @param cs2 - 3 coordinates of moving object 2
     * @returns minimum separation between two moving objects using `sepHav`
     */
    minSepHav(jd1: number, jd3: number, cs1: Coord[], cs2: Coord[]): number;

    /**
     * Returns the angular separation between two celestial bodies using a stable algorithm.
     * @param c1 - coordinate of celestial body 1
     * @param c2 - coordinate of celestial body 2
     * @returns angular separation between two celestial bodies
     */
    sepPauwels(c1: Coord, c2: Coord): number;

    /**
     * Same as `minSep` but uses `sepPauwels` to return the minimum separation.
     * @param jd1 - Julian day - time at cs1[0], cs2[0]
     * @param jd3 - Julian day - time at cs1[2], cs2[2]
     * @param cs1 - 3 coordinates of moving object 1
     * @param cs2 - 3 coordinates of moving object 2
     * @returns minimum separation between two moving objects using `sepPauwels`
     */
    minSepPauwels(jd1: number, jd3: number, cs1: Coord[], cs2: Coord[]): number;

    /**
     * Returns the position angle of one body with respect to another.
     * The position angle is measured counter-clockwise from North.
     *
     * @param c1 - coordinate of celestial body 1
     * @param c2 - coordinate of celestial body 2
     * @returns position angle (p)
     */
    relativePosition(c1: Coord, c2: Coord): number;
  }

  interface Apparent {
    /**
     * Returns corrections due to nutation for equatorial coordinates of an object.
     * @param α - right ascension (in radians)
     * @param δ - declination (in radians)
     * @param jd - Julian Day
     * @returns [Δα1, Δδ1] - corrections for right ascension and declination
     */
    nutation(α: number, δ: number, jd: number): [number, number];

    /**
     * Returns the longitude of perihelion of Earth's orbit.
     * @param T - time in Julian centuries since J2000
     * @returns longitude of perihelion (in radians)
     */
    perihelion(T: number): number;

    /**
     * Returns corrections due to aberration for ecliptic coordinates of an object.
     * @param λ - ecliptic longitude (in radians)
     * @param β - ecliptic latitude (in radians)
     * @param jd - Julian Day
     * @returns [Δλ, Δβ] - corrections for ecliptic coordinates
     */
    eclipticAberration(λ: number, β: number, jd: number): [number, number];

    /**
     * Returns corrections due to aberration for equatorial coordinates of an object.
     * @param α - right ascension (in radians)
     * @param δ - declination (in radians)
     * @param jd - Julian Day
     * @returns [Δα2, Δδ2] - corrections for right ascension and declination
     */
    aberration(α: number, δ: number, jd: number): [number, number];

    /**
     * Computes the apparent position of an object.
     *
     * Position is computed for equatorial coordinates in eqFrom, considering
     * proper motion, precession, nutation, and aberration. Result is in eqTo.
     *
     * @param eqFrom - initial equatorial coordinates
     * @param epochFrom - epoch of initial coordinates
     * @param epochTo - target epoch for the position calculation
     * @param mα - proper motion in right ascension (in hours)
     * @param mδ - proper motion in declination (in degrees)
     * @returns updated equatorial coordinates at epochTo
     */
    position(eqFrom: Coord, epochFrom: number, epochTo: number, mα: number, mδ: number): Coord;

    /**
     * Uses the Ron-Vondrák expression to compute corrections due to aberration for equatorial coordinates of an object.
     *
     * @param α - right ascension (in radians)
     * @param δ - declination (in radians)
     * @param jd - Julian Day
     * @returns [Δα, Δδ] - corrections for right ascension and declination
     */
    aberrationRonVondrak(α: number, δ: number, jd: number): [number, number];

    /**
     * Computes the apparent position of an object using the Ron-Vondrák expression for aberration.
     *
     * Position is computed for equatorial coordinates in eqFrom, considering proper motion,
     * aberration, precession, and nutation. Result is in eqTo.
     *
     * Note that this expression is only valid for the epoch J2000.
     *
     * @param eqFrom - initial equatorial coordinates at epoch J2000
     * @param epochTo - target epoch for the position calculation
     * @param mα - proper motion in right ascension (in hours)
     * @param mδ - proper motion in declination (in degrees)
     * @returns updated equatorial coordinates at epochTo
     */
    positionRonVondrak(eqFrom: Coord, epochTo: number, mα: number, mδ: number): Coord;
  }

  interface Apsis {
    /**
     * Returns the Julian ephemeris day (JED) of the mean perigee of the Moon nearest the given date.
     * @param year - decimal year specifying a date.
     * @returns jde - Julian ephemeris day
     */
    meanPerigee(year: number): number;

    /**
     * Returns the Julian ephemeris day (JED) of perigee of the Moon nearest the given date.
     * @param year - decimal year specifying a date.
     * @returns jde - Julian ephemeris day
     */
    perigee(year: number): number;

    /**
     * Returns the Julian ephemeris day (JED) of the mean apogee of the Moon nearest the given date.
     * @param year - decimal year specifying a date.
     * @returns jde - Julian ephemeris day
     */
    meanApogee(year: number): number;

    /**
     * Returns the Julian ephemeris day (JED) of apogee of the Moon nearest the given date.
     * @param year - decimal year specifying a date.
     * @returns jde - Julian ephemeris day
     */
    apogee(year: number): number;

    /**
     * Returns equatorial horizontal parallax of the Moon at apogee nearest the given date.
     * @param year - decimal year specifying a date.
     * @returns equatorial horizontal parallax in radians
     */
    apogeeParallax(year: number): number;

    /**
     * Returns equatorial horizontal parallax of the Moon at perigee nearest the given date.
     * @param year - decimal year specifying a date.
     * @returns equatorial horizontal parallax in radians
     */
    perigeeParallax(year: number): number;
  }

  interface Base {
    /**
     * Returns corrections due to nutation for equatorial coordinates of an object.
     * @param α - right ascension
     * @param δ - declination
     * @param jd - Julian Day
     * @returns [Δα1, Δδ1] - corrections for right ascension and declination
     */
    nutation(α: number, δ: number, jd: number): [number, number];

    /**
     * Returns the longitude of perihelion of Earth's orbit.
     * @param T - time in Julian centuries since J2000
     * @returns longitude of perihelion (in radians)
     */
    perihelion(T: number): number;

    /**
     * Returns corrections due to aberration for ecliptic coordinates of an object.
     * @param λ - ecliptic longitude (in radians)
     * @param β - ecliptic latitude (in radians)
     * @param jd - Julian Day
     * @returns [Δλ, Δβ] - corrections for ecliptic coordinates
     */
    eclipticAberration(λ: number, β: number, jd: number): [number, number];

    /**
     * Returns corrections due to aberration for equatorial coordinates of an object.
     * @param α - right ascension (in radians)
     * @param δ - declination (in radians)
     * @param jd - Julian Day
     * @returns [Δα2, Δδ2] - corrections for right ascension and declination
     */
    aberration(α: number, δ: number, jd: number): [number, number];

    /**
     * Computes the apparent position of an object.
     * Position is computed for equatorial coordinates in eqFrom, considering proper motion,
     * precession, nutation, and aberration. Result is in eqTo.
     * @param eqFrom - initial equatorial coordinates
     * @param epochFrom - epoch of initial coordinates
     * @param epochTo - target epoch for the position calculation
     * @param mα - proper motion in right ascension (in hours)
     * @param mδ - proper motion in declination (in degrees)
     * @returns updated equatorial coordinates at epochTo
     */
    position(eqFrom: Coord, epochFrom: number, epochTo: number, mα: number, mδ: number): Coord;

    /**
     * Uses the Ron-Vondrák expression to compute corrections due to aberration for equatorial coordinates of an object.
     * @param α - right ascension (in radians)
     * @param δ - declination (in radians)
     * @param jd - Julian Day
     * @returns [Δα, Δδ] - corrections for right ascension and declination
     */
    aberrationRonVondrak(α: number, δ: number, jd: number): [number, number];

    /**
     * Computes the apparent position of an object using the Ron-Vondrák expression for aberration.
     * Position is computed for equatorial coordinates in eqFrom, considering proper motion,
     * aberration, precession, and nutation. Result is in eqTo.
     * Note that this expression is only valid for the epoch J2000.
     * @param eqFrom - initial equatorial coordinates at epoch J2000
     * @param epochTo - target epoch for the position calculation
     * @param mα - proper motion in right ascension (in hours)
     * @param mδ - proper motion in declination (in degrees)
     * @returns updated equatorial coordinates at epochTo
     */
    positionRonVondrak(eqFrom: Coord, epochTo: number, mα: number, mδ: number): Coord;
  }
  
  interface Binary {
    /**
     * Computes mean anomaly for the given date.
     * @param year - decimal year specifying the date
     * @param T - time of periastron, as a decimal year
     * @param P - period of revolution in mean solar years
     * @returns mean anomaly in radians
     */
    meanAnomaly(year: number, T: number, P: number): number;

    /**
     * Computes apparent position angle and angular distance of components of a binary star.
     * @param a - apparent semimajor axis in arc seconds
     * @param e - eccentricity of the true orbit
     * @param i - inclination relative to the line of sight
     * @param Ω - position angle of the ascending node
     * @param ω - longitude of periastron
     * @param E - eccentric anomaly
     * @returns [θ, ρ] - apparent position angle in radians and angular distance in arc seconds
     */
    position(a: number, e: number, i: number, Ω: number, ω: number, E: number): [number, number];

    /**
     * Returns apparent eccentricity of a binary star given true orbital elements.
     * @param e - eccentricity of the true orbit
     * @param i - inclination relative to the line of sight
     * @param ω - longitude of periastron
     * @returns apparent eccentricity of a binary star
     */
    apparentEccentricity(e: number, i: number, ω: number): number;
  }

  interface Coord {
    ra: number; // Right Ascension in radians
    dec: number; // Declination in radians
  }

  interface Ecliptic {
    lon: number; // Longitude (λ) in radians
    lat: number; // Latitude (β) in radians

    /**
     * Converts ecliptic coordinates to equatorial coordinates.
     * @param ε - Obliquity
     * @returns Equatorial
     */
    toEquatorial(ε: number): Equatorial;
  }

  interface Equatorial {
    ra: number; // Right Ascension (α) in radians
    dec: number; // Declination (δ) in radians

    /**
     * Converts equatorial coordinates to ecliptic coordinates.
     * @param ε - Obliquity
     * @returns Ecliptic
     */
    toEcliptic(ε: number): Ecliptic;

    /**
     * Computes horizontal coordinates from equatorial coordinates.
     * @param g - coordinates of observer on Earth
     * @param st - sidereal time at Greenwich at time of observation
     * @returns Horizontal
     */
    toHorizontal(g: GlobeCoord, st: number): Horizontal;

    /**
     * Converts equatorial coordinates to galactic coordinates.
     * @returns Galactic
     */
    toGalactic(): Galactic;
  }

  interface Horizontal {
    az: number; // Azimuth (A) in radians
    alt: number; // Altitude (h) in radians

    /**
     * Transforms horizontal coordinates to equatorial coordinates.
     * @param g - coordinates of observer on Earth (lat, lon)
     * @param st - sidereal time at Greenwich at time of observation.
     * @returns Equatorial (right ascension, declination)
     */
    toEquatorial(g: GlobeCoord, st: number): Equatorial;
  }

  interface Galactic {
    lon: number; // Longitude (l) in radians
    lat: number; // Latitude (b) in radians

    /**
     * Converts galactic coordinates to equatorial coordinates.
     * @returns Equatorial (right ascension, declination)
     */
    toEquatorial(): Equatorial;
  }

  interface GlobeCoord {
    lat: number; // Latitude of the observer in radians
    lon: number; // Longitude of the observer in radians
  }

  interface Conjunction {
    /**
     * Computes a conjunction between two moving objects, such as planets.
     * @param t1 - Julian ephemeris day of first row
     * @param t5 - Julian ephemeris day of fifth row
     * @param cs1 - Ephemeris of the first moving object (array of Coord)
     * @param cs2 - Ephemeris of the second moving object (array of Coord)
     * @returns [t, Δd] - time of conjunction in JDE and the amount that object 2 was "above" object 1
     */
    planetary(t1: number, t5: number, cs1: Coord[], cs2: Coord[]): [number, number];

    /**
     * Computes a conjunction between a moving object and a non-moving object.
     * @param t1 - Julian ephemeris day of first row
     * @param t5 - Julian ephemeris day of fifth row
     * @param c1 - Ephemeris of the non-moving object (Coord)
     * @param cs2 - Ephemeris of the moving object (array of Coord)
     * @returns [t, Δd] - time of conjunction in JDE and the amount that object 2 was "above" object 1
     */
    stellar(t1: number, t5: number, c1: Coord, cs2: Coord[]): [number, number];
  }
  
  interface Circle {
    /**
     * Finds the smallest circle containing three points.
     * @param c1 - Coordinate of point 1 (ra, dec)
     * @param c2 - Coordinate of point 2 (ra, dec)
     * @param c3 - Coordinate of point 3 (ra, dec)
     * @returns [Δ, typeI] - diameter of the circle and a boolean indicating if solution is of type I
     */
    smallest(c1: Coord, c2: Coord, c3: Coord): [number, boolean];
  }

  interface DeltaT {
    /**
     * Returns the difference ΔT = TD - UT between Dynamical Time TD and Universal Time (GMT+12) in seconds.
     * @param dyear - Decimal year
     * @returns ΔT in seconds
     */
    deltaT(dyear: number): number;
  }

  interface ElementEquinoxElement {
    inc: number; // Inclination in radians
    node: number; // Longitude of ascending node (Ω) in radians
    peri: number; // Argument of perihelion (ω) in radians
  }

  interface ElementEquinox {
    /**
     * Reduces orbital elements of a solar system body from equinox B1950 to J2000.
     * @param eFrom - Orbital elements to be reduced
     * @returns eTo - Reduced orbital elements in J2000
     */
    reduceB1950ToJ2000(eFrom: ElementEquinoxElement): ElementEquinoxElement;

    /**
     * Reduces orbital elements of a solar system body from equinox B1950 in the FK4 system to equinox J2000 in the FK5 system.
     * @param eFrom - Orbital elements to be reduced
     * @returns eTo - Reduced orbital elements in J2000 FK5
     */
    reduceB1950FK4ToJ2000FK5(eFrom: ElementEquinoxElement): ElementEquinoxElement;
  }

  interface EllipticElement {
    axis: number; // Semimajor axis (a) in AU
    ecc: number; // Eccentricity (e)
    inc: number; // Inclination (i) in radians
    argP: number; // Argument of perihelion (ω) in radians
    node: number; // Longitude of ascending node (Ω) in radians
    timeP: number; // Time of perihelion (T) as JDE
  }

  interface Elliptic {
    /**
     * Returns observed equatorial coordinates of a planet at a given time.
     * @param planet - A valid V87Planet object for the observed planet.
     * @param earth - A valid V87Planet object for Earth.
     * @param jde - Julian Ephemeris Day.
     * @returns [α, δ] - Right Ascension and Declination in radians.
     */
    position(planet: any, earth: any, jde: number): Coord;

    /**
     * Returns observed equatorial coordinates of a body with Keplerian elements.
     * @param jde - Julian Ephemeris Day.
     * @param earth - A valid V87Planet object for Earth.
     * @returns [α, δ, ψ] - Right Ascension, Declination, and Elongation in radians.
     */
    Elements: EllipticElement;

    /**
     * Computes the instantaneous velocity of a body in elliptical orbit around the Sun.
     * @param a - Semimajor axis of the body in AU.
     * @param r - Instantaneous distance to the Sun in AU.
     * @returns Velocity in Km/sec.
     */
    velocity(a: number, r: number): number;

    /**
     * Computes the velocity of a body at aphelion.
     * @param a - Semimajor axis of the body in AU.
     * @param e - Eccentricity of the orbit.
     * @returns Velocity at aphelion in Km/sec.
     */
    vAphelion(a: number, e: number): number;

    /**
     * Computes the velocity of a body at perihelion.
     * @param a - Semimajor axis of the body in AU.
     * @param e - Eccentricity of the orbit.
     * @returns Velocity at perihelion in Km/sec.
     */
    vPerihelion(a: number, e: number): number;

    /**
     * Returns Ramanujan's approximation for the length of an elliptical orbit.
     * @param a - Semimajor axis in AU.
     * @param e - Eccentricity of the orbit.
     * @returns Length of the elliptical orbit in AU.
     */
    length1(a: number, e: number): number;

    /**
     * Returns an alternate approximation for the length of an elliptical orbit.
     * @param a - Semimajor axis in AU.
     * @param e - Eccentricity of the orbit.
     * @returns Length of the elliptical orbit in AU.
     */
    length2(a: number, e: number): number;

    /**
     * Returns the exact length of an elliptical orbit.
     * @param a - Semimajor axis in AU.
     * @param e - Eccentricity of the orbit.
     * @returns Length of the elliptical orbit in AU.
     */
    length4(a: number, e: number): number;
  }

  interface Eclipse {
    /**
     * Computes quantities related to solar eclipses.
     * @param year - Decimal year specifying a date.
     * @returns An object containing eclipse type, central status, JDE max, magnitude, distance, umbral radius, and penumbral radius.
     */
    solar(year: number): {
      type: number; // Eclipse type (None, Partial, Annular, AnnularTotal, Total)
      central: boolean; // True if the center of the eclipse shadow touches the Earth
      jdeMax: number; // JDE when the center of the eclipse shadow is closest to Earth
      magnitude?: number; // Eclipse magnitude for partial eclipses
      distance: number; // Distance from the eclipse shadow center to Earth's center
      umbral: number; // Radius of the Moon's umbral cone in equatorial Earth radii
      penumbral: number; // Radius of the penumbral cone in equatorial Earth radii
    };

    /**
     * Computes quantities related to lunar eclipses.
     * @param year - Decimal year specifying a date.
     * @returns An object containing eclipse type, JDE max, magnitude, distance, umbral radius, penumbral radius, and semi-durations of phases.
     */
    lunar(year: number): {
      type: number; // Eclipse type (None, Penumbral, Umbral, Total)
      jdeMax: number; // JDE when the center of the eclipse shadow is closest to the Moon
      magnitude?: number; // Eclipse magnitude
      distance: number; // Distance from the eclipse shadow center to Moon's center
      umbral: number; // Radius of the umbral cone in equatorial Earth radii
      penumbral: number; // Radius of the penumbral cone in equatorial Earth radii
      sdTotal?: number; // Semi-duration of total phase in days
      sdPartial?: number; // Semi-duration of partial phase in days
      sdPenumbral?: number; // Semi-duration of penumbral phase in days
    };
  }

  interface Elp {
    /**
     * Represents the Moon's orbital elements and provides methods to calculate its position.
     */
    Moon: {
      /**
       * Constructs a Moon object with the given ELP data series.
       * @param data - ELP data series for the Moon.
       */
      new (data: any): {
        /**
         * Returns rectangular coordinates referred to the inertial mean ecliptic and equinox of J2000.
         * @param jde - Julian ephemeris day
         * @returns Rectangular coordinates { x, y, z }
         */
        positionXYZ(jde: number): { x: number; y: number; z: number };

        /**
         * Returns the delay effect of light time.
         * @param jde - Julian ephemeris day
         * @returns Delay time in days
         */
        lightTime(jde: number): number;

        /**
         * Returns ecliptic position of the Moon at equinox and ecliptic of date.
         * @param jde - Julian ephemeris day
         * @returns Coordinates { lon, lat, range }
         */
        position(jde: number): Coord;
      };
    };

    /**
     * Returns the true geometric position of the Moon as ecliptic coordinates.
     * @param elpData - ELP data for the Moon
     * @param jde - Julian ephemeris day
     * @returns Ecliptic coordinates { lon, lat, range }
     */
    position(elpData: any, jde: number): Coord;
  }

  interface EqTime {
    /**
     * Computes the "equation of time" for the given Julian Ephemeris Day (JDE).
     * @param jde - Julian Ephemeris Day
     * @param earth - A valid V87Planet object for Earth
     * @returns Equation of time as an hour angle in radians
     */
    e(jde: number, earth: any): number;

    /**
     * Computes a less accurate "equation of time" for the given Julian Ephemeris Day (JDE).
     * @param jde - Julian Ephemeris Day
     * @returns Equation of time as an hour angle in radians
     */
    eSmart(jde: number): number;
  }

  interface Point {
    x: number; // X coordinate
    y: number; // Y coordinate
  }

  interface Fit {
    /**
     * Fits a line to sample data.
     * @param points - Array of data points
     * @returns [a, b] - Coefficients of the best fit line y = ax + b
     */
    linear(points: Point[]): [number, number];

    /**
     * Returns the correlation coefficient for sample data.
     * @param points - Array of data points
     * @returns Correlation coefficient
     */
    correlationCoefficient(points: Point[]): number;

    /**
     * Fits a quadratic curve to sample data.
     * @param points - Array of data points
     * @returns [a, b, c] - Coefficients of the best fit quadratic y = ax² + bx + c
     */
    quadratic(points: Point[]): [number, number, number];

    /**
     * Implements multiple linear regression for a linear combination of three functions.
     * @param points - Array of data points
     * @param f0 - First function
     * @param f1 - Second function
     * @param f2 - Third function
     * @returns [a, b, c] - Coefficients fitting y = aƒ₀(x) + bƒ₁(x) + cƒ₂(x)
     */
    func3(points: Point[], f0: (x: number) => number, f1: (x: number) => number, f2: (x: number) => number): [number, number, number];

    /**
     * Fits a linear multiple of a function to sample data.
     * @param points - Array of data points
     * @param f - Function to fit
     * @returns Coefficient fitting y = aƒ(x)
     */
    func1(points: Point[], f: (x: number) => number): number;
  }

  interface Ellipsoid {
    radius: number; // Equatorial radius in kilometers
    flat: number; // Flattening of the ellipsoid

    /**
     * Returns the equatorial radius.
     */
    A(): number;

    /**
     * Returns the polar radius.
     */
    B(): number;

    /**
     * Returns the eccentricity of a meridian.
     */
    eccentricity(): number;

    /**
     * Computes parallax constants ρ sin φ′ and ρ cos φ′.
     * @param φ - Geographic latitude in radians
     * @param h - Height in meters above the ellipsoid
     * @returns [ρ sin φ′, ρ cos φ′] - Parallax constants
     */
    parallaxConstants(φ: number, h: number): [number, number];

    /**
     * Returns distance from Earth center to a point on the ellipsoid.
     * @param φ - Geographic latitude in radians
     * @returns Distance from Earth center
     */
    rho(φ: number): number;

    /**
     * Returns the radius of the circle that is the parallel of latitude at φ.
     * @param φ - Latitude in radians
     * @returns Radius in kilometers
     */
    radiusAtLatitude(φ: number): number;

    /**
     * Returns the radius of curvature along a meridian at latitude φ.
     * @param φ - Latitude in radians
     * @returns Radius in kilometers
     */
    radiusOfCurvature(φ: number): number;

    /**
     * Computes distance between two points measured along the surface of an ellipsoid.
     * @param c1 - Coordinate of point 1
     * @param c2 - Coordinate of point 2
     * @returns Distance in kilometers
     */
    distance(c1: Coord, c2: Coord): number;
  }

  interface Globe {
    Ellipsoid: new (radius: number, flat: number) => Ellipsoid; // Constructor for Ellipsoid
    Earth76: Ellipsoid; // IAU 1976 values for Earth

    /**
     * Returns the rotational angular velocity of the Earth with respect to the stars at epoch 1996.5.
     */
    RotationRate1996_5: number;

    /**
     * Returns the length of one degree of longitude at a given radius.
     * @param rp - Radius in kilometers of a circle that is a parallel of latitude
     * @returns Distance in kilometers along one degree of the circle
     */
    oneDegreeOfLongitude(rp: number): number;

    /**
     * Returns the length of one degree of latitude at a given radius.
     * @param rm - Radius in kilometers of curvature along a meridian
     * @returns Distance in kilometers along one degree of the meridian
     */
    oneDegreeOfLatitude(rm: number): number;

    /**
     * Returns geographic latitude - geocentric latitude difference.
     * @param φ - Geographic latitude in radians
     * @returns Difference in radians
     */
    geocentricLatitudeDifference(φ: number): number;

    /**
     * Represents geographic coordinates on Earth.
     */
    Coord: new (lat?: number, lon?: number) => Coord;

    /**
     * Computes cosine of angle between two points.
     * @param p1 - Point 1 coordinates
     * @param p2 - Point 2 coordinates
     * @returns Cosine of angle between two points
     */
    approxAngularDistance(p1: Coord, p2: Coord): number;

    /**
     * Computes distance across surface of Earth based on geocentric angular distance.
     * @param d - Geocentric angular distance in radians
     * @returns Linear distance in kilometers
     */
    approxLinearDistance(d: number): number;
  }

  interface Illum {
    /**
     * Computes the phase angle of a planet.
     * @param r - Planet's distance to the Sun in AU
     * @param Δ - Distance to Earth in AU
     * @param R - Distance from Sun to Earth in AU
     * @returns Phase angle in radians
     */
    phaseAngle(r: number, Δ: number, R: number): number;

    /**
     * Computes the illuminated fraction of the disk of a planet.
     * @param r - Planet's distance to the Sun in AU
     * @param Δ - Distance to Earth in AU
     * @param R - Distance from Sun to Earth in AU
     * @returns Illuminated fraction of the disk
     */
    fraction(r: number, Δ: number, R: number): number;

    /**
     * Computes the phase angle of a planet using heliocentric ecliptic coordinates.
     * @param L - Heliocentric ecliptic longitude of the planet in radians
     * @param B - Heliocentric ecliptic latitude of the planet in radians
     * @param R - Distance from Sun to the planet in AU
     * @param L0 - Heliocentric ecliptic longitude of Earth in radians
     * @param R0 - Distance from Sun to Earth in AU
     * @param Δ - Distance from Earth to the planet in AU
     * @returns Phase angle in radians
     */
    phaseAngle2(L: number, B: number, R: number, L0: number, R0: number, Δ: number): number;

    /**
     * Computes the phase angle of a planet using Cartesian coordinates.
     * @param L - Heliocentric ecliptic longitude of the planet in radians
     * @param B - Heliocentric ecliptic latitude of the planet in radians
     * @param x - Cartesian x coordinate of the planet in AU
     * @param y - Cartesian y coordinate of the planet in AU
     * @param z - Cartesian z coordinate of the planet in AU
     * @param Δ - Distance from Earth to the planet in AU
     * @returns Phase angle in radians
     */
    phaseAngle3(L: number, B: number, x: number, y: number, z: number, Δ: number): number;

    /**
     * Computes an approximation of the illuminated fraction of Venus.
     * @param jde - Julian ephemeris day
     * @returns Illuminated fraction for Venus
     */
    fractionVenus(jde: number): number;

    /**
     * Computes the visual magnitude of Mercury.
     * @param r - Planet's distance from the Sun in AU
     * @param Δ - Distance from Earth in AU
     * @param i - Phase angle in radians
     * @returns Visual magnitude of Mercury
     */
    mercury(r: number, Δ: number, i: number): number;

    /**
     * Computes the visual magnitude of Venus.
     * @param r - Planet's distance from the Sun in AU
     * @param Δ - Distance from Earth in AU
     * @param i - Phase angle in radians
     * @returns Visual magnitude of Venus
     */
    venus(r: number, Δ: number, i: number): number;

    /**
     * Computes the visual magnitude of Mars.
     * @param r - Planet's distance from the Sun in AU
     * @param Δ - Distance from Earth in AU
     * @param i - Phase angle in radians
     * @returns Visual magnitude of Mars
     */
    mars(r: number, Δ: number, i: number): number;

    /**
     * Computes the visual magnitude of Jupiter.
     * @param r - Planet's distance from the Sun in AU
     * @param Δ - Distance from Earth in AU
     * @returns Visual magnitude of Jupiter
     */
    jupiter(r: number, Δ: number): number;

    /**
     * Computes the visual magnitude of Saturn.
     * @param r - Planet's distance from the Sun in AU
     * @param Δ - Distance from Earth in AU
     * @param B - Saturnicentric latitude of Earth referred to Saturn's ring plane (radians)
     * @param ΔU - Difference between Saturnicentric longitudes of Sun and Earth (radians)
     * @returns Visual magnitude of Saturn
     */
    saturn(r: number, Δ: number, B: number, ΔU: number): number;

    /**
     * Computes the visual magnitude of Uranus.
     * @param r - Planet's distance from the Sun in AU
     * @param Δ - Distance from Earth in AU
     * @returns Visual magnitude of Uranus
     */
    uranus(r: number, Δ: number): number;

    /**
    Computes the visual magnitude of Neptune.
    @param r - Planet's distance from the Sun in AU 
    @param Δ - Distance from Earth in AU 
    @returns Visual magnitude of Neptune 
    */
    neptune(r: number, Δ: number): number;

    /**
    Computes Mercury's visual magnitude using 1984 formula. 
    The formula is that adopted by "Astronomical Almanac" 1984.0. 
    Argument r is distance from Sun; Δ is distance from Earth; i is phase angle (radians). 
    */
    mercury84(r: number, Δ: number, i: number): number;

    /**
    Computes Venus' visual magnitude using 1984 formula. 
    The formula is that adopted by "Astronomical Almanac" 1984.0. 
    Argument r is distance from Sun; Δ is distance from Earth; i is phase angle (radians). 
    */
    venus84(r: number, Δ: number, i: number): number;

    /**
    Computes Mars' visual magnitude using 1984 formula. 
    The formula is that adopted by "Astronomical Almanac" 1984.0. 
    Argument r is distance from Sun; Δ is distance from Earth; i is phase angle (radians). 
    */
    mars84(r: number, Δ: number, i: number): number;

    /**
    Computes Jupiter's visual magnitude using 1984 formula. 
    The formula is that adopted by "Astronomical Almanac" 1984.0. 
    Argument r is distance from Sun; Δ is distance from Earth; i is phase angle (radians). 
    */
    jupiter84(r: number, Δ: number, i: number): number;

    /**
    Computes Saturn's visual magnitude using 1984 formula. 
    The formula is that adopted by "Astronomical Almanac" 1984.0. 
    Argument r is distance from Sun; Δ is distance from Earth; B is Saturnicentric latitude; and U (in radians) is difference between longitudes. 
    */
    saturn84(r: number, Δ: number, B: number, ΔU: number): number;

    /**  
     Computes Uranus' visual magnitude using 1984 formula.  
     The formula is that adopted by "Astronomical Almanac" 1984.0.  
     Argument r is distance from Sun; and Δ is distance from Earth.  
     */
    uranus84(r: number, Δ: number): number;
    /**  
     Computes Neptune's visual magnitude using 1984 formula. 
     Argument r is distance from Sun; and Δ is distance from Earth. 
     */
    neptune84(r: number, Δ: number): number;

    /** 
      Computes Pluto's visual magnitude using 1984 formula. 
      Argument r is distance from Sun; and Δ is distance from Earth. 
      */
    pluto84(r: number, Δ: number): number;
  }

  interface Interpolation {
    /**
     * Error values returned by functions and methods in this package.
     */
    errorNot3: Error;
    errorNot4: Error;
    errorNot5: Error;
    errorNoXRange: Error;
    errorNOutOfRange: Error;
    errorNoExtremum: Error;
    errorExtremumOutside: Error;
    errorZeroOutside: Error;
    errorNoConverge: Error;

    /**
     * Computes a linear interpolation for a given x value.
     * @param x - The x value for interpolation
     * @param x1 - The first x value in the range
     * @param xN - The last x value in the range
     * @param y - Array of y values corresponding to x values
     * @returns Interpolated y value
     */
    linear(x: number, x1: number, xN: number, y: number[]): number;

    /**
     * Performs Lagrange interpolation with unequally spaced abscissae.
     * @param x - The x value for interpolation
     * @param table - Array of points [[x0, y0], ... [xN, yN]]
     * @returns Interpolated y value
     */
    lagrange(x: number, table: [number, number][]): number;

    /**
     * Uses Lagrange's formula to produce an interpolating polynomial.
     * @param table - Array of points [[x0, y0], ... [xN, yN]]
     * @returns Polynomial coefficients as an array
     */
    lagrangePoly(table: [number, number][]): number[];

    /**
     * Computes a special purpose Len3 object for interpolation.
     * @param x - Target for interpolation
     * @param x1 - First x value in the table
     * @param xN - Last x value in the table
     * @param y - All y values in the table (length should be >= 3)
     */
    len3ForInterpolateX(x: number, x1: number, xN: number, y: number[]): Len3;

    /**
     * Computes a half-length interpolation from a table of four rows.
     * @param y - Array of four values
     * @returns Interpolated result
     */
    len4Half(y: number[]): number;

    /**
     * Represents a Len5 object for fourth difference interpolation.
     */
    Len5: new (x1: number, x5: number, y: number[]) => {
      interpolateX(x: number): number;
      interpolateXStrict(x: number): number;
      interpolateN(n: number): number;
      interpolateNStrict(n: number): number;
      extremum(): [number, number];
      zero(strong?: boolean): number;
    };
  }

  interface Len3 {
    /**
     * Constructs a Len3 object from a table of three rows of x and y values.
     * @param x1 - The x value corresponding to the first y value of the table.
     * @param x3 - The x value corresponding to the last y value of the table.
     * @param y - Array of three y values.
     */
    new (x1: number, x3: number, y: number[]): Len3;

    /**
     * Interpolates for a given x value.
     * @param x - The x value for interpolation
     * @returns Interpolated y value
     */
    interpolateX(x: number): number;

    /**
     * Interpolates for a given x value, restricting it to the range x1 to x3.
     * @param x - The x value for interpolation
     * @returns Interpolated y value
     */
    interpolateXStrict(x: number): number;

    /**
     * Interpolates for a given interpolating factor n.
     * @param n - The interpolation factor
     * @returns Interpolated value
     */
    interpolateN(n: number): number;

    /**
     * Interpolates for a given interpolating factor n, restricting n to the range [-1..1].
     * @param n - The interpolation factor
     * @returns Interpolated value
     */
    interpolateNStrict(n: number): number;

    /**
     * Returns the x and y values at the extremum.
     * @returns [x, y] - Extremum values
     */
    extremum(): [number, number];

    /**
     * Finds a zero of the quadratic function represented by the table.
     * @param strong - If true, uses a more sophisticated estimation method.
     * @returns Estimated zero value
     */
    zero(strong: boolean): number;
  }

  interface Iterate {
    /**
     * Iterates to a fixed number of decimal places.
     * @param better - Improvement function
     * @param start - Starting value
     * @param places - Number of decimal places desired in the result
     * @param maxIterations - Maximum number of iterations allowed
     * @returns Improved value to the specified decimal places
     * @throws Error if maximum iterations are reached
     */
    decimalPlaces(better: (value: number) => number, start: number, places: number, maxIterations: number): number;

    /**
     * Iterates to (nearly) the full precision of a float64.
     * @param better - Improvement function
     * @param start - Starting value
     * @param maxIterations - Maximum number of iterations allowed
     * @returns Improved value with full precision
     * @throws Error if maximum iterations are reached
     */
    fullPrecision(better: (value: number) => number, start: number, maxIterations: number): number;

    /**
     * Finds a root between given bounds by binary search.
     * @param f - Function for which to find the root
     * @param lower - Lower bound for the root search
     * @param upper - Upper bound for the root search
     * @returns Root value found between the bounds
     */
    binaryRoot(f: (x: number) => number, lower: number, upper: number): number;
  }

  interface DateObj {
    year: number; // Year in the calendar
    month: number; // Month in the calendar
    day: number; // Day in the calendar
  }

  interface JM {
    /**
     * Returns interesting dates and facts about a given year in the Jewish calendar.
     * @param y - Julian or Gregorian year
     * @returns [A, mP, dP, mNY, dNY, months, days] - Various details about the Jewish calendar year
     */
    JewishCalendar(y: number): [number, number, number, number, number, number, number];

    /**
     * Converts a Moslem calendar date to a Julian Day.
     * @param y - Year in Moslem calendar
     * @param m - Month in Moslem calendar
     * @param d - Day in Moslem calendar
     * @returns Julian Day corresponding to the Moslem date
     */
    MoslemToJD(y: number, m: number, d: number): number;

    /**
     * Returns true if the specified year in the Moslem calendar is a leap year.
     * @param year - Year in Moslem calendar
     * @returns True if leap year, otherwise false
     */
    MoslemLeapYear(year: number): boolean;

    /**
     * Converts a Julian calendar date to a Moslem calendar date.
     * @param y - Julian year
     * @param m - Julian month
     * @param d - Julian day
     * @returns DateObj containing the equivalent Moslem date
     */
    JulianToMoslem(y: number, m: number, d: number): DateObj;

    /**
     * Returns the Romanization of the month in the Moslem Calendar.
     * @param m - Month number (1-12)
     * @returns Name of the month in Romanized form
     */
    moslemMonth(m: number): string;
  }

  interface Calendar {
    year: number; // Year in the calendar
    month: number; // Month in the calendar
    day: number; // Day in the calendar

    /**
     * Returns the date as an object.
     */
    getDate(): { year: number; month: number; day: number };

    /**
     * Returns the time as an object.
     */
    getTime(): { hour: number; minute: number; second: number; millisecond: number };

    /**
     * Returns the date as an ISO string.
     */
    toISOString(): string;

    /**
     * Checks if the calendar instance is Gregorian.
     */
    isGregorian(): boolean;

    /**
     * Converts a proleptic Gregorian date to a Calendar instance.
     * @param date - Proleptic Gregorian date
     */
    fromDate(date: Date): this;

    /**
     * Converts the Calendar instance to a proleptic Gregorian date.
     */
    toDate(): Date;

    /**
     * Converts a calendar date to decimal year.
     */
    toYear(): number;

    /**
     * Converts a decimal year to a calendar date.
     * @param year - Decimal year
     */
    fromYear(year: number): this;

    /**
     * Checks if the year is a leap year.
     */
    isLeapYear(): boolean;

    /**
     * Converts the calendar date to Julian Day.
     */
    toJD(): number;

    /**
     * Converts a Julian Day to a Calendar instance.
     * @param jd - Julian Day
     */
    fromJD(jd: number): this;

    /**
     * Converts a Julian Ephemeris Day to a Calendar instance.
     * @param jde - Julian Ephemeris Day
     */
    fromJDE(jde: number): this;

    /**
     * Converts the Calendar instance to Julian Ephemeris Day.
     */
    toJDE(): number;

    /**
     * Sets the date to midnight UTC.
     */
    midnight(): this;

    /**
     * Sets the date to noon UTC.
     */
    noon(): this;

    /**
     * Adjusts for ΔT based on whether the calendar instance is in TD or UT.
     * @param td - If true, converts TD to UT
     */
    deltaT(td: boolean): this;

    /**
     * Returns the day of the week for the current date.
     */
    dayOfWeek(): number;

    /**
     * Returns the day of the year for the current date.
     */
    dayOfYear(): number;
  }

  interface CalendarJulian extends Calendar {
    /**
     * Converts Julian calendar date to Julian Day.
     */
    toJD(): number;

    /**
     * Converts Julian Day to Julian calendar date.
     * @param jd - Julian Day
     */
    fromJD(jd: number): this;

    /**
     * Checks if the year is a leap year in the Julian calendar.
     */
    isLeapYear(): boolean;

    /**
    Converts Julian calendar date to Gregorian calendar date.
    @returns {CalendarGregorian} - Instance of CalendarGregorian
    */
    toGregorian(): CalendarGregorian;
  }

  interface CalendarGregorian extends Calendar {
    /**
    Converts Gregorian calendar date to Julian Day.
    @returns {number} - Julian Day
    */
    toJD(): number;

    /**
    Converts Julian Day to Gregorian calendar date.
    @param jd - Julian Day
    @returns {CalendarGregorian} - Instance of CalendarGregorian
    */
    fromJD(jd: number): this;

    /**
    Checks if the year is a leap year in the Gregorian calendar.
    @returns {boolean} - True if leap year, otherwise false
    */
    isLeapYear(): boolean;

    /**  
     Converts Gregorian calendar date to Julian calendar date.  
     @returns {CalendarJulian} - Instance of CalendarJulian  
     */
    toJulian(): CalendarJulian;
  }

  interface Julian {
    GREGORIAN0JD: number; // The start of the Gregorian Calendar

    Calendar: new (year?: number | Date, month?: number, day?: number) => Calendar;
    CalendarJulian: new () => CalendarJulian;
    CalendarGregorian: new () => CalendarGregorian;

    /**  
     Converts a given Julian or Gregorian year into Jewish calendar details.  
     @param y - Year in either Julian or Gregorian format  
     @returns [A, mP, dP, mNY, dNY, months, days] - Various details about Jewish calendar  
     */
    JewishCalendar(y: number): [number, number, number, number, number, number, number];

    /**  
     Converts a Moslem calendar date into its equivalent Julian Day.  
     @param y - Year in Moslem calendar  
     @param m - Month in Moslem calendar  
     @param d - Day in Moslem calendar  
     @returns {number} - Corresponding Julian Day  
     */
    MoslemToJD(y: number, m: number, d: number): number;

    /**  
     Checks if a given year in Moslem calendar is a leap year.  
     @param year - Year in Moslem calendar  
     @returns {boolean} - True if leap year, otherwise false  
     */
    MoslemLeapYear(year: number): boolean;

    /**  
     Converts a given Julian date into its equivalent Moslem calendar date.  
     @param y - Year in Julian format  
     @param m - Month in Julian format  
     @param d - Day in Julian format  
     @returns {DateObj} - Equivalent Moslem calendar date   
     */
    JulianToMoslem(y: number, m: number, d: number): DateObj;

    /**  
     Returns Romanization of specified month in Moslem calendar.   
     @param m - Month (1-12)   
     @returns {string} - Name of month   
     */
    moslemMonth(m: number): string;
    /**
     * Converts a Gregorian or Julian date to Julian Day.
     * @param y - Year (can be negative for BC)
     * @param m - Month (1-12)
     * @param d - Day of the month
     * @param isJulian - True if the date is Julian, false if Gregorian
     * @returns Julian Day as a number
     */
    CalendarToJD(y: number, m: number, d: number, isJulian: boolean): number;

    /**
     * Converts a Gregorian date to Julian Day.
     * @param y - Gregorian year
     * @param m - Month (1-12)
     * @param d - Day of the month
     * @returns Julian Day as a number
     */
    CalendarGregorianToJD(y: number, m: number, d: number): number;

    /**
     * Converts a Julian date to Julian Day.
     * @param y - Julian year
     * @param m - Month (1-12)
     * @param d - Day of the month
     * @returns Julian Day as a number
     */
    CalendarJulianToJD(y: number, m: number, d: number): number;

    /**
     * Checks if a given year in the Julian calendar is a leap year.
     * @param y - Year in Julian calendar
     * @returns True if leap year, otherwise false
     */
    LeapYearJulian(y: number): boolean;

    /**
     * Checks if a given year in the Gregorian calendar is a leap year.
     * @param y - Year in Gregorian calendar
     * @returns True if leap year, otherwise false
     */
    LeapYearGregorian(y: number): boolean;

    /**
     * Converts a Julian Day to a calendar date.
     * @param jd - Julian Day as a float
     * @param isJulian - True for Julian Calendar, false for Gregorian Calendar
     * @returns DateObj containing year, month, and day
     */
    JDToCalendar(jd: number, isJulian: boolean): DateObj;

    /**
     * Converts a Julian Day to a Gregorian calendar date.
     * @param jd - Julian Day as a float
     * @returns DateObj containing year, month, and day in Gregorian Calendar
     */
    JDToCalendarGregorian(jd: number): DateObj;

    /**
     * Converts a Julian Day to a Julian calendar date.
     * @param jd - Julian Day as a float
     * @returns DateObj containing year, month, and day in Julian Calendar
     */
    JDToCalendarJulian(jd: number): DateObj;

    /**
     * Checks if a given Julian Day falls into the Gregorian calendar.
     * @param jd - Julian Day as a float
     * @returns True if it falls into Gregorian calendar, otherwise false
     */
    isJDCalendarGregorian(jd: number): boolean;

    /**
     * Checks if a given date falls into the Gregorian calendar.
     * @param year - Year (can be negative for BC)
     * @param month - Month (1-12)
     * @param day - Day of the month
     * @returns True if it falls into Gregorian calendar, otherwise false
     */
    isCalendarGregorian(year: number, month?: number, day?: number): boolean;

    /**
   Converts a Julian day to a Date object (Gregorian Calendar).
   Note that this function returns dates in proleptic Gregorian Calendar.
   @param jd - Julian day (float)
   @returns Date object representing the corresponding date
   */
    JDToDate(jd: number): Date;

    /**  
    Converts a proleptic Gregorian Date into a Julian day.  
    @param date - Javascript Date object  
    @returns {number} jd - Corresponding Julian day  
    */
    DateToJD(date: Date): number;

    /**  
    Converts a Julian ephemeris day `jde` to a Date Object (Gregorian Calendar).  
    To obtain "Universal Time" (UT) from "Dynamical Time" (TD) apply correction ΔT.  
    Note that this function returns dates in proleptic Gregorian Calendar.  
    */
    JDEToDate(jde: number): Date;

    /**  
    Converts a Date Object (Gregorian Calendar) to a Julian ephemeris day `jde`.  
    To obtain "Dynamical Time" (TD) from "Universal Time" (UT) apply correction ΔT.  
    */
    DateToJDE(date: Date): number;

    /**  
    Converts Modified Julian Day `mjd` to Julian Day `jd`.  
    */
    MJDToJD(mjd: number): number;

    /**  
    Converts Julian Day `jd` to Modified Julian Day `mjd`.  
    */
    JDToMJD(jd: number): number;

    /**  
    Determines the day of the week for a given JD.  
    Returns an integer from 0 to 6 where 0 represents Sunday.  
    */
    DayOfWeek(jd: number): number;

    /**
     * Computes the day number within the year of the Gregorian calendar.
     * @param y - Year (int)
     * @param m - Month (int)
     * @param d - Day (float)
     * @returns Day of the year (int)
     */
    DayOfYearGregorian(y: number, m: number, d: number): number;

    /**
     * Computes the day number within the year of the Julian calendar.
     * @param y - Year (int)
     * @param m - Month (int)
     * @param d - Day (float)
     * @returns Day of the year (int)
     */
    DayOfYearJulian(y: number, m: number, d: number): number;

    /**
     * Computes the day number within the year.
     * This function is not specific to Julian or Gregorian calendars.
     * @param y - Year (int)
     * @param m - Month (int)
     * @param d - Day (float)
     * @param leap - Set true if y is a leap year
     * @returns Day of the year (int)
     */
    DayOfYear(y: number, m: number, d: number, leap: boolean): number;

    /**
     * Converts a day of year to a calendar month and day.
     * @param n - Day of year (int)
     * @param leap - Set true if y is a leap year
     * @returns { month: number; day: number } - Month and day
     */
    DayOfYearToCalendar(n: number, leap: boolean): { month: number; day: number };

    /**
     * Converts a day of year to a Gregorian calendar date.
     * @param year - Year (int)
     * @param n - Day of year (int)
     * @returns {CalendarGregorian} - Instance of CalendarGregorian
     */
    DayOfYearToCalendarGregorian(year: number, n: number): CalendarGregorian;

    /**
      Converts a day of year to a Julian calendar date.
      @param year - Year (int)
      @param n - Day of year (int)
      @returns {CalendarJulian} - Instance of CalendarJulian
      */
    DayOfYearToCalendarJulian(year: number, n: number): CalendarJulian;
  }

  interface Jupiter {
    /**
     * Computes quantities for physical observations of Jupiter.
     * @param jde - Julian ephemeris day
     * @param earth - Planet object representing Earth
     * @param jupiter - Planet object representing Jupiter
     * @returns {Array} - Contains:
     *    {number} DS - Planetocentric declination of the Sun.
     *    {number} DE - Planetocentric declination of the Earth.
     *    {number} ω1 - Longitude of the System I central meridian of the illuminated disk, as seen from Earth.
     *    {number} ω2 - Longitude of the System II central meridian of the illuminated disk, as seen from Earth.
     */
    physical(jde: number, earth: any, jupiter: any): [number, number, number, number];

    /**
     * Computes quantities for physical observations of Jupiter with less accuracy.
     * @param jde - Julian ephemeris day
     * @returns {Array} - Contains:
     *    {number} DS - Planetocentric declination of the Sun.
     *    {number} DE - Planetocentric declination of the Earth.
     *    {number} ω1 - Longitude of the System I central meridian of the illuminated disk, as seen from Earth.
     *    {number} ω2 - Longitude of the System II central meridian of the illuminated disk, as seen from Earth.
     */
    physical2(jde: number): [number, number, number, number];
  }

  interface XY {
    x: number; // X coordinate in units of Jupiter radii
    y: number; // Y coordinate in units of Jupiter radii
  }

  interface JupiterMoons {
    /**
     * Constant indices for the four largest moons of Jupiter.
     */
    io: number; // Index for Io
    europa: number; // Index for Europa
    ganymede: number; // Index for Ganymede
    callisto: number; // Index for Callisto

    /**
     * Computes the positions of Jupiter's moons.
     * @param jde - Julian ephemeris day
     * @returns Array of XY coordinates for the four moons, in units of Jupiter radii
     */
    positions(jde: number): XY[];

    /**
     * Computes positions of moons using a high-accuracy method based on theory "E5".
     * @param jde - Julian ephemeris day
     * @param earth - VSOP87 Planet object representing Earth
     * @param jupiter - VSOP87 Planet object representing Jupiter
     * @param pos - Optional reference to an array of positions (same as return value)
     * @returns Array of XY coordinates for the four moons
     */
    e5(jde: number, earth: any, jupiter: any, pos?: XY[]): XY[];
  }

  interface Kepler {
    /**
     * Computes the true anomaly for a given eccentric anomaly.
     * @param E - Eccentric anomaly in radians
     * @param e - Eccentricity
     * @returns True anomaly in radians
     */
    trueAnomaly(E: number, e: number): number;

    /**
     * Computes the radius distance for a given eccentric anomaly.
     * @param E - Eccentric anomaly in radians
     * @param e - Eccentricity
     * @param a - Semimajor axis
     * @returns Radius distance in units of semimajor axis
     */
    radius(E: number, e: number, a: number): number;

    /**
     * Solves Kepler's equation using the first iterative method.
     * @param e - Eccentricity
     * @param m - Mean anomaly in radians
     * @param places - Desired number of decimal places in the result
     * @returns Eccentric anomaly in radians
     */
    kepler1(e: number, m: number, places: number): number;

    /**
     * Solves Kepler's equation using the second iterative method.
     * @param e - Eccentricity
     * @param m - Mean anomaly in radians
     * @param places - Desired number of decimal places in the result
     * @returns Eccentric anomaly in radians
     */
    kepler2(e: number, m: number, places: number): number;

    /**
     * Solves Kepler's equation using an improved second iterative method.
     * @param e - Eccentricity
     * @param m - Mean anomaly in radians
     * @param places - Desired number of decimal places in the result
     * @returns Eccentric anomaly in radians
     */
    kepler2a(e: number, m: number, places: number): number;

    /**
     * Solves Kepler's equation using another improved second iterative method.
     * @param e - Eccentricity
     * @param m - Mean anomaly in radians
     * @param places - Desired number of decimal places in the result
     * @returns Eccentric anomaly in radians
     */
    kepler2b(e: number, m: number, places: number): number;

    /**
     * Solves Kepler's equation using binary search.
     * @param e - Eccentricity
     * @param m - Mean anomaly in radians
     * @returns Eccentric anomaly in radians
     */
    kepler3(e: number, m: number): number;

    /**
     * Returns an approximate solution to Kepler's equation for small eccentricities.
     * @param e - Eccentricity
     * @param m - Mean anomaly in radians
     * @returns Eccentric anomaly in radians
     */
    kepler4(e: number, m: number): number;
  }

  interface Line {
    /**
     * Computes the time at which a moving body is on a straight line (great circle)
     * between two fixed points, such as stars.
     *
     * @param r1 - Right ascension of the first point in radians
     * @param d1 - Declination of the first point in radians
     * @param r2 - Right ascension of the second point in radians
     * @param d2 - Declination of the second point in radians
     * @param r3 - Array of right ascensions for the moving body
     * @param d3 - Array of declinations for the moving body
     * @param t1 - Starting time in Julian Days
     * @param t5 - Ending time in Julian Days
     * @returns Time of alignment in Julian Days
     * @throws Error if input arrays are not of length 5 or if other conditions are not met
     */
    time(r1: number, d1: number, r2: number, d2: number, r3: number[], d3: number[], t1: number, t5: number): number;

    /**
     * Computes the angle between great circles defined by three points.
     *
     * @param r1 - Right ascension of the first point in radians
     * @param d1 - Declination of the first point in radians
     * @param r2 - Right ascension of the second point in radians
     * @param d2 - Declination of the second point in radians
     * @param r3 - Right ascension of the third point in radians
     * @param d3 - Declination of the third point in radians
     * @returns Angle between the two lines in radians
     */
    angle(r1: number, d1: number, r2: number, d2: number, r3: number, d3: number): number;

    /**
     * Computes an error angle of three nearly co-linear points.
     *
     * @param r1 - Right ascension of the first point in radians
     * @param d1 - Declination of the first point in radians
     * @param r2 - Right ascension of the second point in radians
     * @param d2 - Declination of the second point in radians
     * @param r0 - Right ascension of the reference point in radians
     * @param d0 - Declination of the reference point in radians
     * @returns Error angle in radians
     */
    error(r1: number, d1: number, r2: number, d2: number, r0: number, d0: number): number;

    /**
     * Computes both an angle and an error angle based on three points.
     *
     * @param r1 - Right ascension of the first point in radians
     * @param d1 - Declination of the first point in radians
     * @param r2 - Right ascension of the second point in radians
     * @param d2 - Declination of the second point in radians
     * @param r3 - Right ascension of the third point in radians
     * @param d3 - Declination of the third point in radians
     * @returns An array containing [ψ, ω], where ψ is the angle and ω is the error angle.
     */
    angleError(r1: number, d1: number, r2: number, d2: number, r3: number, d3: number): [number, number];
  }

  interface NearParabolicElements {
    timeP: number; // Time of perihelion (T)
    pDis: number; // Perihelion distance (q) in AU
    ecc: number; // Eccentricity (e)

    /**
     * Computes the true anomaly and distance for near-parabolic orbits.
     * @param jde - Julian ephemeris day
     * @returns An object containing:
     *    {number} ano - True anomaly (ν) in radians
     *    {number} dist - Distance (r) in AU
     *    {Error | null} err - Error if convergence fails, otherwise null
     */
    anomalyDistance(jde: number): { ano: number; dist: number; err: Error | null };
  }

  interface NearParabolic {
    Elements: new (timeP: number, pDis: number, ecc: number) => NearParabolicElements;
  }

  interface Node {
    /**
     * Computes time and distance of passage through the ascending node of a body in an elliptical orbit.
     * @param axis - Semimajor axis in AU
     * @param ecc - Eccentricity
     * @param argP - Argument of perihelion in radians
     * @param timeP - Time of perihelion as Julian Day
     * @returns [jde, r] - Julian Day of the event and distance from the Sun in AU
     */
    ellipticAscending(axis: number, ecc: number, argP: number, timeP: number): [number, number];

    /**
     * Computes time and distance of passage through the descending node of a body in an elliptical orbit.
     * @param axis - Semimajor axis in AU
     * @param ecc - Eccentricity
     * @param argP - Argument of perihelion in radians
     * @param timeP - Time of perihelion as Julian Day
     * @returns [jde, r] - Julian Day of the event and distance from the Sun in AU
     */
    ellipticDescending(axis: number, ecc: number, argP: number, timeP: number): [number, number];

    /**
     * Computes time and distance of passage through the ascending node of a body in a parabolic orbit.
     * @param q - Perihelion distance in AU
     * @param argP - Argument of perihelion in radians
     * @param timeP - Time of perihelion as Julian Day
     * @returns [jde, r] - Julian Day of the event and distance from the Sun in AU
     */
    parabolicAscending(q: number, argP: number, timeP: number): [number, number];

    /**
     * Computes time and distance of passage through the descending node of a body in a parabolic orbit.
     * @param q - Perihelion distance in AU
     * @param argP - Argument of perihelion in radians
     * @param timeP - Time of perihelion as Julian Day
     * @returns [jde, r] - Julian Day of the event and distance from the Sun in AU
     */
    parabolicDescending(q: number, argP: number, timeP: number): [number, number];

    /**
     * Computes the position based on eccentric anomaly for elliptical orbits.
     * @param ν - True anomaly in radians
     * @param axis - Semimajor axis in AU
     * @param ecc - Eccentricity
     * @param timeP - Time of perihelion as Julian Day
     * @returns [jde, r] - Julian Day and distance from the Sun in AU
     */
    el(ν: number, axis: number, ecc: number, timeP: number): [number, number];
  }

  interface Nutation {
    /**
     * Returns nutation in longitude (Δψ) and nutation in obliquity (Δε) for a given Julian Ephemeris Day (JDE).
     * Computation is based on the 1980 IAU theory.
     *
     * @param jde - Julian Ephemeris Day
     * @returns [Δψ, Δε] - Nutation in longitude and obliquity in radians
     */
    nutation(jde: number): [number, number];

    /**
     * Returns a fast approximation of nutation in longitude (Δψ) and nutation in obliquity (Δε) for a given JDE.
     *
     * @param jde - Julian Ephemeris Day
     * @returns [Δψ, Δε] - Approximate nutation in longitude and obliquity in radians
     */
    approxNutation(jde: number): [number, number];

    /**
     * Returns mean obliquity (ε₀) following the IAU 1980 polynomial.
     *
     * @param jde - Julian Ephemeris Day
     * @returns Mean obliquity (ε₀) in radians
     */
    meanObliquity(jde: number): number;

    /**
     * Returns mean obliquity (ε₀) following the Laskar 1986 polynomial.
     *
     * @param jde - Julian Ephemeris Day
     * @returns Mean obliquity (ε₀) in radians
     */
    meanObliquityLaskar(jde: number): number;

    /**
     * Returns "nutation in right ascension" or "equation of the equinoxes."
     *
     * @param jde - Julian Ephemeris Day
     * @returns Nutation in right ascension in radians
     */
    nutationInRA(jde: number): number;
  }

  interface Mars {
    /**
     * Computes quantities for physical observations of Mars.
     * @param jde - Julian ephemeris day
     * @param earth - Planet object representing Earth
     * @param mars - Planet object representing Mars
     * @returns {Array} - Contains:
     *    {number} DE - Planetocentric declination of the Earth.
     *    {number} DS - Planetocentric declination of the Sun.
     *    {number} ω - Areographic longitude of the central meridian, as seen from Earth.
     *    {number} P - Geocentric position angle of Mars' northern rotation pole.
     *    {number} Q - Position angle of greatest defect of illumination.
     *    {number} d - Apparent diameter of Mars.
     *    {number} k - Illuminated fraction of the disk.
     *    {number} q - Greatest defect of illumination.
     */
    physical(jde: number, earth: any, mars: any): [number, number, number, number, number, number, number, number];
  }

  interface Moon {
    /**
     * Computes quantities useful for physical observation of the Moon.
     * @param jde - Julian ephemeris day
     * @param earth - Planet object representing Earth
     * @returns {Array} - Contains:
     *    {base.Coord} cMoon - Selenographic longitude and latitude of the Moon.
     *    {number} P - Position angle of the Moon's axis of rotation.
     *    {base.Coord} cSun - Selenographic longitude and latitude of the Sun.
     */
    physical(jde: number, earth: any): [base.Coord, number, base.Coord];

    /**
     * Returns the altitude of the Sun above the lunar horizon.
     * @param cOnMoon - Selenographic coordinates of a site on the Moon
     * @param cSun - Selenographic coordinates of the Sun
     * @returns Altitude in radians
     */
    sunAltitude(cOnMoon: base.Coord, cSun: base.Coord): number;

    /**
     * Returns the time of sunrise for a point on the Moon near the given date.
     * @param cOnMoon - Selenographic coordinates of a site on the Moon
     * @param jde - Julian ephemeris day
     * @param earth - Planet object representing Earth
     * @returns Time of sunrise as Julian Day nearest to the given JDE
     */
    sunrise(cOnMoon: base.Coord, jde: number, earth: any): number;

    /**
     * Returns the time of sunset for a point on the Moon near the given date.
     * @param cOnMoon - Selenographic coordinates of a site on the Moon
     * @param jde - Julian ephemeris day
     * @param earth - Planet object representing Earth
     * @returns Time of sunset as Julian Day nearest to the given JDE
     */
    sunset(cOnMoon: base.Coord, jde: number, earth: any): number;

    /**
     * Converts latitude and longitude to selenographic coordinates.
     * @param η - Longitude in radians
     * @param θ - Latitude in radians
     * @returns A base.Coord object representing selenographic coordinates
     */
    lunarCoord(η: number, θ: number): base.Coord;

    /**
     * Returns selenographic coordinates for various lunar features.
     */
    selenographic: {
      [key: string]: base.Coord; // Keyed by feature name (e.g., "tycho", "gassendi")
    };
  }

  interface MoonIllum {
    /**
     * Computes the phase angle of the Moon given equatorial coordinates.
     * @param cMoon - Geocentric right ascension, declination, and distance to the Moon
     * @param cSun - Coordinates and distance of the Sun
     * @returns Phase angle of the Moon in radians
     */
    phaseAngleEquatorial(cMoon: base.Coord, cSun: base.Coord): number;

    /**
     * Computes a less accurate phase angle of the Moon given equatorial coordinates.
     * @param cMoon - Geocentric right ascension and declination of the Moon
     * @param cSun - Coordinates of the Sun
     * @returns Phase angle of the Moon in radians
     */
    phaseAngleEquatorial2(cMoon: base.Coord, cSun: base.Coord): number;

    /**
     * Computes the phase angle of the Moon given ecliptic coordinates.
     * @param cMoon - Geocentric longitude, latitude, and distance to the Moon
     * @param cSun - Longitude and distance to the Sun
     * @returns Phase angle of the Moon in radians
     */
    phaseAngleEcliptic(cMoon: base.Coord, cSun: base.Coord): number;

    /**
     * Computes a less accurate phase angle of the Moon given ecliptic coordinates.
     * @param cMoon - Geocentric longitude and latitude of the Moon
     * @param cSun - Longitude of the Sun
     * @returns Phase angle of the Moon in radians
     */
    phaseAngleEcliptic2(cMoon: base.Coord, cSun: base.Coord): number;

    /**
     * Computes the phase angle of the Moon for a given Julian Day.
     * This method is less accurate than those taking coordinates.
     * @param jde - Julian ephemeris day
     * @returns Phase angle of the Moon in radians
     */
    phaseAngle3(jde: number): number;
  }

  interface MoonMaxDec {
    /**
     * Computes the maximum northern declination of the Moon near a given date.
     * @param y - Decimal year specifying a date near the event
     * @returns {Array} - Contains:
     *    {number} jde - Julian ephemeris day of the event nearest to the given date
     *    {number} δ - Declination of the Moon at that time
     */
    north(y: number): [number, number];

    /**
     * Computes the maximum southern declination of the Moon near a given date.
     * @param y - Decimal year specifying a date near the event
     * @returns {Array} - Contains:
     *    {number} jde - Julian ephemeris day of the event nearest to the given date
     *    {number} δ - Declination of the Moon at that time
     */
    south(y: number): [number, number];
  }

  interface MoonNode {
    /**
     * Computes the date of passage of the Moon through an ascending node.
     * @param year - Decimal year specifying a date near the event
     * @returns JDE of the event nearest to the given date
     */
    ascending(year: number): number;

    /**
     * Computes the date of passage of the Moon through a descending node.
     * @param year - Decimal year specifying a date near the event
     * @returns JDE of the event nearest to the given date
     */
    descending(year: number): number;
  }

  interface MoonPhase {
    /**
     * Mean synodial lunar month in days.
     */
    meanLunarMonth: number;

    /**
     * Returns the Julian Ephemeris Day (JDE) of the mean New Moon nearest the given year.
     * @param year - Decimal year
     * @returns JDE of the mean New Moon
     */
    meanNew(year: number): number;

    /**
     * Returns the Julian Ephemeris Day (JDE) of the mean First Quarter Moon nearest the given year.
     * @param year - Decimal year
     * @returns JDE of the mean First Quarter Moon
     */
    meanFirst(year: number): number;

    /**
     * Returns the Julian Ephemeris Day (JDE) of the mean Full Moon nearest the given year.
     * @param year - Decimal year
     * @returns JDE of the mean Full Moon
     */
    meanFull(year: number): number;

    /**
     * Returns the Julian Ephemeris Day (JDE) of the mean Last Quarter Moon nearest the given year.
     * @param year - Decimal year
     * @returns JDE of the mean Last Quarter Moon
     */
    meanLast(year: number): number;

    /**
     * Returns the Julian Ephemeris Day (JDE) of New Moon nearest the given year.
     * @param year - Decimal year
     * @returns JDE of New Moon
     */
    newMoon(year: number): number;

    /**
     * Returns the Julian Ephemeris Day (JDE) of First Quarter Moon nearest the given year.
     * @param year - Decimal year
     * @returns JDE of First Quarter Moon
     */
    first(year: number): number;

    /**
     * Returns the Julian Ephemeris Day (JDE) of Full Moon nearest the given year.
     * @param year - Decimal year
     * @returns JDE of Full Moon
     */
    full(year: number): number;

    /**
     * Returns the Julian Ephemeris Day (JDE) of Last Quarter Moon nearest the given year.
     * @param year - Decimal year
     * @returns JDE of Last Quarter Moon
     */
    last(year: number): number;
  }

  interface MoonPosition {
    /**
     * Computes the equatorial horizontal parallax of the Moon.
     * @param distance - Distance between centers of the Earth and Moon, in km
     * @returns Equatorial horizontal parallax in radians
     */
    parallax(distance: number): number;

    /**
     * Returns the geocentric location of the Moon.
     * Results are referenced to mean equinox of date and do not include the effect of nutation.
     * @param jde - Julian ephemeris day
     * @returns {Coord} - Contains:
     *    {number} lon - Geocentric longitude (λ) in radians
     *    {number} lat - Geocentric latitude (β) in radians
     *    {number} range - Distance (Δ) between centers of the Earth and Moon, in km
     */
    position(jde: number): base.Coord;

    /**
     * Returns the longitude of the mean ascending node of the lunar orbit.
     * @param jde - Julian ephemeris day
     * @returns Longitude of the mean ascending node in radians
     */
    node(jde: number): number;

    /**
     * Returns the longitude of perigee of the lunar orbit.
     * @param jde - Julian ephemeris day
     * @returns Longitude of perigee in radians
     */
    perigee(jde: number): number;

    /**
     * Returns the longitude of the true ascending node.
     * That is, the node of the instantaneous lunar orbit.
     * @param jde - Julian ephemeris day
     * @returns Longitude of the true ascending node in radians
     */
    trueNode(jde: number): number;
  }

  interface ParabolicElements {
    timeP: number; // Time of perihelion (T)
    pDis: number; // Perihelion distance (q) in AU

    /**
     * Computes true anomaly and distance for a body in a parabolic orbit.
     * @param jde - Julian ephemeris day
     * @returns {Object} - Contains:
     *    {number} ano - True anomaly (ν) in radians
     *    {number} dist - Distance (r) in AU
     */
    anomalyDistance(jde: number): { ano: number; dist: number };
  }

  interface Parabolic {
    Elements: new (timeP: number, pDis: number) => ParabolicElements;
  }

  interface Parallax {
    /**
     * Computes the equatorial horizontal parallax of a body.
     * @param distance - Distance between centers of the Earth and Moon, in km
     * @returns Equatorial horizontal parallax in radians
     */
    horizontal(distance: number): number;

    /**
     * Returns topocentric positions including parallax.
     * @param c - Geocentric right ascension and declination in radians
     * @param ρsφ - Parallax constants (see package globe)
     * @param ρcφ - Parallax constants (see package globe)
     * @param lon - Geographic longitude of the observer (measured positively westwards)
     * @param jde - Time of observation
     * @returns {Coord} Observed topocentric right ascension and declination in radians
     */
    topocentric(c: base.Coord, ρsφ: number, ρcφ: number, lon: number, jde: number): base.Coord;

    /**
     * Returns topocentric corrections including parallax using a non-rigorous method.
     * @param c - Geocentric right ascension and declination in radians
     * @param ρsφ - Parallax constants (see package globe)
     * @param ρcφ - Parallax constants (see package globe)
     * @param lon - Geographic longitude of the observer (measured positively westwards)
     * @param jde - Time of observation
     * @returns {Coord} Observed topocentric right ascension and declination in radians
     */
    topocentric2(c: base.Coord, ρsφ: number, ρcφ: number, lon: number, jde: number): base.Coord;

    /**
     * Returns topocentric hour angle and declination including parallax using an alternative method.
     * @param c - Geocentric right ascension and declination in radians
     * @param ρsφ - Parallax constants (see package globe)
     * @param ρcφ - Parallax constants (see package globe)
     * @param lon - Geographic longitude of the observer (measured positively westwards)
     * @param jde - Time of observation
     * @returns {Array} [H_, δ_] - Topocentric hour angle and declination in radians
     */
    topocentric3(c: base.Coord, ρsφ: number, ρcφ: number, lon: number, jde: number): [number, number];

    /**
     * Returns topocentric ecliptical coordinates including parallax.
     * @param c - Geocentric ecliptical coordinates of a body
     * @param s - Geocentric semidiameter of the body
     * @param φ - Observer's latitude
     * @param h - Observer's height above the ellipsoid in meters
     * @param ε - Obliquity of the ecliptic
     * @param θ - Local sidereal time
     * @param π - Equatorial horizontal parallax of the body
     * @returns {Array} [λ_, β_, s_] - Observed topocentric ecliptical longitude, latitude, and semidiameter
     */
    topocentricEcliptical(c: base.Coord, s: number, φ: number, h: number, ε: number, θ: number, π: number): [number, number, number];
  }

  interface Parallactic {
    /**
     * Computes the parallactic angle of a celestial object.
     * @param φ - Geographic latitude of the observer (in radians)
     * @param δ - Declination of the observed object (in radians)
     * @param H - Hour angle of the observed object (in radians)
     * @returns Parallactic angle in radians
     */
    parallacticAngle(φ: number, δ: number, H: number): number;

    /**
     * Computes the parallactic angle of a celestial object when it is on the horizon.
     * @param φ - Geographic latitude of the observer (in radians)
     * @param δ - Declination of the observed object (in radians)
     * @returns Parallactic angle in radians
     */
    parallacticAngleOnHorizon(φ: number, δ: number): number;

    /**
     * Computes how the plane of the ecliptic intersects the horizon at a given local sidereal time.
     * @param ε - Obliquity of the ecliptic (in radians)
     * @param φ - Geographic latitude of the observer (in radians)
     * @param θ - Local sidereal time expressed as an hour angle (in radians)
     * @returns {Array} - Contains:
     *    {number} λ1 - Ecliptic longitude where the ecliptic intersects the horizon
     *    {number} λ2 - Ecliptic longitude where the ecliptic intersects the horizon (λ1 + π)
     *    {number} I - Angle at which the ecliptic intersects the horizon
     */
    eclipticAtHorizon(ε: number, φ: number, θ: number): [number, number, number];

    /**
     * Computes the angle between the ecliptic and parallels of ecliptic latitude at a given ecliptic longitude.
     * @param λ - Ecliptic longitude (in radians)
     * @param ε - Obliquity of the ecliptic (in radians)
     * @returns Angle between the ecliptic and parallels of latitude in radians
     */
    eclipticAtEquator(λ: number, ε: number): number;

    /**
     * Computes the angle of the path a celestial object relative to the horizon at rising or setting.
     * @param δ - Declination of the object (in radians)
     * @param φ - Geographic latitude of observer (in radians)
     * @returns Angle of diurnal path at horizon in radians
     */
    diurnalPathAtHorizon(δ: number, φ: number): number;
  }

  interface Perihelion {
    /**
     * Planet constants for perihelion and aphelion functions.
     */
    planetsEnum: {
      mercury: number;
      venus: number;
      earth: number;
      mars: number;
      jupiter: number;
      saturn: number;
      uranus: number;
      neptune: number;
      embary: number;
    };

    /**
     * Returns the Julian Ephemeris Day (JDE) of the perihelion event nearest the given year.
     * @param p - Planet constant from planetsEnum
     * @param year - Decimal year specifying a date near the perihelion event
     * @returns JDE of the perihelion event
     */
    perihelion(p: number, year: number): number;

    /**
     * Returns the Julian Ephemeris Day (JDE) of the aphelion event nearest the given year.
     * @param p - Planet constant from planetsEnum
     * @param year - Decimal year specifying a date near the aphelion event
     * @returns JDE of the aphelion event
     */
    aphelion(p: number, year: number): number;

    /**
     * Returns the Julian Ephemeris Day (JDE) of the perihelion event nearest to the given year,
     * with specified precision and optional callback for asynchronous processing.
     * @param planet - VSOP87 planet (EMBary is not allowed)
     * @param year - Decimal year near the perihelion event
     * @param precision - Desired precision of the time result, in days
     * @param cb - Optional callback function for asynchronous processing
     * @returns [jde, r] - JDE of the event and distance from the Sun in AU
     */
    perihelion2(planet: any, year: number, precision: number, cb?: (result: [number, number]) => void): [number, number];

    /**
     * Returns the Julian Ephemeris Day (JDE) of the aphelion event nearest to the given year,
     * with specified precision and optional callback for asynchronous processing.
     * @param planet - VSOP87 planet (EMBary is not allowed)
     * @param year - Decimal year near the aphelion event
     * @param precision - Desired precision of the time result, in days
     * @param cb - Optional callback function for asynchronous processing
     * @returns [jde, r] - JDE of the event and distance from the Sun in AU
     */
    aphelion2(planet: any, year: number, precision: number, cb?: (result: [number, number]) => void): [number, number];
  }

  interface Caa {
    c: number; // Coefficient for additional angles
    f: number; // Frequency for additional angles
  }

  interface Ca {
    A: number; // Constant A from table
    B: number; // Constant B from table
    M0: number; // Initial mean anomaly
    M1: number; // Mean anomaly rate
  }

  interface Planetary {
    /**
     * Computes intermediate values for a mean planetary configuration.
     * @param y - Decimal year
     * @param a - Coefficients from Table 36.A
     * @returns [J, M, T] - Julian Day, Mean anomaly, and Time in Julian centuries
     */
    mean(y: number, a: Ca): [number, number, number];

    /**
     * Computes a sum of periodic terms.
     * @param T - Time in Julian centuries
     * @param M - Mean anomaly
     * @param c - Coefficients for periodic terms
     * @returns Sum of periodic terms
     */
    sum(T: number, M: number, c: number[][]): number;

    /**
     * Computes a mean time corrected by a sum.
     * @param y - Decimal year
     * @param a - Coefficients from Table 36.A
     * @param c - Coefficients for periodic terms
     * @returns Corrected mean time
     */
    ms(y: number, a: Ca, c: number[][]): number;

    /**
     * Returns the time of an inferior conjunction of Mercury.
     * @param year - Decimal year near the event
     * @returns JDE of the event
     */
    mercuryInfConj(year: number): number;

    /**
     * Returns the time of a superior conjunction of Mercury.
     * @param year - Decimal year near the event
     * @returns JDE of the event
     */
    mercurySupConj(year: number): number;

    /**
     * Returns the time of an inferior conjunction of Venus.
     * @param year - Decimal year near the event
     * @returns JDE of the event
     */
    venusInfConj(year: number): number;

    /**
     * Returns the time of an opposition of Mars.
     * @param year - Decimal year near the event
     * @returns JDE of the event
     */
    marsOpp(year: number): number;

    /**
     * Computes a sum of periodic terms with "additional angles".
     * @param T - Time in Julian centuries
     * @param M - Mean anomaly
     * @param c - Coefficients for periodic terms
     * @param aa - Additional angle coefficients
     * @returns Sum of periodic terms with additional angles
     */
    sumA(T: number, M: number, c: number[][], aa: Caa[]): number;

    /**
     * Returns a mean time corrected by a sum with additional angles.
     * @param y - Decimal year
     * @param a - Coefficients from Table 36.A
     * @param c - Coefficients for periodic terms
     * @param aa - Additional angle coefficients
     * @returns Corrected mean time
     */
    msa(y: number, a: Ca, c: number[][], aa: Caa[]): number;

    /**
     * Returns the time of an opposition of Jupiter.
     * @param year - Decimal year near the event
     * @returns JDE of the event
     */
    jupiterOpp(year: number): number;

    /**
     * Returns the time of an opposition of Saturn.
     * @param year - Decimal year near the event
     * @returns JDE of the event
     */
    saturnOpp(year: number): number;

    /**
    Returns the time of a conjunction of Saturn.
    @param year - Decimal year near the event 
    @returns JDE of the event 
    */
    saturnConj(year: number): number;

    /**
    Returns the time of an opposition of Uranus.
    @param year - Decimal year near the event 
    @returns JDE of the event 
    */
    uranusOpp(year: number): number;

    /**
    Returns the time of an opposition of Neptune.
    @param year - Decimal year near the event 
    @returns JDE of the event 
    */
    neptuneOpp(year: number): number;

    /**
    Computes time and elongation for greatest elongation events.
    @param y - Decimal year near the event 
    @param a - Coefficients from Table 36.A 
    @param t - Periodic term coefficients 
    @param e - Additional angle coefficients 
    */
    el(y: number, a: Ca, t: any[][], e: any[][]): [number, number];

    /**
    Returns time and elongation for greatest eastern elongation of Mercury.
    @param y - Decimal year near the event 
    */
    mercuryEastElongation(y: number): [number, number];

    /**
    Returns time and elongation for greatest western elongation of Mercury.
    @param y - Decimal year near the event 
    */
    mercuryWestElongation(y: number): [number, number];
  }

  interface Planet {
    /**
     * Computes the geocentric position of the planet using the full VSOP87 theory.
     * @param jde - Julian ephemeris day
     * @returns {Coord} - Contains:
     *    {number} lon - Heliocentric longitude in radians
     *    {number} lat - Heliocentric latitude in radians
     *    {number} range - Heliocentric range in AU
     */
    position2000(jde: number): Coord;

    /**
     * Computes the geocentric position of the planet at equinox and ecliptic of date.
     * @param jde - Julian ephemeris day
     * @returns {Coord} - Contains:
     *    {number} lon - Heliocentric longitude in radians
     *    {number} lat - Heliocentric latitude in radians
     *    {number} range - Heliocentric range in AU
     */
    position(jde: number): Coord;
  }

  interface PlanetPosition {
    /**
     * Computes a sum of periodic terms for planetary positions.
     * @param t - Time in Julian centuries
     * @param series - Coefficients for periodic terms
     * @returns Sum of periodic terms
     */
    sum(t: number, series: any): number;

    /**
     * Converts ecliptic coordinates from dynamical frame to FK5.
     * @param lon - Ecliptic longitude in radians
     * @param lat - Ecliptic latitude in radians
     * @param jde - Julian ephemeris day
     * @returns {Coord} - FK5 coordinates containing:
     *    {number} lon - FK5 longitude
     *    {number} lat - FK5 latitude
     */
    toFK5(lon: number, lat: number, jde: number): Coord;

    /**
     * Creates a new instance of a planet with its corresponding data series.
     * @param planetData - The VSOP87 data series for the planet
     */
    Planet: new (planetData: any) => Planet;
  }

  interface OrbitalElements {
    lon: number; // Mean longitude (L) in radians
    axis: number; // Semimajor axis (a) in AU
    ecc: number; // Eccentricity (e)
    inc: number; // Inclination (i) in radians
    node: number; // Longitude of ascending node (Ω) in radians
    peri: number; // Longitude of perihelion (ϖ) in radians
  }

  interface PlanetElements {
    /**
     * Returns mean orbital elements for a specified planet.
     * @param p - Planet constant (e.g., 'mercury', 'venus', etc.)
     * @param jde - Julian ephemeris day
     * @param e - An instance of Elements to store the results
     * @returns {OrbitalElements} - Mean orbital elements for the planet
     */
    mean(p: string, jde: number, e: OrbitalElements): OrbitalElements;

    /**
     * Returns mean inclination for a specified planet at a given date.
     * @param p - Planet constant (e.g., 'mercury', 'venus', etc.)
     * @param jde - Julian ephemeris day
     * @returns Mean inclination in radians
     */
    inc(p: string, jde: number): number;

    /**
     * Returns mean longitude of ascending node for a specified planet at a given date.
     * @param p - Planet constant (e.g., 'mercury', 'venus', etc.)
     * @param jde - Julian ephemeris day
     * @returns Mean longitude of ascending node in radians
     */
    node(p: string, jde: number): number;
  }

  interface Pluto {
    /**
     * Returns the J2000 heliocentric coordinates of Pluto.
     * Results include solar longitude and latitude in radians, and distance in AU.
     * @param jde - Julian ephemeris day
     * @returns {Object} - Contains:
     *    {number} lon - Heliocentric longitude in radians
     *    {number} lat - Heliocentric latitude in radians
     *    {number} range - Distance from the Sun in AU
     */
    heliocentric(jde: number): { lon: number; lat: number; range: number };

    /**
     * Returns the J2000 astrometric coordinates of Pluto.
     * @param jde - Julian ephemeris day
     * @param earth - Planet object representing Earth
     * @returns {Coord} - Astrometric coordinates of Pluto
     */
    astrometric(jde: number, earth: any): base.Coord;
  }

  interface Precess {
    /**
     * Computes the approximate annual precession of a celestial object.
     * @param eqFrom - Equatorial coordinates of the object
     * @param epochFrom - Initial epoch in Julian years
     * @param epochTo - Final epoch in Julian years
     * @returns {Object} - Contains:
     *    {number} ra - Seconds of right ascension
     *    {number} dec - Seconds of declination
     */
    approxAnnualPrecession(eqFrom: coord.Equatorial, epochFrom: number, epochTo: number): { ra: number; dec: number };

    /**
     * Returns mean time corrected by a sum for a given epoch.
     * @param epochFrom - Initial epoch in Julian years
     * @param epochTo - Final epoch in Julian years
     * @returns {number[]} - Array containing mean time and other values
     */
    mn(epochFrom: number, epochTo: number): number[];

    /**
     * Computes a simple and quick precession while considering proper motion.
     * @param eqFrom - Equatorial coordinates of the object at the initial epoch
     * @param epochFrom - Initial epoch in Julian years
     * @param epochTo - Final epoch in Julian years
     * @param mα - Proper motion in right ascension (in radians)
     * @param mδ - Proper motion in declination (in radians)
     * @returns {coord.Equatorial} - New equatorial coordinates after precession
     */
    approxPosition(eqFrom: coord.Equatorial, epochFrom: number, epochTo: number, mα: number, mδ: number): coord.Equatorial;

    /**
     * Constructs a Precessor object to precess coordinates from one epoch to another.
     */
    Precessor: new (epochFrom: number, epochTo: number) => {
      /**
       * Precesses coordinates eqFrom, leaving result in eqTo.
       * @param eqFrom - Equatorial coordinates to be precessed
       * @returns {coord.Equatorial} - Precessed equatorial coordinates
       */
      precess(eqFrom: coord.Equatorial): coord.Equatorial;
    };

    /**
     * Computes the ecliptic position from one epoch to another, including proper motions.
     * @param eclFrom - Ecliptic coordinates at the initial epoch
     * @param epochFrom - Initial epoch in Julian years
     * @param epochTo - Final epoch in Julian years
     * @param mα - Proper motion in ecliptic longitude (in radians)
     * @param mδ - Proper motion in ecliptic latitude (in radians)
     * @returns {coord.Ecliptic} - New ecliptic coordinates after precession
     */
    eclipticPosition(eclFrom: coord.Ecliptic, epochFrom: number, epochTo: number, mα: number, mδ: number): coord.Ecliptic;

    /**
     * Computes proper motion corrections from 3D equatorial coordinates.
     * @param eqFrom - Equatorial coordinates at the initial epoch
     * @param epochFrom - Initial epoch in Julian years
     * @param epochTo - Final epoch in Julian years
     * @param r - Radial distance (in parsecs)
     * @param mr - Radial velocity (in parsecs per year)
     * @param mα - Proper motion in right ascension (in radians)
     * @param mδ - Proper motion in declination (in radians)
     * @returns {coord.Equatorial} - New equatorial coordinates after applying proper motion corrections
     */
    properMotion3D(eqFrom: coord.Equatorial, epochFrom: number, epochTo: number, r: number, mr: number, mα: number, mδ: number): coord.Equatorial;
  }

  interface Refraction {
    /**
     * Computes the refraction for obtaining true altitude when altitude is greater than 15 degrees.
     * @param h0 - Measured apparent altitude of a celestial body in radians
     * @returns Refraction to be subtracted from h0 to obtain true altitude (in radians)
     */
    gt15True(h0: number): number;

    /**
     * Computes the refraction for obtaining apparent altitude when altitude is greater than 15 degrees.
     * @param h - Computed true "airless" altitude of a celestial body in radians
     * @returns Refraction to be added to h to obtain apparent altitude (in radians)
     */
    gt15Apparent(h: number): number;

    /**
     * Computes the refraction for obtaining true altitude.
     * @param h0 - Measured apparent altitude of a celestial body in radians
     * @returns Refraction to be subtracted from h0 to obtain true altitude (in radians)
     */
    bennett(h0: number): number;

    /**
     * Computes a more accurate refraction for obtaining true altitude.
     * Similar to Bennett, but includes a correction for improved accuracy.
     * @param h0 - Measured apparent altitude of a celestial body in radians
     * @returns Corrected refraction (in radians)
     */
    bennett2(h0: number): number;

    /**
     * Computes the refraction for obtaining apparent altitude.
     * @param h - Computed true "airless" altitude of a celestial body in radians
     * @returns Refraction to be added to h to obtain apparent altitude (in radians)
     */
    saemundsson(h: number): number;
  }

  interface RiseObj {
    rise: number; // Time of rise in seconds
    transit: number; // Time of transit in seconds
    set: number; // Time of set in seconds
  }

  interface PlanetRiseOptions {
    date?: boolean; // Return times as Date objects
    refraction?: number; // Use different refraction than standard
  }

  interface PlanetRise {
    /**
     * Constructs a PlanetRise object for computing rise, transit, and set times.
     * @param jd - Julian Day starting at midnight or Date object
     * @param lat - Geographic latitude of the observer in degrees
     * @param lon - Geographic longitude of the observer in degrees (measured positively westward)
     * @param earth - VSOP87 planet object for Earth
     * @param planet - VSOP87 planet object of the observed body
     * @param opts - Optional parameters for configuration
     */
    constructor(jd: number | Date, lat: number, lon: number, earth: any, planet: any, opts?: PlanetRiseOptions);

    /**
     * Computes approximate rise, transit, and set times for a celestial object.
     * @returns {RiseObj} - Result containing rise, transit, and set times in seconds
     */
    approxTimes(): RiseObj;

    /**
     * Computes exact rise, transit, and set times for a celestial object.
     * @returns {RiseObj} - Result containing rise, transit, and set times in seconds
     */
    times(): RiseObj;
  }

  interface Rise {
    errorAboveHorizon: Error; // Error thrown when object is always above horizon
    errorBelowHorizon: Error; // Error thrown when object is always below horizon
    meanRefraction: number; // Mean refraction of the atmosphere in radians

    /**
     * Computes approximate rise, transit, and set times for a celestial object.
     * @param p - Geographic coordinates of the observer
     * @param h0 - Standard altitude of the body in radians
     * @param Th0 - Apparent sidereal time at 0h UT at Greenwich in seconds
     * @param α - Right ascension (in radians)
     * @param δ - Declination (in radians)
     * @returns {RiseObj} - Result containing rise, transit, and set times in seconds
     */
    approxTimes(p: any, h0: number, Th0: number, α: number, δ: number): RiseObj;

    /**
     * Computes exact rise, transit, and set times for a celestial object.
     * @param p - Geographic coordinates of the observer
     * @param ΔT - Delta T in seconds
     * @param h0 - Standard altitude of the body in radians
     * @param Th0 - Apparent sidereal time at 0h UT at Greenwich in seconds
     * @param α3 - Slices of three right ascensions (in radians)
     * @param δ3 - Slices of three declinations (in radians)
     * @returns {RiseObj} - Result containing rise, transit, and set times in seconds
     */
    times(p: any, ΔT: number, h0: number, Th0: number, α3: number[], δ3: number[]): RiseObj;

    /**
     * Standard altitude for stars with corrections for refraction.
     */
    stdh0Stellar(refraction?: number): number;

    /**
     * Standard altitude for solar observations with corrections for refraction.
     */
    stdh0Solar(refraction?: number): number;

    /**
     * Standard altitude for lunar observations with corrections for refraction.
     */
    stdh0LunarMean(refraction?: number): number;

    /**
     * Standard altitude for lunar observations considering parallax.
     */
    stdh0Lunar(π: number, refraction?: number): number;
  }

  interface PlanetElements {
    // /**
    //  * Represents the orbital elements of a planet.
    //  * @param {number} lon - Mean longitude (L) in radians
    //  * @param {number} axis - Semimajor axis (a) in AU
    //  * @param {number} ecc - Eccentricity (e)
    //  * @param {number} inc - Inclination (i) in radians
    //  * @param {number} node - Longitude of ascending node (Ω) in radians
    //  * @param {number} peri - Longitude of perihelion (ϖ) in radians
    //  */
    // new (lon?: number, axis?: number, ecc?: number, inc?: number, node?: number, peri?: number): {
    //   lon: number;
    //   axis: number;
    //   ecc: number;
    //   inc: number;
    //   node: number;
    //   peri: number;
    // };

    /**
     * Returns mean orbital elements for a specified planet.
     * @param p - Planet constant (e.g., 'mercury', 'venus', etc.)
     * @param jde - Julian ephemeris day
     * @returns {PlanetElements} - Mean orbital elements for the planet
     */
    mean(p: string, jde: number): PlanetElements;

    /**
     * Returns mean inclination for a specified planet at a given date.
     * @param p - Planet constant (e.g., 'mercury', 'venus', etc.)
     * @param jde - Julian ephemeris day
     * @returns Mean inclination in radians
     */
    inc(p: string, jde: number): number;

    /**
     * Returns mean longitude of ascending node for a specified planet at a given date.
     * @param p - Planet constant (e.g., 'mercury', 'venus', etc.)
     * @param jde - Julian ephemeris day
     * @returns Mean longitude of ascending node in radians
     */
    node(p: string, jde: number): number;
  }

  interface SaturnRing {
    /**
     * Computes quantities of the ring of Saturn.
     * @param jde - Julian ephemeris day
     * @param earth - VSOP87 planet object for Earth
     * @param saturn - VSOP87 planet object for Saturn
     * @returns {Array} - Contains:
     *    {number} B - Saturnicentric latitude of the Earth referred to the plane of the ring
     *    {number} Bʹ - Saturnicentric latitude of the Sun referred to the plane of the ring
     *    {number} ΔU - Difference between Saturnicentric longitudes of the Sun and Earth
     *    {number} P - Geometric position angle of the northern semiminor axis of the ring
     *    {number} aEdge - Major axis of the outer edge of the outer ring
     *    {number} bEdge - Minor axis of the outer edge of the outer ring
     */
    ring(jde: number, earth: any, saturn: any): [number, number, number, number, number, number];

    /**
     * Computes quantities required by illum.Saturn().
     * Same as ΔU and B returned by ring().
     * @param jde - Julian ephemeris day
     * @param earth - VSOP87 planet object for Earth
     * @param saturn - VSOP87 planet object for Saturn
     * @returns {Array} - Contains:
     *    {number} ΔU - Difference between Saturnicentric longitudes of the Sun and Earth
     *    {number} B - Saturnicentric latitude of the Earth referred to the plane of the ring
     */
    ub(jde: number, earth: any, saturn: any): [number, number];
  }

  // ! the rest is correct - - - - - the rest is correct - - - - - the rest is correct - - - - - the rest is correct - - - - - the rest is correct

  // ! the rest is correct - - - - - the rest is correct - - - - - the rest is correct - - - - - the rest is correct - - - - - the rest is correct

  // ! the rest is correct - - - - - the rest is correct - - - - - the rest is correct - - - - - the rest is correct - - - - - the rest is correct

  // ! the rest is correct - - - - - the rest is correct - - - - - the rest is correct - - - - - the rest is correct - - - - - the rest is correct

  // ! the rest is correct - - - - - the rest is correct - - - - - the rest is correct - - - - - the rest is correct - - - - - the rest is correct

  // ! the rest is correct - - - - - the rest is correct - - - - - the rest is correct - - - - - the rest is correct - - - - - the rest is correct

  interface SexaAngle {
    lon: number; // Mean longitude in radians
    axis: number; // Semimajor axis in AU
    ecc: number; // Eccentricity
    inc: number; // Inclination in radians
    node: number; // Longitude of ascending node in radians
    peri: number; // Longitude of perihelion in radians

    /**
     * Constructs a new Angle value from sign, degree, minute, and second components.
     * @param angleOrNeg - Angle in radians or sign (true if negative)
     * @param d - Degree (optional)
     * @param m - Minute (optional)
     * @param s - Second (optional)
     */
    new (angleOrNeg: number | boolean, d?: number, m?: number, s?: number): SexaAngle;

    /**
     * Sets the value of an Angle from degree, minute, and second components.
     * @param neg - Sign, true if negative
     * @param d - Degree
     * @param m - Minute
     * @param s - Second
     * @returns {SexaAngle} The updated Angle instance
     */
    setDMS(neg?: boolean, d?: number, m?: number, s?: number): SexaAngle;

    /**
     * Sets the angle in radians.
     * @param angle - Angle in radians
     * @returns {SexaAngle} The updated Angle instance
     */
    setAngle(angle: number): SexaAngle;

    /**
     * Returns the angle in radians.
     * @returns {number} Angle in radians
     */
    rad(): number;

    /**
     * Returns the angle in degrees.
     * @returns {number} Angle in degrees
     */
    deg(): number;

    /**
     * Converts to parsed sexagesimal angle components.
     * @returns {Array} [neg, d, m, s] - Components of the angle
     */
    toDMS(): [boolean, number, number, number];

    /**
     * Prints the angle in degrees using `d°m′s.ss″`.
     * @param precision - Precision of `s.ss`
     * @returns {string} String representation of the angle
     */
    toString(precision?: number): string;

    /**
     * Prints the angle in degrees using `d°.ff`.
     * @param precision - Precision of `.ff`
     * @returns {string} String representation of the angle
     */
    toDegString(precision?: number): string;
  }

  interface HourAngle extends SexaAngle {
    /**
     * Constructs a new HourAngle value from sign, hour, minute, and second components.
     * @param neg - Sign (true if negative)
     * @param h - Hour (int)
     * @param m - Minute (int)
     * @param s - Second (float)
     */
    new (neg: boolean, h: number, m: number, s: number): HourAngle;

    /**
     * Returns the hour angle as hours of time.
     * @returns {number} Hour angle in hours
     */
    hour(): number;

    /**
     * Prints the hour angle using `HʰMᵐs.ssˢ`.
     * @param precision - Precision of `s.ss`
     * @returns {string} String representation of the hour angle
     */
    toString(precision?: number): string;
  }

  interface Time {
    /**
     * Constructs a new Time value from sign or time in seconds.
     * If type is boolean, it indicates if negative; if type is number then it's time in seconds.
     * @param negOrTimeInSecs - Set true if negative; if type is number then time in seconds
     * @param h - Hour (optional)
     * @param m - Minute (optional)
     * @param s - Second (optional)
     */
    new (negOrTimeInSecs: boolean | number, h?: number, m?: number, s?: number): Time;

    /**
    Sets time from hours, minutes and seconds.
    @returns {Time} The updated Time instance
    */
    setHMS(neg?: boolean, h?: number, m?: number, s?: number): Time;

    /**
    Returns time in seconds.
    @returns {number} Time in seconds
    */
    sec(): number;

    /**
    Returns time in minutes.
    @returns {number} Time in minutes
    */
    min(): number;

    /**
    Returns time in hours.
    @returns {number} Time in hours
    */
    hour(): number;

    /**
    Returns time in days.
    @returns {number} Time in days
    */
    day(): number;

    /**
    Returns time in radians where 1 day = 2π radians.
    @returns {number} Time in radians
    */
    rad(): number;

    /**
    Converts time to HMS format.
    @returns {Array} [neg, h, m, s] - Components of time
    */
    toHMS(): [boolean, number, number, number];

    /**
    Prints time using `HʰMᵐs.ss`.
    @param precision - Precision of `s.ss`
    @returns {string} String representation of the time
    */
    toString(precision?: number): string;
  }

  interface Sexagesimal {
    SexaAngle: new (...args: any[]) => SexaAngle;
    HourAngle: new (...args: any[]) => HourAngle;
    RA: new (...args: any[]) => HourAngle;
    Time: new (...args: any[]) => Time;

    /**
     * Converts from parsed sexagesimal angle components to decimal degrees.
     *
     * @param neg - Sign (true if negative)
     * @param d - Degree (int)
     * @param m - Minute (int)
     * @param s - Second (float)
     *
     * @returns {number} Angle in degrees
     */
    DMSToDeg(neg: boolean, d: number, m: number, s: number): number;
    /**
     * Converts from decimal degrees to parsed sexagesimal angle component.
     *
     * @param deg - Angle in degrees
     *
     * @returns {Array} [neg, d, m, s]
     */
    degToDMS(deg: number): [boolean, number, number, number];
    /**
     * Converts from decimal degrees to radians.
     *
     * @param deg - Angle in degrees
     *
     * @returns {number} Angle in radians
     */
    angleFromDeg(deg: number): number;
    /**
     * Converts from minutes to radians.
     *
     * @param min - Angle in minutes
     *
     * @returns {number} Angle in radians
     */
    angleFromMin(min: number): number;
    /**
     * Converts from seconds to radians.
     *
     * @param sec - Angle in seconds
     *
     * @returns {number} Angle in radians
     */
    angleFromSec(sec: number): number;
    /**
     * Converts from an angle in radians to degrees.
     *
     * @param angle - Angle in radians
     *
     *  returns {number} Angle in degrees
     */
    degFromAngle(angle: number): number;
    /**
     * Converts an angle from radians to seconds.
     *
     *  returns {number} Time in seconds
     */
    secFromAngle(angle: number): number;
    /**
     * Converts an hour angle from radians to seconds.
     *
     *  returns {number} Time in seconds
     */
    secFromHourAngle(ha: number): number;
    /**
     * Separates fix i from fraction f.
     *
     *  returns {[number]} [i,f]
     */
    modf(float: number): [number, float];
  }

  interface Sidereal {
    /**
     * Returns values for use in computing sidereal time at Greenwich.
     * @param jd - Julian Days
     * @returns {number[]} - [century, fraction] where century is centuries from J2000 and fraction is the fraction of jd after 0h UT
     */
    JDToCFrac(jd: number): [number, number];

    /**
     * Returns mean sidereal time at Greenwich for a given JD.
     * @param jd - Julian Days
     * @returns {number} Mean sidereal time in seconds (range [0, 86400))
     */
    mean(jd: number): number;

    /**
     * Returns mean sidereal time at Greenwich at 0h UT on the given JD.
     * @param jd - Julian Days
     * @returns {number} Mean sidereal time in seconds (range [0, 86400))
     */
    mean0UT(jd: number): number;

    /**
     * Returns apparent sidereal time at Greenwich for the given JD.
     * @param jd - Julian Days
     * @returns {number} Apparent sidereal time in seconds (range [0, 86400))
     */
    apparent(jd: number): number;

    /**
     * Returns apparent sidereal time at Greenwich at 0h UT on the given JD.
     * @param jd - Julian Days
     * @returns {number} Apparent sidereal time in seconds (range [0, 86400))
     */
    apparent0UT(jd: number): number;
  }

  interface Solar {
    /**
     * Returns true geometric longitude and anomaly of the Sun referenced to the mean equinox of date.
     * @param T - Number of Julian centuries since J2000
     * @returns {Object} - Contains:
     *    {number} lon - True geometric longitude in radians
     *    {number} ano - True anomaly in radians
     */
    trueLongitude(T: number): { lon: number; ano: number };

    /**
     * Returns the mean anomaly of Earth at the given T.
     * @param T - Number of Julian centuries since J2000
     * @returns {number} Mean anomaly in radians
     */
    meanAnomaly(T: number): number;

    /**
     * Returns the eccentricity of Earth's orbit around the Sun.
     * @param T - Number of Julian centuries since J2000
     * @returns {number} Eccentricity of Earth's orbit
     */
    eccentricity(T: number): number;

    /**
     * Returns the Sun-Earth distance in AU.
     * @param T - Number of Julian centuries since J2000
     * @returns {number} Sun-Earth distance in AU
     */
    radius(T: number): number;

    /**
     * Returns apparent longitude of the Sun referenced to the true equinox of date.
     * Result includes correction for nutation and aberration.
     * @param T - Number of Julian centuries since J2000
     * @returns {number} Apparent longitude of the Sun in radians
     */
    apparentLongitude(T: number): number;

    /**
     * Returns true geometric position of the Sun as equatorial coordinates.
     * @param jde - Julian ephemeris day
     * @returns {Coord} - Contains:
     *    {number} ra - Right ascension in radians
     *    {number} dec - Declination in radians
     */
    trueEquatorial(jde: number): coord.Coord;

    /**
     * Returns apparent position of the Sun as equatorial coordinates.
     * @param jde - Julian ephemeris day
     * @returns {Coord} - Contains:
     *    {number} ra - Right ascension in radians
     *    {number} dec - Declination in radians
     */
    apparentEquatorial(jde: number): coord.Coord;

    /**
     * Returns true geometric position of the Sun as ecliptic coordinates.
     * Result computed by full VSOP87 theory.
     * @param planet - VSOP87 planet object for the Sun
     * @param jde - Julian ephemeris day
     * @returns {Coord} - Contains:
     *    {number} lon - Ecliptic longitude in radians
     *    {number} lat - Ecliptic latitude in radians
     *    {number} range - Range in AU
     */
    trueVSOP87(planet: any, jde: number): coord.Coord;

    /**
     * Returns apparent position of the Sun as ecliptic coordinates.
     * Result computed by VSOP87, including effects of nutation and aberration.
     * @param planet - VSOP87 planet object for the Sun
     * @param jde - Julian ephemeris day
     * @returns {Coord} - Contains:
     *    {number} lon - Ecliptic longitude in radians
     *    {number} lat - Ecliptic latitude in radians
     *    {number} range - Range in AU
     */
    apparentVSOP87(planet: any, jde: number): coord.Coord;

    /**
    Returns apparent position of the Sun as equatorial coordinates using VSOP87.
    Result includes effects of nutation and aberration.
    @param planet - VSOP87 planet object for the Sun
    @param jde - Julian ephemeris day
    @returns {Coord}
    */
    apparentEquatorialVSOP87(planet: any, jde: number): coord.Coord;

    /**
 Computes the aberration based on distance from the Sun.
 @param range - Distance from the Sun in AU 
 @returns Aberration correction in radians 
 */
    aberration(range: number): number;
  }

  interface SolarDisk {
    /**
     * Returns the apparent orientation of the Sun at the given Julian Day.
     * Results include:
     *  P: Position angle of the solar north pole.
     *  B0: Heliographic latitude of the center of the solar disk.
     *  L0: Heliographic longitude of the center of the solar disk.
     * @param jd - Julian ephemeris day
     * @param earth - VSOP87 planet object for Earth
     * @returns {Object} - Contains:
     *    {number} P - Position angle of the solar north pole in radians
     *    {number} B0 - Heliographic latitude of the center of the solar disk in radians
     *    {number} L0 - Heliographic longitude of the center of the solar disk in radians
     */
    ephemeris(jd: number, earth: any): { P: number; B0: number; L0: number };

    /**
     * Returns the Julian Day of the start of a given synodic rotation.
     * @param c - The "Carrington" cycle number
     * @returns {number} Julian Day of the start of the synodic rotation
     */
    cycle(c: number): number;
  }

  interface SolarXYZ {
    /**
     * Returns rectangular coordinates of the Sun referenced to the mean equinox of date.
     * @param earth - VSOP87 planet object for Earth
     * @param jde - Julian ephemeris day
     * @returns {Object} - Contains:
     *    {number} x - Rectangular coordinate x in AU
     *    {number} y - Rectangular coordinate y in AU
     *    {number} z - Rectangular coordinate z in AU
     */
    position(earth: any, jde: number): { x: number; y: number; z: number };

    /**
     * Returns geometric longitude of the Sun referenced to equinox J2000.
     * @param earth - VSOP87 planet object for Earth
     * @param jde - Julian ephemeris day
     * @returns {number} Geometric longitude referenced to equinox J2000 in radians
     */
    longitudeJ2000(earth: any, jde: number): number;

    /**
     * Returns rectangular coordinates of the Sun referenced to equinox J2000.
     * @param earth - VSOP87 planet object for Earth
     * @param jde - Julian ephemeris day
     * @returns {Object} - Contains:
     *    {number} x - Rectangular coordinate x in AU
     *    {number} y - Rectangular coordinate y in AU
     *    {number} z - Rectangular coordinate z in AU
     */
    positionJ2000(earth: any, jde: number): { x: number; y: number; z: number };

    /**
     * Returns rectangular coordinates of the Sun referenced to B1950.
     * @param earth - VSOP87 planet object for Earth
     * @param jde - Julian ephemeris day
     * @returns {Object} - Contains:
     *    {number} x - Rectangular coordinate x in AU
     *    {number} y - Rectangular coordinate y in AU
     *    {number} z - Rectangular coordinate z in AU
     */
    positionB1950(earth: any, jde: number): { x: number; y: number; z: number };

    /**
     * Returns rectangular coordinates of the Sun referenced to an arbitrary epoch.
     * @param earth - VSOP87 planet object for Earth
     * @param jde - Julian ephemeris day
     * @param epoch - The epoch year for reference
     * @returns {Object} - Contains:
     *    {number} x - Rectangular coordinate x in AU
     *    {number} y - Rectangular coordinate y in AU
     *    {number} z - Rectangular coordinate z in AU
     */
    positionEquinox(earth: any, jde: number, epoch: number): { x: number; y: number; z: number };
  }

  interface Solstice {
    /**
     * Returns the Julian Ephemeris Day (JDE) of the March equinox for the given year.
     * Results are valid for the years -1000 to +3000.
     * Accuracy is within one minute of time for the years 1951-2050.
     * @param year - The year for which to calculate the March equinox
     * @returns {number} JDE of the March equinox
     */
    march(year: number): number;

    /**
     * Returns the JDE of the June solstice for the given year.
     * Results are valid for the years -1000 to +3000.
     * Accuracy is within one minute of time for the years 1951-2050.
     * @param year - The year for which to calculate the June solstice
     * @returns {number} JDE of the June solstice
     */
    june(year: number): number;

    /**
     * Returns the JDE of the September equinox for the given year.
     * Results are valid for the years -1000 to +3000.
     * Accuracy is within one minute of time for the years 1951-2050.
     * @param year - The year for which to calculate the September equinox
     * @returns {number} JDE of the September equinox
     */
    september(year: number): number;

    /**
     * Returns the JDE of the December solstice for a given year.
     * Results are valid for the years -1000 to +3000.
     * Accuracy is within one minute of time for the years 1951-2050.
     * @param year - The year for which to calculate the December solstice
     * @returns {number} JDE of the December solstice
     */
    december(year: number): number;

    /**
     * Returns a more accurate JDE of the March equinox.
     * Result is accurate to one second of time.
     * @param year - The year for which to calculate the March equinox
     * @param planet - VSOP87 planet object representing Earth
     * @returns {number} Accurate JDE of the March equinox
     */
    march2(year: number, planet: any): number;

    /**
     * Returns a more accurate JDE of the June solstice.
     * Result is accurate to one second of time.
     * @param year - The year for which to calculate the June solstice
     * @param planet - VSOP87 planet object representing Earth
     * @returns {number} Accurate JDE of the June solstice
     */
    june2(year: number, planet: any): number;

    /**
     * Returns a more accurate JDE of the September equinox.
     * Result is accurate to one second of time.
     * @param year - The year for which to calculate the September equinox
     * @param planet - VSOP87 planet object representing Earth
     * @returns {number} Accurate JDE of the September equinox
     */
    september2(year: number, planet: any): number;

    /**
    Returns a more accurate JDE of the December solstice.
    Result is accurate to one second of time.
    @param year - The year for which to calculate the December solstice
    @param planet - VSOP87 planet object representing Earth
    @returns {number} Accurate JDE of the December solstice
    */
    december2(year: number, planet: any): number;

    /**
 Returns Julian Day (JDE) for a given `year`, VSOP87 Planet `planet` at a given geocentric solar longitude `lon`.
 @param year - (int) The year 
 @param planet - VSOP87 planet object representing Earth 
 @param lon - Geocentric solar longitude in radians 
 @returns {number} JDE 
 */
    longitude(year: number, planet: any, lon: number): number;
  }

  interface Stellar {
    /**
     * Computes the combined apparent magnitude of two stars.
     * @param m1 - Apparent magnitude of the first star
     * @param m2 - Apparent magnitude of the second star
     * @returns {number} Combined apparent magnitude
     */
    sum(m1: number, m2: number): number;

    /**
     * Computes the combined apparent magnitude of a number of stars.
     * @param m - Array of apparent magnitudes of the stars
     * @returns {number} Combined apparent magnitude
     */
    sumN(...m: number[]): number;

    /**
     * Computes the brightness ratio of two stars based on their apparent magnitudes.
     * @param m1 - Apparent magnitude of the first star
     * @param m2 - Apparent magnitude of the second star
     * @returns {number} Brightness ratio of the two stars
     */
    ratio(m1: number, m2: number): number;

    /**
     * Computes the difference in apparent magnitude of two stars given their brightness ratio.
     * @param ratio - Brightness ratio of the two stars
     * @returns {number} Difference in apparent magnitude
     */
    difference(ratio: number): number;

    /**
     * Computes absolute magnitude given annual parallax.
     * @param m - Apparent magnitude
     * @param π - Annual parallax in arc seconds
     * @returns {number} Absolute magnitude
     */
    absoluteByParallax(m: number, π: number): number;

    /**
     * Computes absolute magnitude given distance.
     * @param m - Apparent magnitude
     * @param d - Distance in parsecs
     * @returns {number} Absolute magnitude
     */
    absoluteByDistance(m: number, d: number): number;
  }

  interface Sundial {
    /**
     * Computes data for the general case of a planar sundial.
     * @param φ - Geographic latitude at which the sundial will be located (in radians)
     * @param D - Gnomonic declination (in radians)
     * @param a - Length of a straight stylus perpendicular to the plane of the sundial
     * @param z - Zenithal distance of the direction defined by the stylus (in radians)
     * @returns {Object} - Contains:
     *    {Line[]} lines - Set of lines for the sundial
     *    {Point} center - Center point of the sundial
     *    {number} length - Length of a polar stylus in units of a
     *    {number} angle - Angle which the polar stylus makes with the plane of the sundial
     */
    general(φ: number, D: number, a: number, z: number): { lines: Line[]; center: Point; length: number; angle: number };

    /**
     * Computes data for a sundial level with the equator.
     * @param φ - Geographic latitude at which the sundial will be located (in radians)
     * @param a - Length of a straight stylus perpendicular to the plane of the sundial
     * @returns {Object} - Contains:
     *    {Line[]} north - Lines on the north side of the sundial
     *    {Line[]} south - Lines on the south side of the sundial
     */
    equatorial(φ: number, a: number): { north: Line[]; south: Line[] };

    /**
     * Computes data for a horizontal sundial.
     * @param φ - Geographic latitude at which the sundial will be located (in radians)
     * @param a - Length of a straight stylus perpendicular to the plane of the sundial
     * @returns {Object} - Contains:
     *    {Line[]} lines - Set of lines for the horizontal sundial
     *    {Point} center - Center point of the horizontal sundial
     *    {number} length - Length of a polar stylus in units of a
     */
    horizontal(φ: number, a: number): { lines: Line[]; center: Point; length: number };

    /**
     * Computes data for a vertical sundial.
     * @param φ - Geographic latitude at which the sundial will be located (in radians)
     * @param D - Gnomonic declination (in radians)
     * @param a - Length of a straight stylus perpendicular to the plane of the sundial
     * @returns {Object} - Contains:
     *    {Line[]} lines - Set of lines for the vertical sundial
     *    {Point} center - Center point of the vertical sundial
     *    {number} length - Length of a polar stylus in units of a
     */
    vertical(φ: number, D: number, a: number): { lines: Line[]; center: Point; length: number };
  }

  interface Sunrise {
    /**
     * Constructs a Sunrise object to compute solar times for a given date and observer's location.
     * @param date - Julian calendar date
     * @param lat - Latitude of the observer in degrees (range: -89.6 to 89.6)
     * @param lon - Longitude of the observer in degrees (measured positively westward)
     * @param options - Optional parameters for configuration
     */
    constructor(date: julian.Calendar, lat: number, lon: number, options?: SunriseOptions);

    /**
     * Computes the time of solar noon.
     * @returns {julian.Calendar} Time of solar noon
     */
    noon(): julian.Calendar;

    /**
     * Computes the time of sunrise.
     * @returns {julian.Calendar} Time of sunrise
     */
    rise(): julian.Calendar;

    /**
     * Computes the time of sunset.
     * @returns {julian.Calendar} Time of sunset
     */
    set(): julian.Calendar;

    /**
     * Computes the time when the solar limb is fully visible at sunrise.
     * @returns {julian.Calendar} Time of sunrise end
     */
    riseEnd(): julian.Calendar;

    /**
     * Computes the time when the solar limb starts disappearing at sunset.
     * @returns {julian.Calendar} Time of sunset start
     */
    setStart(): julian.Calendar;

    /**
     * Computes the time of dawn when there is enough light for objects to be distinguishable.
     * @returns {julian.Calendar} Time of dawn
     */
    dawn(): julian.Calendar;

    /**
     * Computes the time of dusk when there is still enough light for objects to be distinguishable.
     * @returns {julian.Calendar} Time of dusk
     */
    dusk(): julian.Calendar;

    /**
     * Computes the time of nautical dawn when the horizon gets visible by naked eye.
     * @returns {julian.Calendar} Time of nautical dawn
     */
    nauticalDawn(): julian.Calendar;

    /**
     * Computes the time of nautical dusk when the horizon is no longer visible by naked eye.
     * @returns {julian.Calendar} Time of nautical dusk
     */
    nauticalDusk(): julian.Calendar;

    /**
     * Computes the time when night starts, indicating no sunlight illumination.
     * @returns {julian.Calendar} Time of start of night
     */
    nightStart(): julian.Calendar;

    /**
     * Computes the time when night ends, indicating sunlight starts illuminating the sky.
     * @returns {julian.Calendar} Time of end of night
     */
    nightEnd(): julian.Calendar;

    /**
     * Computes the start time of the "golden hour" before sunset.
     * @returns {julian.Calendar} Time of start of golden hour
     */
    goldenHourStart(): julian.Calendar;

    /**
     * Computes the end time of the "golden hour" after sunrise.
     * @returns {julian.Calendar} Time of end of golden hour
     */
    goldenHourEnd(): julian.Calendar;
  }
}
declare module "astronomia/solstice" {
  const solstice: {
    march(year: number): number;
    june(year: number): number;
    september(year: number): number;
    december(year: number): number;
  };
  export default solstice;
}

declare module "astronomia/julian" {
  const julian: {
    JDToDate(jd: number): Date;
  };
  export default julian;
}
