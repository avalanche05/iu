export const mapFloatYearToReadableText = (year: number): string => {
    const years = Math.floor(year);
    const months = Math.round((year - years) * 12);

    if (years === 0) {
        return `${months} месяцев`;
    }

    if (months === 0) {
        return `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'}`;
    }

    return `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'} ${months} месяцев`;
};
