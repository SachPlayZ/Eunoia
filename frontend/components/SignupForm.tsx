"use client"

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
import { FileUpload } from "@/components/FileUpload";

const therapistTypes = [
  "Psychologist",
  "Counselor",
  "Psychiatrist",
  "Social Worker",
  "Marriage and Family Therapist",
];

const specialties = [
  "Anxiety",
  "Depression",
  "PTSD",
  "Addiction",
  "Relationship Issues",
  "Eating Disorders",
  "Trauma",
];

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  interface FormData {
    fullName: string;
    therapistType: string;
    yearsOfExperience: number;
    specialties: string[];
    email: string;
    certifications: File[];
    password: string;
    termsAgreed: boolean;
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(data);
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Static Right Section */}
      <div className="flex-1 p-10 flex justify-center">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 w-full max-w-lg bg-white p-8 rounded-lg shadow-lg"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex justi items-center">Therapist Sign-Up</h2>

          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" {...register("fullName", { required: "Full name is required" })} />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <Label htmlFor="therapistType">Type of Therapist</Label>
            <Select {...register("therapistType", { required: "Therapist type is required" })}>
              <SelectTrigger>
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
            {errors.therapistType && <p className="text-red-500 text-sm mt-1">{errors.therapistType.message}</p>}
          </div>

          <div>
            <Label htmlFor="yearsOfExperience">Years of Experience</Label>
            <Input
              type="number"
              id="yearsOfExperience"
              min="0"
              step="1"
              {...register("yearsOfExperience", { required: "This field is required", min: 0 })}
            />
            {errors.yearsOfExperience && <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience.message}</p>}
          </div>

          <div>
            <Label>Specialties</Label>
            <div className="grid grid-cols-2 gap-2">
              {specialties.map((specialty) => (
                <div key={specialty} className="flex items-center">
                  <Checkbox id={specialty} {...register("specialties")} value={specialty} />
                  <Label htmlFor={specialty} className="ml-2">
                    {specialty}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
              })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Label>Certifications</Label>
            <Controller
              name="certifications"
              control={control}
              render={({ field }) => <FileUpload onChange={field.onChange} />}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters long" },
              })}
            />
            <PasswordStrengthMeter password={watch("password")} />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex items-center">
            <Checkbox id="termsAgreed" {...register("termsAgreed", { required: "You must agree to the terms" })} />
            <Label htmlFor="termsAgreed" className="ml-2">
              I agree to the terms and conditions
            </Label>
          </div>
          {errors.termsAgreed && <p className="text-red-500 text-sm mt-1">{errors.termsAgreed.message}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>
        </motion.form>
      </div>
    </div>
  );
}