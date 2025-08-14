import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

function BookingForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    telephone: "+44",
    email: "",
    postcode: "",
    notes: "",
    subject: "FHC Video",
    time: "17:30",
    date: "27th August",
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/.netlify/functions/book-appointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setBooking(data);
    setShowConfirm(true);
  };

  const handleCancel = async () => {
    const res = await fetch("/.netlify/functions/cancel-appointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId: booking?.appointmentId }),
    });
    const data = await res.json();
    if (data.cancelled) setCancelled(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-natwest-purple text-white py-12 px-8 flex flex-col lg:flex-row">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2">Book a time slot that works for you</h2>
          <p className="mb-2">All Financial Health Check appointments are for 1 hour</p>
          <div className="mb-4">
            <span className="font-semibold">Booking Date:</span> 28/08/2025<br />
            <span className="font-semibold">Booking Time:</span> 17:30
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img src="https://images.pexels.com/photos/5862400/pexels-photo-5862400.jpeg" alt="Booking" className="rounded-lg w-full max-w-md" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-[-40px]">
        <div className="bg-yellow-50 border border-yellow-300 rounded p-2 mb-4 text-yellow-800 text-sm">
          The slot is held for: 19m 56s
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">First name *</label>
              <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last name *</label>
              <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telephone number *</label>
              <input type="text" name="telephone" value={form.telephone} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email address *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Postcode *</label>
              <input type="text" name="postcode" value={form.postcode} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full border rounded px-3 py-2" maxLength={500} />
              <div className="text-xs text-gray-500">You have 500 characters remaining</div>
            </div>
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input type="checkbox" className="mr-2" /> Are you an existing customer?
            </label>
          </div>
          <div className="mb-4 text-sm text-gray-700">
            All the details captured above will only be used to book and manage your appointment. They will not be used for any marketing purposes.
          </div>
          <div className="flex justify-between mt-6">
            <button type="button" className="px-8 py-2 border-2 border-natwest-purple text-natwest-purple rounded-full font-medium">Back</button>
            <button type="submit" className="px-8 py-2 bg-natwest-purple text-white rounded-full font-medium">Book appointment</button>
          </div>
        </form>
      </div>
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-lg">
          {!showCancelPrompt ? (
            <>
              <h2 className="text-xl font-semibold mb-2">Booking confirmed</h2>
              <hr className="mb-4" />
              {booking && (
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="flex-1 space-y-2 text-left">
                    <div><span className="font-semibold">Customer Name:</span> {booking.customerName}</div>
                    <div><span className="font-semibold">Subject:</span> {booking.subject}</div>
                    <div><span className="font-semibold">Duration:</span> {booking.duration}</div>
                    <div><span className="font-semibold">Confirmation Email:</span> {booking.confirmationEmail}</div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white rounded shadow">
                    <div className="text-natwest-purple text-2xl font-bold">{booking.time}</div>
                    <div className="text-natwest-purple text-lg">{booking.date}</div>
                    <div className="mt-2 text-xs font-semibold">Appointment ID:</div>
                    <div className="font-bold">{booking.appointmentId}</div>
                  </div>
                </div>
              )}
              <div className="flex justify-center gap-4 mt-6">
                <button className="px-6 py-2 border-2 border-natwest-purple rounded-full flex items-center gap-2" onClick={() => setShowCancelPrompt(true)}><span>🗑️</span>Cancel Appointment</button>
                <button className="px-6 py-2 border-2 border-natwest-purple rounded-full flex items-center gap-2"><span>🔄</span>Reschedule</button>
                <button className="px-6 py-2 border-2 border-natwest-purple rounded-full flex items-center gap-2"><span>📝</span>New Appointment</button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-2">Cancel Appointment</h2>
              <hr className="mb-4" />
              {booking && (
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="flex-1 space-y-2 text-left">
                    <div><span className="font-semibold">Customer Name:</span> {booking.customerName}</div>
                    <div><span className="font-semibold">Subject:</span> {booking.subject}</div>
                    <div><span className="font-semibold">Duration:</span> {booking.duration}</div>
                    <div><span className="font-semibold">Confirmation Email:</span> {booking.confirmationEmail}</div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white rounded shadow">
                    <div className="text-natwest-purple text-2xl font-bold">{booking.time}</div>
                    <div className="text-natwest-purple text-lg">{booking.date}</div>
                    <div className="mt-2 text-xs font-semibold">Appointment ID:</div>
                    <div className="font-bold">{booking.appointmentId}</div>
                  </div>
                </div>
              )}
              {!cancelled ? (
                <div className="flex justify-center gap-4 mt-6">
                  <button className="px-6 py-2 border-2 border-natwest-purple rounded-full flex items-center gap-2" onClick={handleCancel}><span>🗑️</span>Cancel Appointment</button>
                </div>
              ) : (
                <>
                  <div className="bg-green-50 border border-green-300 rounded p-2 mb-4 text-green-800 text-sm flex items-center gap-2"><span>✔️</span>Appointment Cancelled</div>
                  <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex-1 space-y-2 text-left">
                      <div><span className="font-semibold">Customer Name:</span> {booking.customerName}</div>
                      <div><span className="font-semibold">Subject:</span> {booking.subject}</div>
                      <div><span className="font-semibold">Duration:</span> {booking.duration}</div>
                      <div><span className="font-semibold">Confirmation Email:</span> {booking.confirmationEmail}</div>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-white rounded shadow">
                      <div className="text-natwest-purple text-2xl font-bold">{booking.time}</div>
                      <div className="text-natwest-purple text-lg">{booking.date}</div>
                      <div className="mt-2 text-xs font-semibold">Appointment ID:</div>
                      <div className="font-bold">{booking.appointmentId}</div>
                      <div className="mt-2 text-red-600 font-semibold">Cancelled</div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 mt-6">
                    <button className="px-6 py-2 border-2 border-natwest-purple rounded-full flex items-center gap-2"><span>📝</span>New Appointment</button>
                  </div>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
      <footer className="bg-natwest-purple text-white py-8 mt-12">
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
                Copyright © National Westminster Bank plc 2025 | <a href="#" className="underline hover:no-underline">Terms & Conditions and FSCS</a> | <a href="#" className="underline hover:no-underline">Privacy & Cookies</a> | <a href="#" className="underline hover:no-underline">Accessibility</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default BookingForm;
