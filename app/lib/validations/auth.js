import { z } from "zod";

export const signupSchema = z
  .object({
    company_name: z.string().min(2, "Company name is required"),
    company_email: z.string().email("Enter a valid email"),
    company_mobile: z
      .string()
      .min(10, "Enter a valid mobile number")
      .max(15, "Enter a valid mobile number"),
    company_address: z.string().optional(),
    company_city: z.string().optional(),
    company_state: z.string().optional(),
    company_country: z.string().optional(),
    company_zipcode: z.string().optional(),
    company_landline: z.string().optional(),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});