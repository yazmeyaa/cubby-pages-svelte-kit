import { IFormats, ISpreadsheet } from "../types";
import { ITreeCollection } from "../../../ts-data";
export declare function getSeparators(): {
    decimal: string;
    thousands: string;
};
export declare function getDefaultFormats(): IFormats[];
export declare function getFormat(id: string): IFormats;
export declare function isNumeric(val: any): boolean;
export declare function initFormat(spreadsheet: ISpreadsheet, dateFormat?: string, timeFormat?: number): void;
export declare function getDefaultFormatsMap(): {};
export declare function getPureNumber(val: string): number;
export declare function detectFormat(val: any): IFormats;
export declare function getCleanValue(val: string, format: IFormats): string | number;
export declare function getFormattedValue(val: any, format: IFormats): string;
export declare function addNewFormat(mask: string, toolbarData: ITreeCollection, formats: IFormats[]): IFormats;
