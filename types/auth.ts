import { z } from "zod"


export const SignUpSchema = z
    .object({
        name: z.string().min(2).max(50),
        email: z.string().min(2).max(50).email("Email is invalid."),
        role: z.string(),
        password: z
            .string()
            .min(8, { message: "يجب أن تكون كلمة السر بطول 8 أحرف على الأقل" }),
        confirmPassword: z
            .string()
            .min(8, { message: "يجب أن تكون كلمة السر بطول 8 أحرف على الأقل" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "يجب أن تتطابق كلمة السر مع تأكيد كلمة السر",
        path: ["confirmPassword"],
    })

export const SignInSchema = z.object({
  email: z.string().min(2).max(50).email("Email is invalid."),
  password: z
    .string()
    .min(8, { message: "Password must contain at least 8 character(s)" }),
  remember:z.boolean().optional()
})


export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional()
})


export const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.union([
        z.literal(""),
        z
            .string()
            .min(6, { message: "Phone number must be at least 6 characters" })
            .max(20, { message: "Phone number must be at most 20 characters" })
            .regex(
                /^[\d\s\-()+]+$/,
                { message: "Phone number must contain only numbers and allowed characters (+, -, space, parentheses)" }
            ),
    ]).optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
    //   .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    //   .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    //   .regex(/[0-9]/, "Password must contain at least one number")
    ,
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, "You must agree to the terms and conditions"),
    subscribeNewsletter: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export const signupSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }).max(25,{message: "First name must be 25 characters at most"}),
    lastName: z.string().min(1, { message: "Last name is required" }).max(25,{message: "Last name must be 25 characters at most"}),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})


export const AdminChangeCredentialsSchema = z.object({
    email: z.string().min(2).max(50).email("البريد الإلكتروني غير صالح"),
    password:z.string().optional()
})
export const ChangeCredentialsSchema = z.object({
    email: z.string().min(2).max(50).email("البريد الإلكتروني غير صالح"),
    oldPassword: 
        z.union(
            [
                z.string().min(8, { message: "يجب أن تكون كلمة السر بطول 8 أحرف على الأقل" }),
                z.literal("")
            ]
        ),
    newPassword: 
        z.union(
            [
                z.string().min(8, { message: "يجب أن تكون كلمة السر بطول 8 أحرف على الأقل" }),
                z.literal("")
            ]
        ),
}).refine((data) => !( (data.newPassword || data.oldPassword) && !(data.newPassword && data.oldPassword) ), {
    message: "لتغيير كلمة السر يجب توفير كلًا من كلمة السر القدمية و الجديدة",
    path: ["newPassword"],
})
.refine((data) => !( (data.newPassword || data.oldPassword) && !(data.newPassword && data.oldPassword) ), {
    message: "لتغيير كلمة السر يجب توفير كلًا من كلمة السر القدمية و الجديدة",
    path: ["oldPassword"],
})


export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Current password must be at least 6 characters'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
)