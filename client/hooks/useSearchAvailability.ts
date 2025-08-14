import { useState, useCallback, useRef, useMemo } from "react";
import {
  SearchAvailabilityRequest,
  SearchAvailabilityResponse,
  TimeSlot,
} from "@shared/api";

interface SearchState {
  slots: TimeSlot[];
  isLoading: boolean;
  error: string;
}

interface CacheEntry {
  data: TimeSlot[];
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const DEBOUNCE_DELAY = 300; // 300ms

export const useSearchAvailability = () => {
  const [state, setState] = useState<SearchState>({
    slots: [],
    isLoading: false,
    error: "",
  });

  // Cache for API responses
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Create cache key from search parameters
  const createCacheKey = useCallback((date: string, time: string) => {
    return `${date}_${time}`;
  }, []);

  // Check if cached data is still valid
  const getCachedData = useCallback((key: string): TimeSlot[] | null => {
    const cached = cacheRef.current.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }, []);

  // Store data in cache
  const setCachedData = useCallback((key: string, data: TimeSlot[]) => {
    cacheRef.current.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Clean old cache entries (keep only last 10)
    if (cacheRef.current.size > 10) {
      const entries = Array.from(cacheRef.current.entries());
      entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
      cacheRef.current.clear();
      entries.slice(0, 10).forEach(([key, value]) => {
        cacheRef.current.set(key, value);
      });
    }
  }, []);

  // Optimized search function with debouncing and caching
  const searchAvailability = useCallback(
    async (date: string, time: string) => {
      if (!date || !time) return;

      const cacheKey = createCacheKey(date, time);

      // Check cache first
      const cachedSlots = getCachedData(cacheKey);
      if (cachedSlots) {
        setState({
          slots: cachedSlots,
          isLoading: false,
          error: "",
        });
        return;
      }

      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set loading state immediately
      setState((prev) => ({ ...prev, isLoading: true, error: "" }));

      // Debounce the API call
      debounceTimerRef.current = setTimeout(async () => {
        try {
          const requestBody: SearchAvailabilityRequest = {
            date,
            time,
            serviceType: "Financial Health Check",
            duration: 60,
          };

          const response = await fetch("/api/search-availability", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });

          const result: SearchAvailabilityResponse = await response.json();

          if (result.success && result.data) {
            const slots = result.data.slots;
            setCachedData(cacheKey, slots);
            setState({
              slots,
              isLoading: false,
              error: "",
            });
          } else {
            setState({
              slots: [],
              isLoading: false,
              error: result.error?.message || "Failed to search availability",
            });
          }
        } catch (err) {
          setState({
            slots: [],
            isLoading: false,
            error: "Network error occurred. Please try again.",
          });
        }
      }, DEBOUNCE_DELAY);
    },
    [createCacheKey, getCachedData, setCachedData],
  );

  // Clear search results
  const clearResults = useCallback(() => {
    setState({
      slots: [],
      isLoading: false,
      error: "",
    });
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  // Memoize return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      ...state,
      searchAvailability,
      clearResults,
      cleanup,
    }),
    [state, searchAvailability, clearResults, cleanup],
  );
};
