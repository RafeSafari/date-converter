import Badi from "./Badi";
import Chinese from "./Chinese";
import Gregorian from "./Gregorian";
import Hebrew from "./Hebrew";
import Hindu from "./Hindu";
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
  {
    name: "Chinese",
    title: "چینی",
    title_alt: "قمری",
    component: Chinese,
  },
  {
    name: "Hindu",
    title: "هندی",
    title_alt: "ساکا",
    component: Hindu,
  },
  {
    name: "Hebrew",
    title: "عبری",
    title_alt: "یهودی",
    component: Hebrew,
  },
];

export default calendars;