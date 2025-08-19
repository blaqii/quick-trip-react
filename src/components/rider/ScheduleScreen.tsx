
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import CircularTimePicker from "@/components/ui/circular-time-picker";
import { cn } from "@/lib/utils";

interface ScheduleScreenProps {
  date?: Date;
  time?: string;
  onBack: () => void;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time: string) => void;
  onConfirm: () => void;
}

const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ 
  date, 
  time = "12:00", 
  onBack, 
  onDateChange, 
  onTimeChange, 
  onConfirm 
}) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="p-6 pb-32"> {/* Added bottom padding for footer space */}
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold ml-4">Schedule a ride</h1>
        </div>

        {/* Calendar */}
        <div className="bg-card rounded-2xl p-4 border mb-4">
          <div className="flex items-center mb-3">
            <CalendarIcon className="w-5 h-5 text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Pick a date</span>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            disabled={(d) => d < new Date()}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </div>

        {/* Time picker */}
        <div className="bg-card rounded-2xl p-4 border mb-6">
          <div className="flex items-center mb-4">
            <span className="text-sm text-muted-foreground">Pick a time</span>
          </div>
          <div className="flex justify-center">
            <CircularTimePicker
              value={time}
              onChange={onTimeChange}
            />
          </div>
        </div>

        {/* Confirm */}
        <Button className="w-full" size="driver" onClick={onConfirm} disabled={!date || !time}>
          Confirm schedule
        </Button>
      </div>
    </div>
  );
};

export default ScheduleScreen;
