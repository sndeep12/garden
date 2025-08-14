import { RequestHandler } from "express";
import {
  SearchAvailabilityRequest,
  SearchAvailabilityResponse,
  TimeSlot,
} from "@shared/api";

// Mock data generation based on typical banking booking patterns
const generateTimeSlots = (date: string, requestedTime: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const requestedHour = parseInt(requestedTime.split(":")[0]);

  // Generate slots starting from the requested time onwards (typical banking hours 9-17)
  const startHour = Math.max(9, requestedHour);
  const endHour = Math.min(17, Math.max(requestedHour + 5, 17));

  for (let hour = startHour; hour <= endHour; hour++) {
    // Generate slots every hour
    const timeSlot = `${hour.toString().padStart(2, "0")}:00`;
    const endTimeSlot = `${(hour + 1).toString().padStart(2, "0")}:00`;

    // Simulate some unavailable slots (realistic availability pattern)
    const isAvailable = Math.random() > 0.3; // 70% availability rate

    slots.push({
      id: `slot_${date}_${hour}00`,
      startTime: timeSlot,
      endTime: endTimeSlot,
      available: isAvailable,
      bookingReference: isAvailable ? undefined : `booked_${hour}`,
    });
  }

  return slots;
};

export const handleSearchAvailability: RequestHandler = (req, res) => {
  try {
    const searchRequest = req.body as SearchAvailabilityRequest;

    // Validate required fields
    if (!searchRequest.date || !searchRequest.time) {
      const errorResponse: SearchAvailabilityResponse = {
        success: false,
        error: {
          code: "MISSING_PARAMETERS",
          message: "Date and time are required parameters",
        },
      };
      return res.status(400).json(errorResponse);
    }

    // Validate date format and ensure it's not in the past
    const requestDate = new Date(searchRequest.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (requestDate < today) {
      const errorResponse: SearchAvailabilityResponse = {
        success: false,
        error: {
          code: "INVALID_DATE",
          message: "Cannot search for availability in the past",
        },
      };
      return res.status(400).json(errorResponse);
    }

    // Simulate API processing delay (realistic banking system response time)
    setTimeout(() => {
      const slots = generateTimeSlots(searchRequest.date, searchRequest.time);

      const response: SearchAvailabilityResponse = {
        success: true,
        data: {
          date: searchRequest.date,
          serviceType: searchRequest.serviceType || "Financial Health Check",
          duration: searchRequest.duration || 60,
          slots,
          branchInfo: {
            id: "branch_001",
            name: "Main Branch",
            address: "123 Banking Street, London, UK",
          },
        },
      };

      res.json(response);
    }, 800); // 800ms delay to simulate real API
  } catch (error) {
    console.error("Error in search availability:", error);

    const errorResponse: SearchAvailabilityResponse = {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message:
          "An unexpected error occurred while searching for availability",
      },
    };

    res.status(500).json(errorResponse);
  }
};
