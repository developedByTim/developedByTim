import type { DropdownOptions } from "./Dropdown";

export enum FilmColorType {
  ColorNegative = "Color Negative",
  ColorPositive = "Color Positive",
  BlackAndWhite = "Black & White",
  Infrared = "Infrared"
}
export enum FilmStockType {
  KodakGold = "Kodak Gold",
  KodakUltraMax = "Kodak UltraMax",
  KodakColorPlus = "Kodak ColorPlus",
  KodakPortra = "Kodak Portra",
  KodakEktar = "Kodak Ektar",
  KodakTriX = "Kodak Tri-X",
  KodakTMax = "Kodak T-Max",
  FujifilmPro400H = "Fujifilm Pro 400H",
  FujifilmVelvia = "Fujifilm Velvia",
  FujifilmAcros = "Fujifilm Acros",
  IlfordHP5 = "Ilford HP5",
  IlfordDelta = "Ilford Delta",
  IlfordPanF = "Ilford Pan F",
  IlfordFP4 = "Ilford FP4",
  IlfordXP5 = "Ilford XP5",
  LomographyColorNegative = "Lomography Color Negative",
  LomographyRedscale = "Lomography Redscale",
  Cinestill = "Cinestill"
}
 export enum FilmSpeedType
  {
      ISO25 = 25,
      ISO50 = 50,
      ISO100 = 100,
      ISO125 = 125,
      ISO160 = 160,
      ISO200 = 200,
      ISO400 = 400,
      ISO800 = 800,
      ISO1600 = 1600,
      ISO3200 = 3200
  }

  export enum FilmFormatType
  {
      Format35mm,
      Format120,
      FormatPolaroid,
      // No photos currently available for the following formats
      // Format4x5,
      // Format8x10,
      // Format110,
      // APS,
      // Disc
  }
  export enum FilmOrientationType {
    Landscape = "Landscape",
    Portrait = "Portrait",
    Square = "Square"
  }

  export type Image = {
      id: string;
      fileName: string;
      url: string;
      filmStock: string;
      filmSpeed: FilmSpeedType;
      filmFormat: FilmFormatType;
      filmOrientation: FilmOrientationType;
      bw: boolean;
      uploadedAt: string;
      metadata: string;
  }
  export type Collection = {
      id: string;
      name: string;
      isCollection: boolean;
    }

    export const filmOrientationOptions: DropdownOptions<any>[] = [{ key: '', text: 'All' }, ...Object.entries(FilmOrientationType).map(([key, text]) => ({
  key,
  text,
}))]
// Film Stock Options
export const filmStockOptions: DropdownOptions<any>[] = [{ key: '', text: 'All' }, ...Object.entries(FilmStockType).map(([key, text]) => ({
  key,
  text: text ?? 'All',
}))]

// Film Speed (ISO) Options
export const filmSpeedOptions: DropdownOptions<any>[] = [{ key: '', text: 'All' }, ...Object.values(FilmSpeedType)
  .filter((v) => typeof v === "number") // Ensures we only get numeric values
  .map((iso) => ({
    key: iso,
    text: iso ? `ISO ${iso}` : 'All',
  }))]

// Film Format Options
export const filmFormatOptions: DropdownOptions<any>[] = [{ key: '', text: 'All' }, ...Object.keys(FilmFormatType)
  .filter((key) => isNaN(Number(key))) // Filters out numeric index keys
  .map((format) => ({
    key: format,
    text: format.replace("Format", "").replace(/([A-Z])/g, " $1").trim(),
  }))]

// Film Color Options
export const filmColorOptions: DropdownOptions<any>[] = Object.entries(FilmColorType).map(([key, text]) => ({
  key,
  text,
}));

