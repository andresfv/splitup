
interface ExportOptions {
    decimals?: number;
}

export const roundNumber = (num: number, options: ExportOptions = {}): number => {
    const { decimals = 2 } = options;

    return Number(Math.round(Number(num + 'e' + decimals)) + 'e-' + decimals);

};