    export const roundNumber = (num: number, decimals: number = 0): number => {

        return Number( Math.round( Number( num + 'e' + decimals ) ) + 'e-' + decimals );
        
    };