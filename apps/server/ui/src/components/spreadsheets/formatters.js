//* FORMATTERS __

export function floatNumberWithSpaces(input) {
    const parts = input.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}

export function formatToPrecision(input, n = 2) {
    const number = Number(input);
    if (isNaN(number) || input.length === 0) return input;

    return floatNumberWithSpaces(number.toFixed(n));
}

export function formatToPercent(input) {
    const number = Number(input);
    if (isNaN(number) || input.length === 0) return input;
    const percent = number * 100;
    return formatToPrecision(percent.toString()) + "%";
}

export function formatToCurrency(input, currency) {
    const currencys = {
        EUR: "€",
        RUB: "₽",
        USD: "$",
    };

    const number = Number(input);
    if (isNaN(number) || input.length === 0) return input;

    return formatToPrecision(input) + " " + currencys[currency];
}

export function formatToDate(input) {
    const isDateRegex = /^([0-9]{1,2}(\.|-|\/|,)){2}[0-9]{4}$/;
    if (!isDateRegex.test(input)) return input;
    const [day, month, year] = input.split(/\.|-|\/|,/);

    const combinedData = [month, day, year].join(".");
    return new Date(combinedData).toLocaleDateString();
}
//* FORMATTERS __

