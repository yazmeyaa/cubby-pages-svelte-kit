import Parser from "fast-formula-parser";

class FormulaResolver extends Parser {
    spreadsheet;
    constructor(spreadsheet, functions = {}) {
        const config = {
            onCell: ({ sheet, row, col }) => {
                const tableData = spreadsheet.serialize();

                const tableSheet = tableData.sheets.find((item) => {
                    item.name === sheet;
                });
                //? if(!sheet)...
                const sheetData = tableSheet.data;
                const decodedCol = this.#numberToTitle(col);
                const cellAddress = `${decodedCol}${row}`;

                const cellValue = sheetData.find((data) => (data.cell = cellAddress));

                return cellValue ?? ""; //* Empty string to escape errors
            },
            onRange: (ref) => {
                const tableData = spreadsheet.serialize();
                const sheet = tableData.sheets.find((sheet) => {
                    sheet.name === sheet;
                });
                //? if(!sheet)...
                const sheetData = sheet.data;

                const resultArr = [];

                for (let row = ref.from.row; row < ref.to.row; row++) {
                    const innerArr = [];
                    for (let col = ref.from.col; col <= ref.to.col; col++) {
                        const decodedCol = this.#numberToTitle(col);
                        const cellAddress = `${decodedCol}${row}`;
                        const cellValue = sheetData.find((data) => (data.cell = cellAddress));
                        innerArr.push(cellValue ?? ""); //* Empty string to escape errors
                    }
                    resultArr.push(innerArr);
                }

                return resultArr;
            },
        };
        super(config);
        this.spreadsheet = spreadsheet;

        this.parse("A1", { row: 1, col: 1, sheet: "sheet1" });
    }

    /**
     * A => 1
     * @param {string} columnLetter
     * @returns {number}
     */
    #titleToNumber(columnLetter) {
        //* Can be helpfull later.
        let result = 0;
        for (let i = 0; i < columnLetter.length; i++) {
            result *= 26;
            result += columnLetter[i].charCodeAt(0) - "A".charCodeAt(0) + 1;
        }
        return result;
    }

    /**
     * Converts number of column to a letters ex. 1 => A; 2 => B
     * @param {number} columnNumber Number of column ex. 1, 13, 24
     * @returns {string}
     */
    #numberToTitle(columnNumber) {
        const columnName = [];

        while (columnNumber > 0) {
            let rem = columnNumber % 26;
            if (rem === 0) {
                columnName.push("Z");
                columnNumber = Math.floor(columnNumber / 26) - 1;
            } else {
                columnName.push(String.fromCharCode(rem - 1 + "A".charCodeAt(0)));
                columnNumber = Math.floor(columnNumber / 26);
            }
        }
        return columnName.reverse().join("");
    }
}

export { FormulaResolver };
