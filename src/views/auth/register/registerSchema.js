import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { required, isEmail, isPhoneNumber, isValidPassword } from '@utils/rules.util'

export const registerSchema = toTypedSchema(
  z
    .object({
      firstName: z.string().refine(required, {
        message: 'Required'
      }),
      phone: z.string().refine(isPhoneNumber, {
        message: 'Invalid phone number format'
      }),
      email: z
        .string()
        .refine(required, {
          message: 'Required'
        })
        .refine(isEmail, {
          message: 'Invalid email format'
        }),
      password: z
        .string()
        .refine(required, {
          message: 'Required'
        })
        .refine(isValidPassword, {
          message: 'Minimum 6 characters is required'
        }),
      confirmPassword: z.string().refine(required, {
        message: 'Required'
      })
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword']
    })
)
