/**
 * Returns string for making request body
 * @param {string} key 
 * @param {string} value 
 * @returns {`[${key}].[${key}].[${value}]`}
 */

const makeRequestSubstring = (key, value) => {
    return `[${key}].[${key}].[${value}]`;
};


const headers = new Headers({
    "Content-Type": "application/json",
    // Cookie: "TM1SessionId=PHUZmWKpss5Tt1FRCn-06kjnqcQ",
    Authorization: "Basic " + btoa("admin:Apple"),
});



/**
 * @typedef RequestParams
 * @property {string[]} requiredDemensions
 * @property {string[]} args
 */

/**
 * 
 * @param {RequestParams} params 
 */
export function requestTM1CubeData({ requiredDemensions, args, cubeName }) {
    const startMDX = `SELECT {[${requiredDemensions[0]}].[${requiredDemensions[0]}].[${args[0]}]} ON 1, {[${requiredDemensions[1]}].[${requiredDemensions[1]}].[${args[1]}]} ON 0 FROM [${cubeName}] `;

    let endMDX = "";

    if (requiredDemensions.length > 2) {
        const strings = [];
        for (let i = 2; i < requiredDemensions.length; i++) {
            const key = requiredDemensions[i];
            const value = args[i];
            strings.push(makeRequestSubstring(key, value));
        }

        const result = "WHERE(" + strings.join(", ") + ")";
        endMDX = result;
    }

    const MDX = startMDX + endMDX;

    return fetch(`https://84.201.147.227:8009/api/v1/ExecuteMDX?$expand=Cells`, {
        method: "POST",
        headers,
        body: JSON.stringify({ MDX }),
    });
}