import Badi from "./Badi";
import Gregorian from "./Gregorian";
import Islamic from "./Islamic";
import Jalali from "./Jalali";

const calendars = [
  {
    name: "Jalali",
    title: "شمسی",
    title_alt: "جلالی",
    component: Jalali,
  },
  {
    name: "Gregorian",
    title: "میلادی",
    title_alt: "گِرِگوری",
    component: Gregorian,
  },
  {
    name: "Badi",
    title: "بدیع",
    title_alt: "بهایی",
    component: Badi,
  },
  {
    name: "Islamic",
    title: "هجری قمری",
    title_alt: "أم القرى",
    component: Islamic,
  },
];

export default calendars;