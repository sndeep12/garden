/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Booking API types based on NatWest booking system patterns
 */
export interface SearchAvailabilityRequest {
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // Time in HH:mm format
  serviceType: string; // Type of appointment (e.g., "Financial Health Check")
  duration: number; // Duration in minutes
  branchId?: string; // Optional branch identifier
}

export interface TimeSlot {
  id: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  available: boolean;
  bookingReference?: string;
}

export interface SearchAvailabilityResponse {
  success: boolean;
  data?: {
    date: string;
    serviceType: string;
    duration: number;
    slots: TimeSlot[];
    branchInfo?: {
      id: string;
      name: string;
      address: string;
    };
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface BookingConfirmationRequest {
  slotId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  serviceType: string;
  notes?: string;
}

export interface BookingConfirmationResponse {
  success: boolean;
  data?: {
    bookingReference: string;
    confirmationNumber: string;
    slot: TimeSlot;
    customerInfo: any;
  };
  error?: {
    code: string;
    message: string;
  };
}
