
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CircularTimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  className?: string;
}

const CircularTimePicker: React.FC<CircularTimePickerProps> = ({
  value = '12:00',
  onChange,
  className,
}) => {
  const [selectedTime, setSelectedTime] = useState(value);
  const [isSelectingHour, setIsSelectingHour] = useState(true);
  const clockRef = useRef<HTMLDivElement>(null);

  // Parse time to get hours and minutes
  const [hours, minutes] = selectedTime.split(':').map(Number);

  // Generate hour numbers (1-12)
  const hourNumbers = Array.from({ length: 12 }, (_, i) => i === 0 ? 12 : i);
  
  // Generate minute numbers (00, 05, 10, ..., 55)
  const minuteNumbers = Array.from({ length: 12 }, (_, i) => i * 5);

  const handleTimeChange = (newHours: number, newMinutes: number) => {
    const timeString = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    setSelectedTime(timeString);
    onChange?.(timeString);
  };

  const handleNumberClick = (num: number) => {
    if (isSelectingHour) {
      handleTimeChange(num, minutes);
      setIsSelectingHour(false);
    } else {
      handleTimeChange(hours, num);
    }
  };

  const getCurrentNumbers = () => {
    return isSelectingHour ? hourNumbers : minuteNumbers;
  };

  const getSelectedValue = () => {
    return isSelectingHour ? hours : minutes;
  };

  return (
    <div className={cn('flex flex-col items-center space-y-4', className)}>
      {/* Time display */}
      <div className="text-3xl font-bold text-center">
        <span 
          className={cn('cursor-pointer px-2 rounded', isSelectingHour ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}
          onClick={() => setIsSelectingHour(true)}
        >
          {hours.toString().padStart(2, '0')}
        </span>
        <span className="mx-1">:</span>
        <span 
          className={cn('cursor-pointer px-2 rounded', !isSelectingHour ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}
          onClick={() => setIsSelectingHour(false)}
        >
          {minutes.toString().padStart(2, '0')}
        </span>
      </div>

      {/* Circular picker */}
      <div className="relative w-64 h-64" ref={clockRef}>
        <div className="absolute inset-0 rounded-full border-2 border-border bg-card">
          {getCurrentNumbers().map((num, index) => {
            const angle = (index * 30) - 90; // Start from top (12 o'clock position)
            const radian = (angle * Math.PI) / 180;
            const radius = 100; // Distance from center
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;
            
            const isSelected = num === getSelectedValue();
            
            return (
              <button
                key={num}
                className={cn(
                  'absolute w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  'transform -translate-x-1/2 -translate-y-1/2',
                  isSelected 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background hover:bg-secondary text-foreground'
                )}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                }}
                onClick={() => handleNumberClick(num)}
              >
                {isSelectingHour ? num : num.toString().padStart(2, '0')}
              </button>
            );
          })}
        </div>

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2" />

        {/* Hand indicator */}
        <div 
          className="absolute top-1/2 left-1/2 origin-bottom bg-primary rounded-full transform -translate-x-1/2"
          style={{
            width: '2px',
            height: '80px',
            marginTop: '-80px',
            rotate: `${(getCurrentNumbers().indexOf(getSelectedValue()) * 30)}deg`,
            transition: 'rotate 0.2s ease-in-out',
          }}
        />
      </div>

      {/* Helper text */}
      <p className="text-sm text-muted-foreground text-center">
        {isSelectingHour ? 'Select hour' : 'Select minutes'}
      </p>
    </div>
  );
};

export default CircularTimePicker;
