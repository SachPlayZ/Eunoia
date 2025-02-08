"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter"
import { FileUpload } from "@/components/FileUpload"

const therapistTypes = ["Psychologist", "Counselor", "Psychiatrist", "Social Worker", "Marriage and Family Therapist"]

const specialties = ["Anxiety", "Depression", "PTSD", "Addiction", "Relationship Issues", "Eating Disorders", "Trauma"]

interface FormData {
  fullName: string
  therapistType: string
  yearsOfExperience: number
  specialties: string[]
  email: string
  certifications: File[]
  password: string
  termsAgreed: boolean
}

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log(data)
    setIsSubmitting(false)
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 w-full max-w-lg bg-white p-8 rounded-lg shadow-xl"
    >
      <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Therapist Sign-Up</h2>

      <div>
        <Label htmlFor="fullName" className="text-blue-900">
          Full Name
        </Label>
        <Input
          id="fullName"
          {...register("fullName", { required: "Full name is required" })}
          className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
      </div>

      <div>
        <Label htmlFor="therapistType" className="text-blue-900">
          Type of Therapist
        </Label>
        <Controller
          name="therapistType"
          control={control}
          rules={{ required: "Therapist type is required" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {therapistTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.therapistType && <p className="text-red-500 text-sm mt-1">{errors.therapistType.message}</p>}
      </div>

      <div>
        <Label htmlFor="yearsOfExperience" className="text-blue-900">
          Years of Experience
        </Label>
        <Input
          type="number"
          id="yearsOfExperience"
          min="0"
          step="1"
          {...register("yearsOfExperience", { required: "This field is required", min: 0 })}
          className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.yearsOfExperience && <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience.message}</p>}
      </div>

      <div>
        <Label className="text-blue-900">Specialties</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {specialties.map((specialty) => (
            <div key={specialty} className="flex items-center">
              <Checkbox
                id={specialty}
                {...register("specialties")}
                value={specialty}
                className="text-blue-500 focus:ring-blue-500"
              />
              <Label htmlFor={specialty} className="ml-2 text-blue-800">
                {specialty}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="text-blue-900">
          Email Address
        </Label>
        <Input
          type="email"
          id="email"
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
          })}
          className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <Label className="text-blue-900">Certifications</Label>
        <Controller
          name="certifications"
          control={control}
          render={({ field }) => <FileUpload onChange={field.onChange} />}
        />
      </div>

      <div>
        <Label htmlFor="password" className="text-blue-900">
          Password
        </Label>
        <Input
          type="password"
          id="password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Password must be at least 8 characters long" },
          })}
          className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
        />
        <PasswordStrengthMeter password={watch("password")} />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <div className="flex items-center">
        <Checkbox
          id="termsAgreed"
          {...register("termsAgreed", { required: "You must agree to the terms" })}
          className="text-blue-500 focus:ring-blue-500"
        />
        <Label htmlFor="termsAgreed" className="ml-2 text-blue-800">
          I agree to the terms and conditions
        </Label>
      </div>
      {errors.termsAgreed && <p className="text-red-500 text-sm mt-1">{errors.termsAgreed.message}</p>}

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
        {isSubmitting ? "Signing Up..." : "Sign Up"}
      </Button>
    </motion.form>
  )
}

