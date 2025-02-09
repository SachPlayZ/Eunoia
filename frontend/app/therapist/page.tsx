"use client"
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import  AvailabilityManager from '@/components/availability-manager';

const TherapistDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl" />
        <div className="relative pt-8 pb-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Therapist Dashboard
          </h1>
          <p className="text-gray-300 text-center max-w-2xl mx-auto">
            Manage your practice, appointments, and availability all in one place
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="w-full justify-start space-x-2 rounded-lg bg-gray-800/50 p-1 backdrop-blur-lg">
              <TabsTrigger 
                value="overview" 
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="availability"
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Manage Availability
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-lg">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-white">28</CardTitle>
                    <p className="text-sm text-gray-400">Active Patients</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-4 flex items-center space-x-2">
                      <span className="text-green-400 text-sm">↑ 12%</span>
                      <span className="text-gray-500 text-sm">from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-lg">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-white">89%</CardTitle>
                    <p className="text-sm text-gray-400">Session Completion Rate</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-4 flex items-center space-x-2">
                      <span className="text-green-400 text-sm">↑ 3%</span>
                      <span className="text-gray-500 text-sm">from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-lg">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-white">4.9</CardTitle>
                    <p className="text-sm text-gray-400">Average Rating</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-4 flex items-center space-x-2">
                      <span className="text-yellow-400 text-sm">★★★★★</span>
                      <span className="text-gray-500 text-sm">32 reviews</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Appointments */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white">
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-gray-600" />
                          <div>
                            <p className="text-white font-medium">Patient Name</p>
                            <p className="text-gray-400 text-sm">Virtual Session</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white">3:00 PM</p>
                          <p className="text-gray-400 text-sm">Today</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="availability">
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-lg">
                <CardContent className="p-6">
                  <AvailabilityManager />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default TherapistDashboard;