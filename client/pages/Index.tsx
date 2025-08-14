import { useState, useMemo, useCallback, memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { TimeSlot } from "@shared/api";
import { useSearchAvailability } from "@/hooks/useSearchAvailability";
import { useDateUtils } from "@/hooks/useDateUtils";

// Optimized Hero Image with preload hints and better sizing
const HeroImage = memo(({ src, alt }: { src: string; alt: string }) => (
  <div className="flex-1 relative min-h-[300px] lg:min-h-[400px]">
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 w-full h-full object-cover object-center"
      loading="eager"
      decoding="async"
  fetchPriority="high"
      width="800"
      height="600"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
    {/* Preload the image for better performance */}
    <link rel="preload" as="image" href={src} />
  </div>
));
HeroImage.displayName = "HeroImage";

const HeroContent = memo(() => (
  <div className="flex-1 px-6 lg:px-12 py-12 lg:py-20 text-white">
    <div className="max-w-xl">
      <p className="text-lg font-medium mb-6">Video Banking</p>
      <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
        Book a time slot that works for you
      </h1>
      <p className="text-xl opacity-95">
        All Financial Health Check appointments are for 1 hour
      </p>
    </div>
  </div>
));
HeroContent.displayName = "HeroContent";

const Footer = memo(() => (
  <footer className="bg-natwest-purple text-white py-8">
    <div className="px-6 lg:px-12">
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <div className="text-2xl font-bold italic">Tomorrow Begins Today</div>
        </div>
        <div className="text-center lg:text-right text-sm opacity-90">
          <p className="mb-2">
            Copyright © National Westminster Bank plc 2025 |{" "}
            <a href="#" className="underline hover:no-underline">
              Terms & Conditions and FSCS
            </a>{" "}
            |{" "}
            <a href="#" className="underline hover:no-underline">
              Privacy & Cookies
            </a>{" "}
            |{" "}
            <a href="#" className="underline hover:no-underline">
              Accessibility
            </a>
          </p>
        </div>
      </div>
    </div>
  </footer>
));
Footer.displayName = "Footer";

// Optimized Available Slots Display Component with virtualization hints
const AvailableSlots = memo(
  ({
    slots,
    onSlotSelect,
    selectedSlot,
  }: {
    slots: TimeSlot[];
    onSlotSelect: (slot: TimeSlot) => void;
    selectedSlot: TimeSlot | null;
  }) => {
    // Memoize slot rendering to prevent unnecessary re-renders
    const slotElements = useMemo(() => {
      return slots.map((slot) => {
        const isSelected = selectedSlot?.id === slot.id;
        const isAvailable = slot.available;

        return (
          <Button
            key={slot.id}
            variant={
              isSelected ? "default" : isAvailable ? "outline" : "secondary"
            }
            disabled={!isAvailable}
            onClick={() => {
              if (isAvailable) {
                onSlotSelect(slot);
              }
            }}
            className={`p-3 text-sm transition-all ${
              isSelected
                ? "bg-natwest-purple text-white border-natwest-purple"
                : isAvailable
                  ? "border-natwest-purple text-natwest-purple hover:bg-natwest-purple hover:text-white"
                  : "opacity-50 cursor-not-allowed bg-gray-100"
            }`}
          >
            {slot.startTime} - {slot.endTime}
            {!isAvailable && <span className="block text-xs">Unavailable</span>}
            {isSelected && <span className="block text-xs">Selected</span>}
          </Button>
        );
      });
    }, [slots, selectedSlot, onSlotSelect]);

    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Available Time Slots</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {slotElements}
        </div>
      </div>
    );
  },
);
AvailableSlots.displayName = "AvailableSlots";

// Pre-computed time slots for faster rendering
const TIME_SLOTS = [
  { value: "09:00", label: "09:00 AM", hour: 9 },
  { value: "10:00", label: "10:00 AM", hour: 10 },
  { value: "11:00", label: "11:00 AM", hour: 11 },
  { value: "12:00", label: "12:00 PM", hour: 12 },
  { value: "13:00", label: "01:00 PM", hour: 13 },
  { value: "14:00", label: "02:00 PM", hour: 14 },
  { value: "15:00", label: "03:00 PM", hour: 15 },
  { value: "16:00", label: "04:00 PM", hour: 16 },
  { value: "17:00", label: "05:00 PM", hour: 17 },
] as const;

export default function Index() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showConsent, setShowConsent] = useState(false);
  const navigate = useNavigate();

  // Use optimized hooks
  const { slots, isLoading, error, searchAvailability, clearResults, cleanup } =
    useSearchAvailability();
  const { today, isToday, getAvailableHours } = useDateUtils();

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Memoize available times calculation with optimized logic
  const availableTimes = useMemo(() => {
    if (!selectedDate) return TIME_SLOTS;

    const availableHours = getAvailableHours(selectedDate);
    return TIME_SLOTS.filter((time) => availableHours.includes(time.hour));
  }, [selectedDate, getAvailableHours]);

  // Optimized date change handler
  const handleDateChange = useCallback(
    (date: string) => {
      setSelectedDate(date);
      clearResults();
      setSelectedSlot(null);

      // If switching to today and current time is no longer valid, clear it
      if (isToday(date) && selectedTime) {
        const selectedHour = parseInt(selectedTime.split(":")[0]);
        const availableHours = getAvailableHours(date);
        if (!availableHours.includes(selectedHour)) {
          setSelectedTime("");
        }
      }
    },
    [selectedTime, isToday, getAvailableHours, clearResults],
  );

  // Optimized time change handler
  const handleTimeChange = useCallback(
    (time: string) => {
      setSelectedTime(time);
      clearResults();
      setSelectedSlot(null);
    },
    [clearResults],
  );

  // Optimized slot selection handler
  const handleSlotSelect = useCallback((slot: TimeSlot) => {
    setSelectedSlot(slot);
  }, []);

  // Auto-search when both date and time are selected (debounced)
  useEffect(() => {
    if (selectedDate && selectedTime) {
      searchAvailability(selectedDate, selectedTime);
    }
  }, [selectedDate, selectedTime, searchAvailability]);

  // Memoize form validation
  const isFormValid = useMemo(() => {
    return Boolean(selectedDate && selectedTime);
  }, [selectedDate, selectedTime]);

  const hasAvailableTimes = useMemo(() => {
    return availableTimes.length > 0;
  }, [availableTimes.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-natwest-purple via-natwest-purple-light to-natwest-purple-dark">
        <div className="flex flex-col lg:flex-row">
          <HeroContent />
          <HeroImage
            src="https://images.pexels.com/photos/5862400/pexels-photo-5862400.jpeg"
            alt="Professional woman using tablet"
          />
        </div>
      </div>

      {/* Booking Form Section */}
      <div className="px-6 lg:px-12 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Form Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Date Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Date (DD/MM/YYYY)
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={today}
                    className="h-12 border-gray-300 pr-10"
                    placeholder="Select Date"
                  />
                </div>
              </div>

              {/* Time Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Time
                </label>
                <div className="relative">
                  <Select value={selectedTime} onValueChange={handleTimeChange}>
                    <SelectTrigger className="h-12 pl-10 border-gray-300">
                      <SelectValue placeholder="Select Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {hasAvailableTimes ? (
                        availableTimes.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-times" disabled>
                          No times available for selected date
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-natwest-purple w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Search Status */}
              <div className="flex items-end">
                <div className="w-full h-12 flex items-center justify-center">
                  {isLoading ? (
                    <div className="flex items-center text-natwest-purple">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="text-sm">Searching...</span>
                    </div>
                  ) : isFormValid ? (
                    <div className="text-green-600 text-sm">
                      ✓ Search completed
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">
                      Select date and time to search
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Available Slots */}
            {slots.length > 0 && (
              <AvailableSlots
                slots={slots}
                onSlotSelect={handleSlotSelect}
                selectedSlot={selectedSlot}
              />
            )}

            {/* Helper Text */}
            <div className="text-center mb-8 mt-8">
              <p className="text-gray-600">
                {slots.length > 0
                  ? "Select a time slot above to proceed with booking"
                  : isFormValid
                    ? "Available slots will appear above when search completes"
                    : "Select the required date and time above to view available slots"}
              </p>
            </div>

            {/* Next Button */}
            <div className="flex justify-center">
              <Button
                className="px-12 py-3 bg-natwest-purple hover:bg-natwest-purple-dark text-white font-medium rounded-full"
                disabled={!selectedSlot}
                onClick={() => setShowConsent(true)}
              >
                Next
              </Button>
            </div>

            {/* Consent Dialog */}
            <Dialog open={showConsent} onOpenChange={setShowConsent}>
              <DialogContent className="max-w-xl">
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">Data Privacy</h2>
                  <div className="bg-yellow-50 border border-yellow-300 rounded p-2 mb-4 text-yellow-800 text-sm">
                    To proceed please agree with our Privacy policy.
                  </div>
                  <p className="mb-4 text-gray-700 text-sm">
                    NatWest collects your name and mobile number to help identify you and provide you with updates on the progress of your service. The information is deleted after your appointment as per the bank's policy and no bank records are updated as a result.
                  </p>
                  <p className="mb-4 text-gray-700 text-sm">
                    Our full Privacy Policy is available at natwest.com/privacy or click the link below
                  </p>
                  <a href="https://natwest.com/privacy" target="_blank" rel="noopener noreferrer" className="text-natwest-purple underline mb-4 block">Privacy Policy Link</a>
                  <div className="flex justify-center gap-4 mt-6">
                    <Button variant="outline" className="px-6" onClick={() => {
                      setShowConsent(false);
                      setSelectedDate("");
                      setSelectedTime("");
                      setSelectedSlot(null);
                      navigate("/");
                    }}>I do not agree</Button>
                    <Button className="px-6 bg-natwest-purple text-white" onClick={() => {
                      setShowConsent(false);
                      navigate("/booking-form");
                    }}>I agree</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
