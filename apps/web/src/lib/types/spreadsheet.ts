export enum CELL_KINDS {
    CELL = "CELL",
    PICKLIST = "PICKLIST",
}

export interface Position {
    col: number
    row: number
}

type CellAlignType = "left" | "center" | "right"

export interface CellFormat {
    italics: number
    bold: number
    underline: number
    fontsize: number
    align: CellAlignType
    colour: string
    background: string
    border: [boolean, boolean, boolean, boolean]
    readonly: boolean
}

export interface Cell {
    value: string
    display: string
    result: string
    format: CellFormat
    nowIsViewMode: boolean
    isCDBFormula: boolean
    canEditInViewMode: boolean
    kind: CELL_KINDS
    dependencies: Position[]
}

interface RowSetting {
    height: number
    resizable: boolean
}
interface ColSetting {
    width: number
    resizable: boolean
}

export interface SpreadSheetSelection {
    col: number
    col2: number
    row: number
    row2: number
}

export interface SpreadsheetConfig {
    currCell: Position
    editCell: Position
    rowSetting: RowSetting[]
    columnSetting: ColSetting[]
    defaultFormat: CellFormat
    selCells: SpreadSheetSelection
}