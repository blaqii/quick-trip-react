import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface ScheduleScreenProps {
  date?: Date;
  time?: string;
  onBack: () => void;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time: string) => void;
  onConfirm: () => void;
}

const times = [
  "07:00", "07:15", "07:30", "07:45",
  "08:00", "08:15", "08:30", "08:45",
  "09:00", "09:15", "09:30", "09:45",
  "10:00", "10:15", "10:30", "10:45",
  "11:00", "11:15", "11:30", "11:45",
  "12:00", "12:15", "12:30", "12:45",
  "13:00", "13:15", "13:30", "13:45",
  "14:00", "14:15", "14:30", "14:45",
  "15:00", "15:15", "15:30", "15:45",
  "16:00", "16:15", "16:30", "16:45",
  "17:00", "17:15", "17:30", "17:45",
  "18:00", "18:15", "18:30", "18:45",
];

const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ date, time, onBack, onDateChange, onTimeChange, onConfirm }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="p-6">
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
        <div className="bg-card rounded-2xl p-4 border">
          <label className="text-sm text-muted-foreground mb-2 block">Pick a time</label>
          <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {times.map((t) => (
              <button
                key={t}
                className={cn(
                  "py-2 px-3 rounded-md border text-sm transition-colors",
                  time === t ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-secondary/50"
                )}
                onClick={() => onTimeChange(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Confirm */}
        <Button className="w-full mt-6" size="driver" onClick={onConfirm} disabled={!date || !time}>
          Confirm schedule
        </Button>
      </div>
    </div>
  );
};

export default ScheduleScreen;
