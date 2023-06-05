import { utils, writeFile } from 'xlsx'

export function exportDataToXLSX(cells) {
    const convertedCells = cells.map(row => {
        const subRow = row.map(item => item.value)
        return subRow
    })
    const workbook = utils.book_new()
    const worksheet = utils.aoa_to_sheet(convertedCells)

    workbook.Sheets['cubby'] = worksheet
    workbook.SheetNames.push('cubby')
    

    writeFile(workbook, `cubby_${Date.now()}.xlsx`)
}