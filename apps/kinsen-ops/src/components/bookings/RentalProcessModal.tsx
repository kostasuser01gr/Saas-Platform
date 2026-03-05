import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Car, FileText, PenTool, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import DamageMap from './DamageMap';
import SignaturePad from './SignaturePad';

interface RentalProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onComplete: (bookingId: string, data: any) => void;
}

const steps = [
  { id: 'verify', label: 'Verify Details', icon: FileText },
  { id: 'inspect', label: 'Damage Inspection', icon: AlertTriangle },
  { id: 'sign', label: 'Sign & Complete', icon: PenTool },
];

export default function RentalProcessModal({ isOpen, onClose, booking, onComplete }: RentalProcessModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [damages, setDamages] = useState<any[]>([]);
  const [signature, setSignature] = useState<string | null>(null);

  if (!isOpen || !booking) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(booking.id, { damages, signature });
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Car className="text-indigo-600" size={24} />
              Process Rental: {booking.id}
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              {booking.customer} • {booking.vehicle} • {booking.dates}
            </p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-10" />
            
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step.id} className="flex flex-col items-center gap-2 bg-white dark:bg-zinc-900 px-2">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    isActive 
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600" 
                      : isCompleted 
                        ? "border-emerald-500 bg-emerald-50 text-emerald-600" 
                        : "border-zinc-300 text-zinc-400"
                  )}>
                    {isCompleted ? <Check size={20} /> : <step.icon size={20} />}
                  </div>
                  <span className={cn(
                    "text-xs font-medium",
                    isActive ? "text-indigo-600" : isCompleted ? "text-emerald-600" : "text-zinc-400"
                  )}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 dark:bg-zinc-900/50">
          
          {/* Step 1: Verify Details */}
          {currentStep === 0 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-zinc-500 uppercase font-medium">Customer</label>
                    <p className="font-medium text-lg">{booking.customer}</p>
                    <p className="text-sm text-zinc-500">License: DL-9823-CA</p>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 uppercase font-medium">Vehicle</label>
                    <p className="font-medium text-lg">{booking.vehicle}</p>
                    <p className="text-sm text-zinc-500">Plate: {booking.plate || 'ABC-123'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 uppercase font-medium">Dates</label>
                    <p className="font-medium">{booking.dates}</p>
                    <p className="text-sm text-zinc-500">7 Days</p>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 uppercase font-medium">Total Amount</label>
                    <p className="font-medium text-lg text-emerald-600">{booking.amount}</p>
                    <p className="text-sm text-zinc-500">Paid via Stripe</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800 flex gap-3">
                <AlertTriangle className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-300">Required Documents</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                    Please verify the customer's physical driver's license and credit card match the booking details before proceeding.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Damage Inspection */}
          {currentStep === 1 && (
            <div className="h-full">
              <DamageMap 
                damages={damages}
                onAddDamage={(d) => setDamages([...damages, d])}
                onRemoveDamage={(id) => setDamages(damages.filter(d => d.id !== id))}
              />
            </div>
          )}

          {/* Step 3: Sign & Complete */}
          {currentStep === 2 && (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Finalize Rental Agreement</h3>
                <p className="text-zinc-500">Please have the customer sign below to acknowledge the vehicle condition and rental terms.</p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <SignaturePad 
                  onSave={setSignature}
                  onClear={() => setSignature(null)}
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-700 dark:text-indigo-300 text-sm">
                <Check size={20} />
                <span>A copy of the signed agreement will be automatically emailed to {booking.customer}.</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft size={16} /> Back
          </Button>
          
          <div className="flex gap-2">
            {currentStep === steps.length - 1 ? (
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                onClick={handleNext}
                disabled={!signature}
              >
                Complete Rental <Check size={16} />
              </Button>
            ) : (
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 gap-2"
                onClick={handleNext}
              >
                Next Step <ArrowRight size={16} />
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
