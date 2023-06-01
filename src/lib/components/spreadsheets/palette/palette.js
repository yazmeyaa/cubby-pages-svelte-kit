import { colors } from '@carbon/colors'
/**
 * @typedef {Object} Colors
 * @property {string} background
 * @property {string} color
 */
/**
 * @type {Colors[][]} - Colors palette
 */

const palette = [
    [{ background: colors.white[0], color: colors.black[100] }, { background: colors.purple[10], color: colors.purple[60] }, { background: colors.blue[10], color: colors.blue[60] }, { background: colors.green[10], color: colors.green[60] }, { background: colors.red[10], color: colors.red[60] }, { background: colors.orange[10], color: colors.orange[60] }],
    [{ background: colors.gray[30], color: colors.black[100] }, { background: colors.purple[30], color: colors.purple[80] }, { background: colors.blue[30], color: colors.blue[60] }, { background: colors.green[30], color: colors.green[60] }, { background: colors.red[30], color: colors.red[60] }, { background: colors.orange[30], color: colors.orange[60] }],
    [{ background: colors.gray[60], color: colors.white[0] }, { background: colors.purple[60], color: colors.purple[10] }, { background: colors.blue[60], color: colors.blue[10] }, { background: colors.green[60], color: colors.green[10] }, { background: colors.red[60], color: colors.red[10] }, { background: colors.orange[60], color: colors.orange[10] }],
    [{ background: colors.gray[80], color: colors.white[0] }, { background: colors.purple[80], color: colors.purple[10] }, { background: colors.blue[80], color: colors.blue[10] }, { background: colors.green[80], color: colors.green[10] }, { background: colors.red[80], color: colors.red[10] }, { background: colors.orange[80], color: colors.orange[10] }],
]

export { palette }