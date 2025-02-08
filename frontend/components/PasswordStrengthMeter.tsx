"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

type PasswordStrengthMeterProps = {
  password: string
}

export function PasswordStrengthMeter({ password = "" }: PasswordStrengthMeterProps) {

  const [strength, setStrength] = useState(0)

  useEffect(() => {
    // Simple password strength calculation
    let newStrength = 0
    if (password.length > 7) newStrength++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) newStrength++
    if (password.match(/\d/)) newStrength++
    if (password.match(/[^a-zA-Z\d]/)) newStrength++
    setStrength(newStrength)
  }, [password])

  const getColor = () => {
    if (strength < 2) return "bg-red-500"
    if (strength < 3) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${(strength / 4) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="text-sm mt-1 text-gray-600">
        {strength < 2 && "Weak"}
        {strength === 2 && "Medium"}
        {strength > 2 && "Strong"}
      </p>
    </div>
  )
}

