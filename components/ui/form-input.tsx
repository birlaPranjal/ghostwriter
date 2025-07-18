import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FieldError, UseFormRegisterReturn } from "react-hook-form"
import React from "react"

interface FormInputProps {
  label: string
  id: string
  type?: string
  register: UseFormRegisterReturn
  error?: FieldError
  placeholder?: string
  className?: string
}

export default function FormInput({ label, id, type = "text", register, error, placeholder, className }: FormInputProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        {...register}
        placeholder={placeholder}
        className={className}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  )
} 