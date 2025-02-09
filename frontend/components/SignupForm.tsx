"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/FileUpload";
import { useAccount } from "wagmi";
import { useAddTherapist } from "@/functions/addTherapist";
import abi from "@/app/abi";
import { useRouter } from "next/navigation";

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

interface FormData {
  fullName: string;
  therapistType: string;
  yearsOfExperience: number;
  specialties: string[];
  email: string;
  certifications: File[];
  licenseNumber: string;
  consultationFeeETH: number;
}

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>();
  const { address: walletAddress } = useAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTherapist } = useAddTherapist({
    contractAddress: "0xe72442D80Fb85CDB85Cc9B197B25055aB79712dA",
    abi: abi,
  });
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      console.log({ ...data, walletAddress });
      const response = await fetch("/api/therapist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, walletAddress }),
      });
      await addTherapist({
        name: data.fullName,
        wallet: walletAddress!.toString(),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);
      router.push("/therapist");
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 w-full max-w-lg bg-white p-8 rounded-lg shadow-xl"
    >
      <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
        Therapist Sign-Up
      </h2>

      <div>
        <Label htmlFor="fullName" className="text-blue-900">
          Full Name
        </Label>
        <Input
          id="fullName"
          {...register("fullName", { required: "Full name is required" })}
          className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
        )}
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
        {errors.therapistType && (
          <p className="text-red-500 text-sm mt-1">
            {errors.therapistType.message}
          </p>
        )}
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
          {...register("yearsOfExperience", {
            required: "This field is required",
            min: 0,
          })}
          className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.yearsOfExperience && (
          <p className="text-red-500 text-sm mt-1">
            {errors.yearsOfExperience.message}
          </p>
        )}
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
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
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
        <Label htmlFor="licenseNumber" className="text-blue-900">
          License Number
        </Label>
        <Input
          type="text"
          id="licenseNumber"
          {...register("licenseNumber", {
            required: "License number is required",
            pattern: {
              value: /^[A-Za-z0-9-]+$/,
              message:
                "License number can only contain letters, numbers, and hyphens",
            },
          })}
          className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.licenseNumber && (
          <p className="text-red-500 text-sm mt-1">
            {errors.licenseNumber.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="consultationFeeETH" className="text-blue-900">
          Consultation Fee (ETH)
        </Label>
        <Input
          type="number"
          id="consultationFeeETH"
          min="0"
          step="0.01"
          {...register("consultationFeeETH", {
            required: "This field is required",
            min: 0,
          })}
          className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.consultationFeeETH && (
          <p className="text-red-500 text-sm mt-1">
            {errors.consultationFeeETH.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing Up..." : "Sign Up"}
      </Button>
    </motion.form>
  );
}
