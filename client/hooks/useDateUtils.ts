import { useMemo } from "react";

interface DateUtils {
  today: string;
  currentHour: number;
  isToday: (date: string) => boolean;
  isValidFutureDate: (date: string) => boolean;
  formatDateForDisplay: (date: string) => string;
  getAvailableHours: (selectedDate: string) => number[];
}

// Pre-calculate time slots to avoid recalculation
const ALL_AVAILABLE_HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17] as const;

export const useDateUtils = (): DateUtils => {
  // Memoize current date calculations - only recalculate when day changes
  const { today, currentHour } = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const hour = now.getHours();

    return {
      today: todayStr,
      currentHour: hour,
    };
  }, [Math.floor(Date.now() / (1000 * 60 * 60 * 24))]); // Only update when day changes

  // Memoize utility functions
  const utils = useMemo((): DateUtils => {
    const isToday = (date: string): boolean => {
      return date === today;
    };

    const isValidFutureDate = (date: string): boolean => {
      const selectedDate = new Date(date);
      const todayDate = new Date(today);
      return selectedDate >= todayDate;
    };

    const formatDateForDisplay = (date: string): string => {
      if (!date) return "";
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString("en-GB", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const getAvailableHours = (selectedDate: string): number[] => {
      if (!selectedDate) return [];

      if (isToday(selectedDate)) {
        // For today, only show hours after current hour
        return ALL_AVAILABLE_HOURS.filter((hour) => hour > currentHour);
      }

      // For future dates, show all available hours
      return [...ALL_AVAILABLE_HOURS];
    };

    return {
      today,
      currentHour,
      isToday,
      isValidFutureDate,
      formatDateForDisplay,
      getAvailableHours,
    };
  }, [today, currentHour]);

  return utils;
};
