export const addMonths = (date: Date, months: number): Date => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
};

export const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const formatted = dateObj.toLocaleDateString("ru-RU", {
        month: "long",
        year: "numeric",
    });

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export const getYear = (date: Date | string): number => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.getFullYear();
};

export const isDateInYear = (date: Date | string, year: number): boolean => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.getFullYear() === year;
};

export const getDateRange = (
    dates: (Date | string)[]
): { minYear: number; maxYear: number } => {
    if (dates.length === 0) {
        const currentYear = new Date().getFullYear();
        return { minYear: currentYear, maxYear: currentYear };
    }

    const years = dates.map((date) => {
        const dateObj = typeof date === "string" ? new Date(date) : date;
        return dateObj.getFullYear();
    });
    return {
        minYear: Math.min(...years),
        maxYear: Math.max(...years),
    };
};
