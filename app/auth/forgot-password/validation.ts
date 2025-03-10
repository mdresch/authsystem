//auth\forgot-password\validation.ts
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function validateForm(data: {email: string | null}) {
  try {
      const result = forgotPasswordSchema.safeParse(data);
        return result.success ? {data: null, message: null} : {data: null, error: result.error.message}
  } catch (error: any) {
      return {data: null, error: "Something went wrong during email"}
  }
};