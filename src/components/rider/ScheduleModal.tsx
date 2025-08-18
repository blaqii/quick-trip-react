import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Clock, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSchedule: (date: Date, time: string) => void;
}

const times = [
  '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45',
  '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45',
  '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45',
  '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45',
  '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45',
  '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45',
  '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45',
  '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45'
];

const ScheduleModal: React.FC<ScheduleModalProps> = ({ open, onOpenChange, onSchedule }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [showTimeSelect, setShowTimeSelect] = useState(false);
  const { toast } = useToast();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setShowTimeSelect(true);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onSchedule(selectedDate, selectedTime);
      onOpenChange(false);
      // Reset state
      setSelectedDate(undefined);
      setSelectedTime("");
      setShowTimeSelect(false);
      
      toast({
        title: "Ride scheduled",
        description: `Your ride is scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTime}`,
      });
    }
  };

  const handleBack = () => {
    if (showTimeSelect) {
      setShowTimeSelect(false);
      setSelectedTime("");
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedDate(undefined);
    setSelectedTime("");
    setShowTimeSelect(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            {showTimeSelect && (
              <Button variant="ghost" size="icon" onClick={handleBack} className="h-6 w-6">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Schedule ride</span>
            </DialogTitle>
          </div>
          <DialogDescription>
            {!showTimeSelect 
              ? "Choose a date for your ride" 
              : `Select a time for ${selectedDate?.toLocaleDateString()}`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1">
          {!showTimeSelect ? (
            <div className="flex justify-center py-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>
          ) : (
            <div className="py-4">
              <Label className="text-sm font-medium mb-3 block flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Available times</span>
              </Label>
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {times.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTimeSelect(time)}
                    className="h-10"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime}
          >
            Confirm schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleModal;