
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CircularTimePicker from "@/components/ui/circular-time-picker";

interface ScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSchedule: (date: Date, time: string) => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ open, onOpenChange, onSchedule }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("12:00");
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
      setSelectedTime("12:00");
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
      setSelectedTime("12:00");
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedDate(undefined);
    setSelectedTime("12:00");
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
            <div className="py-4 flex justify-center">
              <CircularTimePicker
                value={selectedTime}
                onChange={handleTimeSelect}
              />
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
