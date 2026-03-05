import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Calendar, Clock, MapPin, MoreHorizontal, Play, CheckCircle } from 'lucide-react';
import RentalProcessModal from '@/components/bookings/RentalProcessModal';

const initialBookings = [
  { id: 'BK-101', customer: 'John Doe', vehicle: 'Toyota Camry', dates: 'Oct 12 - Oct 15', status: 'Confirmed', amount: '$450.00', pickup: 'Downtown', return: 'Airport' },
  { id: 'BK-102', customer: 'Alice Smith', vehicle: 'Tesla Model 3', dates: 'Oct 14 - Oct 20', status: 'Active', amount: '$850.00', pickup: 'Airport', return: 'Airport' },
  { id: 'BK-103', customer: 'Robert Johnson', vehicle: 'Ford Explorer', dates: 'Oct 10 - Oct 12', status: 'Completed', amount: '$320.00', pickup: 'Downtown', return: 'Downtown' },
  { id: 'BK-104', customer: 'Emily Davis', vehicle: 'BMW X5', dates: 'Oct 16 - Oct 18', status: 'Pending', amount: '$600.00', pickup: 'Airport', return: 'Downtown' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Confirmed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'Active': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'Completed': return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400';
    case 'Pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-zinc-100 text-zinc-700';
  }
};

export default function Bookings() {
  const [bookings, setBookings] = useState(initialBookings);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isProcessOpen, setIsProcessOpen] = useState(false);

  const handleProcess = (booking: any) => {
    setSelectedBooking(booking);
    setIsProcessOpen(true);
  };

  const handleCompleteProcess = (bookingId: string, data: any) => {
    // In a real app, we would save the damage/signature data to the backend
    console.log('Processed booking:', bookingId, data);
    
    // Update local state to move booking to next stage
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: b.status === 'Confirmed' ? 'Active' : 'Completed'
        };
      }
      return b;
    }));
  };

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-zinc-500 text-sm">Manage reservations, pickups, and returns.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            Filter
          </Button>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Plus size={16} />
            New Booking
          </Button>
        </div>
      </div>

      {/* Kanban / Status Board (Simplified as Cards for MVP) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Pending', 'Confirmed', 'Active', 'Completed'].map((status) => {
          const statusBookings = bookings.filter(b => b.status === status);
          return (
            <div key={status} className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 h-full">
              <h3 className="font-semibold text-sm text-zinc-500 uppercase tracking-wider mb-3 flex justify-between">
                {status}
                <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded-full text-xs">
                  {statusBookings.length}
                </span>
              </h3>
              <div className="space-y-3">
                {statusBookings.map(booking => (
                  <div key={booking.id} className="bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono text-zinc-400">{booking.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm">{booking.vehicle}</h4>
                    <p className="text-xs text-zinc-500 mb-2">{booking.customer}</p>
                    
                    <div className="space-y-1 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                        <Calendar size={12} /> {booking.dates}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                        <MapPin size={12} /> {booking.pickup} → {booking.return}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {(booking.status === 'Confirmed' || booking.status === 'Active') && (
                      <Button 
                        size="sm" 
                        className={`w-full mt-3 h-7 text-xs gap-1 ${
                          booking.status === 'Confirmed' 
                            ? 'bg-indigo-600 hover:bg-indigo-700' 
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                        onClick={() => handleProcess(booking)}
                      >
                        {booking.status === 'Confirmed' ? (
                          <>
                            <Play size={12} /> Start Rental
                          </>
                        ) : (
                          <>
                            <CheckCircle size={12} /> Complete Return
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <RentalProcessModal 
        isOpen={isProcessOpen}
        onClose={() => setIsProcessOpen(false)}
        booking={selectedBooking}
        onComplete={handleCompleteProcess}
      />
    </div>
  );
}
