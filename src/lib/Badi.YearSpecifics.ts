class YearSpecifics {
    year: number;
    leapday: boolean;
    nawRuzOnMarch21: boolean;
    birthOfBab: number;

    constructor(year: number, birthOfBab: number, leapday: boolean = false, nawRuzOnMarch21: boolean = false) {
        this.year = year;
        this.birthOfBab = birthOfBab;
        this.leapday = leapday;
        this.nawRuzOnMarch21 = nawRuzOnMarch21;
    }
}
export { YearSpecifics };

const yearSpecifics: Record<number, YearSpecifics> = {
    172: new YearSpecifics(172, 238, false, true),
    173: new YearSpecifics(173, 227),
    174: new YearSpecifics(174, 216, true),
    175: new YearSpecifics(175, 234, false, true),
    176: new YearSpecifics(176, 223, false, true),
    177: new YearSpecifics(177, 213),
    178: new YearSpecifics(178, 232, true),
    179: new YearSpecifics(179, 220, false, true),
    180: new YearSpecifics(180, 210, false, true),
    181: new YearSpecifics(181, 228),
    182: new YearSpecifics(182, 217, true),
    183: new YearSpecifics(183, 235, false, true),
    184: new YearSpecifics(184, 224, false, true),
    185: new YearSpecifics(185, 214),
    186: new YearSpecifics(186, 233),
    187: new YearSpecifics(187, 223, true),
    188: new YearSpecifics(188, 211, false, true),
    189: new YearSpecifics(189, 230),
    190: new YearSpecifics(190, 238),
    191: new YearSpecifics(191, 238, true),
    192: new YearSpecifics(192, 226, false, true),
    193: new YearSpecifics(193, 215),
    194: new YearSpecifics(194, 234),
    195: new YearSpecifics(195, 224, true),
    196: new YearSpecifics(196, 213, false, true),
    197: new YearSpecifics(197, 232),
    198: new YearSpecifics(198, 221),
    199: new YearSpecifics(199, 210, true),
    200: new YearSpecifics(200, 228, false, true),
    201: new YearSpecifics(201, 217),
    202: new YearSpecifics(202, 236),
    203: new YearSpecifics(203, 225, true),
    204: new YearSpecifics(204, 214, false, true),
    205: new YearSpecifics(205, 233),
    206: new YearSpecifics(206, 223),
    207: new YearSpecifics(207, 212, true),
    208: new YearSpecifics(208, 230, false, true),
    209: new YearSpecifics(209, 219),
    210: new YearSpecifics(210, 237),
    211: new YearSpecifics(211, 227, true),
    212: new YearSpecifics(212, 215 ,false ,true ),
    213: new YearSpecifics(213, 234),
    214: new YearSpecifics(214, 224),
    215: new YearSpecifics(215, 213),
    216: new YearSpecifics(216, 232, true),
    217: new YearSpecifics(217, 220),
    218: new YearSpecifics(218, 209),
    219: new YearSpecifics(219, 228),
    220: new YearSpecifics(220, 218, true),
    221: new YearSpecifics(221, 236),
};
export default yearSpecifics;