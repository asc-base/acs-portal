import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type {
  AdapterFormats,
  AdapterOptions,
  FieldFormatTokenMap,
} from "@mui/x-date-pickers/models";

dayjs.extend(buddhistEra);

const YEAR_OFFSET = 543;

const buddhistFormats: Partial<AdapterFormats> = {
  year: "BBBB",
  fullDate: "D MMM BBBB",
  keyboardDate: "DD/MM/BBBB",
  keyboardDateTime12h: "DD/MM/BBBB hh:mm A",
  keyboardDateTime24h: "DD/MM/BBBB HH:mm",
};

const buddhistYearTokens: FieldFormatTokenMap = {
  BBBB: { sectionType: "year", contentType: "digit", maxLength: 4 },
};

export class AdapterDayjsBuddhist extends AdapterDayjs {
  constructor(options: AdapterOptions<string, never> = {}) {
    super({
      ...options,
      formats: { ...buddhistFormats, ...options.formats },
    });
    this.lib = "dayjs-buddhist";
    this.formatTokenMap = { ...this.formatTokenMap, ...buddhistYearTokens };

    const getGregorianYear = this.getYear;
    const setGregorianYear = this.setYear;
    const parseGregorianDate = this.parse;

    this.getYear = (value: Dayjs) => getGregorianYear(value) + YEAR_OFFSET;
    this.setYear = (value: Dayjs, year: number) =>
      setGregorianYear(value, year - YEAR_OFFSET);
    this.parse = (value: string, format: string) => {
      if (!format.includes("BBBB") || value === "") {
        return parseGregorianDate(value, format);
      }

      const buddhistYear = /\d{4}/.exec(value);
      if (!buddhistYear) return this.getInvalidDate();

      const gregorianYear = String(Number(buddhistYear[0]) - YEAR_OFFSET).padStart(4, "0");
      return parseGregorianDate(
        value.replace(buddhistYear[0], gregorianYear),
        format.replaceAll("BBBB", "YYYY"),
      );
    };
  }
}
