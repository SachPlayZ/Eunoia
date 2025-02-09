import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = new Date(2024, 0, 1, hour, minute);
      slots.push(time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }));
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

interface TimeRange {
  start: string;
  end: string;
}

interface AvailabilityEntry {
  date: Date;
  timeRanges: TimeRange[];
}

export default function AvailabilityManager() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentTimeRanges, setCurrentTimeRanges] = useState<TimeRange[]>([{ 
    start: timeSlots[0], 
    end: timeSlots[1] 
  }]);
  const [availability, setAvailability] = useState<AvailabilityEntry[]>([]);

  const handleAddTimeRange = () => {
    setCurrentTimeRanges(prev => [...prev, { 
      start: timeSlots[0], 
      end: timeSlots[1] 
    }]);
  };

  const handleRemoveTimeRange = (index: number) => {
    setCurrentTimeRanges(prev => prev.filter((_, i) => i !== index));
  };

  const handleTimeChange = (index: number, type: 'start' | 'end', value: string) => {
    setCurrentTimeRanges(prev => prev.map((range, i) => {
      if (i === index) {
        return { ...range, [type]: value };
      }
      return range;
    }));
  };

  const handleAddAvailability = () => {
    if (selectedDate) {
      setAvailability(prev => [...prev, { 
        date: selectedDate, 
        timeRanges: currentTimeRanges 
      }]);
      setSelectedDate(undefined);
      setCurrentTimeRanges([{ start: timeSlots[0], end: timeSlots[1] }]);
    }
  };

  const handleRemoveAvailability = (index: number) => {
    setAvailability(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto px-4 py-6 h-screen max-h-screen overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full max-h-full">
        {/* Left Section */}
        <Card className="bg-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">Set Your Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg">
              <h3 className="text-sm font-medium mb-3 text-gray-200">Select Date</h3>
              <Calendar 
                mode="single" 
                selected={selectedDate} 
                onSelect={setSelectedDate}
                className="rounded-md border bg-gray-800 text-gray-100"
              />
            </div>

            <div className="rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-200">Time Ranges</h3>
                <Button
                  onClick={handleAddTimeRange}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-gray-200 border-gray-500 hover:bg-gray-600"
                >
                  <Plus className="h-4 w-4" />
                  Add Range
                </Button>
              </div>
              
              <div className="space-y-3">
                {currentTimeRanges.map((range, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Select
                      value={range.start}
                      onValueChange={(value) => handleTimeChange(index, 'start', value)}
                    >
                      <SelectTrigger className="w-[140px] bg-gray-800 text-gray-200 border-gray-600">
                        <SelectValue>{range.start}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-gray-200 border-gray-600">
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <span className="text-gray-200">to</span>
                    
                    <Select
                      value={range.end}
                      onValueChange={(value) => handleTimeChange(index, 'end', value)}
                    >
                      <SelectTrigger className="w-[140px] bg-gray-800 text-gray-200 border-gray-600">
                        <SelectValue>{range.end}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-gray-200 border-gray-600">
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {currentTimeRanges.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveTimeRange(index)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleAddAvailability} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!selectedDate}
            >
              Add Availability
            </Button>
          </CardContent>
        </Card>

        {/* Right Section */}
        <Card className="bg-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">Your Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
              <div className="space-y-3">
                {availability.map((entry, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between bg-gray-800 p-4 rounded-lg group"
                  >
                    <div>
                      <div className="font-medium text-gray-200">
                        {entry.date.toLocaleDateString('en-US', { 
                          weekday: 'long',
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-sm text-gray-400 space-y-1">
                        {entry.timeRanges.map((range, i) => (
                          <div key={i}>
                            {range.start} - {range.end}
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAvailability(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {availability.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    No availability set yet. Select a date and time range to get started.
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}