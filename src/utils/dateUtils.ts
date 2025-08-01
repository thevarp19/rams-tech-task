export const addMonths = (date: Date, months: number): Date => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
};

export const formatDate = (date: Date): string => {
    const formatted = date.toLocaleDateString("ru-RU", {
        month: "long",
        year: "numeric",
    });

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export const getYear = (date: Date): number => {
    return date.getFullYear();
};

export const isDateInYear = (date: Date, year: number): boolean => {
    return date.getFullYear() === year;
};

export const getDateRange = (
    dates: Date[]
): { minYear: number; maxYear: number } => {
    if (dates.length === 0) {
        const currentYear = new Date().getFullYear();
        return { minYear: currentYear, maxYear: currentYear };
    }

    const years = dates.map((date) => date.getFullYear());
    return {
        minYear: Math.min(...years),
        maxYear: Math.max(...years),
    };
};
