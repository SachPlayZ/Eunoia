"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Clock, Award, Users } from "lucide-react";

interface Therapist {
  id: number;
  name: string;
  specialization: string;
  rating: number;
  slots: string[];
  experience: string;
  patientsHelped: number;
}

interface SelectedSlot {
  [key: number]: string;
}

export default function UsersDashboard() {
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot>({});
  const [confirmedBookings, setConfirmedBookings] = useState<number[]>([]);

  const therapists: Therapist[] = [
    {
      id: 1,
      name: "Dr. Jane Smith",
      specialization: "Cognitive Behavioral Therapy",
      rating: 4.8,
      experience: "15 years",
      patientsHelped: 1200,
      slots: ["10:00 AM", "2:00 PM", "5:00 PM"],
    },
    {
      id: 2,
      name: "Dr. John Doe",
      specialization: "Family Therapy",
      rating: 4.5,
      experience: "12 years",
      patientsHelped: 950,
      slots: ["9:30 AM", "1:30 PM", "4:00 PM"],
    },
    {
      id: 3,
      name: "Dr. Emily Davis",
      specialization: "Trauma Therapy",
      rating: 4.9,
      experience: "18 years",
      patientsHelped: 1500,
      slots: ["11:00 AM", "3:00 PM"],
    },
  ];

  const stats = [
    {
      value: "50+",
      label: "Expert Therapists",
      icon: <Users className="w-4 h-4" />,
    },
    {
      value: "24/7",
      label: "Support Available",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      value: "4.8",
      label: "Average Rating",
      icon: <Star className="w-4 h-4" />,
    },
  ];

  const selectTimeSlot = (therapistId: number, slot: string): void => {
    setSelectedSlot((prev: SelectedSlot) => ({ ...prev, [therapistId]: slot }));
  };

  const confirmBooking = (therapistId: number): void => {
    if (selectedSlot[therapistId]) {
      setConfirmedBookings((prev) => [...prev, therapistId]);
      alert(`Appointment confirmed with therapist ${therapistId} at ${selectedSlot[therapistId]}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"
          aria-hidden="true"
        />
        <div className="relative pt-8 pb-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white text-center mb-2 drop-shadow-lg">
            Find Your Perfect Therapist
          </h1>
          <p className="text-gray-300 text-center max-w-2xl mx-auto drop-shadow">
            Connect with licensed therapists who can help you thrive
          </p>
        </div>
      </header>

      <main className="relative z-10 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-lg shadow-lg shadow-gray-900/50 hover:shadow-xl hover:shadow-gray-900/50 transition-all">
                <CardContent className="flex items-center p-6">
                  <div className="bg-blue-600/20 p-3 rounded-lg mr-4 shadow-inner">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white drop-shadow">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Therapists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {therapists.map((therapist) => (
              <Card 
                key={therapist.id} 
                className="bg-gray-800/50 border-gray-700 backdrop-blur-lg hover:bg-gray-800/70 transition-all shadow-lg shadow-gray-900/50 hover:shadow-xl hover:shadow-gray-900/50"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold text-white drop-shadow">
                        {therapist.name}
                      </CardTitle>
                      <p className="text-sm text-gray-400">{therapist.specialization}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400 drop-shadow">
                      <Star size={16} fill="currentColor" />
                      <span className="text-white">{therapist.rating}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Award size={16} />
                      <span className="text-sm">{therapist.experience}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users size={16} />
                      <span className="text-sm">{therapist.patientsHelped}+ helped</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <h3 className="text-md font-medium text-white drop-shadow">Available Slots:</h3>
                    <div className="flex flex-wrap gap-2">
                      {therapist.slots.map((slot) => (
                        <Button
                          key={slot}
                          variant={selectedSlot[therapist.id] === slot ? "default" : "secondary"}
                          size="sm"
                          onClick={() => selectTimeSlot(therapist.id, slot)}
                          disabled={confirmedBookings.includes(therapist.id)}
                          className={
                            selectedSlot[therapist.id] === slot
                              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-900/50"
                              : "bg-gray-700/50 hover:bg-gray-700 text-white shadow-md shadow-gray-900/50"
                          }
                        >
                          {slot}
                          {selectedSlot[therapist.id] === slot && " ✓"}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      onClick={() => confirmBooking(therapist.id)}
                      disabled={!selectedSlot[therapist.id] || confirmedBookings.includes(therapist.id)}
                      className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-900/50 disabled:bg-gray-600"
                    >
                      {confirmedBookings.includes(therapist.id)
                        ? "Appointment Confirmed"
                        : "Book Appointment"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}