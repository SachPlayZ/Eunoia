"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, BarChart3, Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

const patients = [
  {
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    consultations: 12,
    nextSession: "Feb 10, 2025 - 3:00 PM",
  },
  {
    name: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    consultations: 8,
    nextSession: "Feb 12, 2025 - 5:00 PM",
  },
  {
    name: "Michael Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    consultations: 15,
    nextSession: "Feb 15, 2025 - 2:00 PM",
  },
]

const appointments = [
  { name: "Sarah Johnson", time: "10:00 AM", date: "Feb 9, 2025" },
  { name: "Robert Brown", time: "2:30 PM", date: "Feb 9, 2025" },
  { name: "Emily Davis", time: "4:00 PM", date: "Feb 9, 2025" },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function TherapistDashboard() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Subtle background effects */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/10"></div>
        
        {/* Reduced blob animations */}
        <div className="absolute left-0 top-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full mix-blend-soft-light filter blur-[128px] animate-blob"></div>
        <div className="absolute right-0 bottom-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full mix-blend-soft-light filter blur-[128px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Simplified header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-800 shadow-lg py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Therapist" />
            <AvatarFallback>TD</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-semibold text-white">Patient Overview</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search patients..."
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {patients
                .filter((patient) => patient.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((patient, index) => (
                  <motion.div key={index} whileHover={{ y: -5 }} className="relative">
                    <Card className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg">
                      <CardHeader className="bg-gray-800/80 p-4 border-b border-gray-700">
                        <CardTitle className="flex items-center justify-between">
                          <span className="text-xl font-semibold text-white">{patient.name}</span>
                          <Avatar>
                            <AvatarImage src={patient.avatar} alt={patient.name} />
                            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p className="text-lg text-gray-300 flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-blue-400" /> {patient.consultations} Consultations
                        </p>
                        <p className="text-lg text-gray-300 flex items-center gap-2 mb-4">
                          <Clock className="w-5 h-5 text-blue-400" /> {patient.nextSession}
                        </p>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Card className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-400" /> Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {appointments.map((appointment, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-white">{appointment.name}</p>
                        <p className="text-sm text-gray-400">{appointment.date}</p>
                      </div>
                      <span className="text-blue-400">{appointment.time}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                  View All Appointments
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-400" /> Consultation Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-300 mb-4">Analyze patient progress and session history.</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Consultations</span>
                    <span className="font-semibold text-white">35</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Average Session Duration</span>
                    <span className="font-semibold text-white">50 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Patient Satisfaction</span>
                    <span className="font-semibold text-white">4.8/5</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                  View Detailed Analytics
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}